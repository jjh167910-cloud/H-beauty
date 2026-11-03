import test from 'node:test';
import assert from 'node:assert/strict';
import {transferDetailAtlas as original} from '../v202_detail_atlas.js';
import {transferDetailAtlas as enhanced,loadDetailAtlas} from '../v203_detail_atlas.js';

function fixture(){
 const width=256,height=256,n=width*height;
 const photo=new Uint8ClampedArray(4*n),atlas=new Uint8ClampedArray(4*n),region=new Uint8ClampedArray(4*n);
 for(let i=0;i<n;i++){
  photo.set([120,135,155,211],i*4);
  atlas.set([128,128,128,255],i*4);
  region.set([0,0,0,255],i*4);
 }
 for(let y=45;y<75;y++)for(let x=42;x<78;x++){
  atlas.set([96,115,190,255],4*(y*width+x));
  region.set([255,0,0,255],4*(y*width+x));
 }
 const pts=Array.from({length:478},(_,i)=>[112+(i*7)%40,95+(i*11)%90]);
 Object.assign(pts,{0:[5,5],2:[5,251],3:[251,5],33:[79,114],263:[183,108],10:[128,34],152:[132,227],234:[57,157],454:[202,145],1:[132,148],13:[130,179],14:[132,185]});
 const img=(data)=>({width,height,data});
 return {src:img(photo),atlas:img(atlas),region:img(region),pts,tri:[0,3,2]};
}
const run=(engine,f,opts={})=>engine(f.src,f.atlas,f.region,f.pts,f.pts,f.tri,{eyes:1,lips:1,blush:1,...opts});
test('original finish is byte-for-byte compatible with v20.2',()=>{
 const f=fixture(),before=run(original,f),after=run(enhanced,f,{edgeFeatherPx:0});
 assert.deepEqual(after.data,before.data);
 assert.equal(after.edited,before.edited);
});
test('soft finish keeps original resolution and alpha and never changes source beyond editable regions',()=>{
 const f=fixture(),result=run(enhanced,f,{edgeFeatherPx:5});
 assert.equal(result.width,256);assert.equal(result.height,256);
 assert.ok(result.edited>0);
 for(let i=0;i<f.src.data.length;i+=4){
  assert.equal(result.data[i+3],211);
 }
 const outside=4*(150*256+150);
 assert.deepEqual([...result.data.slice(outside,outside+4)], [120,135,155,211]);
});
test('invalid finish parameters fail closed without changing any source image',()=>{
 const f=fixture(),originalPhoto=new Uint8ClampedArray(f.src.data);
 assert.throws(()=>run(enhanced,f,{edgeFeatherPx:NaN}),/Invalid optical/);
 assert.throws(()=>run(enhanced,f,{edgeFeatherPx:40}),/Invalid optical/);
 assert.deepEqual(f.src.data,originalPhoto);
});
test('only known local style asset variants may be selected',async()=>{
 await assert.rejects(()=>loadDetailAtlas('electric-blue','./detail-atlas/','unknown'),/Unknown cosmetic/);
});