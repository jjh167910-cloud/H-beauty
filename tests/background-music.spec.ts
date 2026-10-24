import { expect, test } from "playwright/test";
test.skip(process.env.VITE_SALON_MUSIC !== "true", "Music file not installed/licensed for this build");
test("music loops across navigation and remembers mute preference", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("hananeh-atelier-v1",
      JSON.stringify({ welcomed: true, theme: "light", bookings: [], favMakeup: [] }));
    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true, value: function (this: HTMLMediaElement) {
        this.dispatchEvent(new Event("play")); return Promise.resolve();
      },
    });
    Object.defineProperty(HTMLMediaElement.prototype, "pause", {
      configurable: true, value: function (this: HTMLMediaElement) {
        this.dispatchEvent(new Event("pause"));
      },
    });
  });
  await page.goto("/#/");
  const audio = page.locator("audio[src='/audio/hananeh-salon-ambience.mp3']");
  await expect(audio).toHaveCount(1);
  await expect(audio).toHaveAttribute("loop", "");
  await page.getByRole("button", { name: "حنانه بیوتی، خانه" }).click();
  const toggle = page.getByRole("button", { name: "قطع موسیقی پس‌زمینه" });
  await expect(toggle).toHaveAttribute("data-playing", "");
  await page.getByRole("button", { name: "خدمات", exact: true }).first().click();
  await expect(audio).toHaveCount(1);
  await toggle.click();
  await expect(page.getByRole("button", { name: "پخش موسیقی پس‌زمینه" }))
    .toHaveAttribute("aria-pressed", "false");
  await expect.poll(() => page.evaluate(() =>
    localStorage.getItem("hananeh-salon-music-enabled-v1"))).toBe("off");
  await page.reload();
  await expect(page.getByRole("button", { name: "پخش موسیقی پس‌زمینه" }))
    .toHaveAttribute("aria-pressed", "false");
});
