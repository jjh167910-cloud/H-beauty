/**
 * H-Beauty v32: fail-closed audit for 48 SEPARATELY PHOTOGRAPHED outcomes.
 * Does not attempt to "prove" that photos are genuine; it checks concrete
 * files/metadata and leaves identity & capture-provenance review to people.
 *
 * node scripts/verify-makeup-photos.mjs --plan    # staging schema (CI-safe)
 * node scripts/verify-makeup-photos.mjs --release # strict publication gate
 */
import { readFileSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const records=JSON.parse(readFileSync(join(ROOT,"src/data/makeup-photo-manifest.json"),"utf8"));
const categories=["natural","soft","evening","bridal","eyes","lips"];
const release=process.argv.includes("--release");
const plan=process.argv.includes("--plan");
if(!release&&!plan){console.error("Use --plan or --release; publication must explicitly opt into the strict gate");process.exit(2)}
const errors=[];
function requireCondition(ok,message){if(!ok)errors.push(message)}
const looks=records.looks;
requireCondition(records.schemaVersion===1,"Unexpected manifest schema version");
requireCondition(Array.isArray(looks)&&looks.length===48,"Exactly 48 photographed looks must be specified");
const ids=new Set(),files=new Set(),captured=new Set(),hashes=new Map();
for(const category of categories)requireCondition(looks.filter(x=>x.category===category).length===8,`Expected eight photographs in category ${category}`);
for(const item of looks){
 const {id,file}=item;
 requireCondition(/^mk-(natural|soft|evening|bridal|eyes|lips)-0[1-8]$/.test(id),`Invalid ID: ${id}`);
 requireCondition(!ids.has(id),`Duplicate look ID: ${id}`);ids.add(id);
 const expected=`/makeup/results/${id}.webp`;
 requireCondition(file===expected,`Unexpected image mapping for ${id}: ${file}`);
 requireCondition(!files.has(file),`Different looks must not point at the same file: ${file}`);files.add(file);
 requireCondition(Boolean(item.nameFa&&item.nameFa.trim()),`Missing Persian title: ${id}`);
 if(!release){requireCondition(item.approved!==true||Boolean(item.shotId&&item.originalCaptureFile),`Marked approved without capture provenance: ${id}`);continue}
 requireCondition(item.approved===true,`Photo not approved: ${id}`);
 requireCondition(item.identityApproved===true,`Model identity not approved: ${id}`);
 requireCondition(item.makeupApproved===true,`Makeup execution not approved: ${id}`);
 requireCondition(item.publicationConsentRecorded===true,`Photo publication authorization not recorded: ${id}`);
 requireCondition(typeof item.photographer==="string"&&item.photographer.trim().length>1,`Missing photographer: ${id}`);
 requireCondition(typeof item.capturedAt==="string"&&!Number.isNaN(Date.parse(item.capturedAt)),`Missing capture timestamp: ${id}`);
 requireCondition(typeof item.originalCaptureFile==="string"&&item.originalCaptureFile.trim(),`Missing original source file reference: ${id}`);
 requireCondition(typeof item.shotId==="string"&&item.shotId.trim(),`Missing individual camera shot ID: ${id}`);
 if(item.shotId){
   requireCondition(!captured.has(item.shotId),`Reused shot ID: ${item.shotId}`);
   captured.add(item.shotId);
 }
 const path=join(ROOT,"public",file.replace(/^\//,""));
 if(!existsSync(path)){errors.push(`Missing actual photographed file: ${file}`);continue}
 const buffer=readFileSync(path);
 requireCondition(statSync(path).size>=90_000,`Photo is too small for premium catalog: ${file}`);
 requireCondition(buffer.toString("ascii",0,4)==="RIFF"&&buffer.toString("ascii",8,12)==="WEBP",`Not WebP: ${file}`);
 const digest=createHash("sha256").update(buffer).digest("hex");
 if(hashes.has(digest))errors.push(`Byte-identical makeup photos at ${hashes.get(digest)} and ${file}`);
 hashes.set(digest,file);
 let dims=null;
 const chunk=buffer.toString("ascii",12,16);
 if(chunk==="VP8X"&&buffer.length>=30)dims=[buffer.readUIntLE(24,3)+1,buffer.readUIntLE(27,3)+1];
 else if(chunk==="VP8 "&&buffer.length>=30)dims=[buffer.readUInt16LE(26)&0x3fff,buffer.readUInt16LE(28)&0x3fff];
 else if(chunk==="VP8L"&&buffer.length>=25)dims=[1+(buffer[21]|((buffer[22]&0x3f)<<8)),1+((buffer[22]>>6)|(buffer[23]<<2)|((buffer[24]&0x0f)<<10))];
 requireCondition(Boolean(dims&&dims[0]>=900&&dims[1]>=1200),`Image needs portrait resolution >=900x1200: ${file} (${dims??"unknown"})`);
}
if(release)requireCondition(hashes.size===48,`Expected 48 separate photographed WebP assets, found ${hashes.size}`);
if(errors.length){
 console.error(`H-Beauty 48-photo ${release?"release":"plan"} audit FAILED (${errors.length} issues):`);
 errors.forEach((e,i)=>console.error(`  ${i+1}. ${e}`));
 process.exit(1);
}
console.log(`H-Beauty ${release?"release":"plan"} verified: ${looks.length} distinct named entries.`);
if(plan)console.log("PLAN ONLY: no photograph or release/identity/consent verification performed.");
else console.log("All 48 files and metadata checks passed; independent human provenance/identity review remains required.");
