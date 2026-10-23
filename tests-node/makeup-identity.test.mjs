import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT=join(dirname(fileURLToPath(import.meta.url)),"..");
const PHOTO=join(ROOT,"public/makeup/model-reference.webp");
const SOURCE_HASH="769e44737d161e77845a9fdb0c6475a75262f01384b369fd9dee3cc20c0cb786";

test("exact user-supplied model reference is not altered or replaced",()=>{
  const photo=readFileSync(PHOTO);
  assert.equal(createHash("sha256").update(photo).digest("hex"),SOURCE_HASH,
    "Reference face changed: compare against original user photo and obtain approval before updating the locked fingerprint");
  assert.equal(photo.toString("ascii",0,4),"RIFF");
  assert.equal(photo.toString("ascii",8,12),"WEBP");
});

test("all makeup concepts use one immutable local photo, not generated identities",()=>{
  const artwork=readFileSync(join(ROOT,"src/components/salon/makeup-artwork.tsx"),"utf8");
  assert.match(artwork,/MODEL_REFERENCE_SRC = "\/makeup\/model-reference.webp"/);
  assert.match(artwork,/<img\s+[\s\S]*?src=\{MODEL_REFERENCE_SRC\}/);
  assert.doesNotMatch(artwork,/https?:\/\//);
  const gallery=readFileSync(join(ROOT,"src/components/salon/screens/makeup.tsx"),"utf8");
  assert.match(gallery,/عکس تمام مدل‌ها متعلق به یک چهره مرجع ثابت است/);
});
