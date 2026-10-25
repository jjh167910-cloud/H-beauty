import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

async function expansion() {
  const tsSource=readFileSync("src/data/nail-expansion.ts","utf8");
  const js=ts.transpileModule(tsSource,{
    compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022},
    fileName:"nail-expansion.ts",
    reportDiagnostics:true,
  });
  assert.equal(js.diagnostics?.filter(d=>d.category===ts.DiagnosticCategory.Error).length,0);
  const address="data:text/javascript;base64,"+Buffer.from(js.outputText).toString("base64");
  return import(address);
}

test("298 total nail designs: stable 34 plus 192 manicure and 72 pedicure expansions",async()=>{
  const exp=await expansion();
  assert.equal(exp.EXPANSION_MANICURE_STYLES.length,192);
  assert.equal(exp.EXPANSION_PEDICURE_STYLES.length,72);
  const original=readFileSync("src/data/nail-styles.ts","utf8");
  const originals=[...original.matchAll(/\bid:"((?:nail|pedi)-[^"]+)"/g)].map(x=>x[1]);
  assert.equal(originals.length,34);
  const all=[...originals,...exp.NAIL_EXPANSION.map(x=>x.id)];
  assert.equal(all.length,298);
  assert.equal(new Set(all).size,298,"No two saved design IDs can collide");
  assert.equal(new Set(exp.NAIL_EXPANSION.map(x=>x.en)).size,264,"English names must be unique");
  assert.equal(new Set(exp.NAIL_EXPANSION.map(x=>x.title)).size,264,"Persian names must be unique");
});

test("expanded collection has real finish/motif variety and valid category metadata",async()=>{
  const {NAIL_EXPANSION}=await expansion();
  const services=new Set(["gel-manicure","nail-art","classic-pedicure","gel-pedicure"]);
  const finish=new Set(NAIL_EXPANSION.map(x=>x.finish));
  const motifs=new Set(NAIL_EXPANSION.map(x=>x.motif));
  assert.equal(finish.size,12);
  assert.ok(motifs.size>=16);
  const hex=/^#[0-9a-fA-F]{6}$/;
  for(const style of NAIL_EXPANSION){
    assert.ok(hex.test(style.base)&&hex.test(style.accent),style.id);
    assert.ok(services.has(style.serviceId),style.id);
    assert.ok(style.title.length>6&&style.description.length>12,style.id);
    assert.ok(["nude","pink","red","dark","color"].includes(style.color),style.id);
    assert.ok(["almond","oval","coffin","square"].includes(style.shape),style.id);
    assert.ok(["short","medium","long"].includes(style.length),style.id);
    assert.ok(style.id.startsWith(style.kind==="pedicure"?"pedi-atlas-":"nail-atlas-"),style.id);
    if(style.kind==="pedicure")assert.equal(style.length,"short");
  }
});
