#!/usr/bin/env node
/**
 * Mobile visual QA: walk a scripted flow on several phone sizes, capture
 * screenshots, report console/page errors and horizontal overflow, and write
 * a contact sheet per device.
 *
 * Usage (run from the project root, which must have `playwright` installed):
 *   node <skill>/scripts/screenshot.mjs --url http://localhost:4173 --flow flow.json --out shots \
 *        [--devices "iPhone SE,iPhone 13,Pixel 7"] [--theme dark] [--scale 1.5] [--executable /path/to/chromium]
 *
 * flow.json is an array of steps, executed in order. Each step may combine an
 * action with `shot` (screenshot name) and `wait` (ms, default 600 after actions):
 *   { "goto": "/#/services", "shot": "services" }
 *   { "click": "text=Book now" }                 // any Playwright selector
 *   { "click": ".card >> nth=1", "shot": "card-open" }
 *   { "fill": ["input[name=phone]", "09123456789"] }
 *   { "press": "Enter" }
 *   { "scroll": 800 }                             // window.scrollTo(0, y)
 *   { "back": true }
 *   { "eval": "localStorage.clear()" }            // runs in the page
 *   { "reload": true }
 *   { "shot": "home-full", "fullPage": true }     // note: scroll-driven reveals render blank in full-page shots
 *   { "storage": { "key": "app", "value": {…} } } // seed localStorage then reload
 *
 * Exit code 1 if any step fails, any console/page error is logged, or the page
 * overflows horizontally.
 */
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const require = createRequire(join(process.cwd(), "noop.js"));
let playwright;
try {
  playwright = require("playwright");
} catch {
  console.error("playwright is not installed in this project. Run `npm i -D playwright` (browsers may already be provided by the environment).");
  process.exit(2);
}
const { chromium, devices } = playwright;

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, value, index, all) => {
    if (value.startsWith("--")) pairs.push([value.slice(2), all[index + 1]?.startsWith("--") || all[index + 1] === undefined ? "true" : all[index + 1]]);
    return pairs;
  }, []),
);

const baseUrl = (args.url ?? "http://localhost:4173").replace(/\/$/, "");
const flow = JSON.parse(readFileSync(resolve(args.flow ?? "flow.json"), "utf8"));
const outDir = resolve(args.out ?? "shots");
const deviceNames = (args.devices ?? "iPhone SE,iPhone 13,Pixel 7").split(",").map((name) => name.trim());
const scale = Number(args.scale ?? 1.5);
const executable = args.executable ?? process.env.CHROMIUM_PATH ?? (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);

const browser = await chromium.launch(executable ? { executablePath: executable } : {});
let failed = false;

for (const deviceName of deviceNames) {
  const device = devices[deviceName];
  if (!device) {
    console.error(`Unknown device "${deviceName}". See playwright's devices list.`);
    failed = true;
    continue;
  }
  const dir = join(outDir, deviceName.replace(/\s+/g, "-"));
  mkdirSync(dir, { recursive: true });
  const context = await browser.newContext({ ...device, deviceScaleFactor: scale, colorScheme: args.theme === "dark" ? "dark" : "light" });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  const shots = [];

  console.log(`\n▶ ${deviceName} (${device.viewport.width}×${device.viewport.height})`);
  for (const [index, step] of flow.entries()) {
    const label = step.shot ?? Object.keys(step).join("+");
    try {
      if (step.goto) await page.goto(baseUrl + step.goto, { waitUntil: "networkidle" });
      if (step.storage) {
        await page.evaluate(({ key, value }) => localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value)), step.storage);
        await page.reload({ waitUntil: "networkidle" });
      }
      if (step.eval) await page.evaluate(step.eval);
      if (step.reload) await page.reload({ waitUntil: "networkidle" });
      if (step.click) await page.locator(step.click).first().click({ timeout: 8000 });
      if (step.fill) await page.locator(step.fill[0]).first().fill(step.fill[1], { timeout: 8000 });
      if (step.press) await page.keyboard.press(step.press);
      if (step.scroll !== undefined) await page.evaluate((y) => window.scrollTo(0, y), step.scroll);
      if (step.back) await page.goBack();
      await page.waitForTimeout(step.wait ?? 600);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 1) {
        errors.push(`horizontal overflow of ${overflow}px after step ${index} (${label})`);
      }
      if (step.shot) {
        const file = join(dir, `${String(index).padStart(2, "0")}-${step.shot}.png`);
        await page.screenshot({ path: file, fullPage: Boolean(step.fullPage) });
        shots.push({ file, name: step.shot });
        console.log(`  ✓ ${step.shot}`);
      }
    } catch (error) {
      failed = true;
      console.log(`  ✗ step ${index} (${label}): ${error.message.split("\n")[0]}`);
      const file = join(dir, `${String(index).padStart(2, "0")}-FAILED.png`);
      await page.screenshot({ path: file }).catch(() => {});
      shots.push({ file, name: `FAILED ${label}` });
      break;
    }
  }

  if (errors.length) {
    failed = true;
    console.log(`  issues:\n    ${[...new Set(errors)].join("\n    ")}`);
  } else {
    console.log("  no console errors, no horizontal overflow");
  }

  // Contact sheet rendered by the browser itself (no image libraries needed).
  if (shots.length) {
    const html = `<!doctype html><meta charset="utf-8"><body style="margin:0;padding:24px;background:#e9e6e1;font:12px system-ui">
      <h1 style="font:600 16px system-ui;margin:0 0 16px">${deviceName} · ${shots.length} screens</h1>
      <div style="display:flex;flex-wrap:wrap;gap:16px">${shots
        .map((shot) => `<figure style="margin:0;width:260px"><img src="file://${shot.file}" style="width:100%;border-radius:12px;box-shadow:0 6px 20px #0002"><figcaption style="margin-top:6px">${shot.name}</figcaption></figure>`)
        .join("")}</div></body>`;
    const sheetHtml = join(dir, "contact-sheet.html");
    writeFileSync(sheetHtml, html);
    const sheetPage = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    await sheetPage.goto(`file://${sheetHtml}`);
    await sheetPage.waitForTimeout(400);
    await sheetPage.screenshot({ path: join(dir, "contact-sheet.png"), fullPage: true });
    await sheetPage.close();
    console.log(`  contact sheet: ${join(dir, "contact-sheet.png")}`);
  }
  await context.close();
}

await browser.close();
process.exit(failed ? 1 : 0);
