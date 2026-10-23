import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT=join(dirname(fileURLToPath(import.meta.url)),"..");
const img=readFileSync(join(ROOT,"public/makeup/model-reference.webp"));

test("makeup model is the exact approved reference crop, not a generated replacement",()=>{
  const hash=createHash("sha256").update(img).digest("hex");
  assert.equal(hash,"769e44737d161e77845a9fdb0c6475a75262f01384b369fd9dee3cc20c0cb786");
  assert.equal(img.toString("ascii",0,4),"RIFF");
  assert.equal(img.toString("ascii",8,12),"WEBP");
});
