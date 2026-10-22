import { test, expect, type Page } from "playwright/test";

const KEY = "hananeh-atelier-v1";

/**
 * Visual audit captures are encoded in 2400-character JPEG chunks in CI logs.
 * GitHub Actions artifact storage is currently unavailable, so this is a
 * temporary review-only transport for synthetic / no-personal-data screenshots.
 */
async function prepare(page: Page, welcome = true) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(({ key, welcomed }) => {
    localStorage.setItem(key, JSON.stringify({ welcomed, theme: "light", bookings: [] }));
  }, { key: KEY, welcomed: welcome });
}

async function settle(page: Page) {
  await page.locator("#root").waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const img of Array.from(document.querySelectorAll<HTMLImageElement>("img"))) {
      if (img.getBoundingClientRect().top > innerHeight + 900) continue;
      try { if (!img.complete) await Promise.race([img.decode(), new Promise<void>((ok) => setTimeout(ok, 1000))]); } catch { /* missing photo is visible in audit */ }
    }
  });
  await page.waitForTimeout(170);
}

async function capture(page: Page, name: string) {
  await settle(page);
  const meta = await page.evaluate(() => {
    const doc = document.documentElement;
    const images = Array.from(document.querySelectorAll<HTMLImageElement>("img")).filter((x) => {
      const box = x.getBoundingClientRect();
      return box.bottom > 0 && box.top < innerHeight && box.width > 50;
    });
    const nav = document.querySelector(".tabbar");
    return {
      overflowPx: doc.scrollWidth - doc.clientWidth,
      height: doc.scrollHeight,
      brokenImages: images.filter(x => x.complete && x.naturalWidth === 0).map(x => x.getAttribute("src")),
      imageBoxes: images.slice(0, 6).map(x => {
        const box = x.getBoundingClientRect();
        return { w: Math.round(box.width), h: Math.round(box.height), natural: [x.naturalWidth, x.naturalHeight] };
      }),
      navBottom: nav ? Math.round(nav.getBoundingClientRect().bottom - innerHeight) : null,
    };
  });
  console.log(`VISUAL_META|${name}|${JSON.stringify(meta)}`);
  const png = await page.screenshot({ type: "jpeg", quality: 57, fullPage: false, animations: "disabled", path: `test-results/audit-${name}.jpg` });
  const raw = png.toString("base64");
  const chunkSize = 2400;
  console.log(`VISUAL_START|${name}|${Math.ceil(raw.length / chunkSize)}`);
  for (let index = 0; index < raw.length; index += chunkSize) {
    console.log(`VISUAL_CHUNK|${name}|${index / chunkSize}|${raw.slice(index, index + chunkSize)}`);
  }
  console.log(`VISUAL_END|${name}`);
  expect(meta.overflowPx).toBeLessThanOrEqual(1);
}

test("audit core salon screens at Android portrait viewport", async ({ page }) => {
  await prepare(page);
  const routes = [
    ["home", "/"],
    ["services", "/#/services"],
    ["looks", "/#/looks"],
    ["bookings", "/#/bookings"],
    ["profile", "/#/me"],
  ];
  for (const [name, route] of routes) {
    await page.goto(route);
    await capture(page, name);
  }
});

test("audit first visit, salon request flow and hairstyle details", async ({ page }) => {
  await prepare(page, false);
  await page.goto("/");
  await expect(page.getByRole("dialog", { name: /خوش آمدید/ })).toBeVisible();
  await capture(page, "welcome");
  await page.getByRole("button", { name: /شروع و مشاهده مدل‌ها/ }).click();
  await expect(page.getByRole("dialog", { name: /خوش آمدید/ })).not.toBeVisible();
  await page.locator(".tabbar__book").click();
  await expect(page.getByRole("dialog", { name: /درخواست نوبت/ })).toBeVisible();
  await capture(page, "booking");
  await page.getByRole("button", { name: "بستن" }).last().click();
  await page.goto("/#/looks");
  await page.locator(".studio-look-card > button").first().click();
  await expect(page.getByRole("dialog", { name: "کاوش لوک‌ها" })).toBeVisible();
  await capture(page, "discovery");
  await page.getByRole("button", { name: "جزئیات" }).click();
  await expect(page.locator(".studio-look-detail__hero")).toBeVisible();
  await capture(page, "look-detail");
});

test("audit scrolled home and catalog at mobile viewport", async ({ page }) => {
  await prepare(page);
  for (const [name,route] of [["home-footer","/"],["lookbook-footer","/#/looks"]] as const) {
    await page.goto(route);
    await settle(page);
    await page.evaluate(() => window.scrollTo(0,document.documentElement.scrollHeight));
    await page.waitForTimeout(350);
    await capture(page,name);
  }
});
