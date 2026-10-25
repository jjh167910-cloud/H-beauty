import { test, expect, type Page } from "playwright/test";

async function ready(page: Page, width: number) {
  await page.setViewportSize({width, height:850});
  await page.addInitScript(() => {
    localStorage.setItem("hananeh-atelier-v1",
      JSON.stringify({ welcomed: true, theme:"light", bookings: [], favNails: [] }));
  });
  await page.goto("/#/nails");
  await expect(page.getByRole("heading",{name:/هنر ناخن/})).toBeVisible();
}

for (const width of [320,390,768]) {
  test(`nail art gallery responsive with usable filters at ${width}px`,async({page})=>{
    await ready(page,width);
    const cards=page.locator(".nail-card");
    await expect(cards).toHaveCount(28);
    const over=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(over).toBeLessThanOrEqual(1);
    await page.getByRole("group",{name:"فیلتر نوع طراحی ناخن"}).getByRole("button",{name:"فرنچ"}).click();
    await expect(cards).toHaveCount(6);
    await page.getByRole("group",{name:"فیلتر فرم ناخن"}).getByRole("button",{name:"بادامی"}).click();
    await expect(cards).toHaveCount(2);
    const save=cards.first().getByRole("button",{name:/ذخیره طرح/});
    const box=await save.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeGreaterThanOrEqual(44);
  });
}

test("nail inspiration favorite remains after reload and saved filter works",async({page})=>{
  await ready(page,390);
  await page.getByRole("button",{name:"ذخیره طرح شیری ابریشمی"}).click();
  await expect(page.getByRole("button",{name:"طرح‌های ناخن ذخیره‌شده"})).toContainText("۱");
  await page.reload();
  await expect(page.getByRole("button",{name:"طرح‌های ناخن ذخیره‌شده"})).toContainText("۱");
  await page.getByRole("button",{name:"طرح‌های ناخن ذخیره‌شده"}).click();
  await expect(page.locator(".nail-card")).toHaveCount(1);
  await expect(page.locator(".nail-card").first()).toContainText("شیری ابریشمی");
});

test("selected nail reference is shown in booking wizard",async({page})=>{
  await ready(page,390);
  await page.getByRole("button",{name:"مشاهده طرح فرنچ کلاسیک"}).click();
  await expect(page.getByRole("dialog",{name:"فرنچ کلاسیک"})).toBeVisible();
  await page.getByRole("button",{name:"درخواست اجرای همین طرح"}).click();
  await expect(page.getByRole("dialog",{name:"درخواست نوبت"})).toBeVisible();
  await expect(page.getByText("طرح ناخن انتخاب‌شده")).toBeVisible();
  await expect(page.getByText(/فرنچ کلاسیک/).first()).toBeVisible();
  const persisted=await page.evaluate(()=>localStorage.getItem("hananeh-atelier-v1"));
  expect(persisted).not.toBeNull();
});

test("nail gallery is accessible from services and home entry",async({page})=>{
  await ready(page,390);
  await page.getByRole("button",{name:"بازگشت به خدمات"}).click();
  await page.getByRole("group",{name:"دسته‌بندی خدمات"}).getByRole("button",{name:"مانیکور و پدیکور"}).click();
  await page.getByRole("button",{name:"ورود به گالری طراحی ناخن"}).click();
  await expect(page.getByRole("heading",{name:/هنر ناخن/})).toBeVisible();
  await page.getByRole("button",{name:"حنانه بیوتی، خانه"}).click();
  await page.getByRole("button",{name:"دیدن گالری ۲۸ طرح ناخن"}).click();
  await expect(page.locator(".nail-card")).toHaveCount(28);
});

test("nail search and empty state reset without breaking navigation",async({page})=>{
  await ready(page,390);
  await page.getByRole("searchbox",{name:"جست‌وجو در گالری ناخن"}).fill("NOT-A-NAIL");
  await expect(page.getByText("طرحی با این فیلترها پیدا نشد.")).toBeVisible();
  await page.getByRole("button",{name:"نمایش همه طرح‌ها"}).click();
  await expect(page.locator(".nail-card")).toHaveCount(28);
});
