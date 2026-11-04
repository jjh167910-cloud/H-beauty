import test from 'node:test';
import assert from 'node:assert/strict';
import {transferDetailAtlas} from '../v198_detail_atlas.js';
const W=256,H=256;
function fixture(){
 const p=Array.from({length:478},(_,i)=>[112+(i*7)%40,95+(i*11)%90]);
 Object.assign(p,{0:[5,5],2:[5,251],3:[251,5],33:[79,114],263:[183,108],10:[128,34],152:[132,227],234:[57,157],454:[202,145],1:[132,148],13:[130,179],14:[132,185]});
 const src=new Uint8ClampedArray(W*H*4),atlas=new Uint8ClampedArray(src.length),mask=new Uint8ClampedArray(src.length);
 for(let i=0;i<W*H;i++){src.set([120,135,155,211],i*4);atlas.set([128,128,128,255],i*4);mask.set([0,0,0,255],i*4)}
 for(let y=45;y<73;y++)for(let x=42;x<75;x++){atlas.set([158,108,128,255],4*(y*W+x));mask.set([255,0,0,255],4*(y*W+x))}
 return {p,source:{width:W,height:H,data:src},atlas:{width:W,height:H,data:atlas},mask:{width:W,height:H,data:mask},tri:[0,3,2]};
}
const run=(f,points=f.p,options={})=>transferDetailAtlas(f.source,f.atlas,f.mask,points,f.p,f.tri,{eyes:1,lips:1,blush:1,...options});
test('valid atlas transfer edits cosmetics but retains unaffected RGBA',()=>{
 const f=fixture(),r=run(f);
 assert.ok(r.edited>0);
 assert.deepEqual([...r.data.slice(4*(50*W+50),4*(50*W+50)+4)],[180,95,155,211]);
 assert.deepEqual([...r.data.slice(4*(150*W+150),4*(150*W+150)+4)],[120,135,155,211]);
 for(let i=3;i<r.data.length;i+=4)assert.equal(r.data[i],211);
});
test('global face mirroring is permitted, not mistaken for a local foldover',()=>{
 const f=fixture(),pts=f.p.map(([x,y])=>[W-x,y]),r=run(f,pts);
 assert.ok(r.edited>0);assert.equal(r.foldedTriangles,0);
});
test('local triangle inversion skips the bad mapping entirely',()=>{
 const f=fixture(),pts=f.p.map(p=>p.slice());
 [pts[0],pts[3]]=[pts[3],pts[0]];
 const r=run(f,pts);
 assert.equal(r.edited,0);assert.equal(r.foldedTriangles,1);
 assert.deepEqual(r.data,f.source.data);
});
test('invalid face geometry rejects with structured error',()=>{
 const f=fixture(),pts=f.p.map(p=>p.slice());pts[33]=[W+120,100];
 assert.throws(()=>run(f,pts),e=>e.code==='HBEAUTY_FACE_GEOMETRY'&&e.reason==='out-of-frame');
});
test('zero-strength is an exact no-op even with an invalid photo',()=>{
 const f=fixture(),pts=f.p.map(p=>p.slice());pts[33]=[-100,100];
 const out=run(f,pts,{eyes:0,lips:0,blush:0});
 assert.deepEqual(out.data,f.source.data);
});
