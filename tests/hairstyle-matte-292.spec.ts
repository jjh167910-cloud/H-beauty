import { test, expect } from "playwright/test";

const sampleIds=[1,9,24,30,43,77,84,125,141,172,205,292];
const matte=[245,243,239];
// SHA-256 of twelve model-preserving corrected 560px WebP images.
// This test must run after the production build installs the locked packs.
const sampleSHA:Record<number,string>={
  1:"d69ad18e62aa209907a69a84324b03a91f82171111c08d179135c9c828232783",
  9:"6acf454fe307a85171d863dc20ff11b65c7d1d00cbe423db71f39b0989f4fdab",
  24:"8bf9c2ea131dd12ffbf0c9895b7b884f62d778887a4137b8ea9227521bf8cc1c",
  30:"d992e0fcd2a6ee3bc86ad6ad2df9df6ede84a4d10c2373e99f30cb4867462809",
  43:"79eb3cf1324d1733f9d910811cd7d0edfe308b219153b90b5aa0fc5ada139f4d",
  77:"4ba678ab8569943b7c3c06119cf1cc49a8b1c8e5f2c17f485eb165f719263dd7",
  84:"d60700965eaef6ab10c0689c1183fac351ce81f8e79bc5f0273330b7e670cd70",
  125:"5c1c1484db2853c201393312c4c2f7bd34593dcc5554211aaf8bd1e5f48ac39f",
  141:"b1a4a79ec95bbec34563440791c6a6df874d161da6f3781d2a643d64081328ad",
  172:"3c33d11e4679e407cb9c223f691712d753fa83b3c9d69aad10b73b1795bc7ad7",
  205:"cd32e8f85c459ce8b4af24785fbfef67f679b4d3550c26b34a34585c711d60da",
  292:"1103f0e429b711c1e509c865f2729a79b211f5d01ada940d8b021b3ea6fac343"
};


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

test("browser receives processed matting assets, not stale original thumbnails",async({page})=>{
  await page.goto("/#/");
  const results=await page.evaluate(async pairs=>{
    const output=[];
    for(const [id,expected] of pairs){
      const response=await fetch(`/looks/sm/${id}.webp`,{cache:"no-store"});
      if(!response.ok)throw new Error("Missing hairstyle thumb "+id);
      const data=await response.arrayBuffer();
      const digest=await crypto.subtle.digest("SHA-256",data);
      const actual=Array.from(new Uint8Array(digest)).map(v=>v.toString(16).padStart(2,"0")).join("");
      output.push({id,expected,actual});
    }
    return output;
  },Object.entries(sampleSHA));
  for(const entry of results)
    expect(entry.actual,`style ${entry.id} must use the approved matting export`).toBe(entry.expected);
});
