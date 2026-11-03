/**
 * v19.9 research-only offline two-face detector preflight.
 * The legacy AI renderer remains unchanged. Requires locally shipped
 * MediaPipe task package, local WASM and local 4.8MB model.
 * This cannot prove that every second face will be detected.
 */
import {evaluateFaceCount} from './face-safety-core.mjs';
let enginePromise=null;
async function localEngine(){
 if(enginePromise)return enginePromise;
 enginePromise=(async()=>{
  const {FaceLandmarker}=await import('./vision_bundle.mjs');
  const txt=await fetch('./face_landmarker.txt',{cache:'force-cache'});
  if(!txt.ok)throw Error('local-face-model-missing');
  const src=(await txt.text()).trim();
  if(!/^[A-Za-z0-9+/=]+$/.test(src)||src.length>15000000)throw Error('face-model-invalid');
  const decoded=atob(src),model=new Uint8Array(decoded.length);
  for(let k=0;k<decoded.length;k++)model[k]=decoded.charCodeAt(k);
  return FaceLandmarker.createFromOptions({
    wasmLoaderPath:new URL('./wasm/vision_wasm_internal.js',import.meta.url).href,
    wasmBinaryPath:new URL('./wasm/vision_wasm_internal.wasm',import.meta.url).href
  },{baseOptions:{modelAssetBuffer:model,delegate:'CPU'},runningMode:'IMAGE',numFaces:2});
 })().catch(e=>{enginePromise=null;throw e;});
 return enginePromise;
}
export async function validateSingleFace(file,selected){
 if(!(file instanceof Blob)||!selected?.photo||!selected?.points)throw Error('missing-face-source');
 const bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});
 try{
  const max=1024,scale=Math.min(1,max/Math.max(bitmap.width,bitmap.height));
  const canvas=document.createElement('canvas');
  canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);
  if(canvas.width<64||canvas.height<64)throw Error('too-small-for-face-detection');
  canvas.getContext('2d',{willReadFrequently:true}).drawImage(bitmap,0,0,canvas.width,canvas.height);
  const detector=await localEngine();
  return evaluateFaceCount(detector.detect(canvas),selected.points,selected.photo.width,selected.photo.height);
 }finally{bitmap.close?.();}
}