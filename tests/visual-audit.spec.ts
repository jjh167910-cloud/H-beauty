import { test, expect, type Page } from "playwright/test";

const KEY = "hananeh-atelier-v1";

/** Visual audit captures synthetic local state and records image/layout metrics.
 * Screenshots are written to the test-results directory; raw image bytes are
 * never printed to CI logs.
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
  await page.screenshot({ type: "png", fullPage: false, animations: "disabled",
    path: `test-results/audit-${name}.png` });
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
  for (const [name,route] of [["home-footer","/"],["services-footer","/#/services"],["lookbook-footer","/#/looks"],["bookings-footer","/#/bookings"],["profile-footer","/#/me"]] as const) {
    await page.goto(route);
    await settle(page);
    await page.evaluate(() => window.scrollTo(0,document.documentElement.scrollHeight));
    await page.waitForTimeout(350);
    await capture(page,name);
  }
});

test("audit all screens at 320px and tablet", async ({ page }) => {
  await prepare(page);
  await page.setViewportSize({width:320,height:700});
  for (const [name,route] of [["home-320","/"],["services-320","/#/services"],["looks-320","/#/looks"],["bookings-320","/#/bookings"],["profile-320","/#/me"]] as const) {
    await page.goto(route);
    await capture(page,name);
  }
  await page.setViewportSize({width:768,height:1024});
  for (const [name,route] of [["home-tablet","/"],["looks-tablet","/#/looks"]] as const) {
    await page.goto(route);
    await capture(page,name);
  }
});

test("tablet hero keeps photo and booking actions in separate columns", async ({ page }) => {
  await prepare(page);
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/");
  const photo = page.locator(".salon24-hero__photo");
  const action = page.getByRole("region", { name: "استایل منتخب سالن" }).getByRole("button", { name: "درخواست نوبت" });
  await expect(page.locator(".salon26-hero__intro")).toBeVisible();
  const pic = await photo.boundingBox();
  const button = await action.boundingBox();
  expect(pic && button).toBeTruthy();
  expect(pic!.height).toBeLessThan(600);
  expect(pic!.x >= button!.x + button!.width - 1 || button!.x >= pic!.x + pic!.width - 1).toBe(true);
});

test("mobile action controls meet minimum tap dimensions", async ({ page }) => {
  await prepare(page);
  await page.setViewportSize({ width: 320, height: 700 });
  for (const route of ["/#/services", "/#/looks"]) {
    await page.goto(route);
    for (const selector of route.includes("services") ? [".studio-service-item__add", ".chip"] : [".salon25-look-card__action", ".chip"]) {
      const nodes = page.locator(selector);
      if (!await nodes.count()) continue;
      const sizes = await nodes.first().evaluate(node => { const box = node.getBoundingClientRect(); return { width: box.width, height: box.height }; });
      expect(sizes.width, selector + " width").toBeGreaterThanOrEqual(44);
      expect(sizes.height, selector + " height").toBeGreaterThanOrEqual(44);
    }
  }
});

test("offline homepage portrait failure has a readable fallback", async ({ page }) => {
  await prepare(page);
  await page.route("**/looks/30.webp", route => route.fulfill({status:404,body:"missing"}));
  await page.goto("/");
  await expect(page.locator(".salon24-hero__photo")).toHaveAttribute("data-image-error", "true");
  await expect(page.locator(".salon26-hero__missing")).toBeVisible();
});

test("wide-hair salon thumbnails use intentional horizontal crop positions", async ({ page }) => {
  await prepare(page);
  await page.goto("/");
  const braid = page.locator('.salon24-style-card img[src="/looks/sm/77.webp"]');
  const curly = page.locator('.salon24-style-card img[src="/looks/sm/84.webp"]');
  await expect(braid).toHaveCSS("object-position", "11% 50%");
  await expect(curly).toHaveCSS("object-position", "6% 50%");
  const normal = page.locator('.salon24-style-card img[src="/looks/sm/30.webp"]');
  await expect(normal).toHaveCSS("object-position", "50% 32%");
});
