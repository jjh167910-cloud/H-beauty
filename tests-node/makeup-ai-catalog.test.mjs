import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root=process.cwd();
const d=JSON.parse(readFileSync(join(root,"src/data/makeup-ai-40.json"),"utf8"));
test("AI makeup catalog has forty unique Persian style records",()=>{
  assert.equal(d.looks.length,40);
  for(const field of ["id","slug","nameFa"])assert.equal(new Set(d.looks.map(x=>x[field])).size,40,field);
  assert.equal(d.looks.filter(x=>x.candidate).length,22);
  assert.equal(d.looks.filter(x=>!x.candidate).length,18);
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
  assert.ok(existsSync(join(root,"scripts/import-makeup-ai-candidates.mjs")));
});
