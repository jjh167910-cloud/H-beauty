import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
const root=process.cwd();
const d=JSON.parse(readFileSync(join(root,"src/data/makeup-ai-40.json"),"utf8"));
const imported=d.looks.filter(x=>x.candidate).every(x=>existsSync(join(root,"public",x.asset.slice(1))));
if(imported){
  const verified=spawnSync(process.execPath,["scripts/verify-makeup-ai-40.mjs","--candidates"],{stdio:"inherit"});
  if(verified.status!==0)process.exit(verified.status??1);
}
const cmd=process.platform==="win32"?"npm.cmd":"npm";
const build=spawnSync(cmd,["run","build"],{
  stdio:"inherit",
  env:{...process.env,VITE_HB_AI_REVIEW:"true",VITE_HB_AI_CANDIDATES_PRESENT:imported?"true":"false"}
});
if(build.error){console.error(build.error);process.exit(1)}
console.log(imported?"Review build displays the 22 imported, UNAPPROVED AI candidates.":"Review build displays 40 look records WITHOUT missing portrait substitutions.");
process.exit(build.status??1);
