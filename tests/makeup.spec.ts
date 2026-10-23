import { expect, test } from "playwright/test";
const KEY="hananeh-atelier-v1";

async function makeup(page: import("playwright/test").Page,width=390,theme:"light"|"dark"="light") {
  await page.setViewportSize({width,height:width===320?700:844});
  await page.addInitScript(({key,theme})=>localStorage.setItem(key,JSON.stringify({
    welcomed:true,theme,bookings:[],favs:[],makeupFavs:[],
  })),{key:KEY,theme});
  await page.goto("/#/looks");
  await page.getByRole("tab",{name:"میکاپ"}).click();
}

test("makeup gallery has six filters and 48 distinct concept cards",async({page})=>{
  await makeup(page);
  await expect(page.getByRole("heading",{name:/گالری.*میکاپ/})).toBeVisible();
  await expect(page.locator(".makeup-card")).toHaveCount(48);
  for(const name of ["نچرال","سافت گلم","مجلسی","عروس","آرایش چشم","آرایش لب"])
    await expect(page.getByRole("group",{name:"دسته‌بندی میکاپ"}).getByRole("button",{name})).toBeVisible();
  await page.getByRole("group",{name:"دسته‌بندی میکاپ"}).getByRole("button",{name:"نچرال"}).click();
  await expect(page.locator(".makeup-card")).toHaveCount(8);
  await expect(page.getByText(/تصویرسازی مفهومی/).first()).toBeVisible();
});

test("makeup favorite is stored separately from existing hairstyle favorites",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.addInitScript(key=>localStorage.setItem(key,JSON.stringify({
    welcomed:true,theme:"light",favs:[1],compare:[],bookings:[],cart:[],
  })),KEY);
  await page.goto("/#/looks");
  await page.getByRole("tab",{name:"میکاپ"}).click();
  await page.locator(".makeup-card__actions button").first().click();
  const stored=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)||"{}"),KEY);
  expect(stored.favs).toEqual([1]);
  expect(stored.makeupFavs).toHaveLength(1);
  expect(stored.makeupFavs[0]).toMatch(/^mk-/);
  await page.getByRole("tab",{name:"مدل مو"}).click();
  await expect(page.locator(".studio-look-card").first()).toBeVisible();
});

test("makeup detail opens booking request with the chosen makeup service",async({page})=>{
  await makeup(page);
  await page.locator(".makeup-card__view").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText(/راهنمای انتخاب رنگ/)).toBeVisible();
  await page.getByRole("button",{name:"درخواست این میکاپ"}).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button",{name:"مرحله قبل"}).click();
  await expect(page.getByText("میکاپ نچرال").first()).toBeVisible();
  await expect(page.getByRole("button",{name:"ادامه"})).toBeVisible();
});

test("makeup style search supports Persian names and independent saved filter",async({page})=>{
  await makeup(page);
  await page.getByRole("searchbox",{name:"جست‌وجوی مدل میکاپ"}).fill("رزگلد");
  await expect(page.locator(".makeup-card")).not.toHaveCount(48);
  await expect(page.locator(".makeup-card").first()).toBeVisible();
  await page.getByRole("button",{name:"پاک کردن جست‌وجو"}).click();
  await expect(page.locator(".makeup-card")).toHaveCount(48);
  await page.locator(".makeup-card__actions button").first().click();
  await page.getByRole("group",{name:"دسته‌بندی میکاپ"}).getByRole("button",{name:/ذخیره‌ها/}).click();
  await expect(page.locator(".makeup-card")).toHaveCount(1);
});

test("gallery renders without overflow at 320px and 768px",async({page})=>{
  await makeup(page,320);
  await expect(page.locator(".makeup-grid")).toBeVisible();
  let overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({path:"test-results/makeup-gallery-320.png",animations:"disabled"});
  await page.setViewportSize({width:768,height:1024});
  overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({path:"test-results/makeup-gallery-tablet.png",animations:"disabled"});
});

test("dark mode makeup is readable and works completely without external images",async({page})=>{
  await makeup(page,390,"dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme","dark");
  await expect(page.locator(".makeup-art").first()).toBeVisible();
  const outbound=await page.evaluate(()=>[...document.querySelectorAll('.makeup-page img')].map(x=>x.src));
  expect(outbound).toEqual([]);
  await page.screenshot({path:"test-results/makeup-gallery-dark.png",animations:"disabled"});
});

test("hair gallery and original hairstyle detail still open after makeup switching",async({page})=>{
  await makeup(page);
  await page.getByRole("tab",{name:"مدل مو"}).click();
  await expect(page.locator(".studio-look-card").first()).toBeVisible();
  await page.locator(".studio-look-card > button").first().click();
  await expect(page.getByRole("dialog",{name:"کاوش لوک‌ها"})).toBeVisible();
});
