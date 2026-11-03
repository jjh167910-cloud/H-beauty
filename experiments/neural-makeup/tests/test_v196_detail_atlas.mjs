import test from 'node:test';
import assert from 'node:assert/strict';
import {transferDetailAtlas} from '../v196_detail_atlas.js';
const W=64,H=64;
function fixture(){
  const src=new Uint8ClampedArray(W*H*4),diff=src.slice(),map=src.slice();
  for(let i=0;i<W*H;i++){
    src.set([120,130,140,203],i*4);
    diff.set([128,128,128,255],i*4);
    map.set([0,0,0,255],i*4);
  }
  for(let y=12;y<26;y++)for(let x=12;x<26;x++){
    diff.set([158,108,128,255],(y*W+x)*4);
    map.set([255,0,0,255],(y*W+x)*4);
  }
  const pts=Array.from({length:478},()=>[-100,-100]);
  pts[0]=[1,1];pts[1]=[60,1];pts[2]=[1,60];
  return {source:{data:src,width:W,height:H},atlas:{data:diff,width:W,height:H},
    region:{data:map,width:W,height:H},pts};
}
function run(f,srcPoints=f.pts,strengths={eyes:1,lips:1,blush:1}){
  return transferDetailAtlas(f.source,f.atlas,f.region,srcPoints,f.pts,[0,1,2],strengths);
}
test('source identity and alpha remain pixel exact outside makeup geometry',()=>{
  const f=fixture(),r=run(f),a=(15*W+15)*4,b=(30*W+30)*4;
  assert.deepEqual([...r.data.slice(a,a+4)],[180,90,140,203]);
  assert.deepEqual([...r.data.slice(b,b+4)],[120,130,140,203]);
  for(let j=3;j<r.data.length;j+=4)assert.equal(r.data[j],203);
});
test('zero-intensity mode returns byte-for-byte original source',()=>{
  const f=fixture(),r=run(f,f.pts,{eyes:0,lips:0,blush:0});
  assert.deepEqual(r.data,f.source.data);assert.equal(r.edited,0);
});
test('landmark shift moves makeup rather than using fixed coordinates',()=>{
  const f=fixture(),shifted=f.pts.map(p=>p[0]<0?p:[p[0]+9,p[1]+10]);
  const r=run(f,shifted);
  assert.deepEqual([...r.data.slice((25*W+24)*4,(25*W+24)*4+4)],[180,90,140,203]);
  assert.deepEqual([...r.data.slice((15*W+15)*4,(15*W+15)*4+4)],[120,130,140,203]);
});
test('region selection and invalid inputs fail closed',()=>{
  const f=fixture();
  assert.equal(run(f,f.pts,{eyes:0,lips:1,blush:1}).edited,0);
  assert.throws(()=>run(f,f.pts,{eyes:NaN,lips:1,blush:1}),/strength/);
  assert.throws(()=>transferDetailAtlas(f.source,f.atlas,{...f.region,width:50},f.pts,f.pts,[0,1,2]),/Invalid region map|sizes/);
});
