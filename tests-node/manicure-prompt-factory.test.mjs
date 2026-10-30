import test from "node:test";
import assert from "node:assert/strict";
import {GENERATOR_SETTINGS,makePrompt,renderFiles,buildRecords,validateQueue,loadQueue} from "../scripts/generate-manicure-prompts.mjs";
const queue=loadQueue(),rows=validateQueue(queue),pending=rows.filter(x=>x.qa_status!=="APPROVED");
test("exactly 150 unique pending prompts and 12 published exclusions",()=>{
  const records=buildRecords(queue);
  assert.equal(rows.length,162);
  assert.equal(rows.length-pending.length,12);
  assert.equal(records.length,150);
  assert.equal(new Set(records.map(x=>x.id)).size,150);
  assert.ok(!records.some(r=>r.id==="nail-rose-chrome"));
});
test("all 150 prompts are independently complete and exact-catalog scoped",()=>{
  for(const s of pending){
    const p=makePrompt(s);
    for(const marker of ["ONE standalone","FIVE","thumb","IVORY SILK","NO stone", "NO text","1:1","2K",s.id,s.en,s.base,s.accent])
      assert.ok(p.includes(marker),"Missing "+marker+" from "+s.id);
    assert.ok(p.includes("LENGTH:")&&p.includes("SHAPE:"),"Missing geometry: "+s.id);
    assert.ok(p.length>1800&&p.length<6500,"Unsafe prompt length: "+s.id);
  }
});
test("each motif family has a meaningful specific instruction",()=>{
  const a=makePrompt(pending.find(x=>x.motif==="velvet"));
  const b=makePrompt(pending.find(x=>x.motif==="double-french"));
  const c=makePrompt(pending.find(x=>x.motif==="watercolor"));
  assert.match(a,/opaque velvety MATTE/);
  assert.match(b,/two distinct hair-thin, parallel/);
  assert.match(c,/Soft translucent WATERCOLOR CLOUDS/);
  assert.ok(!a.includes("Render the characteristic motif"));
});
test("settings require explicit native square 2K, not text-only guess",()=>{
  assert.equal(GENERATOR_SETTINGS.model_parameters.aspect_ratio,"1:1");
  assert.equal(GENERATOR_SETTINGS.model_parameters.resolution,"2K");
  assert.ok(GENERATOR_SETTINGS.minimum_native_width>=1600);
});
test("all four generated docs fully cover the original 162-style cohort",()=>{
  const rendered=renderFiles(queue);
  assert.equal(rendered.length,4);
  assert.equal(rendered.filter(x=>x.content.includes("generator configuration")).length,4);
  for(const f of rendered) assert.ok(f.content.includes("~~~text"));
  assert.throws(()=>makePrompt(rows.find(x=>x.qa_status==="APPROVED")),/Already released/);
});
test("fail closed on stale approval or unsupported catalog shape",()=>{
  const bad=structuredClone(queue);
  bad.batches[0].styles.find(x=>x.qa_status!=="APPROVED").shape="stiletto";
  assert.throws(()=>validateQueue(bad),/Invalid catalog/);
  const bad2=structuredClone(queue);
  bad2.batches[0].styles.find(x=>x.qa_status!=="APPROVED").approved_by_qa=true;
  assert.throws(()=>validateQueue(bad2),/Unsupported pending/);
});
