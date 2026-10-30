#!/usr/bin/env node
/**
 * Install all 60 user-provided original manicure WebPs in a SEPARATE review-only
 * public namespace. This does NOT approve images or enable customer catalog
 * photographs. Every extracted source is independently SHA-locked to the
 * immutable NOT_APPROVED intake ledger.
 *
 * Source archives: user's original three 20-photo ZIP attachments, mirrored to
 * permanent Higgsfield media URLs on 2026-10-30 after explicit deploy request.
 *
 * Usage: node scripts/install-manicure-intake-review.mjs
 *        node scripts/install-manicure-intake-review.mjs --verify
 */
import { readFileSync, mkdirSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { createHash } from "node:crypto";
import { inflateRawSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { webpDimensions } from "./audit-nail-photo-candidates.mjs";

export const SOURCES=Object.freeze([
  {batch:"01-of-08",url:"https://d2ol7oe51mr4n9.cloudfront.net/user_3JeOUdb9NaNBnQHWcT0xYSQ6MdR/93c0eb87-6591-4f88-833b-ae9fe0a17e6e.zip"},
  {batch:"04-of-08",url:"https://d2ol7oe51mr4n9.cloudfront.net/user_3JeOUdb9NaNBnQHWcT0xYSQ6MdR/38848cce-e621-4cc0-aea2-b95bab1c3e9b.zip"},
  {batch:"05-of-08",url:"https://d2ol7oe51mr4n9.cloudfront.net/user_3JeOUdb9NaNBnQHWcT0xYSQ6MdR/b7cbe4dd-249b-45ec-af32-6992542171d7.zip"}
]);
const LEDGER="docs/MANICURE_UPLOADED_60_ORIGINAL_SHA256_NOT_APPROVED_20261030.csv";
const OUT="public/review/photos";
const SHA=/^[a-f0-9]{64}$/;
const NAME=/^nail-[a-z0-9-]+\.webp$/;
const hash=x=>createHash("sha256").update(x).digest("hex");
const u16=(b,p)=>b.readUInt16LE(p),u32=(b,p)=>b.readUInt32LE(p);
const strict=(c,m)=>{if(!c)throw Error("Review-only asset import denied: "+m)};

export function records(root="."){
  const lines=readFileSync(resolve(root,LEDGER),"utf8").trimEnd().split(/\r?\n/);
  strict(lines.shift()==="catalog_id,sha256,visual_disposition,expected_shape,expected_length,expected_finish,native_generation_provenance,editorial_approval,release_permission","unknown intake ledger schema");
  const rows=lines.map((line,i)=>{
    const p=line.split(",");
    strict(p.length===9,"invalid ledger row "+i);
    const [id,sha,status,shape,length,finish,provenance,approval,permission]=p;
    strict(NAME.test(id+".webp")&&SHA.test(sha),"invalid original catalog ID or sha");
    strict(["VISUAL_CANDIDATE_NOT_APPROVED","HOLD_EXACT_STYLE_REVIEW","REJECT_REGENERATE"].includes(status),"unknown visual disposition "+id);
    strict(provenance==="UNVERIFIED"&&approval==="NOT_GRANTED"&&permission==="DENIED","image approval MUST remain denied "+id);
    return {id,sha,status,shape,length,finish};
  });
  strict(rows.length===60,"requires exactly 60 original files");
  strict(new Set(rows.map(x=>x.id)).size===60&&new Set(rows.map(x=>x.sha)).size===60,"duplicates in release-denied manifest");
  strict(rows.filter(x=>x.status==="VISUAL_CANDIDATE_NOT_APPROVED").length===28,"candidate count changed");
  strict(rows.filter(x=>x.status==="HOLD_EXACT_STYLE_REVIEW").length===16,"hold count changed");
  strict(rows.filter(x=>x.status==="REJECT_REGENERATE").length===16,"reject count changed");
  return rows;
}

/** Strict central-directory parser. File name and SHA are individually checked. */
export function extractZip(buf){
  strict(Buffer.isBuffer(buf)&&buf.length>22&&buf.length<20_000_000,"invalid source ZIP size");
  let end=-1;
  for(let p=buf.length-22;p>=Math.max(0,buf.length-65557);p--){
    if(u32(buf,p)===0x06054b50){end=p;break;}
  }
  strict(end>=0,"missing ZIP central directory");
  const count=u16(buf,end+10),size=u32(buf,end+12),start=u32(buf,end+16);
  strict(count===20&&start+size<=buf.length&&start>=0,"unexpected ZIP archive inventory");
  let pos=start;
  const out=new Map();
  for(let i=0;i<count;i++){
    strict(pos+46<=buf.length&&u32(buf,pos)===0x02014b50,"invalid central directory record");
    const method=u16(buf,pos+10),csize=u32(buf,pos+20),usize=u32(buf,pos+24);
    const nlen=u16(buf,pos+28),elen=u16(buf,pos+30),clen=u16(buf,pos+32),local=u32(buf,pos+42);
    strict(nlen>0&&nlen<150&&pos+46+nlen+elen+clen<=buf.length,"bad ZIP filename region");
    const name=buf.subarray(pos+46,pos+46+nlen).toString("utf8");
    pos+=46+nlen+elen+clen;
    strict(NAME.test(name)&&!out.has(name),"unexpected ZIP entry "+name);
    strict(method===8||method===0,"unsupported ZIP compression method");
    strict(csize<1_000_000&&usize>=25_000&&usize<1_000_000,"unsafe ZIP image length "+name);
    strict(local+30<=buf.length&&u32(buf,local)===0x04034b50,"missing ZIP local header");
    const offset=local+30+u16(buf,local+26)+u16(buf,local+28);
    strict(offset+csize<=buf.length,"truncated compressed image "+name);
    const compressed=buf.subarray(offset,offset+csize);
    const bytes=method===8?inflateRawSync(compressed,{maxOutputLength:1_000_000}):compressed;
    strict(bytes.length===usize,"ZIP uncompressed size mismatch "+name);
    out.set(name,bytes);
  }
  strict(pos===start+size&&out.size===20,"ZIP central directory mismatch");
  return out;
}

export async function install({root=".",verify=false,fetcher=fetch}={}){
  const expected=records(root),byId=new Map(expected.map(x=>[x.id,x]));
  const all=new Map();
  if(verify){
    const folder=resolve(root,OUT);
    strict(existsSync(folder),"review-only originals directory missing");
    for(const x of expected){
      const name=x.id+".webp",bytes=readFileSync(join(folder,name));
      strict(hash(bytes)===x.sha,"review asset changed "+x.id);
      const d=webpDimensions(bytes);
      strict(d.width===1600&&d.height===1600,"wrong review photo dimensions "+x.id);
      all.set(name,bytes);
    }
  }else{
    for(const source of SOURCES){
      let response;
      for(let attempt=1;attempt<=3;attempt++){
        try{
          response=await fetcher(source.url,{signal:AbortSignal.timeout(70_000)});
          strict(response.ok,"archive "+source.batch+" HTTP "+response.status);
          break;
        }catch(e){
          if(attempt===3)throw Error("Cannot retrieve original user archive "+source.batch+": "+String(e.message||e));
          await new Promise(ok=>setTimeout(ok,attempt*2000));
        }
      }
      const buf=Buffer.from(await response.arrayBuffer());
      const extracted=extractZip(buf);
      strict(extracted.size===20,"wrong count in batch "+source.batch);
      for(const [name,bytes] of extracted){
        const id=name.slice(0,-5),row=byId.get(id);
        strict(row&&!all.has(name),"duplicate/unrecognized uploaded style "+name);
        strict(hash(bytes)===row.sha,"source SHA-256 differs from approved-ledger intake "+name);
        const d=webpDimensions(bytes);
        strict(d.width===1600&&d.height===1600,"source does not decode at 1600px "+name);
        all.set(name,bytes);
      }
    }
    strict(all.size===60,"all 60 original assets are required, no partial publish");
    const dir=resolve(root,OUT);
    mkdirSync(dir,{recursive:true});
    for(const [name,bytes] of all)writeFileSync(join(dir,name),bytes);
  }
  const dir=resolve(root,OUT);
  const found=readdirSync(dir).filter(f=>f.endsWith(".webp")).sort();
  strict(found.length===60&&found.every(x=>all.has(x)),"unexpected or missing review-only images");
  const sum=[...all.values()].reduce((a,b)=>a+b.length,0);
  console.log("Review-only manicure archive installed, SHA verified:",{files:all.size,bytes:sum,approved:0,rejected:16,customerGalleryChanges:0});
  return {files:all.size,bytes:sum};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  await install({verify:process.argv.includes("--verify")});
}