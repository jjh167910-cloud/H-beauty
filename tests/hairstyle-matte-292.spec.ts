import { test, expect } from "playwright/test";

const sampleIds=[1,9,24,30,43,77,84,125,141,172,205,292];
const matte=[245,243,239];

test("all sample thumbs have a completely consistent ivory background with intact subjects",async({page})=>{
  await page.goto("/#/");
  const result=await page.evaluate(async ids=>{
    const outcomes=[];
    for(const id of ids){
      const img=new Image();
      img.src=`/looks/sm/${id}.webp`;
      await img.decode();
      const canvas=document.createElement("canvas");
      canvas.width=canvas.height=96;
      const ctx=canvas.getContext("2d",{willReadFrequently:true})!;
      ctx.drawImage(img,0,0,96,96);
      const data=ctx.getImageData(0,0,96,96).data;
      const get=(x:number,y:number)=>{
        const at=4*(y*96+x);
        return [data[at],data[at+1],data[at+2]];
      };
      const corners=[get(0,0),get(95,0),get(0,95),get(95,95)];
      const center=get(48,36);
      outcomes.push({id,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,corners,center});
    }
    return outcomes;
  },sampleIds);
  expect(result).toHaveLength(sampleIds.length);
  for(const photo of result){
    expect(photo.naturalWidth).toBe(560);
    expect(photo.naturalHeight).toBe(560);
    for(const rgb of photo.corners)for(let ch=0;ch<3;ch++)
      expect(Math.abs(rgb[ch]-matte[ch]),`Photo ${photo.id} corner color`).toBeLessThanOrEqual(7);
    const centerVariance=photo.center.map((c,i)=>Math.abs(c-matte[i]));
    expect(Math.max(...centerVariance),`Photo ${photo.id} subject should exist`).toBeGreaterThan(15);
  }
});

for(const width of [320,354,390]){
  test(`native-background portrait cards remain correctly framed at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:850});
    await page.addInitScript(()=>{
      localStorage.setItem("hananeh-atelier-v1",
        JSON.stringify({welcomed:true,theme:"dark",bookings:[],favNails:[]}));
    });
    await page.goto("/#/");
    await expect(page.locator(".salon24-style-card")).toHaveCount(4);
    const corners=await page.locator(".salon24-style-card .media").first().evaluate(async frame=>{
      const img=frame.querySelector("img")!;
      await img.decode();
      const style=getComputedStyle(frame);
      const r=frame.getBoundingClientRect();
      return {fit:getComputedStyle(img).objectFit,bg:style.backgroundColor,ratio:r.width/r.height,photoWidth:img.naturalWidth};
    });
    expect(corners.fit).toBe("contain");
    expect(corners.bg).toBe("rgb(245, 243, 239)");
    expect(corners.ratio).toBeCloseTo(1,1);
    expect(corners.photoWidth).toBe(560);
    const overflow=await page.evaluate(()=>
      document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
