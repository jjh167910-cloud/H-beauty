import { spawnSync } from "node:child_process";

// Invoked only after verify-makeup-48 has passed.
const result=spawnSync(process.platform==="win32" ? "npm.cmd" : "npm",["run","build"],{
  stdio:"inherit",
  env:{...process.env,VITE_MAKEUP_FINAL_IMAGES:"true"},
});
if(result.error){ console.error(result.error);process.exit(1); }
process.exit(result.status??1);
