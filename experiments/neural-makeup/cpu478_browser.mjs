/**
 * H-Beauty experimental CPU-only selfie geometry pipeline.
 *
 * OpenCV Zoo MIT YuNet -> cropped 478-point Apache-2.0 FaceLandmarker ONNX.
 * Requires locally shipped pinned bytes and onnxruntime-web@1.31.1 WASM.
 * The caller must configure ort.env.wasm.wasmPaths to local cached files.
 * Never performs a fetch or sends portrait bytes to a server.
 * 
 * This does NOT implement new photorealistic makeup synthesis, face identity
 * recognition, or guarantee detection of every tiny/occluded second face.
 */
import {decodeYuNet} from './yunet-cpu-core.mjs';
import {
 CPU478_MODEL_SHA256,makeYuNetLetterbox,yunetToSource,getMeshROI,
 makeMeshCrop,decodeMesh478,checkMeshTopology
} from './cpu478_geometry.mjs';

const YUNET_SHA256='ebafce4e3c118d6554634be5c27ab333b4c047a9a8c3faf1d7cf93101c22f0f0';
const toHex=bytes=>Array.from(new Uint8Array(bytes),v=>v.toString(16).padStart(2,'0')).join('');
async function checkedModel(bytes,expected,name){
 if(!(bytes instanceof Uint8Array)||bytes.length<100000||bytes.length>30000000)
  throw Error('Invalid '+name+' ONNX model byte length');
 if(!globalThis.crypto?.subtle)throw Error('Secure-origin SHA-256 required to load local '+name+' model');
 const hash=toHex(await globalThis.crypto.subtle.digest('SHA-256',bytes));
 if(hash!==expected)throw Error(name+' ONNX integrity failed');
}
function contract(session,inputs,outputs,label){
 if(!session?.run||!session?.inputNames?.includes(inputs)||
    !outputs.every(x=>session.outputNames?.includes(x)))
  throw Error('Invalid '+label+' ONNX tensor contract');
}
export async function loadCPU478(ort,yunetModel,meshModel){
 if(!ort?.Tensor||!ort?.InferenceSession?.create)
  throw Error('onnxruntime-web CPU/WASM runtime missing');
 await checkedModel(yunetModel,YUNET_SHA256,'YuNet');
 await checkedModel(meshModel,CPU478_MODEL_SHA256,'478 landmark');
 let detector=null,landmarker=null;
 try{
  detector=await ort.InferenceSession.create(yunetModel,{executionProviders:['wasm']});
  landmarker=await ort.InferenceSession.create(meshModel,{executionProviders:['wasm']});
  contract(detector,'input',[8,16,32].flatMap(s=>
    ['cls','obj','bbox','kps'].map(name=>name+'_'+s)),'YuNet');
  contract(landmarker,'input_12',['Identity','Identity_1'],'478 landmark');
  return {
    detect:(rgba)=>runCPU478(ort,detector,landmarker,rgba),
    close:async()=>{await Promise.all([detector.release?.(),landmarker.release?.()]);}
  };
 }catch(e){
  await Promise.all([detector?.release?.(),landmarker?.release?.()]);
  throw e;
 }
}
/**
 * Actual inference with sessions already opened. The sessions may only have
 * been constructed from trusted, hash-verified local ONNX in production.
 */
export async function runCPU478(ort,detector,landmarker,rgba){
 if(!ort?.Tensor||!detector?.run||!landmarker?.run)
  throw Error('CPU sessions required');
 const pre=makeYuNetLetterbox(rgba);
 const d=await detector.run({
  input:new ort.Tensor('float32',pre.data,pre.dims)
 });
 const hits=decodeYuNet(d,{width:320,height:320,threshold:.45,nms:.30,maxFaces:10});
 if(hits.length===0)return {ok:false,reason:'no-face',faceCount:0};
 if(hits.length>1)return {ok:false,reason:'multiple-faces',faceCount:hits.length};
 if(hits[0].score<.55)return {ok:false,reason:'low-detection-confidence',faceCount:1};
 const face=yunetToSource(hits[0],pre.letterbox);
 const [fx,fy,fw,fh]=face.box;
 if(fw<rgba.width*.11||fh<rgba.height*.11)
  return {ok:false,reason:'face-too-small',faceCount:1};
 const roi=getMeshROI(face);
 const crop=makeMeshCrop(rgba,roi);
 const out=await landmarker.run({
  input_12:new ort.Tensor('float32',crop.data,crop.dims)
 });
 const mesh=decodeMesh478(out,roi);
 const gate=checkMeshTopology(mesh.points,rgba.width,rgba.height);
 if(!gate.ok)return {ok:false,reason:gate.reason,faceCount:1};
 return {
  ok:true,reason:'offline-cpu-478-valid',faceCount:1,
  points:mesh.points,confidence:mesh.confidence,
  detectionConfidence:hits[0].score,
  originalWidth:rgba.width,originalHeight:rgba.height,
  backend:'wasm-cpu',landmarkCount:478,
 };
}
