/** Post-Vite build: package the offline React shell but NOT the hairstyle collection.
 * Run: node scripts/finalize-service-worker.mjs [--dist /path/to/dist]. */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

const CACHE_TOKEN = "const CACHE='h-beauty-v5-unbuilt';";
const ASSET_TOKEN = 'const BUILD_ASSETS=[]; /* __H_BEAUTY_PRECACHE__ */';
const ALLOWED = /\.(?:js|css|woff2?|ttf|otf|svg|png|jpe?g|webp|avif)$/i;
const LIMIT = process.env.VITE_PEDICURE_78 === 'true' ? 100 * 1024 * 1024 : 35 * 1024 * 1024;

export function finalizeServiceWorker(distDir = 'dist') {
  const root=resolve(distDir);
  const html=join(root,'index.html');
  const worker=join(root,'sw.js');
  if (!existsSync(html) || !existsSync(worker))
    throw new Error(`Vite build missing index.html or sw.js in ${root}`);
  const files=[];
  function scan(dir) {
    if (!existsSync(dir)) throw new Error(`Missing built assets directory: ${dir}`);
    for(const item of readdirSync(dir,{withFileTypes:true})) {
      const full=join(dir,item.name);
      if(item.isDirectory()) scan(full);
      else if(item.isFile() && ALLOWED.test(item.name)) files.push(full);
    }
  }
  scan(join(root,'assets'));
  // Only the selected 80-photo edition adds portrait masters + thumbnails to
  // the offline PWA. Missing files fail the build instead of showing broken cards.
  if (process.env.VITE_MAKEUP_CURATED_80 === "true") {
    for (const [collection,start,end] of [["curated-40",1,40],["curated-80",43,82]]) {
      for(let number=start; number<=end; number++){
        const id=collection==="curated-40"
          ? `mk40-${String(number).padStart(2,"0")}` : `mk80-${number}`;
        for(const sub of ["","sm"]){
          const image=join(root,"makeup",collection,...(sub?[sub]:[]),id+".webp");
          if(!existsSync(image))throw new Error(`Missing curated makeup portrait ${image}`);
          files.push(image);
        }
      }
    }
  }
  // 34-asset photo edition, V3 corrected or legacy V2. No image can be
  // packaged unverified; the V3 release additionally forbids exact duplicates.
  if (process.env.VITE_NAIL_EDITORIAL_V2 === 'true') {
    const photoVersion=["2","3","4"].includes(process.env.NAIL_EDITORIAL_LOCK_VERSION)
      ? Number(process.env.NAIL_EDITORIAL_LOCK_VERSION) : 2;
    const lock=resolve(`assets/hbeauty-nail-editorial-v${photoVersion}.sha256`);
    if (!existsSync(lock)) throw new Error('Nail photo checksum lock missing');
    const entries=readFileSync(lock,'utf8').trim().split(/\r?\n/).map(line=>{
      const match=line.match(/^([a-f\d]{64})\s+(public\/nails\/photos\/[^\s]+\.webp)$/i);
      if (!match) throw new Error('Invalid V2 nail image lock entry: '+line);
      return {hash:match[1],path:match[2]};
    });
    const required=photoVersion===4?9:34;
    if(entries.length!==required || new Set(entries.map(entry=>entry.path)).size!==required)
      throw new Error(`Nail pack must contain ${required} unique image paths`);
    if(photoVersion>=3 && new Set(entries.map(entry=>entry.hash)).size!==required)
      throw new Error('Nail premium photo pack contains byte-identical duplicates');
    for(const entry of entries){
      const image=join(root,entry.path.slice('public/'.length));
      if(!existsSync(image))throw new Error('Missing V2 nail photo '+entry.path);
      const bytes=readFileSync(image);
      if(bytes.length<7_000||bytes.length>500_000)
        throw new Error('Invalid nail photo size '+entry.path);
      if(bytes.subarray(0,4).toString()!=='RIFF'||bytes.subarray(8,12).toString()!=='WEBP')
        throw new Error('Invalid nail WebP '+entry.path);
      if(createHash('sha256').update(bytes).digest('hex')!==entry.hash)
        throw new Error('Nail photo checksum mismatch '+entry.path);
      files.push(image);
    }
  } else {
    // Backward-compatible four-photo edition (if installed).
    const nailIds=['nail-milky-silk','nail-classic-french','nail-ruby-red','nail-pearl-chrome'];
    const nailPaths=nailIds.map(id=>join(root,'nails','photos',id+'.webp'));
    const installedNails=nailPaths.filter(existsSync);
    if(installedNails.length && installedNails.length!==nailIds.length)
      throw new Error('Nail photo pack incomplete: install all four matching WebP files before publishing');
    if(installedNails.length===nailIds.length){
      const lock=resolve('assets/hbeauty-nail-editorial-v1.sha256');
      if(!existsSync(lock))throw new Error('Nail photo pack SHA256 lock missing');
      const expected=new Map(readFileSync(lock,'utf8').trim().split(/\r?\n/).map(line=>{
        const matched=line.match(/^([a-f\d]{64})\s+(.+)$/i);
        if(!matched)throw new Error('Invalid nail photo SHA256 lock entry');
        return [matched[2],matched[1]];
      }));
      for(const image of nailPaths){
        const relativePath='public/nails/photos/'+image.split(sep).at(-1);
        const bytes=readFileSync(image);
        if(bytes.length<10_000||bytes.length>500_000)throw new Error('Invalid nail photo size');
        if(createHash('sha256').update(bytes).digest('hex')!==expected.get(relativePath))
          throw new Error('Nail photo checksum mismatch: '+relativePath);
        files.push(image);
      }
    }
  }
  // New manicure photograph: SHA-locked separately from existing 9-photo V4 pack.
  // Always precache this image when enabled so the gallery works fully offline.
  if (process.env.VITE_MANICURE_MIDNIGHT_GLITTER === 'true') {
    const expected='3ab3970a802027953b13ae56f8272c2cf992a93580c46737b9722d1f6dfac530  public/nails/photos/nail-midnight-glitter.webp';
    const lock=readFileSync(resolve('assets/hbeauty-manicure-midnight-glitter.sha256'),'utf8').trim();
    const file=join(root,'nails','photos','nail-midnight-glitter.webp');
    if(lock!==expected || !existsSync(file))
      throw Error('Midnight-glitter photo missing or release lock invalid');
    const bytes=readFileSync(file);
    if(bytes.length<25000 || bytes.length>2200000 ||
        bytes.toString('ascii',0,4)!=='RIFF' ||
        bytes.toString('ascii',8,12)!=='WEBP' ||
        createHash('sha256').update(bytes).digest('hex')!=='3ab3970a802027953b13ae56f8272c2cf992a93580c46737b9722d1f6dfac530')
      throw Error('Midnight-glitter photo bytes do not match approved SHA256');
    files.push(file);
  }
  // Four separately approved manicure photos are versioned in the offline shell.
  if(process.env.VITE_MANICURE_FOUR==="true"){
    const entries=readFileSync(resolve("assets/hbeauty-manicure-four-20261029.sha256"),"utf8").trim().split(/\r?\n/);
    const ids=new Set(),hashes=new Set();
    if(entries.length!==4)throw Error("Four-photo manicure offline lock incomplete");
    for(const line of entries){
      const match=line.match(/^([a-f0-9]{64})  (public\/nails\/photos\/nail-[a-z0-9-]+\.webp)$/);
      if(!match||ids.has(match[2])||hashes.has(match[1]))throw Error("Invalid four-photo manicure offline lock");
      ids.add(match[2]);hashes.add(match[1]);
      const file=join(root,match[2].slice("public/".length));
      if(!existsSync(file))throw Error("Missing four-photo manicure asset "+match[2]);
      const bytes=readFileSync(file);
      if(bytes.length<25_000||bytes.length>2_200_000||bytes.toString("ascii",0,4)!=="RIFF"||
        bytes.toString("ascii",8,12)!=="WEBP"||
        createHash("sha256").update(bytes).digest("hex")!==match[1])
        throw Error("Corrupt four-photo manicure asset "+match[2]);
      files.push(file);
    }
  }

  // Batch7 manicure release: SHA-256 locked seven image offline precache.
  if(process.env.VITE_MANICURE_BATCH7==="true"){
    const lockPath=resolve("assets/hbeauty-manicure-batch7.sha256");
    if(!existsSync(lockPath))throw Error("Offline batch7 manicure manifest missing");
    const lines=readFileSync(lockPath,"utf8").trim().split(/\r?\n/);
    if(lines.length!==7)throw Error("Incomplete offline manicure batch7 manifest");
    const ids=new Set(),hashes=new Set();
    for(const line of lines){
      const match=line.match(/^([a-f0-9]{64})  (public\/nails\/photos\/nail-[a-z0-9-]+\.webp)$/);
      if(!match||ids.has(match[2])||hashes.has(match[1]))
        throw Error("Invalid or duplicated manicure batch7 offline photo");
      ids.add(match[2]);hashes.add(match[1]);
      const file=join(root,match[2].slice("public/".length));
      if(!existsSync(file))throw Error("Missing offline batch7 photo "+match[2]);
      const bytes=readFileSync(file);
      if(bytes.length<25_000||bytes.length>2_200_000||
        bytes.toString("ascii",0,4)!=="RIFF"||bytes.toString("ascii",8,12)!=="WEBP"||
        createHash("sha256").update(bytes).digest("hex")!==match[1])
        throw Error("Checksum failure for offline manicure batch7 photo "+match[2]);
      files.push(file);
    }
  }
  // Batch 8 follows the same fail-closed, byte-exact rule as prior batches.
  if (process.env.VITE_MANICURE_BATCH8 === "true") {
    const required=new Set(["nail-atlas-geometry-champagne","nail-atlas-botanical-pearl","nail-gold-french","nail-champagne","nail-rose-glitter","nail-modern-lines","nail-atlas-velvet-ruby","nail-atlas-velvet-champagne"]);
    const lines=readFileSync(resolve("assets/hbeauty-manicure-batch8.sha256"),"utf8").trim().split(/\r?\n/);
    if(lines.length!==required.size)throw Error("Manicure batch8 precache must list eight files");
    const seen=new Set(),hashes=new Set();
    for(const line of lines){
      const m=line.match(/^([a-f0-9]{64})  (public\/nails\/photos\/nail-[a-z0-9-]+\.webp)$/);
      if(!m)throw Error("Invalid batch8 precache manifest");
      const id=m[2].slice("public/nails/photos/".length,-".webp".length);
      if(!required.has(id)||seen.has(id)||hashes.has(m[1]))throw Error("Unknown/duplicate batch8 precache asset");
      seen.add(id);hashes.add(m[1]);
      const file=join(root,m[2].slice("public/".length));
      if(!existsSync(file))throw Error("Missing batch8 offline photo "+id);
      const bytes=readFileSync(file);
      if(bytes.length<25_000||bytes.length>2_200_000||
        bytes.toString("ascii",0,4)!=="RIFF"||bytes.toString("ascii",8,12)!=="WEBP"||
        createHash("sha256").update(bytes).digest("hex")!==m[1])
        throw Error("Batch8 offline photo mismatch "+id);
      files.push(file);
    }
    if(seen.size!==required.size)throw Error("Incomplete batch8 offline precache");
  }
  // Source-verified 50-candidate Batch A: only ten images passed exact-style QA.
  // All ten originals enter the offline cache atomically.
  if(process.env.VITE_MANICURE_BATCH50_A==="true") {
    const lines=readFileSync(resolve("assets/hbeauty-manicure-batch50-a.sha256"),"utf8").trim().split(/\r?\n/);
    const selected=new Set(["nail-atlas-gradient-merlot","nail-atlas-prism-blush","nail-atlas-prism-champagne","nail-atlas-prism-coral","nail-atlas-prism-midnight","nail-atlas-prism-pearl","nail-atlas-prism-sage","nail-atlas-velvet-blush","nail-atlas-velvet-coral","nail-atlas-velvet-midnight"]);
    const ids=new Set(),hashes=new Set();
    if(lines.length!==10)throw Error("Batch50-A wrong image count");
    for(const line of lines){
      const m=line.match(/^([a-f0-9]{64})  (public\/nails\/photos\/nail-[a-z0-9-]+\.webp)$/);
      if(!m)throw Error("Malformed Batch50-A manifest");
      const id=m[2].slice("public/nails/photos/".length,-".webp".length);
      if(!selected.has(id)||ids.has(id)||hashes.has(m[1]))throw Error("Duplicate or unknown Batch50-A image");
      ids.add(id);hashes.add(m[1]);
      const file=join(root,m[2].slice("public/".length));
      if(!existsSync(file))throw Error("Batch50-A image not published "+id);
      const bytes=readFileSync(file);
      if(bytes.length<25_000||bytes.length>2_200_000||bytes.toString("ascii",0,4)!=="RIFF"||
        bytes.toString("ascii",8,12)!=="WEBP"||createHash("sha256").update(bytes).digest("hex")!==m[1])
        throw Error("Batch50-A cache asset integrity failure "+id);
      files.push(file);
    }
    if(ids.size!==10)throw Error("Incomplete Batch50-A offline photo collection");
  }
  // Nine new standalone manicure photographs, precached only after SHA-256 validation.
  if(process.env.VITE_MANICURE_BATCH50_B==="true") {
    const lines=readFileSync(resolve("assets/hbeauty-manicure-batch50b.sha256"),"utf8").trim().split(/\r?\n/);
    const selected=new Set(["nail-atlas-modern-french-espresso","nail-atlas-foil-cobalt","nail-atlas-modern-french-merlot","nail-atlas-modern-french-sage","nail-atlas-modern-french-lavender","nail-rose-french","nail-atlas-magnetic-midnight","nail-atlas-magnetic-coral","nail-atlas-magnetic-pearl"]);
    if(lines.length!==9)throw Error("Batch50B must contain exactly nine photos");
    const names=new Set(),hashes=new Set();
    for(const line of lines) {
      const m=line.match(/^([a-f0-9]{64})  (public\/nails\/photos\/nail-[a-z0-9-]+\.webp)$/);
      if(!m)throw Error("Malformed Batch50B photo lock");
      const id=m[2].slice("public/nails/photos/".length,-".webp".length);
      if(!selected.has(id)||names.has(id)||hashes.has(m[1]))throw Error("Duplicate or unknown Batch50B photo");
      names.add(id);hashes.add(m[1]);
      const file=join(root,m[2].slice("public/".length));
      if(!existsSync(file))throw Error("Batch50B image missing from build "+id);
      const b=readFileSync(file);
      if(b.length<25_000||b.length>2_200_000||b.toString("ascii",0,4)!=="RIFF"||
        b.toString("ascii",8,12)!=="WEBP"||createHash("sha256").update(b).digest("hex")!==m[1])
        throw Error("Batch50B photo failed offline integrity gate "+id);
      files.push(file);
    }
    if(names.size!==9)throw Error("Incomplete Batch50B offline photo collection");
  }
  // Offline-first pedicure edition: validate 78 immutable image bytes before
  // adding them to the service-worker cache. Partial releases cannot publish.
  if (process.env.VITE_PEDICURE_78 === 'true') {
    const lock = readFileSync(resolve('assets/hbeauty-pedicure-78.sha256'),'utf8').trim().split(/\r?\n/);
    const seen = new Set(), hashes = new Set();
    if(lock.length !== 78)throw Error('Pedicure release must contain exactly 78 images');
    for(const line of lock) {
      const m=line.match(/^([a-f0-9]{64})\s+(public\/nails\/photos\/pedi-[a-z0-9-]+\.webp)$/);
      if(!m || seen.has(m[2]) || hashes.has(m[1]))throw Error('Invalid or duplicate pedicure lock entry');
      seen.add(m[2]); hashes.add(m[1]);
      const path=join(root,m[2].slice('public/'.length));
      if(!existsSync(path))throw Error('Missing pedicure photo '+m[2]);
      const bytes=readFileSync(path);
      if(bytes.length<25000 || bytes.length>2200000 || bytes.toString('ascii',0,4)!=='RIFF'
        ||bytes.toString('ascii',8,12)!=='WEBP'
        ||createHash('sha256').update(bytes).digest('hex')!==m[1])
        throw Error('Pedicure photo SHA256/content mismatch: '+m[2]);
      files.push(path);
    }
  }
    // Opt-in soundtrack: the exact audio bytes enter the offline PWA cache.
  // Missing or modified files must block an enabled music release.
  if (process.env.VITE_SALON_MUSIC === "true") {
    const audio=join(root,'audio','hananeh-salon-ambience.mp3');
    const lock=resolve('assets/hananeh-salon-ambience.sha256');
    if (!existsSync(audio) || !existsSync(lock)) throw new Error('Salon music enabled but MP3 or SHA256 lock is missing');
    const bytes=readFileSync(audio);
    if (bytes.length<100000 || bytes.length>8*1024*1024) throw new Error('Salon music MP3 size outside expected limits');
    const expected=readFileSync(lock,'utf8').trim().split(/\s+/)[0];
    if (createHash('sha256').update(bytes).digest('hex')!==expected)
      throw new Error('Salon music checksum mismatch; publication blocked');
    files.push(audio);
  }
  files.sort();
  if (!files.some(file => file.endsWith('.js')) || !files.some(file => file.endsWith('.css')))
    throw new Error('Built app must contain JavaScript and CSS in dist/assets');
  const total=files.reduce((sum,file)=>sum+statSync(file).size,0);
  if (total>LIMIT) throw new Error(`Offline app shell ${(total/1048576).toFixed(1)} MiB exceeds 35 MiB budget`);
  const urls=files.map(file=>'/'+relative(root,file).split(sep).join('/'));
  const hash=createHash('sha256').update(readFileSync(html));
  for(let i=0;i<files.length;i++) hash.update(urls[i]).update(readFileSync(files[i]));
  const version=`h-beauty-v5-${hash.digest('hex').slice(0,12)}`;
  const source=readFileSync(worker,'utf8');
  if(!source.includes(CACHE_TOKEN) || !source.includes(ASSET_TOKEN))
    throw new Error('Worker lacks required build placeholders; refusing unversioned offline release');
  const output=source.replace(CACHE_TOKEN,`const CACHE='${version}';`)
    .replace(ASSET_TOKEN,`const BUILD_ASSETS=${JSON.stringify(urls)};`);
  writeFileSync(worker,output);
  console.log(`Offline shell: ${urls.length} built assets, ${(total/1048576).toFixed(2)} MiB, cache ${version}`);
  return { version, urls, bytes:total };
}

if(process.argv[1]?.endsWith('finalize-service-worker.mjs')) {
  const i=process.argv.indexOf('--dist');
  finalizeServiceWorker(i>=0 ? process.argv[i+1] : 'dist');
}
