import test from 'node:test';
import assert from 'node:assert/strict';
import {
 makeYuNetLetterbox,yunetToSource,getMeshROI,roiToSource,sourceToROI,
 makeMeshCrop,decodeMesh478,checkMeshTopology,CPU478_MODEL_SHA256,
} from '../cpu478_geometry.mjs';

const almost=(a,b,tol=1e-5)=>assert.ok(Math.abs(a-b)<tol,String(a)+' != '+String(b));
function img(w=512,h=512){
 const a=new Uint8ClampedArray(w*h*4);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const i=4*(y*w+x);a.set([x%256,y%256,(x+y)%256,211],i);
 }
 return {width:w,height:h,data:a};
}
test('fixed SHA and native aspect preservation in 320px letterbox',()=>{
 assert.equal(CPU478_MODEL_SHA256.length,64);
 const p=img(512,256),a=makeYuNetLetterbox(p);
 assert.deepEqual(a.dims,[1,3,320,320]);
 assert.equal(a.letterbox.scale,.625);
 assert.equal(a.letterbox.y,80);
 assert.equal(a.data[0],0);
 const j=160*320+160,n=320*320;
 assert.ok(a.data[j]>0);
 assert.ok(a.data[n+j]>0);
});
test('detector boxes and 5 points are projected back from letterbox correctly',()=>{
 const p=img(640,320),{letterbox:l}=makeYuNetLetterbox(p);
 const f=yunetToSource({x:80,y:120,w:80,h:90,score:.9,
   landmarks:[[96,140],[144,140],[120,162],[104,190],[136,190]]},l);
 almost(f.box[0],160);almost(f.box[1],80);
 almost(f.box[2],160);almost(f.box[3],180);
 almost(f.landmarks[0][0],192);
});
test('rotated square ROI transform has <=1e-8px bidirectional error',()=>{
 const f={box:[150,100,240,220],landmarks:[[224,181],[335,203],[270,250],[245,295],[325,300]]};
 const roi=getMeshROI(f);
 assert.ok(roi.angle>.15);
 for(const p of [[0,0],[512,20],[255,180],[302,402]]){
  const c=sourceToROI(roi,...p),s=roiToSource(roi,...c);
  almost(s[0],p[0],1e-8);almost(s[1],p[1],1e-8);
 }
});
test('real NHWC RGB tensor is bounded and remains independent of display pixels',()=>{
 const source=img(),roi=getMeshROI({box:[180,165,150,160],landmarks:[[212,218],[302,215]]});
 const tensor=makeMeshCrop(source,roi);
 assert.deepEqual(tensor.dims,[1,256,256,3]);
 assert.equal(tensor.data.length,256*256*3);
 assert.ok(tensor.data.every(n=>n>=0&&n<=1));
 almost(tensor.data[3*(128*256+128)],Math.round(roi.center[0])%256/255,1/255);
});
test('478-point mesh output maps into native original photo and validates topology',()=>{
 const roi=getMeshROI({box:[175,168,170,160],landmarks:[[211,207],[312,211]]});
 const raw=new Float32Array(478*3);
 const set=(id,x,y)=>{raw[3*id]=x;raw[3*id+1]=y;};
 for(let i=0;i<478;i++)set(i,128,132);
 set(10,128,63);set(152,128,220);set(33,90,124);set(263,165,124);
 set(1,128,149);set(13,128,174);set(14,128,180);
 set(468,107,127);set(473,150,127);
 const result=decodeMesh478({Identity:{data:raw},Identity_1:{data:new Float32Array([15])}},roi);
 assert.equal(result.points.length,478);
 assert.ok(result.confidence>.99999);
 const topo=checkMeshTopology(result.points,512,512);
 assert.equal(topo.ok,true,topo.reason);
 const [px,py]=roiToSource(roi,128,149);
 almost(result.points[1][0],px);almost(result.points[1][1],py);
});
test('bad weights, low presence, off-frame and NaN fail closed',()=>{
 const roi=getMeshROI({box:[175,168,170,160],landmarks:[[211,207],[312,211]]});
 assert.throws(()=>decodeMesh478({Identity:{data:new Float32Array(20)},Identity_1:{data:new Float32Array([10])}},roi),/contract/);
 assert.throws(()=>decodeMesh478({Identity:{data:new Float32Array(1434)},Identity_1:{data:new Float32Array([-15])}},roi),/confidence/);
 assert.throws(()=>getMeshROI({box:[0,0,20,20],landmarks:[[2,2],[10,60]]}),/roll/);
 assert.equal(checkMeshTopology([],512,512).ok,false);
});
