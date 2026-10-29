import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {webpDimensions} from "../scripts/audit-nail-photo-candidates.mjs";

const ids=new Set(["nail-atlas-magnetic-espresso","nail-atlas-magnetic-sage","nail-atlas-prism-ivory","nail-atlas-gradient-pearl","nail-atlas-gradient-lavender"]);
const lock="assets/hbeauty-manicure-batch50c.sha256";
test("Batch50C publishes only five exact-ID, native, nonduplicate images",()=>{
  const lines=readFileSync(lock,"utf8").trim().split(/\r?\n/);
  assert.equal(lines.length,5);
  const seen=new Set(),hashes=new Set();
  for(const line of lines){
    const m=line.match(/^([a-f0-9]{64})  (public\/nails\/photos\/(nail-[a-z0-9-]+)\.webp)$/);
    assert.ok(m,"Invalid Batch50C lock entry");
    const [_,hash,path,id]=m;
    assert.ok(ids.has(id)&&!seen.has(id)&&!hashes.has(hash),"Unknown or duplicate photo");
    assert.ok(existsSync(path),"Missing image "+id);
    const bytes=readFileSync(path);
    assert.equal(createHash("sha256").update(bytes).digest("hex"),hash);
    assert.deepEqual(webpDimensions(bytes),{width:1600,height:1600});
    seen.add(id);hashes.add(hash);
  }
  assert.equal(seen.size,5);
  for(const prior of ["hbeauty-nail-editorial-v4.sha256","hbeauty-manicure-batch7.sha256","hbeauty-manicure-batch8.sha256","hbeauty-manicure-batch50-a.sha256","hbeauty-manicure-batch50b.sha256","hbeauty-manicure-four-20261029.sha256","hbeauty-manicure-midnight-glitter.sha256","hbeauty-pedicure-78.sha256"]){
    const old=readFileSync("assets/"+prior,"utf8");
    for(const line of lines){
      const hash=line.slice(0,64),path=line.slice(66);
      assert.ok(!old.includes(hash)&&!old.includes(path),"Previously published image reused");
    }
  }
});
test("Batch50C is build-gated, precached and preserves the pedicure release",()=>{
  const build=readFileSync("scripts/build-salon.mjs","utf8");
  const sw=readFileSync("scripts/finalize-service-worker.mjs","utf8");
  const visual=readFileSync("src/components/salon/nail-visual.tsx","utf8");
  for(const src of [build,sw,visual])assert.match(src,/VITE_MANICURE_BATCH50_C/);
  assert.match(build,/Batch50C SHA-256 or format mismatch/);
  assert.match(sw,/files\.push\(file\)/);
  assert.match(visual,/\.\.\.BATCH50_C_MANICURE_EDITORIAL_PHOTOS/);
  assert.match(visual,/\.\.\.PEDICURE_EDITORIAL_PHOTOS/);
  assert.match(build,/VITE_PEDICURE_78/);
});
