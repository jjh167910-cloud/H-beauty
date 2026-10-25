import { test, expect, type Page } from "playwright/test";

async function ready(page:Page,width=390){
  await page.setViewportSize({width,height:850});
  await page.addInitScript(()=>{
    localStorage.setItem("hananeh-atelier-v1",
      JSON.stringify({welcomed:true,theme:"light",bookings:[],favNails:[]}));
  });
  await page.goto("/#/nails");
  await expect(page.getByRole("heading",{name:/هنر ناخن/})).toBeVisible();
}

test("verified photo-only filter shows exactly nine real editorial references",async({page})=>{
  await ready(page,390);
  const toggle=page.getByRole("button",{name:"فقط طرح‌های دارای عکس الهام‌بخش"});
  await expect(toggle).toBeEnabled();
  // Playwright uses Vite's dev server, which intentionally exposes the
  // legacy 4-image fallback. The verified production V4 build enables nine.
  const sourceCountText=await page.getByRole("group",{name:"نوع پیش‌نمایش ناخن"})
    .locator(".nail-photo-refine__description span").innerText();
  expect(sourceCountText).toMatch(/^[۴۹] مرجع عکاسی الهام‌بخش در این مجموعه$/);
  const expectedCount=sourceCountText.startsWith("۹")?9:4;
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed","true");
  await expect(page.locator(".nail-card")).toHaveCount(expectedCount);
  const first=page.locator(".nail-card").first();
  await expect(first.locator('.nail-visual[data-media-source="ai-photo"]')).toBeVisible();
  await expect(first.locator(".nail-card__media-type--photo")).toBeVisible();
  await expect(first.locator(".nail-card__media-type--illustration")).toBeHidden();
  const delta=await page.evaluate(()=>
    document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(delta).toBeLessThanOrEqual(1);
  await first.getByRole("button",{name:"مشاهده طرح شیری ابریشمی"}).click();
  const sheet=page.getByRole("dialog",{name:"شیری ابریشمی"});
  await expect(sheet.locator(".nail-detail__source--photo")).toBeVisible();
  await expect(sheet.locator(".nail-detail__source--illustration")).toBeHidden();
});

test("pedicure section truthfully reports zero approved photos and keeps all 78 styles",async({page})=>{
  await ready(page,320);
  await page.getByRole("group",{name:"انتخاب گالری دست یا پا"})
    .getByRole("button",{name:"پدیکور · ۷۸ طرح"}).click();
  await expect(page.getByRole("button",{name:"فقط طرح‌های دارای عکس الهام‌بخش"})).toBeDisabled();
  await expect(page.getByRole("group",{name:"نوع پیش‌نمایش ناخن"})
    .getByText(/هنوز عکسِ تأییدشده نداریم/)).toBeVisible();
  await expect(page.locator(".nail-card")).toHaveCount(24);
  await expect(page.locator(".nail-card").first().locator(".nail-card__media-type--illustration")).toBeVisible();
});

test("blocked or missing approved photograph never claims its fallback is a photo",async({page})=>{
  await page.route("**/nails/photos/nail-milky-silk.webp",route=>route.fulfill({
    status:404,contentType:"text/plain",body:"not found"
  }));
  await ready(page,390);
  await page.getByRole("button",{name:"فقط طرح‌های دارای عکس الهام‌بخش"}).click();
  const card=page.locator(".nail-card").filter({has:page.getByRole("button",{name:"مشاهده طرح شیری ابریشمی"})});
  await expect(card.locator('.nail-visual[data-media-source="vector"]')).toBeVisible();
  await expect(card.locator(".nail-card__media-type--illustration")).toBeVisible();
  await expect(card.locator(".nail-card__media-type--photo")).toBeHidden();
  await expect(card.locator(".nail-visual__fallback svg")).toBeVisible();
});

test("photo filter and favorites can be combined without losing design references",async({page})=>{
  await ready(page,390);
  await page.getByRole("button",{name:"فقط طرح‌های دارای عکس الهام‌بخش"}).click();
  await page.getByRole("button",{name:"ذخیره طرح شیری ابریشمی"}).click();
  await page.getByRole("button",{name:"طرح‌های ناخن ذخیره‌شده"}).click();
  await expect(page.locator(".nail-card")).toHaveCount(1);
  await page.getByRole("button",{name:"فقط طرح‌های دارای عکس الهام‌بخش"}).click();
  await expect(page.locator(".nail-card")).toHaveCount(1);
});
