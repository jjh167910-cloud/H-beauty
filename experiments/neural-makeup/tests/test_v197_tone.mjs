import test from 'node:test';
import assert from 'node:assert/strict';
import {calibrateSkinTone,transferDetailAtlas} from '../v197_detail_atlas.js';
const W=64,H=64;
function fixture(){
 const base=new Uint8ClampedArray(W*H*4);
 const atlas=new Uint8ClampedArray(W*H*4);
 const regions=new Uint8ClampedArray(W*H*4);
 const mask=new Uint8ClampedArray(W*H*4);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const i=4*(y*W+x);
  base.set([65+x*2,42+y*2,50+x+y,195],i);
  atlas.set([128,128,128,255],i);
  regions.set([0,0,0,255],i);
  mask.set([255,255,255,255],i);
  if(x>=12&&x<=25&&y>=12&&y<=25){
   atlas.set([148,108,128,255],i);
   regions.set([255,0,0,255],i);
  }
 }
 const pts=Array.from({length:478},(_,i)=>[8+(i*7)%44,8+(i*13)%44]);
 pts[0]=[1,1];pts[1]=[60,1];pts[2]=[1,60];
 return {base:{width:W,height:H,data:base},atlas:{width:W,height:H,data:atlas},
  region:{width:W,height:H,data:regions},mask:{width:W,height:H,data:mask},pts};
}
function toned(f){
 const data=new Uint8ClampedArray(f.base.data);
 for(let i=0;i<data.length;i+=4)for(let c=0;c<3;c++)
  data[i+c]=Math.round(data[i+c]*.65+10);
 return {width:W,height:H,data};
}
const run=(f,src,extra={})=>transferDetailAtlas(
 src,f.atlas,f.region,f.pts,f.pts,[0,1,2],{eyes:1,lips:1,blush:1,...extra});
test('monotone, bounded makeup-free skin tone calibration',()=>{
 const f=fixture(),src=toned(f);
 const tone=calibrateSkinTone(src,f.base,f.mask,f.pts,f.pts);
 assert.equal(tone.valid,true);
 assert.ok(tone.sampleCount>=120);
 for(const lut of tone.luts){
  assert.equal(lut.length,256);
  for(let k=1;k<lut.length;k++)assert.ok(lut[k]>=lut[k-1]);
 }
 const old=run(f,src);
 const current=run(f,src,{toneSupport:{neutral:f.base,skinMask:f.mask}});
 assert.equal(current.toneCalibration.valid,true);
 const p=Array.from({length:W*H},(_,i)=>4*i).find(i=>old.data[i]-src.data[i]>=39);
 assert.notEqual(p,undefined);
 const corrected=current.data[p]-src.data[p];
 assert.ok(corrected>=23&&corrected<=29,'expected calibrated delta near 26');
});
test('missing stable skin calibration falls back and reports it',()=>{
 const f=fixture(),src=toned(f);
 f.mask.data.fill(0);
 const old=run(f,src);
 const current=run(f,src,{toneSupport:{neutral:f.base,skinMask:f.mask}});
 assert.equal(current.toneCalibration.valid,false);
 assert.equal(current.toneCalibration.reason,'insufficient-makeup-free-skin');
 assert.deepEqual(current.data,old.data);
});
test('zero-strength exact identity and original alpha/offmask protection',()=>{
 const f=fixture(),src=toned(f);
 const support={toneSupport:{neutral:f.base,skinMask:f.mask}};
 const zero=run(f,src,{...support,eyes:0,lips:0,blush:0});
 assert.deepEqual(zero.data,src.data);
 const current=run(f,src,support);
 for(let i=0;i<src.data.length;i+=4){
  if(f.region.data[i]===0)assert.deepEqual(
   [...current.data.slice(i,i+3)],[...src.data.slice(i,i+3)]);
  assert.equal(current.data[i+3],src.data[i+3]);
 }
});
