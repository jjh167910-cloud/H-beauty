/** Pure decision logic; never uploads photographs or touches the network. */
const point=p=>Array.isArray(p)&&p.length>=2&&p.every((n,i)=>i>1||Number.isFinite(n));
const mean=(pts,i,j,k)=>[(pts[i][0]+pts[j][0]+pts[k][0])/3,(pts[i][1]+pts[j][1]+pts[k][1])/3];
export function evaluateFaceCount(result,selectedPoints,imageWidth,imageHeight){
 const faces=result?.faceLandmarks;
 if(!Array.isArray(faces))return {ok:false,reason:'invalid-detector-output'};
 if(faces.length===0)return {ok:false,reason:'no-face'};
 if(faces.length>1)return {ok:false,reason:'multiple-faces',faceCount:faces.length};
 const p=faces[0];
 if(!p||p.length<468||![1,33,263].every(i=>p[i]&&Number.isFinite(p[i].x)&&Number.isFinite(p[i].y)))return {ok:false,reason:'missing-landmarks'};
 if(!Array.isArray(selectedPoints)||selectedPoints.length<468||!Number.isFinite(imageWidth)||!Number.isFinite(imageHeight)||imageWidth<64||imageHeight<64||![1,33,263].every(i=>point(selectedPoints[i])))return {ok:false,reason:'invalid-selection'};
 const [x,y]=mean(selectedPoints,1,33,263);
 const center=[x/imageWidth,y/imageHeight];
 const detected=[(p[1].x+p[33].x+p[263].x)/3,(p[1].y+p[33].y+p[263].y)/3];
 const mismatch=Math.hypot(center[0]-detected[0],center[1]-detected[1]);
 const detectedSpan=Math.hypot(p[33].x-p[263].x,p[33].y-p[263].y);
 const selectedSpan=Math.hypot((selectedPoints[33][0]-selectedPoints[263][0])/imageWidth,(selectedPoints[33][1]-selectedPoints[263][1])/imageHeight);
 const ratio=detectedSpan/Math.max(selectedSpan,1e-6);
 if(mismatch>.115||ratio<.55||ratio>1.8)return {ok:false,reason:'different-selected-face',mismatch,ratio};
 return {ok:true,reason:'single-consistent-face',faceCount:1,mismatch,ratio};
}