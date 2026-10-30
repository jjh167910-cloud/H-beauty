import { test, expect } from "playwright/test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { deflateRawSync } from "node:zlib";

const PAGE="/review/manicure-intake.html";
const ID="nail-atlas-aura-blush";
const original="fff72c6cd80dede315a2172657f0f7ab70d9dfe4f2f33092e1ca43ad1b879ddb";

async function createFixtureWebP(page: import("playwright/test").Page): Promise<Buffer> {
  const array=await page.evaluate(async()=>{
    const canvas=document.createElement("canvas");
    canvas.width=1600;canvas.height=1600;
    const c=canvas.getContext("2d");
    if(!c)throw new Error("canvas context missing");
    c.fillStyle="#f2e7dc";c.fillRect(0,0,1600,1600);
    c.fillStyle="#8e5982";c.fillRect(400,400,800,800);
    const blob=await new Promise<Blob>((resolve,reject)=>
      canvas.toBlob(x=>x?resolve(x):reject(Error("WebP encode failed")),"image/webp",.9));
    return [...new Uint8Array(await blob.arrayBuffer())];
  });
  return Buffer.from(array);
}

function zipOneWebP(name:string,source:Buffer):Buffer {
  const path=Buffer.from(name,"utf8"), deflated=deflateRawSync(source);
  const local=Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50,0);local.writeUInt16LE(20,4);local.writeUInt16LE(8,8);
  local.writeUInt32LE(deflated.length,18);local.writeUInt32LE(source.length,22);
  local.writeUInt16LE(path.length,26);
  const central=Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50,0);central.writeUInt16LE(20,4);central.writeUInt16LE(20,6);
  central.writeUInt16LE(8,10);central.writeUInt32LE(deflated.length,20);
  central.writeUInt32LE(source.length,24);central.writeUInt16LE(path.length,28);
  central.writeUInt32LE(0,42);
  const off=local.length+path.length+deflated.length;
  const end=Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(1,8);end.writeUInt16LE(1,10);
  end.writeUInt32LE(central.length+path.length,12);end.writeUInt32LE(off,16);
  return Buffer.concat([local,path,deflated,central,path,end]);
}

test("manicure QA portal displays all hosted original sources, RTL, and separate nonapproved statuses", async({page})=>{
  const outside:string[]=[];
  page.on("request",r=>{if(!r.url().includes("127.0.0.1:4173"))outside.push(r.url())});
  await page.setViewportSize({width:390,height:844});
  await page.goto(PAGE);
  await expect(page.locator("html")).toHaveAttribute("dir","rtl");
  await expect(page.locator(".tile")).toHaveCount(60);
  await expect(page.locator("#loaded")).toHaveText("0");
  await expect(page.locator(".preview img")).toHaveCount(60);
  await expect.poll(()=>page.locator(".tile").first().locator("img").evaluate(e=>(e as HTMLImageElement).naturalWidth)).toBe(1600);
  expect(outside).toEqual([]);
  await page.locator('[data-filter="REJECT_REGENERATE"]').click();
  await expect(page.locator(".tile")).toHaveCount(16);
  await page.locator('[data-filter="HOLD_EXACT_STYLE_REVIEW"]').click();
  await expect(page.locator(".tile")).toHaveCount(16);
  await page.locator('[data-filter="VISUAL_CANDIDATE_NOT_APPROVED"]').click();
  await expect(page.locator(".tile")).toHaveCount(28);
  const size=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
  expect(size.doc).toBeLessThanOrEqual(size.viewport+1);
});

test("real WebP user-file import rejects false SHA and accepts matching original", async({page})=>{
  await page.goto(PAGE);
  const raw=await createFixtureWebP(page);
  await page.locator("#files").setInputFiles({name:ID+".webp",mimeType:"image/webp",buffer:raw});
  await expect(page.locator("#loaded")).toHaveText("0");
  await expect(page.locator("#alert")).toContainText("SHA-256");
  const hash=createHash("sha256").update(raw).digest("hex");
  const source=readFileSync("public/review/manicure-intake.html","utf8");
  expect(source).toContain(original);
  await page.route("**/review/manicure-intake.html",route=>
    route.fulfill({contentType:"text/html",body:source.replace(original,hash)}));
  await page.goto(PAGE);
  await page.locator("#files").setInputFiles({name:ID+".webp",mimeType:"image/webp",buffer:raw});
  await expect(page.locator("#loaded")).toHaveText("1");
  await page.locator(".tile").first().getByRole("button",{name:/بازبینی تصویر/}).click();
  await expect(page.locator("dialog")).toHaveJSProperty("open",true);
  await expect(page.locator("#modalMeta")).toContainText("NOT APPROVED");
});

test("real deflated ZIP archive imports on device without publishing unapproved photos", async({page})=>{
  await page.goto(PAGE);
  const raw=await createFixtureWebP(page);
  const hash=createHash("sha256").update(raw).digest("hex");
  const source=readFileSync("public/review/manicure-intake.html","utf8");
  await page.route("**/review/manicure-intake.html",route=>
    route.fulfill({contentType:"text/html",body:source.replace(original,hash)}));
  await page.goto(PAGE);
  const zipped=zipOneWebP(ID+".webp",raw);
  await page.locator("#files").setInputFiles({name:"manicure-test.zip",mimeType:"application/zip",buffer:zipped});
  await expect(page.locator("#loaded")).toHaveText("1");
  await expect(page.locator("#alert")).toContainText("هیچ خطای انتقالی یافت نشد");
});

test("keyboard-only reviewer can open the local ZIP picker", async({page})=>{
  await page.goto(PAGE);
  const choose=page.getByRole("button",{name:/انتخاب سه فایل ZIP/});
  await choose.focus();
  await expect(choose).toBeFocused();
  const [picker]=await Promise.all([page.waitForEvent("filechooser"),page.keyboard.press("Enter")]);
  expect(picker.isMultiple()).toBe(true);
});
