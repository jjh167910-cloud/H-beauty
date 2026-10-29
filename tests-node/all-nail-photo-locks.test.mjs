import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {LOCKS,loadPhotoLocks} from "../scripts/verify-all-nail-photos.mjs";

test("all 58 manicure and 78 pedicure references are disjoint and locked",()=>{
  const items=loadPhotoLocks();
  assert.equal(LOCKS.reduce((sum,x)=>sum+x.count,0),136);
  assert.equal(items.filter(x=>x.kind==="manicure").length,58);
  assert.equal(items.filter(x=>x.kind==="pedicure").length,78);
  assert.equal(new Set(items.map(x=>x.path)).size,136);
  assert.equal(new Set(items.map(x=>x.hash)).size,136);
});
test("every newly approved manicure image is explicitly wired to the gallery",()=>{
  const items=loadPhotoLocks().filter(x=>x.kind==="manicure"&&!x.legacy);
  const component=readFileSync("src/components/salon/nail-visual.tsx","utf8");
  for(const item of items){
    assert.ok(component.includes(item.id),"Photo has no gallery association: "+item.id);
  }
  assert.match(component,/VITE_PEDICURE_78/);
});
