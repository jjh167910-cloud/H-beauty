/**
 * H-Beauty research: original-pixel YuNet ROI -> 478-point ONNX crop.
 * CPU-only pure JS. Fixed NHWC / 256x256 / [0,1] input for Google's
 * Apache-2.0 MediaPipe FaceLandmarker V2 converted ONNX model.
 * All coordinates are in pixel-index space, never normalized arbitrarily.
 */
export const CPU478_MODEL_SHA256='7d6e82dee82a1dca5fbddb282b3cc74571833a530de317fc22ae325c3358beeb';
export const CPU478_POINTS=478;
const bounded=(n,a,b)=>Math.min(b,Math.max(a,n));
const finite=(n)=>Number.isFinite(n);
export function checkRGBA(image){
 if(!image||!Number.isInteger(image.width)||!Number.isInteger(image.height)||
   image.width<64||image.height<64||image.width>3072||image.height>3072||
   !(image.data instanceof Uint8ClampedArray||image.data instanceof Uint8Array)||
   image.data.byteLength!==image.width*image.height*4)throw Error('Invalid source RGBA');
 return image;
}
function sample(image,x,y,channel){
 const w=image.width,h=image.height;
 const a=bounded(x,0,w-1),b=bounded(y,0,h-1);
 const x0=Math.floor(a),y0=Math.floor(b),x1=Math.min(x0+1,w-1),y1=Math.min(y0+1,h-1);
 const u=a-x0,v=b-y0,d=image.data;
 return (1-u)*(1-v)*d[(y0*w+x0)*4+channel]+u*(1-v)*d[(y0*w+x1)*4+channel]+
        (1-u)*v*d[(y1*w+x0)*4+channel]+u*v*d[(y1*w+x1)*4+channel];
}
export function makeYuNetLetterbox(image){
 checkRGBA(image);
 const scale=Math.min(320/image.width,320/image.height);
 const vw=Math.max(1,Math.round(image.width*scale));
 const vh=Math.max(1,Math.round(image.height*scale));
 const ox=Math.floor((320-vw)/2),oy=Math.floor((320-vh)/2);
 const tensor=new Float32Array(3*320*320),plane=320*320;
 for(let y=oy;y<oy+vh;y++)for(let x=ox;x<ox+vw;x++){
  const sx=(x-ox+.5)/scale-.5,sy=(y-oy+.5)/scale-.5,j=y*320+x;
  tensor[j]=sample(image,sx,sy,2);
  tensor[plane+j]=sample(image,sx,sy,1);
  tensor[plane*2+j]=sample(image,sx,sy,0);
 }
 return {data:tensor,dims:[1,3,320,320],letterbox:{x:ox,y:oy,scale}};
}
export function yunetToSource(face,letterbox){
 const box=face?.x!=null?[face.x,face.y,face.w,face.h]:face?.box;
 const lm=face?.landmarks||face?.kps;
 if(!box||box.length!==4||!Array.isArray(lm)||lm.length!==5||
    ![...box,...lm.flat()].every(finite)||box[2]<12||box[3]<12||
    !letterbox||!finite(letterbox.scale)||letterbox.scale<=0)throw Error('Invalid YuNet face');
 const [x,y,w,h]=box,{x:ox,y:oy,scale}=letterbox;
 return {box:[(x-ox)/scale,(y-oy)/scale,w/scale,h/scale],
   landmarks:lm.map(p=>[(p[0]-ox)/scale,(p[1]-oy)/scale]),score:face.score};
}
/** 256px crop: affine transforms original pixel x,y to crop x,y. */
export function getMeshROI(face,options={}){
 const box=face?.box,lm=face?.landmarks;
 if(!box||box.length!==4||!Array.isArray(lm)||lm.length<2||
   ![...box,...lm[0],...lm[1]].every(finite))throw Error('Invalid face ROI');
 const [x,y,w,h]=box;if(w<12||h<12)throw Error('Too-small face ROI');
 const size=Math.max(w,h)*1.5,cx=x+w/2,cy=y+h/2;
 const [left,right]=[lm[0],lm[1]].sort((a,b)=>a[0]-b[0]);
 const angle=Math.atan2(right[1]-left[1],right[0]-left[0]);
 if(Math.abs(angle)>Math.PI/3)throw Error('Unsupported head roll');
 const cos=Math.cos(angle),sin=Math.sin(angle),scale=256/size;
 if(!finite(scale)||scale<.08||scale>15)throw Error('Invalid ROI scale');
 return {center:[cx,cy],angle,cos,sin,scale,size,
    width:256,height:256};
}
/** Inverse of OpenCV getRotationMatrix2D(center,angle,scale) + crop-center. */
export function roiToSource(roi,cropX,cropY){
 const dx=(cropX-128)/roi.scale,dy=(cropY-128)/roi.scale;
 return [roi.center[0]+roi.cos*dx-roi.sin*dy,
         roi.center[1]+roi.sin*dx+roi.cos*dy];
}
export function sourceToROI(roi,x,y){
 const dx=x-roi.center[0],dy=y-roi.center[1];
 return [128+roi.scale*(roi.cos*dx+roi.sin*dy),
         128+roi.scale*(-roi.sin*dx+roi.cos*dy)];
}
export function makeMeshCrop(image,roi){
 checkRGBA(image);
 const t=new Float32Array(256*256*3);
 let j=0;
 for(let y=0;y<256;y++)for(let x=0;x<256;x++){
  const [sx,sy]=roiToSource(roi,x,y);
  if(sx<0||sy<0||sx>image.width-1||sy>image.height-1){j+=3;continue}
  t[j++]=sample(image,sx,sy,0)/255;
  t[j++]=sample(image,sx,sy,1)/255;
  t[j++]=sample(image,sx,sy,2)/255;
 }
 return {data:t,dims:[1,256,256,3]};
}
export function decodeMesh478(outputs,roi){
 const landmarks=outputs?.Identity?.data??outputs?.Identity;
 const presence=outputs?.Identity_1?.data??outputs?.Identity_1;
 if(!(landmarks instanceof Float32Array)||landmarks.length!==1434||
    !(presence instanceof Float32Array)||presence.length!==1||
    !finite(presence[0]))throw Error('Unexpected 478-point ONNX output contract');
 const probability=1/(1+Math.exp(-Math.max(-80,Math.min(80,presence[0]))));
 if(probability<.5)throw Error('Face-landmark confidence below .5');
 const points=new Array(478);
 for(let i=0;i<478;i++){
  const x=landmarks[3*i],y=landmarks[3*i+1],z=landmarks[3*i+2];
  if(!finite(x)||!finite(y)||!finite(z))throw Error('Non-finite mesh point');
  const p=roiToSource(roi,x,y);
  points[i]=[p[0],p[1],z/roi.scale];
 }
 return {points,confidence:probability,source:'onnx-cpu-478'};
}
export function checkMeshTopology(points,width,height){
 if(!Array.isArray(points)||points.length!==478||!Number.isInteger(width)||!Number.isInteger(height))
  return {ok:false,reason:'invalid-mesh'};
 const get=i=>points[i];
 if(![1,10,13,14,33,152,263,468,473].every(i=>
   Array.isArray(get(i))&&get(i).length>=2&&get(i).slice(0,2).every(finite)))
    return {ok:false,reason:'missing-points'};
 const d=(a,b)=>Math.hypot(get(a)[0]-get(b)[0],get(a)[1]-get(b)[1]);
 const eyeSpan=d(33,263),heightSpan=d(10,152);
 if(eyeSpan<width*.065||eyeSpan>width*.9||heightSpan<height*.12||
   heightSpan>height*1.15)return {ok:false,reason:'unreliable-face-size'};
 const midEyeY=(get(33)[1]+get(263)[1])/2;
 if(!(get(10)[1]<midEyeY&&midEyeY<get(1)[1]&&
      get(1)[1]<get(13)[1]&&get(13)[1]<=get(14)[1]+height*.03&&
      get(14)[1]<get(152)[1]))return {ok:false,reason:'inconsistent-topology'};
 return {ok:true,reason:'478-mesh-valid',eyeSpan,heightSpan};
}
