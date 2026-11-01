import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";

const file=(path)=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const fa=/[\u0600-\u06FF]/u;
const imageCatalog=JSON.parse(file("src/data/catalog.json"));
const allHair=imageCatalog.flatMap(f=>f.variantIds.map((id,i)=>({id,title:f.variantNames[i],family:f})));
function distinctTitles(items,entity){
  const seen=new Map();
  for(const item of items){
    assert.match(item.title,fa,`${entity} ${item.id} lacks Persian`);
    assert.ok(item.title.length>=4 && item.title.length<=65,`${entity} ${item.id} unacceptable title length`);
    assert.ok(!seen.has(item.title),`${entity} duplicate: ${item.id} / ${seen.get(item.title)} => ${item.title}`);
    seen.set(item.title,item.id);
  }
}
test("all 292 hairstyle IDs have contemporary, unique Persian names and searchable legacy aliases",()=>{
  assert.equal(imageCatalog.length,283);
  assert.equal(allHair.length,292);
  assert.deepEqual(allHair.map(x=>x.id).sort((a,b)=>a-b),Array.from({length:292},(_,i)=>i+1));
  distinctTitles(allHair,"hair");
  for(const {id,title,family} of allHair){
    assert.ok(family.searchText.includes(title),`Missing active search name ${id}`);
    assert.ok(family.name && fa.test(family.name));
  }
  const examples=new Map(allHair.map(x=>[x.id,x.title]));
  assert.match(examples.get(1),/ویو.*شکلاتی/);
  assert.match(examples.get(30),/ویو هالیوودی/);
  assert.match(examples.get(291),/لخت مشکی/);
  assert.ok(imageCatalog.find(x=>x.repId===1).searchText.includes("موج‌دار شکلاتی"),"Previous valid Persian title must remain searchable");
});

const parseMakeup=(path,prefix)=>{
  return file(path).split("\n").map(line=>{
    const id=line.match(/"id":"(mk(?:40|80)-\d+)"/)?.[1];
    if(!id)return null;
    const name=line.match(/"name":"([^"]+)"/)?.[1];
    const old=line.match(/"aliases":\["([^"]+)"\]/)?.[1];
    assert.ok(name,"Missing makeup name for "+id);
    return {id,title:name,old};
  }).filter(Boolean);
};
test("all 80 curated makeup names are Persian and previous names are searchable",()=>{
  const makeup=[
    ...parseMakeup("src/data/makeup-curated-40.ts","mk40"),
    ...parseMakeup("src/data/makeup-curated-43-82.ts","mk80")
  ];
  assert.equal(makeup.length,80);
  assert.equal(new Set(makeup.map(x=>x.id)).size,80);
  distinctTitles(makeup,"makeup");
  assert.ok(makeup.filter(x=>x.old).length>=65,"Renamed entries should retain original-search aliases");
  const byId=new Map(makeup.map(x=>[x.id,x]));
  assert.equal(byId.get("mk80-45").title,"میکاپ نچرال شاین");
  assert.equal(byId.get("mk80-49").title,"میکاپ موو سرد");
  assert.equal(byId.get("mk40-06").title,"میکاپ نچرال خیلی سبک");
});

function sectionRecords(src,from,to,kind){
  const start=src.indexOf(from);
  const end=src.indexOf(to,start+from.length);
  assert.ok(start>=0&&end>start,"Missing "+kind+" source section");
  return [...src.slice(start,end).matchAll(/\{id:"([^"]+)",fa:"([^"]+)"(?:,legacyFa:"([^"]+)")?/g)]
    .map(m=>({id:m[1],title:m[2],old:m[3]??m[2]}));
}
test("all 298 nail titles remain unique, modern Persian with former family/shade aliases",()=>{
  const src=file("src/data/nail-expansion.ts");
  const shades=sectionRecords(src,"const SHADES:","type Family =","nail shades");
  const manicures=sectionRecords(src,"const MANICURE_FAMILIES:","const PEDI_SHADES","manicure families");
  const pedicures=sectionRecords(src,"const PEDICURE_FAMILIES:","/** Stable family selector","pedicure families");
  assert.equal(shades.length,12);
  assert.equal(manicures.length,16);
  assert.equal(pedicures.length,12);
  const original=file("src/data/nail-styles.ts");
  const base=[...original.matchAll(/\{ id:"([^"]+)",(?:kind:"[^"]+",)?title:"([^"]+)"/g)]
    .map(m=>({id:m[1],title:m[2]}));
  assert.equal(base.length,34);
  const all=[
    ...base,
    ...manicures.flatMap(f=>shades.map(c=>({id:"nail-atlas-"+f.id+"-"+c.id,title:f.title+" "+c.title}))),
    ...pedicures.flatMap(f=>[shades[0],shades[1],shades[3],shades[6],shades[7],shades[9]].map(c=>
      ({id:"pedi-atlas-"+f.id+"-"+c.id,title:f.title+" "+c.title})))
  ];
  assert.equal(all.length,298);
  assert.equal(new Set(all.map(x=>x.id)).size,298);
  distinctTitles(all,"nail");
  assert.ok(src.includes("family.legacyFa??family.fa")&&src.includes("shade.legacyFa??shade.fa"),"Existing nail names should remain searchable");
  assert.ok(original.includes('aliases?: readonly string[];'),"NailStyle alias type missing");
  assert.ok(file("src/components/salon/screens/nails.tsx").includes('style.aliases?.join(" ")'),"Nail search does not include aliases");
});
