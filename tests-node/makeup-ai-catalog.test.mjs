import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root=process.cwd();
const d=JSON.parse(readFileSync(join(root,"src/data/makeup-ai-40.json"),"utf8"));
test("AI makeup catalog has forty unique Persian style records",()=>{
  assert.equal(d.looks.length,40);
  for(const field of ["id","slug","nameFa"])assert.equal(new Set(d.looks.map(x=>x[field])).size,40,field);
  assert.ok(d.looks.filter(x=>x.candidate).length>=22);
  assert.ok(d.looks.filter(x=>x.candidate).length<=40);
  assert.equal(d.looks.filter(x=>!x.candidate).length,40-d.looks.filter(x=>x.candidate).length);
  assert.equal(d.looks.filter(x=>x.editorialIssues.length>0).length,12);
  assert.equal(d.v36PriorityPairs.length,4);
  const byId=new Map(d.looks.map(x=>[x.id,x]));
  assert.ok(d.looks.every(x=>Array.isArray(x.reviewCompareWith)));
  for(const look of d.looks)for(const target of look.reviewCompareWith){
    assert.ok(byId.has(target),`Missing comparison target ${target}`);
    assert.ok(byId.get(target).reviewCompareWith.includes(look.id),`Asymmetric comparison ${look.id} and ${target}`);
  }

  assert.ok(d.looks.every(x=>Array.isArray(x.editorialIssues)));
  assert.equal(d.looks.filter(x=>x.publishApproved).length,0);
  assert.ok(d.looks.every(x=>x.identityApproved===false&&x.styleDistinctApproved===false));
  assert.ok(d.looks.every(x=>x.candidate?x.asset?.startsWith("/makeup/ai-portraits/"):x.asset===null));
});
test("review mode opt-in is separate from the normal catalog",()=>{
  const screen=readFileSync(join(root,"src/components/salon/screens/makeup.tsx"),"utf8");
  assert.match(screen,/VITE_HB_AI_REVIEW === "true"/);
  assert.match(screen,/MakeupAiReview/);
  const preview=readFileSync(join(root,"src/components/salon/makeup-ai-review.tsx"),"utf8");
  assert.match(preview,/VITE_HB_AI_CANDIDATES_PRESENT === "true"/);
  assert.match(preview,/!broken\[look.id\]/);
  assert.match(preview,/نامزد بازبینی/); // unapproved status is visible
});
test("release check demands private approvals; public images don't imply salon results",()=>{
  const gate=readFileSync(join(root,"scripts/verify-makeup-ai-40.mjs"),"utf8");
  assert.match(gate,/--release/);
  assert.match(gate,/HB_AI_APPROVALS_PATH/);
  assert.match(gate,/modelPublicationConsent/);
  assert.match(gate,/makeupDistinctApproved/);
  assert.match(gate,/editorialIssuesResolved/);
  assert.match(gate,/release && candidateCount!==40/);
  assert.ok(existsSync(join(root,"scripts/import-makeup-ai-candidates.mjs")));
});

test("external Canva and ElevenLabs renders are not falsely treated as approved files",()=>{
  const ids=["hb-makeup-23","hb-makeup-24","hb-makeup-25","hb-makeup-26"];
  const views=ids.map(id=>d.looks.find(x=>x.id===id));
  assert.ok(views.every(Boolean));
  assert.ok(views.every(x=>x.externalGeneration?.status==="completed-provider-not-imported"));
  assert.ok(views.every(x=>x.candidate===false&&x.asset===null&&x.publishApproved===false));
  assert.equal(new Set(views.map(x=>x.externalGeneration.mediaId??x.externalGeneration.generationId)).size,4);
});

test("review counters derive from data and provider-only portraits remain explicitly unapproved",()=>{
  const ui=readFileSync(join(root,"src/components/salon/makeup-ai-review.tsx"),"utf8");
  assert.match(ui,/const candidateCount = catalog\.looks\.filter/);
  assert.match(ui,/const pendingCount = catalog\.looks\.length - candidateCount/);
  assert.match(ui,/const providerOnlyCount = catalog\.looks\.filter/);
  assert.match(ui,/providerOnlyCount\.toLocaleString/);
  assert.match(ui,/تولیدشده در سرویس خارجی؛ فایل اصلی هنوز بررسی نشده/);
  assert.ok(!ui.includes("<strong>۲۲</strong>"));
});
