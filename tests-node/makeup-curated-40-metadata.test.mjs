import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const text=path=>readFileSync(path,"utf8");

test("Forty stable Persian makeup IDs are defined independently of the legacy catalog",()=>{
 const s=text("src/data/makeup-curated-40.ts");
 const ids=[...s.matchAll(/"id":"(mk40-\d{2})"/g)].map(x=>x[1]);
 assert.equal(ids.length,40);
 assert.equal(new Set(ids).size,40);
 for(let i=1;i<=40;i++)assert.ok(ids.includes(`mk40-${String(i).padStart(2,"0")}`));
});
test("Live default is preserved until explicit curated gallery build is enabled",()=>{
 const data=text("src/data/makeup.ts"),art=text("src/components/salon/makeup-artwork.tsx");
 const sw=text("scripts/finalize-service-worker.mjs");
 assert.match(data,/VITE_MAKEUP_CURATED_40 === "true"/);
 assert.match(art,/VITE_MAKEUP_CURATED_40 === "true"/);
 assert.match(sw,/VITE_MAKEUP_CURATED_40 === "true"/);
 assert.match(text("src/components/salon/screens/makeup.tsx"),/تصاویر الهام‌بخش تولیدشده با هوش مصنوعی/);
});

test("curated names match the user's original 02–42 list, skipping 07",()=>{
  const ts=text("src/data/makeup-curated-40.ts");
  const rows=ts.split("\n").filter(line=>/^\s*\{"id":"mk40-\d{2}"/.test(line)).map(line=>JSON.parse(line.trim().replace(/,$/,"")));
  assert.equal(rows.length,40);
  assert.deepEqual(rows.map(x=>x.promptNumber),Array.from({length:41},(_,i)=>i+2).filter(x=>x!==7));
  assert.equal(rows.length,new Set(rows.map(x=>x.nameEn)).size);
  assert.equal(rows.length,new Set(rows.map(x=>x.name)).size);
  const byNo=new Map(rows.map(x=>[x.promptNumber,x]));
  const expected=[
    [2,"Classic Bride","mk40-02"],[3,"Persian Bride","mk40-03"],[4,"Aqd Ceremony","mk40-04"],
    [5,"Romantic Pink","mk40-05"],[6,"Full Glam","mk40-01"],
    [8,"Classic Smokey","mk40-08"],[9,"Brown Smokey","mk40-07"],
    [23,"Emerald Night","mk40-24"],[24,"Navy Smokey","mk40-21"],
    [27,"Graphic Liner","mk40-22"],[28,"Colour Liner","mk40-26"],
    [30,"Henna Night","mk40-28"],[35,"Rhinestone Accents","mk40-34"],
    [36,"Electric Blue","mk40-33"],[37,"50s Pin-Up","mk40-31"],
    [38,"60s Mod","mk40-39"],[39,"90s Brown Lip","mk40-40"],
    [40,"1920s Vamp","mk40-38"],[41,"K-Beauty","mk40-37"],[42,"Douyin","mk40-36"]
  ];
  for(const [n,name,id] of expected){
    assert.equal(byNo.get(n)?.nameEn,name);
    assert.equal(byNo.get(n)?.id,id);
  }
  for(const look of rows){
    assert.equal(look.code,'HB-'+String(look.promptNumber).padStart(2,"0"));
    assert.ok(look.description.length>25);
    assert.ok(look.image.endsWith('/'+look.id+'.webp'));
    assert.ok(look.thumb.endsWith('/sm/'+look.id+'.webp'));
  }
});
test("English and Persian style labels stay beneath portraits",()=>{
  const grid=text("src/components/salon/screens/makeup.tsx");
  const detail=text("src/components/salon/sheets/makeup.tsx");
  assert.match(grid,/makeup-card__english/);
  assert.match(grid,/look\.promptNumber/);
  assert.match(detail,/makeup-detail__english/);
  assert.match(text("src/styles/makeup-curated-40.css"),/\.makeup-card__english/);
});
