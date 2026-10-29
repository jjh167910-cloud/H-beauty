/**
 * H-Beauty: global editorial nail-photo integrity gate.
 * 
 * Unlike the individual release checks, this validates every published nail
 * photograph across all batches and tests their public bytes after deployment.
 * It proves technical fidelity, not semantic/anatomical photographic approval.
 *
 * node scripts/verify-all-nail-photos.mjs --manifest
 * node scripts/verify-all-nail-photos.mjs --local
 * node scripts/verify-all-nail-photos.mjs --live
 */
import {readFileSync, existsSync, readdirSync} from "node:fs";
import {createHash} from "node:crypto";
import {resolve, join} from "node:path";
import {webpDimensions, knownNailIds} from "./audit-nail-photo-candidates.mjs";

export const LOCKS = Object.freeze([
  {name:"hbeauty-nail-editorial-v4",count:9,kind:"manicure",legacy:true},
  {name:"hbeauty-manicure-midnight-glitter",count:1,kind:"manicure"},
  {name:"hbeauty-manicure-four-20261029",count:4,kind:"manicure"},
  {name:"hbeauty-manicure-batch7",count:7,kind:"manicure"},
  {name:"hbeauty-manicure-batch8",count:8,kind:"manicure"},
  {name:"hbeauty-manicure-batch50-a",count:10,kind:"manicure"},
  {name:"hbeauty-manicure-batch50b",count:9,kind:"manicure"},
  {name:"hbeauty-manicure-batch50c",count:8,kind:"manicure"},
  {name:"hbeauty-manicure-batch50d",count:2,kind:"manicure"},
  {name:"hbeauty-pedicure-78",count:78,kind:"pedicure"}
]);

/**
 * Discover future batch lockfiles automatically instead of requiring the
 * 58-photo coverage constant to be edited on every safe release.
 * Only strict batch-name patterns are accepted; archival rejection lists
 * and historical V1-V3 locks are never accidentally considered releases.
 */
export function releaseLocks(root="."){
  const known=new Set(LOCKS.map(x=>x.name));
  const names=readdirSync(resolve(root,"assets"))
    .filter(n=>/^hbeauty-manicure-batch(?:[0-9]+[a-z]?)(?:-[0-9]{8})?\.sha256$/.test(n))
    .map(n=>n.slice(0,-".sha256".length)).filter(n=>!known.has(n)).sort();
  return [...LOCKS,...names.map(name=>({
    name,kind:"manicure",count:readFileSync(resolve(root,"assets",name+".sha256"),"utf8").trim().split(/\r?\n/).length
  }))];
}

export function loadPhotoLocks(root="."){
  const names=new Set(), hashes=new Set(), result=[];
  const known=knownNailIds();
  for(const group of releaseLocks(root)){
    const filename=resolve(root,"assets",group.name+".sha256");
    if(!existsSync(filename))throw Error("Missing photo lock "+filename);
    const lines=readFileSync(filename,"utf8").trim().split(/\r?\n/);
    if(lines.length!==group.count)
      throw Error(group.name+" expected "+group.count+" assets, found "+lines.length);
    for(const line of lines){
      const match=line.match(/^([0-9a-f]{64})  (public\/nails\/photos\/(nail|pedi)-[a-z0-9-]+\.webp)$/);
      if(!match)throw Error("Malformed photo lock line in "+group.name);
      const hash=match[1],path=match[2],id=path.slice("public/nails/photos/".length,-5);
      if((group.kind==="pedicure")!==(match[3]==="pedi"))
        throw Error("Wrong photo category "+path);
      if(!known.has(id))throw Error("Photo is not mapped to a catalog design "+id);
      if(names.has(id)||hashes.has(hash))throw Error("Duplicate ID or identical image across batches "+path);
      names.add(id);hashes.add(hash);
      result.push({hash,path,id,group:group.name,legacy:Boolean(group.legacy),kind:group.kind});
    }
  }
  const manicure=result.filter(x=>x.kind==="manicure").length;
  const pedicure=result.filter(x=>x.kind==="pedicure").length;
  if(manicure<58||manicure>220||pedicure!==78||result.length!==manicure+pedicure)
    throw Error("Unexpected released nail photo coverage "+manicure+"/"+pedicure);
  return result;
}

