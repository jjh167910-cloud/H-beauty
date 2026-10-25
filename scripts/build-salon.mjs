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
  const file = resolve(MUSIC_PATH);
  const installed = existsSync(file) && statSync(file).isFile();
  const configured = process.env.VITE_SALON_MUSIC;
  const enabled = resolveMusicFlag({ installed, configured });
  // The full v2 photo pack is optional. Only expose its URLs after every
  // SHA256-locked asset exists: no partial, broken, or mislabeled cards.
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
  const env = { ...process.env, VITE_SALON_MUSIC: enabled, VITE_NAIL_EDITORIAL_V2:nailEdition };
  console.log(`Nail editorial v2 photos: ${nailEdition==="true"?"34 verified assets detected":"offline vector previews active"}`);
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
