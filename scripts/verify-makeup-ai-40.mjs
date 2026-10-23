#!/usr/bin/env node
/** Source-of-truth QA: metadata always; --candidates checks 22 imported files;
 * --release requires 40 physically distinct images and a PRIVATE reviewed approvals file.
 * Image hashing cannot verify whether makeup or facial identity are actually distinct.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { createHash } from "node:crypto";
const root=process.cwd(),data=JSON.parse(readFileSync(join(root,"src/data/makeup-ai-40.json"),"utf8"));
const strictCandidates=process.argv.includes("--candidates");
const release=process.argv.includes("--release");
const failures=[],byImageHash=new Map();
const ids=new Set(),slugs=new Set(),names=new Set();
if(data.looks.length!==40)failures.push(`Expected 40 records, received ${data.looks.length}`);
if(data.looks.filter(x=>x.candidate).length!==22)failures.push("Expected 22 staged candidate records");
let approvals={};
if(release){
  const approvalPath=process.env.HB_AI_APPROVALS_PATH || ".makeup-ai-approvals.local.json";
  if(!existsSync(approvalPath))failures.push("Missing private release approvals (HB_AI_APPROVALS_PATH)");
  else try{approvals=JSON.parse(readFileSync(resolve(approvalPath),"utf8"))}catch{failures.push("Malformed private approvals JSON")}
}
let files=0;
for(const look of data.looks){
  if(ids.has(look.id))failures.push("Duplicate id "+look.id);
  if(slugs.has(look.slug))failures.push("Duplicate slug "+look.slug);
  if(names.has(look.nameFa))failures.push("Duplicate Persian name "+look.nameFa);
  ids.add(look.id);slugs.add(look.slug);names.add(look.nameFa);
  if(look.identityApproved || look.styleDistinctApproved || look.publishApproved)
    failures.push("Baseline must never preapprove "+look.id);
  if(!look.description || !look.nameFa)failures.push("Incomplete description "+look.id);
  if(!Array.isArray(look.editorialIssues)) failures.push("Missing editorial issue register for "+look.id);
  const expectedName=`${look.id}-${look.slug}.webp`;
  const expectedPath=`/makeup/ai-portraits/${expectedName}`;
  if(look.candidate && look.asset!==expectedPath)failures.push("Misrouted asset "+look.id);
  if(!look.candidate && look.asset!==null)failures.push("Missing look points to an image "+look.id);
  const shouldCheck=release||(strictCandidates&&look.candidate);
  if(!shouldCheck)continue;
  const path=join(root,"public","makeup","ai-portraits",expectedName);
  if(!existsSync(path)){failures.push("Missing "+expectedName);continue}
  files++;
  const bytes=readFileSync(path);
  const hash=createHash("sha256").update(bytes).digest("hex");
  if(bytes.length<25000||bytes.toString("ascii",0,4)!=="RIFF"||bytes.toString("ascii",8,12)!=="WEBP")
    failures.push("Invalid / tiny WebP "+look.id);
  if(byImageHash.has(hash))failures.push("Repeated exact image "+look.id+" and "+byImageHash.get(hash));
  byImageHash.set(hash,look.id);
  if(look.candidate&&hash!==look.expectedSha256&&!release)failures.push("Changed candidate bytes "+look.id);
  if(release){
    const approval=approvals.looks?.[look.id];
    if(!approval||approval.assetSha256!==hash||approval.identityApproved!==true||
       approval.makeupDistinctApproved!==true||approval.publishApproved!==true||
       approval.modelPublicationConsent!==true||approval.provenance!=="ai-generated"||
       (look.editorialIssues?.length>0 && approval.editorialIssuesResolved!==true))
      failures.push("Private image/identity/style/consent review missing "+look.id);
  }
}
console.log(`AI makeup metadata: ${data.looks.length}/40 planned; ${files} images checked; ${failures.length} issues.`);
for(const f of failures)console.error("- "+f);
if(failures.length)process.exitCode=1;
else console.log(release?"Forty images and private approval records passed mechanical checks; visual reviews remain human responsibilities.":"Metadata / candidate file checks passed; no image is automatically approved.");