export function verifyLocalPhotos(items,{dist="dist"}={}){
  const sw=readFileSync(resolve(dist,"sw.js"),"utf8");
  for(const item of items){
    const rel=item.path.slice("public/".length);
    const local=resolve(dist,rel);
    if(!existsSync(local))throw Error("Built release missing "+rel);
    const bytes=readFileSync(local);
    if(bytes.length<(item.legacy?7000:25000)||bytes.length>2_200_000)
      throw Error("Unexpected image size "+rel);
    if(bytes.toString("ascii",0,4)!=="RIFF"||bytes.toString("ascii",8,12)!=="WEBP")
      throw Error("Invalid WebP header "+rel);
    if(createHash("sha256").update(bytes).digest("hex")!==item.hash)
      throw Error("Built photo checksum mismatch "+rel);
    const {width,height}=webpDimensions(bytes);
    if(width<(item.legacy?600:800)||height<(item.legacy?600:800))
      throw Error("Image lacks native detail "+rel);
    if(!sw.includes(JSON.stringify("/"+rel)))
      throw Error("Photo not included in offline service-worker cache "+rel);
  }
  return {checked:items.length};
}

export async function verifyLivePhotos(items,{
  base=process.env.HBEAUTY_PUBLIC_URL||"https://h-beauty.mostifa2273.workers.dev",
  revision=process.env.GITHUB_SHA||"release",
  concurrency=8,
  attempts=3
}={}){
  const clean=base.replace(/\/$/,"");
  let next=0, failures=[],passed=0;
  const work=async()=>{
    while(next<items.length){
      const index=next++, item=items[index];
      const url=clean+"/"+item.path.slice("public/".length);
      let error;
      for(let attempt=1;attempt<=attempts;attempt++){
        try{
          const response=await fetch(url+"?verify="+encodeURIComponent(revision+"-"+attempt),{
            headers:{"Cache-Control":"no-cache"},
            signal:AbortSignal.timeout(30000)
          });
          if(!response.ok)throw Error("HTTP "+response.status);
          const bytes=Buffer.from(await response.arrayBuffer());
          if(bytes.length<7000 || bytes.toString("ascii",0,4)!=="RIFF" ||
             bytes.toString("ascii",8,12)!=="WEBP")
            throw Error("Not a delivered WebP");
          const got=createHash("sha256").update(bytes).digest("hex");
          if(got!==item.hash)throw Error("SHA-256 mismatch "+got);
          passed++;error=null;break;
        }catch(e){
          error=e;
          if(attempt<attempts)await new Promise(done=>setTimeout(done,2000));
        }
      }
      if(error)failures.push(item.id+": "+String(error));
    }
  };
  await Promise.all(Array.from({length:Math.min(concurrency,items.length)},work));
  if(failures.length)throw Error("Nail production photo acceptance failed "+failures.length+"/"+items.length+"\n"+failures.join("\n"));
  return {checked:passed};
}

if(process.argv[1] && process.argv[1].endsWith("verify-all-nail-photos.mjs")){
  const args=process.argv.slice(2);
  const mode=args.includes("--live")?"live":args.includes("--local")?"local":"manifest";
  const items=loadPhotoLocks();
  const counts={manicure:items.filter(x=>x.kind==="manicure").length,pedicure:items.filter(x=>x.kind==="pedicure").length};
  console.log("Validated "+items.length+" unique locked nail photo references",counts);
  if(mode==="local"){
    console.log("Verified local decoded images and offline precache",verifyLocalPhotos(items));
  }else if(mode==="live"){
    console.log("Verified public SHA-256 image bytes",await verifyLivePhotos(items));
  }
}
