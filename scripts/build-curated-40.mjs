import {spawnSync} from "node:child_process";
function call(args,env=process.env){
 const r=spawnSync(process.platform==="win32"?"npm.cmd":"npm",args,{stdio:"inherit",env});
 if(r.error)throw r.error;if(r.status!==0)process.exit(r.status??1);
}
call(["run","verify:makeup-curated-40"]);
call(["run","build"],{...process.env,VITE_MAKEUP_CURATED_40:"true",VITE_MAKEUP_FINAL_IMAGES:"false",VITE_HB_AI_REVIEW:"false"});
