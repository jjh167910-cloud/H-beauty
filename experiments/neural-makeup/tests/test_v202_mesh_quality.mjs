import test from 'node:test';
import assert from 'node:assert/strict';
import {measureTriangleWarp} from '../v202_mesh_quality.mjs';
import {transferDetailAtlas} from '../v202_detail_atlas.js';

const T=[[0,0],[100,0],[0,100]];
function check(source,settings={}){
 return measureTriangleWarp(source[0],source[1],source[2],...T,settings);
}
test('identity, rotation and global scale preserve all stable cosmetic triangles',()=>{
 assert.equal(check(T).valid,true);
 const deg=27*Math.PI/180,scale=1.8,c=Math.cos(deg)*scale,s=Math.sin(deg)*scale;
 const transformed=T.map(([x,y])=>[c*x-s*y+20,s*x+c*y+40]);
 const r=check(transformed,{globalScale:scale});
 assert.equal(r.valid,true);
 assert.ok(Math.abs(r.anisotropy-1)<1e-6);
 assert.ok(Math.abs(r.relativeScale-1)<1e-6);
});
test('global mirror is allowed when the surrounding face is mirrored',()=>{
 const mirrored=T.map(([x,y])=>[100-x,y]);
 assert.equal(check(mirrored,{orientation:-1}).valid,true);
 assert.equal(check(mirrored).reason,'folded');
});
test('local folded/inverted and extreme shear are rejected before painting',()=>{
 const swapped=[T[0],T[2],T[1]];
 assert.equal(check(swapped).reason,'folded');
 const sheared=[[0,0],[100,0],[540,100]];
 const r=check(sheared);
 assert.equal(r.reason,'stretched');assert.ok(r.anisotropy>4);
});
test('unrealistic local scale is rejected relative to estimated global face scale',()=>{
 const enlarged=T.map(([x,y])=>[5*x,5*y]);
 assert.equal(check(enlarged,{globalScale:1}).reason,'stretched');
 assert.equal(check(enlarged,{globalScale:5}).valid,true);
});
test('bad or nonfinite geometry never passes',()=>{
 assert.equal(check([[0,0],[0,0],[1,1]]).valid,false);
 assert.equal(check([[0,0],[Infinity,0],[1,1]]).valid,false);
 assert.equal(check(T,{globalScale:0}).valid,false);
});
const W=256,H=256;
function fixture(){
 const pts=Array.from({length:478},(_,i)=>[112+(i*7)%40,95+(i*11)%90]);
 Object.assign(pts,{0:[5,5],2:[5,251],3:[251,5],33:[79,114],263:[183,108],10:[128,34],152:[132,227],234:[57,157],454:[202,145],1:[132,148],13:[130,179],14:[132,185]});
 const source=new Uint8ClampedArray(W*H*4);
 const atlas=new Uint8ClampedArray(W*H*4),mask=new Uint8ClampedArray(W*H*4);
 for(let i=0;i<W*H;i++){
   source.set([120,135,155,211],i*4);
   atlas.set([128,128,128,255],i*4);
   mask.set([0,0,0,255],i*4);
 }
 for(let y=45;y<73;y++)for(let x=42;x<75;x++){
   atlas.set([158,108,128,255],4*(y*W+x));
   mask.set([255,0,0,255],4*(y*W+x));
 }
 return {pts,source:{width:W,height:H,data:source},
   atlas:{width:W,height:H,data:atlas},region:{width:W,height:H,data:mask}};
}
const run=(f,p=f.pts)=>transferDetailAtlas(f.source,f.atlas,f.region,p,f.pts,[0,3,2],{eyes:1,lips:1,blush:1});
test('valid warp transfers pigment and preserves source pixels outside cosmetic mask',()=>{
 const f=fixture(),r=run(f),q=4*(55*W+55),background=4*(150*W+150);
 assert.ok(r.edited>0);assert.equal(r.stretchedTriangles,0);
 assert.deepEqual([...r.data.slice(q,q+4)],[180,95,155,211]);
 assert.deepEqual([...r.data.slice(background,background+4)],[120,135,155,211]);
});
test('implausible local warp skips pigment rather than creating giant fake lashes',()=>{
 const f=fixture(),pts=f.pts.map(p=>p.slice());
 pts[2]=[1200,251];
 const r=run(f,pts);
 assert.equal(r.stretchedTriangles,1);assert.equal(r.edited,0);
 assert.deepEqual(r.data,f.source.data);
});
