/** Post-Vite build: package the offline React shell but NOT the hairstyle collection.
 * Run: node scripts/finalize-service-worker.mjs [--dist /path/to/dist]. */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

const CACHE_TOKEN = "const CACHE='h-beauty-v5-unbuilt';";
const ASSET_TOKEN = 'const BUILD_ASSETS=[]; /* __H_BEAUTY_PRECACHE__ */';
const ALLOWED = /\.(?:js|css|woff2?|ttf|otf|svg|png|jpe?g|webp|avif)$/i;
const LIMIT = 35 * 1024 * 1024;

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
