import test from 'node:test';
import assert from 'node:assert/strict';
import {runCPU478,loadCPU478} from '../cpu478_browser.mjs';

const W=512,H=512;
const picture=()=>{
 const rgba=new Uint8ClampedArray(W*H*4);
 for(let i=0;i<W*H;i++)rgba.set([148,128,112,255],4*i);
 return {width:W,height:H,data:rgba};
};
function yunet(second=false){
 const outputs={};
 for(const s of [8,16,32]){
  const n=320*320/(s*s);
  for(const [name,c] of [['cls',1],['obj',1],['bbox',4],['kps',10]])
   outputs[name+'_'+s]={data:new Float32Array(n*c),dims:[1,n,c]};
 }
 const mark=(c,row,score)=>{
  const s=16,i=row*20+c;
  outputs.cls_16.data[i]=score;
  outputs.obj_16.data[i]=score;
  outputs.bbox_16.data.set([.5,.5,Math.log(100/s),Math.log(120/s)],i*4);
  const cx=(c+.5)*s,cy=(row+.5)*s;
  const target=[[cx-22,cy-15],[cx+22,cy-15],[cx,cy+5],[cx-15,cy+23],[cx+15,cy+23]];
  const lm=target.flatMap(([x,y])=>[x/s-c,y/s-row]);
  outputs.kps_16.data.set(lm,i*10);
 };
 mark(10,9,.96);
 if(second)mark(1,8,.94);
 return outputs;
}
function mesh(){
 const raw=new Float32Array(1434);
 const set=(i,x,y)=>{raw[i*3]=x;raw[i*3+1]=y;};
 for(let i=0;i<478;i++)set(i,128,132);
 set(10,128,40);set(152,128,220);
 set(33,91,111);set(263,168,111);
 set(1,128,138);set(13,128,172);set(14,128,181);
 set(468,104,115);set(473,153,115);
 return {Identity:{data:raw},Identity_1:{data:new Float32Array([17])}};
}
const ort={Tensor:class{
 constructor(type,data,dims){assert.equal(type,'float32');this.data=data;this.dims=dims;}
}};
test('CPU pipeline accepts one face and returns 478 source-pixel landmarks',async()=>{
 let n=0;
 const d={run:async feeds=>{n++;assert.deepEqual(feeds.input.dims,[1,3,320,320]);return yunet();}};
 const m={run:async feeds=>{n++;assert.deepEqual(feeds.input_12.dims,[1,256,256,3]);return mesh();}};
 const r=await runCPU478(ort,d,m,picture());
 assert.equal(n,2);assert.equal(r.ok,true);assert.equal(r.landmarkCount,478);
 assert.equal(r.backend,'wasm-cpu');
 assert.equal(r.originalWidth,512);assert.equal(r.originalHeight,512);
 assert.ok(r.points[33][0]<r.points[263][0]);
});
test('CPU pipeline refuses multiple faces before running expensive mesh model',async()=>{
 let touched=false;
 const d={run:async()=>yunet(true)},m={run:async()=>{touched=true;return mesh()}};
 const r=await runCPU478(ort,d,m,picture());
 assert.equal(r.ok,false);assert.equal(r.reason,'multiple-faces');
 assert.equal(touched,false);
});
test('CPU pipeline refuses missing face and never touches mesh',async()=>{
 const d={run:async()=>yunet(false)};
 const z=yunet(false);z.cls_16.data.fill(0);
 let touched=false;
 const m={run:async()=>{touched=true;return mesh()}};
 const r=await runCPU478(ort,{run:async()=>z},m,picture());
 assert.equal(r.reason,'no-face');assert.equal(touched,false);
});
test('malformed mesh and invalid photos cannot return success',async()=>{
 const d={run:async()=>yunet()};
 const m={run:async()=>({Identity:{data:new Float32Array(2)},
   Identity_1:{data:new Float32Array([10])}})};
 await assert.rejects(()=>runCPU478(ort,d,m,picture()),/contract/);
 await assert.rejects(()=>runCPU478(ort,d,m,{width:30,height:20,data:new Uint8ClampedArray(2)}),/Invalid source/);
});
test('unsigned or altered model bytes fail before any ORT session is loaded',async()=>{
 let loaded=false;
 const fake={Tensor:ort.Tensor,InferenceSession:{create:async()=>{loaded=true;return {}}}};
 await assert.rejects(()=>loadCPU478(fake,new Uint8Array(160000),new Uint8Array(160000)),/integrity|SHA-256/);
 assert.equal(loaded,false);
});
