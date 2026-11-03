import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateFaceGeometry,eyeSimilarity} from '../v198_geometry.js';
const W=256,H=256;
function template(){
 const p=Array.from({length:478},(_,i)=>[110+(i*7)%40,95+(i*11)%90]);
 Object.assign(p,{33:[79,114],263:[183,108],10:[128,34],152:[132,227],234:[57,157],454:[202,145],1:[132,148],13:[130,179],14:[132,185]});
 return p;
}
const warp=(p,{scale=1,roll=0,mirror=false,dx=0,dy=0}={})=>{
 const c=Math.cos(roll*Math.PI/180)*scale,s=Math.sin(roll*Math.PI/180)*scale;
 return p.map(([x,y])=>{
  const u=x-128,v=y-128;
  return [(mirror?-(c*u-s*v):c*u-s*v)+128+dx,(s*u+c*v)+128+dy];
 });
};
test('canonical and modestly transformed faces pass',()=>{
 const p=template();assert.equal(evaluateFaceGeometry(p,W,H).ok,true);
 assert.equal(evaluateFaceGeometry(warp(p,{scale:1.15,roll:13,dx:5,dy:-5}),W,H).ok,true);
});
test('scaled and rotated probe offsets follow the eye baseline',()=>{
 const p=template(),q=warp(p,{scale:1.15,roll:13,dx:5,dy:-5}),m=eyeSimilarity(p,q);
 assert.ok(m);assert.equal(m.reflected,false);
 const c=Math.cos(13*Math.PI/180)*1.15,s=Math.sin(13*Math.PI/180)*1.15;
 const [x,y]=m.offset(3,-5);
 assert.ok(Math.abs(x-(3*c+5*s))<1e-10);
 assert.ok(Math.abs(y-(3*s-5*c))<1e-10);
});
test('mirror selfies do not turn Y sampling upside down',()=>{
 const p=template(),q=warp(p,{mirror:true}),g=evaluateFaceGeometry(q,W,H),m=eyeSimilarity(p,q);
 assert.equal(g.ok,true);assert.equal(m.reflected,true);
 assert.deepEqual(m.offset(4,-3),[-4,-3]);
});
test('rejects off-frame, folded topology and excessive roll',()=>{
 let p=template();assert.equal(evaluateFaceGeometry(warp(p,{roll:55}),W,H).ok,false);
 p=template();p[33]=[500,120];assert.equal(evaluateFaceGeometry(p,W,H).reason,'out-of-frame');
 p=template();p[152]=[125,30];assert.equal(evaluateFaceGeometry(p,W,H).ok,false);
 p=template();p[454]=[60,145];assert.equal(evaluateFaceGeometry(p,W,H).ok,false);
});
