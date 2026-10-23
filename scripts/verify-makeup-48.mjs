#!/usr/bin/env node
/** Release gate for all 48 separate makeup portraits; never creates approvals. */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, join } from "node:path";

const ROOT=resolve(process.cwd(),"public","makeup");
const DIR=join(ROOT,"results");
const CATEGORIES=["natural","soft","evening","bridal","eyes","lips"];
const IDS=CATEGORIES.flatMap(cat=>Array.from({length:8},(_,n)=>`mk-${cat}-${String(n+1).padStart(2,"0")}`));
const SHA=bytes=>createHash("sha256").update(bytes).digest("hex");
const problems=[], seen=new Map(), seenCaptures=new Map();
const refPath=join(ROOT,"model-reference.webp");
const refSHA=existsSync(refPath)?SHA(readFileSync(refPath)):null;
// Approval records may contain sensitive consent details: keep them OUTSIDE public/ and Git.
const manifestPath=process.env.MAKEUP_APPROVALS_PATH ? resolve(process.env.MAKEUP_APPROVALS_PATH) : resolve(process.cwd(),".makeup-approvals.local.json");
let approved={};
if(existsSync(manifestPath)) {
  try { approved=JSON.parse(readFileSync(manifestPath,"utf8")); }
  catch { problems.push("Invalid private makeup approvals JSON"); }
} else problems.push("Missing private .makeup-approvals.local.json (or MAKEUP_APPROVALS_PATH) with identity, provenance and consent records");
let count=0;
for(const id of IDS) {
  const filename=`${id}.webp`,path=join(DIR,filename);
  if(!existsSync(path)){problems.push(`MISSING ${filename}`);continue;}
  count++;
  const b=readFileSync(path), hash=SHA(b);
  if(refSHA===hash)problems.push(`UNCHANGED_REFERENCE ${id}`);
  if(seen.has(hash))problems.push(`DUPLICATE ${id} identical to ${seen.get(hash)}`);
  seen.set(hash,id);
  if(b.toString("ascii",0,4)!=="RIFF"||b.toString("ascii",8,12)!=="WEBP")problems.push(`NOT_WEBP ${id}`);
  if(b.length<25000)problems.push(`TINY_FILE ${id}`);
  if(b.length>=30&&b.toString("ascii",12,16)==="VP8X"){
    const width=1+b.readUIntLE(24,3),height=1+b.readUIntLE(27,3);
    if(width<900||height<1200)problems.push(`LOW_RESOLUTION ${id}: ${width}x${height}`);
  }
  const a=approved?.looks?.[id];
  if(!a||a.assetSha256!==hash||a.identityApproved!==true||a.publishApproved!==true)
    problems.push(`NEEDS_REVIEW ${id}: SHA-matched identity and publication approval required`);
  if(a?.provenance!=="photograph" || a?.makeupApplied!==true)
    problems.push(`NOT_PHOTOGRAPHED ${id}: requires a genuine photo of makeup applied to the same model`);
  if(typeof a?.captureId!=="string" || !a.captureId.trim()) problems.push(`CAPTURE_ID_MISSING ${id}`);
  else if(seenCaptures.has(a.captureId)) problems.push(`REUSED_CAPTURE ${id} shares captureId with ${seenCaptures.get(a.captureId)}`);
  else seenCaptures.set(a.captureId,id);
}
const files=existsSync(DIR)?readdirSync(DIR).filter(x=>x.endsWith(".webp")):[];
for(const f of files)if(!IDS.some(id=>f===`${id}.webp`))problems.push(`UNEXPECTED ${f}`);
console.log(`Makeup portrait gate: ${count}/48 assets, ${problems.length} issues.`);
problems.forEach(p=>console.error("- "+p));
if(problems.length)process.exitCode=1;
else console.log("All 48 individually reviewed assets available. Visual review still required.");
