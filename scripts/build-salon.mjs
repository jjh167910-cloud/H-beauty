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
import { installNailPack } from "./install-nail-photo-pack.mjs";

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
  const installedPhotoPack = installNailPack();
  const file = resolve(MUSIC_PATH);
  const installed = existsSync(file) && statSync(file).isFile();
  const configured = process.env.VITE_SALON_MUSIC;
  const enabled = resolveMusicFlag({ installed, configured });
  // All 34 photos must be installed together. V3 fixes two duplicate designs,
  // and can coexist with older installations from the V2 generation.
  const nailLock=resolve("assets/hbeauty-nail-editorial-v2.sha256");
  const nailPaths=readFileSync(nailLock,"utf8").trim().split(/\r?\n/)
    .map(line=>line.trim().split(/\s+/).at(-1));
  const present=nailPaths.filter(path=>existsSync(resolve(path)));
  if (nailPaths.length!==34 || new Set(nailPaths).size!==34)
    throw new Error("Nail editorial v2 lock must contain 34 unique files");
  if (present.length>4 && present.length!==34)
    throw new Error(`Nail editorial v2 pack incomplete: ${present.length}/34 files found`);
  if (process.env.VITE_NAIL_EDITORIAL_V2==="true" && present.length!==34)
    throw new Error("VITE_NAIL_EDITORIAL_V2=true without complete 34-photo pack");
  const nailEdition=present.length===34?"true":"false";
  let photoVersion=installedPhotoPack.edition ?? 2;
  if(nailEdition==="true" && !installedPhotoPack.edition){
    const v3Lock=readFileSync(resolve("assets/hbeauty-nail-editorial-v3.sha256"),"utf8");
    const expected=v3Lock.split(/\r?\n/).find(line=>line.endsWith("public/nails/photos/nail-marble.webp"))?.split(/\s+/)[0];
    const actual=createHash("sha256").update(readFileSync(resolve("public/nails/photos/nail-marble.webp"))).digest("hex");
    if(expected===actual) photoVersion=3;
  }
  const env = { ...process.env, VITE_SALON_MUSIC: enabled,
    VITE_NAIL_EDITORIAL_V2:nailEdition, NAIL_EDITORIAL_LOCK_VERSION:String(photoVersion) };
  console.log(`Nail editorial photos: ${nailEdition==="true"?"34 photos, integrity gated v"+photoVersion:"offline vector previews active"}`);
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
