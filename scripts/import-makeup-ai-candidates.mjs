#!/usr/bin/env node
/** Import all manifest-listed review candidates from an EXTRACTED review kit.
 * The importer only copies checksum-matched AI candidates; it never approves publication.
 *
 * Usage: node scripts/import-makeup-ai-candidates.mjs /path/to/HBeauty_40_Review_20261023
 */
import { existsSync, mkdirSync, readFileSync, copyFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createHash } from "node:crypto";

const sourceRoot = process.argv[2] ? resolve(process.argv[2]) : "";
if (!sourceRoot || !existsSync(sourceRoot)) {
  console.error("Provide a directory containing public/makeup/ai-portraits from the 40-style review kit.");
  process.exit(1);
}
const project = process.cwd();
const data = JSON.parse(readFileSync(join(project,"src/data/makeup-ai-40.json"),"utf8"));
const targetDir=join(project,"public/makeup/ai-portraits");
const tasks=[];
for(const look of data.looks.filter(x=>x.candidate)) {
  const basename=`${look.id}-${look.slug}.webp`;
  const source=join(sourceRoot,"public","makeup","ai-portraits",basename);
  if(!existsSync(source))throw new Error(`Review kit missing: ${basename}`);
  const bytes=readFileSync(source);
  const hash=createHash("sha256").update(bytes).digest("hex");
  if(hash!==look.expectedSha256)throw new Error(`SHA mismatch: ${basename}. Do not rename or substitute a portrait.`);
  if(bytes.toString("ascii",0,4)!=="RIFF" || bytes.toString("ascii",8,12)!=="WEBP")
    throw new Error(`Not WebP: ${basename}`);
  tasks.push({source,target:join(targetDir,basename)});
}
if(tasks.length<22 || tasks.length>40)throw new Error(`Unexpected verified candidate count: ${tasks.length}`);
mkdirSync(targetDir,{recursive:true});
for(const t of tasks)copyFileSync(t.source,t.target);
console.log(`Imported ${tasks.length} SHA-verified review candidates. All remain unapproved; ${40-tasks.length} planned styles have no verified image.`);
