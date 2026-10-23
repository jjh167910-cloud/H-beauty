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
