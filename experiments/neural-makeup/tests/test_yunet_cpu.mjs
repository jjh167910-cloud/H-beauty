import test from 'node:test';
import assert from 'node:assert/strict';
import {imageToYuNetTensor,decodeYuNet,faceIoU,assessYuNetFaces} from '../yunet-cpu-core.mjs';
const W=320,H=320;
function empty(){
 const o={};for(const s of [8,16,32]){
  const n=W*H/(s*s);for(const [name,c] of [['cls',1],['obj',1],['bbox',4],['kps',10]])
   o[name+'_'+s]={data:new Float32Array(n*c),dims:[1,n,c]};
 }return o;
}
function face(o,stride,c,r,score=.9,w=64,h=72){
 const i=r*W/stride+c;
 o['cls_'+stride].data[i]=score;o['obj_'+stride].data[i]=score;
 o['bbox_'+stride].data.set([.5,.5,Math.log(w/stride),Math.log(h/stride)],i*4);
 o['kps_'+stride].data.set([-.15,-.12,.15,-.12,0,.1,-.1,.22,.1,.22],i*10);
}
test('BGR planar CPU input is exact and unnormalized',()=>{
 const a=new Uint8ClampedArray(32*32*4);a.set([40,90,170,255]);
 const t=imageToYuNetTensor(a,32,32);
 assert.deepEqual(t.dims,[1,3,32,32]);assert.deepEqual([t.data[0],t.data[1024],t.data[2048]],[170,90,40]);
});
test('regressed anchor coordinates and score match OpenCV convention',()=>{
 const o=empty();face(o,8,16,16,.81,64,80);const fs=decodeYuNet(o,{threshold:.5});
 assert.equal(fs.length,1);assert.ok(Math.abs(fs[0].score-.81)<1e-6);
 assert.ok(Math.abs(fs[0].x-(16.5*8-32))<1e-4);
 assert.ok(Math.abs(fs[0].w-64)<1e-4);
});
test('two people survive NMS but overlapping duplicates do not',()=>{
 const o=empty();face(o,16,4,9,.95,56,72);face(o,16,15,9,.92,56,72);
 face(o,8,9,18,.8,56,70);assert.equal(decodeYuNet(o).length,2);
});
test('wrong ONNX shape and photo input reject',()=>{
 const o=empty();delete o['cls_8'];assert.throws(()=>decodeYuNet(o),/mismatch/);
 assert.throws(()=>imageToYuNetTensor(new Uint8Array(5),32,32),/RGBA/);
 assert.throws(()=>decodeYuNet(empty(),{width:319}),/settings/);
});
test('single face is accepted and wrong/multiple faces rejected',()=>{
 const p=Array.from({length:478},()=>[160,160]);
 p[33]=[125,122];p[263]=[196,122];p[1]=[160,160];
 const f={x:95,y:85,w:140,h:150,score:.95,landmarks:[[125,122],[196,122],[160,160],[145,180],[178,180]]};
 assert.equal(assessYuNetFaces([f],p,W,H).ok,true);
 assert.equal(assessYuNetFaces([],p,W,H).reason,'no-face');
 assert.equal(assessYuNetFaces([f,{...f,x:250}],p,W,H).reason,'multiple-faces');
 const other={...f,landmarks:f.landmarks.map(([x,y])=>[x+85,y])};
 assert.equal(assessYuNetFaces([other],p,W,H).reason,'different-selected-face');
});
