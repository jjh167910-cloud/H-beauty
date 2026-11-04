/** Experimental browser CPU face-count verification (not wired to production).
 * Requires locally packaged onnxruntime-web WASM and MIT YuNet model.
 * Both resources MUST already be cached offline. No remote server processing.
 */
import {imageToYuNetTensor,decodeYuNet,assessYuNetFaces} from './yunet-cpu-core.mjs';
export const YUNET_SHA256='ebafce4e3c118d6554634be5c27ab333b4c047a9a8c3faf1d7cf93101c22f0f0';
let memo;
const hex=u=>Array.from(new Uint8Array(u),v=>v.toString(16).padStart(2,'0')).join('');
export async function openYuNetCPU(ort,modelBytes){
 if(!ort?.Tensor||!ort?.InferenceSession?.create||!crypto?.subtle)throw Error('Local CPU inference runtime unavailable');
 if(!(modelBytes instanceof Uint8Array)||modelBytes.byteLength<100000||modelBytes.byteLength>500000)throw Error('Invalid YuNet model byte length');
 const hash=hex(await crypto.subtle.digest('SHA-256',modelBytes));
 if(hash!==YUNET_SHA256)throw Error('YuNet model integrity mismatch');
 const session=await ort.InferenceSession.create(modelBytes,{executionProviders:['wasm']});
 if(!session.inputNames?.includes('input')||![8,16,32].every(s=>['cls','obj','bbox','kps'].every(k=>session.outputNames?.includes(k+'_'+s)))){
  await session.release?.();throw Error('Unexpected YuNet tensor contract');
 }
 return session;
}
export async function checkSingleFaceCPU(file,selected,{ort,modelBytes}={}){
 if(!(file instanceof Blob)||!selected?.photo||!selected?.points)throw Error('A photo and face landmarks are required');
 if(!ort||!modelBytes)throw Error('Offline YuNet model/CPU WASM not installed');
 const bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});
 try{
  if(bitmap.width<64||bitmap.height<64)throw Error('Image too small');
  const s=Math.min(320/bitmap.width,320/bitmap.height),w=bitmap.width*s,h=bitmap.height*s;
  const x=(320-w)/2,y=(320-h)/2,canvas=document.createElement('canvas');
  canvas.width=320;canvas.height=320;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  ctx.fillStyle='black';ctx.fillRect(0,0,320,320);ctx.drawImage(bitmap,x,y,w,h);
  const input=imageToYuNetTensor(ctx.getImageData(0,0,320,320).data,320,320);
  memo??=openYuNetCPU(ort,modelBytes).catch(e=>{memo=null;throw e;});
  const session=await memo;
  const outputs=await session.run({input:new ort.Tensor('float32',input.data,input.dims)});
  const faces=decodeYuNet(outputs,{width:320,height:320});
  return assessYuNetFaces(faces,selected.points,selected.photo.width,selected.photo.height,
    {letterbox:{x,y,w,h}});
 }finally{bitmap.close?.();}
}
