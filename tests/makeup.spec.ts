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
  await expect(page.locator(".makeup-editorial-note")).toContainText("چهره مرجع ثابت");
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
  await expect(page.getByText(/عکس واقعی همان مدل مرجع بدون تغییر چهره/)).toBeVisible();
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
  await page.locator(".makeup-grid").scrollIntoViewIfNeeded();
  await page.screenshot({path:"test-results/makeup-grid-320.png",animations:"disabled"});
  await page.setViewportSize({width:768,height:1024});
  overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({path:"test-results/makeup-gallery-tablet.png",animations:"disabled"});
});

test("dark mode renders the same exact model portrait without remote assets",async({page})=>{
  await makeup(page,390,"dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme","dark");
  const first=page.locator(".makeup-art img").first();
  await expect(first).toBeVisible();
  await expect(first).toHaveAttribute("src","/makeup/model-reference.webp");
  await expect.poll(()=>first.evaluate(img=>(img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  const sources=await page.locator(".makeup-card__art img").evaluateAll(nodes=>nodes.map(img=>img.getAttribute("src")));
  expect(new Set(sources)).toEqual(new Set(["/makeup/model-reference.webp"]));
  expect(sources).toHaveLength(48);
  await expect(page.locator('.makeup-page input[type="file"]')).toHaveCount(0);
  await page.screenshot({path:"test-results/makeup-gallery-dark.png",animations:"disabled"});
});

test("hair gallery and original hairstyle detail still open after makeup switching",async({page})=>{
  await makeup(page);
  await page.getByRole("tab",{name:"مدل مو"}).click();
  await expect(page.locator(".studio-look-card").first()).toBeVisible();
  await page.locator(".studio-look-card > button").first().click();
  await expect(page.getByRole("dialog",{name:"کاوش لوک‌ها"})).toBeVisible();
});

test("same unmodified face appears in service, detail and booking screens",async({page})=>{
  await makeup(page);
  const card=page.locator(".makeup-card__view").first();
  await card.click();
  const detail=page.getByRole("dialog");
  await expect(detail.locator('.makeup-detail__art img[src="/makeup/model-reference.webp"]')).toBeVisible();
  await expect(detail.locator(".makeup-detail__thumbs img")).toHaveCount(3);
  await expect(detail.locator(".makeup-detail__palette span")).toHaveCount(4);
  await page.screenshot({path:"test-results/makeup-detail-exact-face.png",animations:"disabled"});
  await detail.getByRole("button",{name:"درخواست این میکاپ"}).click();
  await page.getByRole("button",{name:"مرحله قبل"}).click();
  await expect(page.getByText("میکاپ نچرال").first()).toBeVisible();
});

test("homepage makeup mode matches visual brief with original face and burgundy CTA",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.addInitScript(key=>localStorage.setItem(key,JSON.stringify({welcomed:true,theme:"light"})),KEY);
  await page.goto("/#/");
  const selector=page.getByRole("tablist",{name:"انتخاب بخش اصلی"});
  await selector.getByRole("tab",{name:"میکاپ"}).click();
  await expect(selector.getByRole("tab",{name:"میکاپ"})).toHaveAttribute("aria-selected","true");
  await expect(page.getByRole("heading",{name:/اعتماد به نفس شما/})).toBeVisible();
  await expect(page.locator('.makeup-spotlight img[src="/makeup/model-reference.webp"]')).toBeVisible();
  await expect(page.getByRole("button",{name:"درخواست نوبت میکاپ"})).toBeVisible();
  await page.screenshot({path:"test-results/makeup-home-exact-face-390.png",animations:"disabled"});
  await page.locator('.makeup-spotlight__categories button').last().click();
  await expect(page.getByRole("tab",{name:"میکاپ"})).toHaveAttribute("aria-selected","true");
});

test("makeup service rows all show the same model rather than unrelated stock photos",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.addInitScript(key=>localStorage.setItem(key,JSON.stringify({welcomed:true,theme:"light"})),KEY);
  await page.goto("/#/services");
  await page.getByRole("group",{name:"دسته‌بندی خدمات"}).getByRole("button",{name:"میکاپ",exact:true}).click();
  const images=page.locator(".studio-service-item[data-makeup] .makeup-service-thumb img");
  await expect(images.first()).toBeVisible();
  const srcs=await images.evaluateAll(elements=>elements.map(x=>x.getAttribute("src")));
  expect(srcs.length).toBeGreaterThan(1);
  expect(new Set(srcs)).toEqual(new Set(["/makeup/model-reference.webp"]));
  await page.screenshot({path:"test-results/makeup-services-exact-face.png",animations:"disabled"});
});

test("reference design: real photo, caption beneath image and saved heart in corner",async({page})=>{
  await makeup(page,390);
  const first=page.locator(".makeup-card").first();
  await first.scrollIntoViewIfNeeded();
  const photo=first.locator(".makeup-card__art");
  const caption=first.locator(".makeup-card__caption");
  const favorite=first.locator('.makeup-card__actions button[aria-pressed]').first();
  const request=first.getByRole("button",{name:/درخواست نوبت/});
  await expect(photo.locator('img[src="/makeup/model-reference.webp"]')).toBeVisible();
  await expect(caption.getByText(/نچرال/).first()).toBeVisible();
  await expect(favorite).toBeVisible();
  await expect(request).toBeVisible();
  const [pb,cb,fb,rb]=await Promise.all([photo.boundingBox(),caption.boundingBox(),favorite.boundingBox(),request.boundingBox()]);
  expect(pb&&cb&&fb&&rb).toBeTruthy();
  expect(cb!.y).toBeGreaterThanOrEqual(pb!.y+pb!.height-1);
  expect(fb!.x).toBeGreaterThanOrEqual(pb!.x-1);
  expect(fb!.y).toBeGreaterThanOrEqual(pb!.y-1);
  expect(fb!.y+fb!.height).toBeLessThan(pb!.y+pb!.height*.36);
  expect(fb!.width).toBeGreaterThanOrEqual(44);
  expect(fb!.height).toBeGreaterThanOrEqual(44);
  expect(rb!.y).toBeGreaterThanOrEqual(cb!.y+cb!.height-1);
  await page.screenshot({path:"test-results/makeup-design-reference-gallery-390.png",animations:"disabled"});
});

test("reference design: details show same face, eye/lip crops and actual service quote status",async({page})=>{
  await makeup(page,390);
  await page.locator(".makeup-card__view").first().click();
  const detail=page.getByRole("dialog");
  await expect(detail.locator('.makeup-detail__art img[src="/makeup/model-reference.webp"]')).toBeVisible();
  await expect(detail.locator(".makeup-detail__thumbs img")).toHaveCount(3);
  await expect(detail.locator(".makeup-detail__palette span")).toHaveCount(4);
  await expect(detail.locator(".makeup-detail__service")).toContainText("میکاپ نچرال");
  await expect(detail.locator(".makeup-detail__service")).toContainText("قیمت پس از مشاوره");
  await detail.locator(".makeup-detail__service").scrollIntoViewIfNeeded();
  await page.screenshot({path:"test-results/makeup-design-reference-detail-390.png",animations:"disabled"});
});

test("RTL makeup tabs support keyboard arrows, Home/End and a labeled panel", async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.addInitScript(key=>localStorage.setItem(key,JSON.stringify({welcomed:true,theme:"light"})),KEY);
  await page.goto("/#/looks");
  const tabs=page.getByRole("tablist",{name:"نوع گالری"});
  const hair=tabs.getByRole("tab",{name:"مدل مو"});
  const makeupTab=tabs.getByRole("tab",{name:"میکاپ"});
  await hair.focus();
  await expect(hair).toHaveAttribute("aria-selected","true");
  await page.keyboard.press("ArrowLeft");
  await expect(makeupTab).toBeFocused();
  await expect(makeupTab).toHaveAttribute("aria-selected","true");
  await expect(page.getByRole("tabpanel",{name:"میکاپ"})).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(hair).toBeFocused();
  await expect(hair).toHaveAttribute("aria-selected","true");
  await page.keyboard.press("End");
  await expect(makeupTab).toBeFocused();
  await page.keyboard.press("Home");
  await expect(hair).toBeFocused();

  await page.goto("/#/");
  const homeTabs=page.getByRole("tablist",{name:"انتخاب بخش اصلی"});
  const homeHair=homeTabs.getByRole("tab",{name:"مدل مو"});
  const homeMakeup=homeTabs.getByRole("tab",{name:"میکاپ"});
  await homeHair.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(homeMakeup).toBeFocused();
  await expect(homeMakeup).toHaveAttribute("aria-selected","true");
  await expect(page.getByRole("tabpanel",{name:"میکاپ"})).toBeVisible();
  await expect(page.getByRole("region",{name:"معرفی خدمات میکاپ"})).toBeVisible();
});
