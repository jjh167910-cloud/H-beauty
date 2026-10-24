#!/usr/bin/env node
/** Integrity gate for 40 exact user-provided AI makeup portraits.
 * This is NOT a visual likeness or consent certification.
 */
import {readFileSync,existsSync,readdirSync} from "node:fs";
import {createHash} from "node:crypto";
import {join,resolve} from "node:path";
const root=resolve(process.cwd()),dir=join(root,"public/makeup/curated-40");
const file=join(dir,"manifest.json");if(!existsSync(file))throw Error("Missing curated-40/manifest.json");
const data=JSON.parse(readFileSync(file,"utf8")),checks=[],seen=new Set(),names=new Set(),hashes=new Set();
if(data.lookCount!==40||data.looks?.length!==40)checks.push("Expected forty source looks");
const sha=b=>createHash("sha256").update(b).digest("hex");
for(let i=0;i<40;i++){
 const look=data.looks?.[i],id=`mk40-${String(i+1).padStart(2,"0")}`;
 if(!look){checks.push("Missing "+id);continue}
 if(look.id!==id)checks.push("Order mismatch "+id);
 if(names.has(look.name)||seen.has(look.id))checks.push("Duplicate label/id "+id);
 names.add(look.name);seen.add(look.id);
 if(!look.name||!look.category||!look.description||!look.serviceId)checks.push("Bad metadata "+id);
 if(look.publishApproved!==false||look.identityApproved!==false||look.styleDistinctApproved!==false)
  checks.push("Unapproved baseline required "+id);
 for(const sub of ["","sm"]){
  const image=join(dir,...(sub?[sub]:[]),id+".webp");
  if(!existsSync(image)){checks.push("Missing "+image);continue}
  const b=readFileSync(image);
  if(b.length<(sub?5000:30000)||b.toString("ascii",0,4)!=="RIFF"||b.toString("ascii",8,12)!=="WEBP")
   checks.push("Invalid WebP "+id+" "+sub);
  if(!sub){const hash=sha(b);if(hash!==look.sha256)checks.push("SHA mismatch "+id);if(hashes.has(hash))checks.push("Duplicate image "+id);hashes.add(hash)}
 }
}
if(process.argv.includes("--release")){
 const privatePath=process.env.MAKEUP_CURATED_APPROVALS_PATH??join(root,".makeup-curated-40-approvals.local.json");
 if(!existsSync(privatePath))checks.push("Missing private likeness and publication approvals");
 else{
  let approvals={};try{approvals=JSON.parse(readFileSync(privatePath,"utf8"))}catch{checks.push("Invalid approvals JSON")}
  for(const look of data.looks){
   const a=approvals.looks?.[look.id];
   if(a?.sha256!==look.sha256||a?.identityApproved!==true||a?.styleDistinctApproved!==true||a?.publishApproved!==true||a?.modelPublicationConsent!==true)
     checks.push("Unapproved publication "+look.id);
  }
 }
}
console.log("Curated 40: ",seen.size,"images, ",hashes.size,"unique encoded files, ",checks.length,"issues");
for(const issue of checks)console.error(issue);
if(checks.length)process.exit(1);
