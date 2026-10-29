/**
 * Production build with safe, automatic salon-music activation.
 *
 * The licensed MP3 is intentionally absent from the public repository until
 * uploaded by the owner. When its exact asset path is present, enable music
 * automatically in Vite and in the service-worker packaging step.
 */
import { spawnSync } from "node:child_process";
import { existsSync, statSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { webpDimensions } from "./audit-nail-photo-candidates.mjs";
import { installNailPack } from "./install-nail-photo-pack.mjs";
import { installPedicure78 } from "./install-pedicure-78-pack.mjs";
import { restorePedicureParts } from "./restore-pedicure-parts.mjs";
import { reconstructNailArchive } from "./restore-embedded-nail-v4.mjs";

export const MUSIC_PATH = "public/audio/hananeh-salon-ambience.mp3";

export function resolveMusicFlag({ installed, configured } = {}) {
  if (configured != null && configured !== "" && !["true", "false", "auto"].includes(configured)) {
    throw new Error("VITE_SALON_MUSIC must be 'true', 'false', or 'auto'");
  }
  if (configured === "true" && !installed) {
    throw new Error(
      "VITE_SALON_MUSIC=true but public/audio/hananeh-salon-ambience.mp3 is missing. " +
      "Upload the licensed MP3 before publishing."
    );
  }
  if (configured === "false") return "false";
  return installed ? "true" : "false";
}

function build() {
  const verifiedEmbeddedArchive = reconstructNailArchive();
  console.log(`Verified bundled salon photos: ${verifiedEmbeddedArchive.bytes} bytes, sha256 ${verifiedEmbeddedArchive.sha256}`);
  const installedPhotoPack = installNailPack();
  // Fail closed on partial/wrong pedicure photo uploads; preserve existing vector gallery otherwise.
  restorePedicureParts();
  const installedPedicure = installPedicure78();
  // Single independently reviewed manicure addition; preserve the nine-photo V4 lock.
  const midnightPath=resolve("public/nails/photos/nail-midnight-glitter.webp");
  const midnightLock=resolve("assets/hbeauty-manicure-midnight-glitter.sha256");
  const hasMidnightPhoto=existsSync(midnightPath), hasMidnightLock=existsSync(midnightLock);
  if(hasMidnightPhoto!==hasMidnightLock)throw new Error("Incomplete midnight-glitter photo release");
  const midnightEnabled=hasMidnightPhoto && hasMidnightLock;
  if(midnightEnabled) {
    const expected=readFileSync(midnightLock,"utf8").trim();
    const actual=createHash("sha256").update(readFileSync(midnightPath)).digest("hex");
    if(expected!==`${actual}  public/nails/photos/nail-midnight-glitter.webp`)
      throw new Error("Midnight-glitter manicure photo release checksum mismatch");
  }
  // Four native 1600px manicure photos, exact-ID mapped and independently SHA-locked.
  // Fail closed before Vite if any piece is missing or modified.
  const FOUR_LOCK=resolve("assets/hbeauty-manicure-four-20261029.sha256");
  const FOUR_IDS=["nail-atlas-botanical-ruby","nail-atlas-botanical-espresso","nail-lavender-chrome","nail-silver-chrome"];
  if(!existsSync(FOUR_LOCK))throw Error("Manicure four-photo release manifest missing");
  const fourLines=readFileSync(FOUR_LOCK,"utf8").trim().split(/\r?\n/);
  if(fourLines.length!==FOUR_IDS.length)throw Error("Manicure release manifest must contain exactly four photos");
  const fourHashes=new Set(),fourNames=new Set();
  for(const line of fourLines){
    const match=line.match(/^([a-f0-9]{64})  (public\/nails\/photos\/nail-[a-z0-9-]+\.webp)$/);
    if(!match)throw Error("Invalid manicure four-photo manifest entry");
    const id=match[2].slice("public/nails/photos/".length,-".webp".length);
    if(!FOUR_IDS.includes(id)||fourHashes.has(match[1])||fourNames.has(id))
      throw Error("Duplicate or unknown manicure four-photo ID");
    fourHashes.add(match[1]);fourNames.add(id);
    const asset=resolve(match[2]);
    if(!existsSync(asset))throw Error("Required manicure photo is missing: "+asset);
    const bytes=readFileSync(asset);
    if(bytes.length<25_000||bytes.length>2_200_000||
       bytes.toString("ascii",0,4)!=="RIFF"||bytes.toString("ascii",8,12)!=="WEBP"||
       createHash("sha256").update(bytes).digest("hex")!==match[1])
      throw Error("Manicure four-photo integrity failure: "+id);
  }
  if(fourNames.size!==FOUR_IDS.length)throw Error("Incomplete four-photo manicure release");

  // Seven full-resolution source photographs; strict all-or-nothing release.
  const BATCH7_LOCK=resolve("assets/hbeauty-manicure-batch7.sha256");
  const BATCH7_IDS=new Set(["nail-micro-french","nail-black-french","nail-cherry-french","nail-pink-ombre","nail-peach-ombre","nail-atlas-geometry-ivory","nail-atlas-foil-ivory"]);
  if(!existsSync(BATCH7_LOCK))throw Error("Manicure batch7 release lock missing");
  const batch7Lines=readFileSync(BATCH7_LOCK,"utf8").trim().split(/\r?\n/);
  if(batch7Lines.length!==7)throw Error("Manicure batch7 must contain exactly seven images");
  const batch7Found=new Set(),batch7Hashes=new Set();
  for(const line of batch7Lines){
    const match=line.match(/^([a-f0-9]{64})  (public\/nails\/photos\/nail-[a-z0-9-]+\.webp)$/);
    if(!match)throw Error("Malformed manicure batch7 lock entry");
    const id=match[2].slice("public/nails/photos/".length,-".webp".length);
    if(!BATCH7_IDS.has(id)||batch7Found.has(id)||batch7Hashes.has(match[1]))
      throw Error("Manicure batch7 contains unknown or duplicated designs");
    batch7Found.add(id);batch7Hashes.add(match[1]);
    const filePath=resolve(match[2]);
    if(!existsSync(filePath))throw Error("Missing manicure batch7 photo "+id);
    const bytes=readFileSync(filePath);
    if(bytes.length<25_000||bytes.length>2_200_000||
      bytes.toString("ascii",0,4)!=="RIFF"||bytes.toString("ascii",8,12)!=="WEBP"||
      createHash("sha256").update(bytes).digest("hex")!==match[1])
      throw Error("Manicure batch7 photo content mismatch "+id);
  }
  if(batch7Found.size!==7)throw Error("Incomplete manicure batch7 photo set");

  // Eight native 1600px photos, locked independently from the prior 21 manicures.
  const BATCH8_IDS = new Set(["nail-atlas-geometry-champagne","nail-atlas-botanical-pearl","nail-gold-french","nail-champagne","nail-rose-glitter","nail-modern-lines","nail-atlas-velvet-ruby","nail-atlas-velvet-champagne"]);
  const BATCH8_LOCK=resolve("assets/hbeauty-manicure-batch8.sha256");
  if(!existsSync(BATCH8_LOCK))throw Error("Manicure batch8 photo lock missing");
  const batch8Lines=readFileSync(BATCH8_LOCK,"utf8").trim().split(/\r?\n/);
  if(batch8Lines.length!==8)throw Error("Manicure batch8 must contain eight assets");
  const batch8Seen=new Set(),batch8Hashes=new Set();
  for(const line of batch8Lines){
    const m=line.match(/^([a-f0-9]{64})  (public\/nails\/photos\/nail-[a-z0-9-]+\.webp)$/);
    if(!m)throw Error("Malformed manicure batch8 SHA-256 entry");
    const id=m[2].slice("public/nails/photos/".length,-".webp".length);
    if(!BATCH8_IDS.has(id)||batch8Seen.has(id)||batch8Hashes.has(m[1]))
      throw Error("Duplicate or unknown manicure batch8 image ID");
    batch8Seen.add(id);batch8Hashes.add(m[1]);
    const target=resolve(m[2]);
    if(!existsSync(target))throw Error("Missing manicure batch8 photograph "+id);
    const bytes=readFileSync(target);
    if(bytes.length<25_000||bytes.length>2_200_000||
       bytes.toString("ascii",0,4)!=="RIFF"||bytes.toString("ascii",8,12)!=="WEBP"||
       createHash("sha256").update(bytes).digest("hex")!==m[1])
      throw Error("Manicure batch8 photograph checksum mismatch: "+id);
  }
  if(batch8Seen.size!==8)throw Error("Incomplete manicure batch8 photographic release");
  // 50-candidate review, Batch A: only ten design-matched photographs approved.
  // Fail before Vite on any missing or altered asset.
  const BATCH50_A_IDS=new Set(["nail-atlas-gradient-merlot","nail-atlas-prism-blush","nail-atlas-prism-champagne","nail-atlas-prism-coral","nail-atlas-prism-midnight","nail-atlas-prism-pearl","nail-atlas-prism-sage","nail-atlas-velvet-blush","nail-atlas-velvet-coral","nail-atlas-velvet-midnight"]);
  const BATCH50_A_LOCK=resolve("assets/hbeauty-manicure-batch50-a.sha256");
  if(!existsSync(BATCH50_A_LOCK))throw Error("Manicure batch50-A manifest missing");
  const batch50AEntries=readFileSync(BATCH50_A_LOCK,"utf8").trim().split(/\r?\n/);
  if(batch50AEntries.length!==10)throw Error("Batch50-A must contain exactly ten approved images");
  const b50Names=new Set(),b50Hashes=new Set();
  for(const line of batch50AEntries){
    const m=line.match(/^([a-f0-9]{64})  (public\/nails\/photos\/nail-[a-z0-9-]+\.webp)$/);
    if(!m)throw Error("Invalid Batch50-A checksum manifest");
    const id=m[2].slice("public/nails/photos/".length,-".webp".length);
    if(!BATCH50_A_IDS.has(id)||b50Names.has(id)||b50Hashes.has(m[1]))
      throw Error("Batch50-A duplicate/unknown manicure style ID");
    b50Names.add(id);b50Hashes.add(m[1]);
    const image=resolve(m[2]);if(!existsSync(image))throw Error("Missing Batch50-A photograph "+id);
    const b=readFileSync(image);
    if(b.length<25_000||b.length>2_200_000||b.toString("ascii",0,4)!=="RIFF"||b.toString("ascii",8,12)!=="WEBP"||
      createHash("sha256").update(b).digest("hex")!==m[1])throw Error("Batch50-A image integrity check failed "+id);
  }
  if(b50Names.size!==BATCH50_A_IDS.size)throw Error("Incomplete Batch50-A photo set");
  // Batch50B: nine native-resolution editorial photos promoted after exact-style QA.
  // A missing, duplicate, or altered image aborts the build before any deployment.
  const BATCH50B_IDS=new Set(["nail-atlas-modern-french-espresso","nail-atlas-foil-cobalt","nail-atlas-modern-french-merlot","nail-atlas-modern-french-sage","nail-atlas-modern-french-lavender","nail-rose-french","nail-atlas-magnetic-midnight","nail-atlas-magnetic-coral","nail-atlas-magnetic-pearl"]);
  const BATCH50B_LOCK=resolve("assets/hbeauty-manicure-batch50b.sha256");
  if(!existsSync(BATCH50B_LOCK))throw Error("Manicure Batch50B release lock missing");
  const batch50BLines=readFileSync(BATCH50B_LOCK,"utf8").trim().split(/\r?\n/);
  if(batch50BLines.length!==9)throw Error("Manicure Batch50B must contain nine images");
  const b50BNames=new Set(),b50BHashes=new Set();
  for(const line of batch50BLines){
    const m=line.match(/^([a-f0-9]{64})  (public\/nails\/photos\/nail-[a-z0-9-]+\.webp)$/);
    if(!m)throw Error("Malformed Batch50B manifest");
    const id=m[2].slice("public/nails/photos/".length,-".webp".length);
    if(!BATCH50B_IDS.has(id)||b50BNames.has(id)||b50BHashes.has(m[1]))
      throw Error("Batch50B duplicate or unknown style ID");
    b50BNames.add(id);b50BHashes.add(m[1]);
    const file=resolve(m[2]);
    if(!existsSync(file))throw Error("Missing Batch50B manicure photo "+id);
    const b=readFileSync(file);
    if(b.length<25_000||b.length>2_200_000||b.toString("ascii",0,4)!=="RIFF"||
      b.toString("ascii",8,12)!=="WEBP"||createHash("sha256").update(b).digest("hex")!==m[1])
      throw Error("Manicure Batch50B integrity failure "+id);
  }
  if(b50BNames.size!==BATCH50B_IDS.size)throw Error("Incomplete Batch50B manicure release");

  // Batch50C: five of eight candidates passed exact-shape and finish review.
  // The three mismatched designs remain vectors, never forced into production.
  const BATCH50C_IDS=new Set(["nail-atlas-magnetic-espresso","nail-atlas-magnetic-sage","nail-atlas-prism-ivory","nail-atlas-gradient-pearl","nail-atlas-gradient-lavender"]);
  const BATCH50C_LOCK=resolve("assets/hbeauty-manicure-batch50c.sha256");
  if(!existsSync(BATCH50C_LOCK))throw Error("Manicure Batch50C release lock missing");
  const b50cLines=readFileSync(BATCH50C_LOCK,"utf8").trim().split(/\r?\n/);
  if(b50cLines.length!==BATCH50C_IDS.size)throw Error("Batch50C must contain exactly five photographs");
  const b50cSeen=new Set(),b50cHashes=new Set();
  const earlierLocks=["hbeauty-nail-editorial-v4.sha256","hbeauty-manicure-batch7.sha256","hbeauty-manicure-batch8.sha256","hbeauty-manicure-batch50-a.sha256","hbeauty-manicure-batch50b.sha256","hbeauty-manicure-four-20261029.sha256","hbeauty-manicure-midnight-glitter.sha256","hbeauty-pedicure-78.sha256"];
  const earlierContents=earlierLocks.map(name=>readFileSync(resolve("assets",name),"utf8"));
  for(const line of b50cLines){
    const m=line.match(/^([a-f0-9]{64})  (public\/nails\/photos\/(nail-[a-z0-9-]+)\.webp)$/);
    if(!m)throw Error("Invalid Batch50C SHA-256 manifest");
    const [_,hash,path,id]=m;
    if(!BATCH50C_IDS.has(id)||b50cSeen.has(id)||b50cHashes.has(hash))throw Error("Unknown or duplicate Batch50C photo");
    if(earlierContents.some(content=>content.includes(hash)||content.includes(path)))
      throw Error("Batch50C reuses an already published image or style");
    b50cSeen.add(id);b50cHashes.add(hash);
    const image=resolve(path);
    if(!existsSync(image))throw Error("Missing Batch50C original "+id);
    const bytes=readFileSync(image);
    if(bytes.length<25_000||bytes.length>2_200_000||
       bytes.toString("ascii",0,4)!=="RIFF"||bytes.toString("ascii",8,12)!=="WEBP"||
       createHash("sha256").update(bytes).digest("hex")!==hash)
       throw Error("Batch50C SHA-256 or format mismatch "+id);
    const {width,height}=webpDimensions(bytes);
    if(width!==1600||height!==1600)throw Error("Batch50C native resolution mismatch "+id);
  }
  if(b50cSeen.size!==5)throw Error("Incomplete Batch50C release");
  const file = resolve(MUSIC_PATH);
  const installed = existsSync(file) && statSync(file).isFile();
  const configured = process.env.VITE_SALON_MUSIC;
  const enabled = resolveMusicFlag({ installed, configured });
  // Prefer quality-gated V4: only nine native high-resolution photographs;
  // the other 25 styles keep detailed and accurate SVG illustrations.
  // Legacy V2/V3 and four-photo releases continue working.
  const lockV2=readFileSync(resolve("assets/hbeauty-nail-editorial-v2.sha256"),"utf8");
  const lockV4=readFileSync(resolve("assets/hbeauty-nail-editorial-v4.sha256"),"utf8");
  const paths=contents=>contents.trim().split(/\r?\n/).map(line=>line.trim().split(/\s+/).at(-1));
  const all34=paths(lockV2);
  const selectedV4=paths(lockV4);
  if(all34.length!==34||selectedV4.length!==9)
    throw new Error("Nail photo lock must specify 34 original / 9 quality-approved assets");
  const count34=all34.filter(path=>existsSync(resolve(path))).length;
  const count9=selectedV4.filter(path=>existsSync(resolve(path))).length;
  let photoVersion=installedPhotoPack.edition ?? 2;
  if(!installedPhotoPack.edition && count34===34){
    const v3Lock=readFileSync(resolve("assets/hbeauty-nail-editorial-v3.sha256"),"utf8");
    const expected=v3Lock.split(/\r?\n/).find(line=>line.endsWith("public/nails/photos/nail-marble.webp"))?.split(/\s+/)[0];
    const actual=createHash("sha256").update(readFileSync(resolve("public/nails/photos/nail-marble.webp"))).digest("hex");
    if(expected===actual)photoVersion=3;
  } else if(!installedPhotoPack.edition && count34<34 && count9===9) photoVersion=4;
  const count=photoVersion===4?count9:count34;
  const expected=photoVersion===4?9:34;
  // V1's optional exact four-photo release remains supported.
  if(count!==expected && count>4)
    throw new Error(`Incomplete nail photo release: ${count}/${expected}`);
  if(process.env.VITE_NAIL_EDITORIAL_V2==="true" && count!==expected)
    throw new Error("Nail photo edition requested without complete verified pack");
  const nailEdition=count===expected?"true":"false";
  const env={...process.env,
    VITE_SALON_MUSIC:enabled,
    VITE_PEDICURE_78:installedPedicure.installed ? "true" : "false",
    VITE_MANICURE_BATCH50_A:"true",
    VITE_MANICURE_BATCH50_B:"true",
    VITE_MANICURE_BATCH50_C:"true",
    VITE_MANICURE_FOUR: "true",
    VITE_MANICURE_BATCH7: "true",
    VITE_MANICURE_BATCH8:"true",
    VITE_MANICURE_MIDNIGHT_GLITTER:midnightEnabled ? "true" : "false",
    VITE_NAIL_EDITORIAL_V2:nailEdition,
    VITE_NAIL_EDITORIAL_V3:nailEdition==="true" && photoVersion>=3?"true":"false",
    NAIL_EDITORIAL_LOCK_VERSION:String(photoVersion)};
  console.log(`Nail photographic edition: ${nailEdition==="true"?`v${photoVersion} (${expected} files)`:"vector-only / legacy optional 4-photo"}`);
  console.log(`Pedicure gallery: ${installedPedicure.installed ? "78 verified photos" : "vector fallback until full approved pack is installed"}`);
  console.log(`Salon music: ${enabled === "true" ? "ENABLED (asset found)" : "disabled (asset missing or explicit opt-out)"}`);
  if (enabled === "true") {
    console.log("Salon music checksum is verified during service-worker packaging.");
  }

  const stages = [
    [resolve("node_modules/vite/bin/vite.js"), "build"],
    [resolve("scripts/finalize-service-worker.mjs")],
  ];
  for (const args of stages) {
    const result = spawnSync(process.execPath, args, { stdio: "inherit", env });
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status ?? 1);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  build();
}
