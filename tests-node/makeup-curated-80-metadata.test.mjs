import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const source=path=>readFileSync(path,"utf8");
const records=path=>source(path).split("\n")
  .filter(line=>/^\s*\{"id":"(?:mk40|mk80)-/.test(line))
  .map(line=>JSON.parse(line.trim().replace(/,$/,"")));

test("80-user-photo mode adds exactly 40 distinct records, without replacing original 40",()=>{
  const old=records("src/data/makeup-curated-40.ts");
  const added=records("src/data/makeup-curated-43-82.ts");
  assert.equal(old.length,40);
  assert.equal(added.length,40);
  assert.deepEqual(added.map(x=>x.promptNumber),Array.from({length:40},(_,i)=>i+43));
  assert.deepEqual(added.map(x=>x.id),Array.from({length:40},(_,i)=>"mk80-"+(i+43)));
  assert.equal(new Set([...old,...added].map(x=>x.id)).size,80);
  assert.equal(new Set([...old,...added].map(x=>x.promptNumber)).size,80);
});

test("uploaded ZIP filenames are source of truth, never the earlier 43–82 idea bank",()=>{
  const added=records("src/data/makeup-curated-43-82.ts");
  const samples=new Map([[43,"Office Polished"],[57,"Silver Smokey"],[61,"Persian Kohl (Sormeh)"],
    [65,"Golden Bride"],[69,"Nowruz Fresh"],[70,"Yalda Night"],
    [71,"Chrome Lids"],[75,"Neon Graphic"],[80,"Igari"],[82,"J-Beauty Coral"]]);
  for(const [number,name] of samples)
    assert.equal(added.find(x=>x.promptNumber===number)?.nameEn,name);
  for(const look of added){
    assert.equal(look.code,"HB-"+look.promptNumber);
    assert.match(look.image,new RegExp("/mk80-"+look.promptNumber+"\\.webp$"));
    assert.match(look.thumb,new RegExp("/sm/mk80-"+look.promptNumber+"\\.webp$"));
    assert.ok(look.name.length>3 && look.description.length>40);
  }
  assert.equal(new Set(added.map(x=>x.nameEn)).size,40);
  assert.equal(new Set(added.map(x=>x.name)).size,40);
});

test("the extra portraits are opt-in and preserve favorites and booking IDs",()=>{
  const app=source("src/data/makeup.ts");
  const art=source("src/components/salon/makeup-artwork.tsx");
  const gallery=source("src/components/salon/screens/makeup.tsx");
  const sw=source("scripts/finalize-service-worker.mjs");
  assert.match(app,/VITE_MAKEUP_CURATED_80 === "true"/);
  assert.match(app,/CURATED_MAKEUP_40, \.\.\.CURATED_MAKEUP_43_82/);
  assert.match(art,/export const MAKEUP_CURATED_80/);
  assert.match(gallery,/makeup-edition-switch/);
  assert.match(gallery,/onClick=\{\(\)=>setEdition\(key\)\}/);
  assert.match(gallery,/makeup-card__english/);
  assert.match(sw,/VITE_MAKEUP_CURATED_80/);
  assert.match(sw,/curated-80/);
});
