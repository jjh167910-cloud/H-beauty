import { test, expect, type Page } from "playwright/test";

async function open(page:Page,width:number){
  await page.setViewportSize({width,height:844});
  await page.addInitScript(()=>{
    localStorage.setItem("hananeh-atelier-v1",JSON.stringify({
      welcomed:true,theme:"dark",bookings:[],favNails:[]
    }));
  });
  await page.goto("/#/");
  await expect(page.locator(".salon24-style-card")).toHaveCount(5);
  await expect(page.locator(".salon24-featured__card")).toHaveCount(4);
}

for(const width of [320,354,390,430,768,1280]){
  test(`full homepage photo cards never peek or clip at ${width}px`,async({page})=>{
    await open(page,width);
    const items=page.locator(".salon24-style-card,.salon24-featured__card");
    const cards=await items.evaluateAll(nodes=>nodes.map(el=>{
      const b=el.getBoundingClientRect();
      const img=el.querySelector("img") as HTMLImageElement;
      const f=img?.parentElement?.getBoundingClientRect();
      const i=img?.getBoundingClientRect();
      return {
        left:b.left,right:b.right,width:b.width,
        frameWidth:f?.width||0,frameHeight:f?.height||0,
        imageLeft:i?.left||0,imageRight:i?.right||0,
        frameLeft:f?.left||0,frameRight:f?.right||0,
        fit:img?getComputedStyle(img).objectFit:"",
        imgWidth:img?.naturalWidth||0,imgHeight:img?.naturalHeight||0,
      };
    }));
    expect(cards).toHaveLength(9);
    for(const [i,c] of cards.entries()){
      expect(c.left, String(i)).toBeGreaterThanOrEqual(-1);
      expect(c.right, String(i)).toBeLessThanOrEqual(width+1);
      expect(c.width).toBeGreaterThan(95);
      expect(c.frameWidth/c.frameHeight).toBeCloseTo(1,1);
      expect(c.fit).toBe("contain");
      expect(c.imageLeft-c.frameLeft).toBeGreaterThan(3);
      expect(c.frameRight-c.imageRight).toBeGreaterThan(3);
    }
    const pageWidth=await page.evaluate(()=>
      document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(pageWidth).toBeLessThanOrEqual(1);
  });
}

test("mobile gallery cards keep full images within their padded matte frames",async({page})=>{
  await open(page,354);
  await page.goto("/#/looks");
  const card=page.locator(".studio-look-card .look-card__media").first();
  await card.scrollIntoViewIfNeeded();
  await expect(card.locator("img")).toHaveJSProperty("complete",true);
  const measure=await card.evaluate(el=>{
    const a=el.getBoundingClientRect();
    const im=el.querySelector("img") as HTMLImageElement;
    const b=im.getBoundingClientRect();
    return {w:a.width,h:a.height,imageW:b.width,imageH:b.height,xpad:b.left-a.left,ypad:b.top-a.top,fit:getComputedStyle(im).objectFit,naturalW:im.naturalWidth};
  });
  expect(measure.w/measure.h).toBeCloseTo(1,1);
  expect(measure.xpad).toBeGreaterThan(3);
  expect(measure.ypad).toBeGreaterThan(3);
  expect(measure.fit).toBe("contain");
  expect(measure.naturalW).toBeGreaterThan(0);
});

test("homepage cards navigate without relying on offscreen partial slides",async({page})=>{
  await open(page,354);
  await page.locator(".salon24-style-card").last().click();
  await expect(page).toHaveURL(/#\/looks/);
});

test("hairstyle detail sheet shows the original square photograph without cover crop",async({page})=>{
  await open(page,354);
  await page.goto("/#/looks");
  const card=page.locator(".studio-look-card").first();
  await card.scrollIntoViewIfNeeded();
  await card.getByRole("button",{name:/مشاهده|دیدن/}).first().click().catch(async()=>{await card.locator(".studio-look-card__frame").click();});
  const hero=page.locator(".look-hero.studio-look-detail__hero");
  await expect(hero).toBeVisible();
  const shape=await hero.evaluate(el=>{
    const r=el.getBoundingClientRect();
    const img=el.querySelector("img") as HTMLImageElement;
    return {ratio:r.width/r.height,fit:getComputedStyle(img).objectFit,pad:getComputedStyle(img).paddingTop};
  });
  expect(shape.ratio).toBeCloseTo(1,1);
  expect(shape.fit).toBe("contain");
  expect(parseFloat(shape.pad)).toBeGreaterThan(2);
});

test("full-screen discovery shows uncut photo in a square canvas",async({page})=>{
  await open(page,354);
  const featured=page.locator(".salon24-featured__card").first();
  await featured.scrollIntoViewIfNeeded();
  await featured.click();
  const frame=page.locator(".discover__frame").first();
  await expect(frame).toBeVisible();
  const shape=await frame.evaluate(el=>{
    const r=el.getBoundingClientRect(),img=el.querySelector("img") as HTMLImageElement;
    return {ratio:r.width/r.height,fit:getComputedStyle(img).objectFit};
  });
  expect(shape.ratio).toBeCloseTo(1,1);
  expect(shape.fit).toBe("contain");
});
