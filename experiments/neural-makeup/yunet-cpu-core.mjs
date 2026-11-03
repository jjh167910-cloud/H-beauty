/** Research-only CPU YuNet decoder. MIT weights are NOT bundled here.
 * Contract: OpenCV Zoo YuNet 2026may ONNX, [1,3,H,W] BGR float32,
 * 12 output heads over strides 8/16/32. Never needs WebGL.
 */
const STRIDES=[8,16,32],clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const finite=v=>typeof v==='number'&&Number.isFinite(v);
export function imageToYuNetTensor(rgba,width,height){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<32||height<32||
   width>1024||height>1024||width%32||height%32||
   !(rgba instanceof Uint8Array||rgba instanceof Uint8ClampedArray)||
   rgba.length!==width*height*4)throw Error('YuNet expects RGBA and dimensions divisible by 32');
 const plane=width*height,out=new Float32Array(3*plane);
 for(let i=0;i<plane;i++){out[i]=rgba[4*i+2];out[plane+i]=rgba[4*i+1];out[2*plane+i]=rgba[4*i];}
 return {data:out,dims:[1,3,height,width]};
}
function checked(o,key,n,c){
 const item=o[key],data=item?.data??item,dims=item?.dims??[1,n,c];
 if(!(data instanceof Float32Array)||data.length!==n*c||!Array.isArray(dims)||
    dims.length!==3||dims[0]!==1||dims[1]!==n||dims[2]!==c)throw Error('YuNet output tensor mismatch: '+key);
 return data;
}
export function faceIoU(a,b){
 const x0=Math.max(a.x,b.x),y0=Math.max(a.y,b.y),x1=Math.min(a.x+a.w,b.x+b.w),y1=Math.min(a.y+a.h,b.y+b.h);
 const area=Math.max(0,x1-x0)*Math.max(0,y1-y0);
 return area/Math.max(1e-10,a.w*a.h+b.w*b.h-area);
}
export function decodeYuNet(o,{width=320,height=320,threshold=.65,nms=.3,maxFaces=10,minSize=12}={}){
 if(!o||!Number.isInteger(width)||!Number.isInteger(height)||width<32||height<32||
   width>1024||height>1024||width%32||height%32||!finite(threshold)||threshold<.1||threshold>1||
   !finite(nms)||nms<0||nms>1)throw Error('Invalid YuNet decoding settings');
 const candidates=[];
 for(const stride of STRIDES){
  const cols=width/stride,n=cols*(height/stride);
  const cls=checked(o,'cls_'+stride,n,1),obj=checked(o,'obj_'+stride,n,1),
    box=checked(o,'bbox_'+stride,n,4),kps=checked(o,'kps_'+stride,n,10);
  for(let i=0;i<n;i++){
   const score=Math.sqrt(clamp(cls[i],0,1)*clamp(obj[i],0,1));
   if(!finite(score)||score<threshold)continue;
   const col=i%cols,row=Math.floor(i/cols),j=i*4,k=i*10;
   if(![box[j],box[j+1],box[j+2],box[j+3]].every(finite))continue;
   const cx=(col+box[j])*stride,cy=(row+box[j+1])*stride;
   const w=Math.exp(clamp(box[j+2],-9,9))*stride,h=Math.exp(clamp(box[j+3],-9,9))*stride;
   if(w<minSize||h<minSize||w>width*3||h>height*3)continue;
   const marks=[];
   for(let v=0;v<5;v++){
    if(!finite(kps[k+2*v])||!finite(kps[k+2*v+1])){marks.length=0;break;}
    marks.push([(col+kps[k+2*v])*stride,(row+kps[k+2*v+1])*stride]);
   }
   if(marks.length===5)candidates.push({x:cx-w/2,y:cy-h/2,w,h,score,landmarks:marks});
  }
 }
 candidates.sort((a,b)=>b.score-a.score);
 const selected=[];
 for(const f of candidates.slice(0,300)){
  if(selected.some(g=>faceIoU(f,g)>.3))continue;
  selected.push(f);if(selected.length>=maxFaces)break;
 }
 return selected;
}
/** Compare face position, not biometric identity. CPU preflight rejects ambiguity. */
export function assessYuNetFaces(faces,points,sourceW,sourceH,{letterbox={x:0,y:0,w:320,h:320}}={}){
 if(!Array.isArray(faces)||!Array.isArray(points)||points.length<468||sourceW<64||sourceH<64||
   ![1,33,263].every(i=>Array.isArray(points[i])&&points[i].slice(0,2).every(finite)))return {ok:false,reason:'invalid-input'};
 if(faces.length===0)return {ok:false,reason:'no-face'};
 if(faces.length>1)return {ok:false,reason:'multiple-faces',faceCount:faces.length};
 const f=faces[0],l=letterbox;
 if(!f||f.score<.65||f.landmarks?.length!==5)return {ok:false,reason:'low-confidence'};
 if(![l.x,l.y,l.w,l.h].every(finite)||l.w<=0||l.h<=0)return {ok:false,reason:'invalid-letterbox'};
 const pred=f.landmarks.slice(0,3).map(([x,y])=>[(x-l.x)/l.w,(y-l.y)/l.h]);
 const exp=[33,263,1].map(i=>[points[i][0]/sourceW,points[i][1]/sourceH]);
 const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
 const eyeError=Math.min(distance(pred[0],exp[0])+distance(pred[1],exp[1]),
  distance(pred[0],exp[1])+distance(pred[1],exp[0]))/2;
 const noseError=distance(pred[2],exp[2]);
 if(eyeError>.075||noseError>.10)return {ok:false,reason:'different-selected-face',eyeError,noseError};
 return {ok:true,reason:'single-consistent-face',faceCount:1,score:f.score};
}
