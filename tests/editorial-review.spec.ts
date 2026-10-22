import { test, expect, type Page } from "playwright/test";

/**
 * Editorial redesign regression checks.
 * Uses intentionally synthetic local data; never opens a real salon service.
 * Run with: npm run test:ui
 */
const STORAGE = "hananeh-atelier-v1";
const fixture = {
  id: "synthetic-booking-for-test",
  services: ["signature-cut"],
  stylist: "any",
  date: "2099-01-12",
  time: "12:00",
  name: "کاربر آزمایشی",
  phone: "09123456789",
  note: "",
  lookId: null,
  createdAt: 1,
  sent: false,
};

async function seed(page: Page, data: Record<string, unknown> = {}) {
  // One initialization script per test avoids undefined ordering between competing scripts.
  await page.addInitScript(({ key, state }) => {
    window.localStorage.setItem(key, JSON.stringify({ welcomed: true, theme: "light", bookings: [], ...state }));
  }, { key: STORAGE, state: data });
}

for (const width of [320, 390, 768, 1280]) {
  test(`home has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 850 });
    await seed(page);
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /زیبایی شما/ })).toBeVisible();
    const overflow = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }));
    expect(overflow.document, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(overflow.viewport + 1);
    await page.screenshot({ path: `test-results/home-${width}-light.png`, fullPage: true });
  });
}

test("three mood categories navigate to the catalog with a matching filter", async ({ page }) => {
  await seed(page);
  await page.goto("/");
  await page.getByRole("button", { name: "دیدن مدل‌های موج‌های نرم" }).click();
  await expect(page).toHaveURL(/#\/looks$/);
  await expect(page.getByRole("button", { name: "موج", exact: true })).toHaveAttribute("aria-pressed", "true");
});

test("dark theme and Persian RTL remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 850 });
  await seed(page, { theme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.screenshot({ path: "test-results/home-390-dark.png", fullPage: true });
});

test("sharing alone does not mark a locally stored booking as sent", async ({ page }) => {
  await seed(page, { bookings: [fixture] });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async () => undefined,
    });
  });

  await page.goto("/#/bookings");
  await expect(page.getByText("پیش‌نویس · ارسال نشده")).toBeVisible();
  await page.getByRole("button", { name: "ارسال برای سالن" }).click();
  await expect(page.getByText("پیش‌نویس · ارسال نشده")).toBeVisible();

  await page.getByRole("button", { name: /درخواست را برای سالن فرستاده‌ام/ }).click();
  await expect(page.getByText("ارسال‌شده · در انتظار تأیید")).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || "{}"), STORAGE);
  expect(stored.bookings[0].sent).toBe(true);
});

test("keyboard skip control targets the main page content", async ({ page }) => {
  await seed(page);
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("button", { name: "پرش به محتوای اصلی" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#app-content")).toBeFocused();
});

test("full-screen look discovery traps keyboard focus and Escape closes it", async ({ page }) => {
  await seed(page);
  await page.goto("/");
  await page.getByRole("button", { name: /دیدن مدل .* در لوک‌بوک/ }).click();
  const dialog = page.getByRole("dialog", { name: "کاوش لوک‌ها" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "بستن" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  const stillInside = await page.evaluate(() =>
    Boolean(document.activeElement?.closest('[role="dialog"][aria-label="کاوش لوک‌ها"]')),
  );
  expect(stillInside).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("storage quota failure is disclosed rather than silently treated as saved", async ({ page }) => {
  await seed(page);
  await page.goto("/#/looks");
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage quota exceeded", "QuotaExceededError");
    };
  });
  await page.getByRole("button", { name: /^ذخیره / }).first().click();
  await expect(page.getByRole("alert")).toContainText("ذخیره‌سازی این دستگاه با خطا");
});

test("home reflows at 200 percent text scaling", async ({ page }) => {
  await seed(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "32px";
  });
  await expect(page.getByRole("heading", { name: /زیبایی شما/ })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({ path: "test-results/home-390-text-200.png", fullPage: true });
});

for (const tab of ["services", "looks", "bookings", "me"] as const) {
  for (const width of [320, 390]) {
    test(`${tab} page has clear heading and no sideways scrolling at ${width}px`, async ({ page }) => {
      await seed(page);
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`/#/${tab}`);
      await expect(page.locator("main h1")).toBeVisible();
      const metrics = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
      }));
      expect(metrics.document).toBeLessThanOrEqual(metrics.viewport + 1);
      await page.screenshot({ path: `test-results/${tab}-${width}-light.png`, fullPage: true });
    });
  }
}

test("service selection reaches the full appointment-request wizard", async ({ page }) => {
  await seed(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/services");
  const add = page.getByRole("button", { name: /^افزودن .* به انتخاب‌ها$/ }).first();
  await add.click();
  await expect(page.getByRole("button", { name: /تکمیل درخواست/ })).toBeVisible();
  await page.getByRole("button", { name: /تکمیل درخواست/ }).click();
  await expect(page.getByRole("dialog", { name: /درخواست نوبت/ })).toBeVisible();
  // Choosing services in the catalog intentionally starts the wizard at step 2 (stylist).
  await expect(page.getByRole("progressbar", { name: /پیشرفت ثبت درخواست/ })).toHaveAttribute("aria-valuenow", "2");
  await expect(page.getByRole("heading", { name: /آرتیست/ })).toBeVisible();
});
