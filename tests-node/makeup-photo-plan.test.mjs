import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const manifest=JSON.parse(readFileSync(join(root,"src/data/makeup-photo-manifest.json"),"utf8"));

test("48 real makeup photographs have unique required IDs, file paths and Persian names",()=>{
  assert.equal(manifest.looks.length,48);
  assert.equal(new Set(manifest.looks.map(x=>x.id)).size,48);
  assert.equal(new Set(manifest.looks.map(x=>x.file)).size,48);
  for(const category of ["natural","soft","evening","bridal","eyes","lips"])
    assert.equal(manifest.looks.filter(x=>x.category===category).length,8);
  for(const look of manifest.looks) {
    assert.ok(look.nameFa.length>2);
    assert.equal(look.file,`/makeup/results/${look.id}.webp`);
  }
});

test("staging photo roster passes independent schema audit without pretending assets exist",()=>{
  const run=spawnSync(process.execPath,["scripts/verify-makeup-photos.mjs","--plan"],{cwd:root,encoding:"utf8"});
  assert.equal(run.status,0,`${run.stdout}\n${run.stderr}`);
  assert.match(run.stdout,/PLAN ONLY/);
});
