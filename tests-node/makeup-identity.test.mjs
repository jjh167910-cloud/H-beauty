import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT=join(dirname(fileURLToPath(import.meta.url)),"..");
const PHOTO=join(ROOT,"public/makeup/model-reference.webp");
const SOURCE_HASH="769e44737d161e77845a9fdb0c6475a75262f01384b369fd9dee3cc20c0cb786";

test("exact user-supplied reference image remains byte-identical",()=>{
  const photo=readFileSync(PHOTO);
  assert.equal(createHash("sha256").update(photo).digest("hex"),SOURCE_HASH);
  assert.equal(photo.toString("ascii",0,4),"RIFF");
  assert.equal(photo.toString("ascii",8,12),"WEBP");
});

test("draft concepts use reference; final images have unique local look filenames",()=>{
  const artwork=readFileSync(join(ROOT,"src/components/salon/makeup-artwork.tsx"),"utf8");
  assert.match(artwork,/MODEL_REFERENCE_SRC = "\/makeup\/model-reference.webp"/);
  assert.match(artwork,/VITE_MAKEUP_FINAL_IMAGES/);
  assert.match(artwork,/return MAKEUP_FINAL_IMAGES \? `\/makeup\/results\/\$\{look\.id\}\.webp` : MODEL_REFERENCE_SRC/);
  assert.match(artwork,/src=\{makeupPortraitSrc\(look\)\}/);
  assert.doesNotMatch(artwork,/https?:\/\//);
  const gallery=readFileSync(join(ROOT,"src/components/salon/screens/makeup.tsx"),"utf8");
  assert.match(gallery,/عکس تمام مدل‌ها متعلق به یک چهره مرجع ثابت است/);
});

test("final image release is blocked without 48 photos and records",()=>{
  const validator=readFileSync(join(ROOT,"scripts/verify-makeup-48.mjs"),"utf8");
  assert.match(validator,/CATEGORIES=.*natural/);
  assert.match(validator,/seenCaptures/);
  assert.match(validator,/identityApproved/);
  assert.match(validator,/publishApproved/);
  assert.match(validator,/NOT_PHOTOGRAPHED/);
});
