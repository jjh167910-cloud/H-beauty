import {spawnSync} from "node:child_process";
const npm=process.platform==="win32"?"npm.cmd":"npm";
function run(args,env=process.env){
 const p=spawnSync(npm,args,{stdio:"inherit",env});
 if(p.error)throw p.error;
 if(p.status!==0)process.exit(p.status??1);
}
run(["run","verify:makeup-curated-80"]);
run(["run","typecheck"]);
run(["run","build"],{
 ...process.env,
 VITE_MAKEUP_CURATED_80:"true",
 VITE_MAKEUP_CURATED_40:"false",
 VITE_MAKEUP_FINAL_IMAGES:"false",
 VITE_HB_AI_REVIEW:"false"
});
