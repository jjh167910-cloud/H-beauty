import test from 'node:test';
import assert from 'node:assert/strict';
import {semanticOpacity,applySemanticProtection} from '../v204_semantic_gate.mjs';
const w=128,h=128;
function fix(){
 const labels=new Uint8Array(w*h).fill(1);
 for(let y=1;y<30;y++)for(let x=1;x<80;x++)labels[y*w+x]=17;
 for(let y=45;y<53;y++)for(let x=31;x<48;x++)labels[y*w+x]=4;
 for(let y=45;y<53;y++)for(let x=80;x<98;x++)labels[y*w+x]=5;
 for(let y=40;y<44;y++)for(let x=31;x<52;x++)labels[y*w+x]=2;
 for(let y=87;y<101;y++)for(let x=49;x<85;x++)labels[y*w+x]=12;
 for(let y=94;y<98;y++)for(let x=55;x<81;x++)labels[y*w+x]=11;
 const original=new Uint8ClampedArray(w*h*4),edited=new Uint8ClampedArray(w*h*4);
 for(let i=0;i<w*h;i++){
  original.set([110,130,165,211],i*4);
  edited.set([25,45,240,99],i*4);
 }
 return {parsing:{width:w,height:h,labels},
  source:{width:w,height:h,data:original},
  result:{width:w,height:h,data:edited}};
}
const pix=(a,x,y)=>[...a.data.slice(4*(y*w+x),4*(y*w+x)+4)];
test('eye, brow, hair and inner mouth are exact source bytes',()=>{
 const f=fix(),r=applySemanticProtection(f.source,f.result,f.parsing,{radius:2});
 for(const [x,y] of [[10,10],[40,49],[41,42],[67,96]])
  assert.deepEqual(pix(r,x,y),pix(f.source,x,y));
 assert.deepEqual(pix(r,115,66),[25,45,240,211]);
 assert.ok(r.protectedEdits>1000);
});
test('semantic edge feather has a smooth shoulder but never edits forbidden class',()=>{
 const f=fix(),matte=semanticOpacity(f.parsing,2);
 assert.equal(matte[49*w+40],0);
 assert.ok(matte[49*w+48]>0&&matte[49*w+48]<255);
 assert.equal(matte[70*w+111],255);
});
test('no change in original channel alpha, even for fully allowed skin',()=>{
 const f=fix(),r=applySemanticProtection(f.source,f.result,f.parsing);
 for(let i=3;i<r.data.length;i+=4)assert.equal(r.data[i],211);
});
test('garbled model labels fail closed, cannot silently show unprotected result',()=>{
 const f=fix();f.parsing.labels.fill(0);
 assert.throws(()=>applySemanticProtection(f.source,f.result,f.parsing),/confidence insufficient/);
});
test('source and render size mismatch is rejected',()=>{
 const f=fix();f.result.height=130;
 assert.throws(()=>applySemanticProtection(f.source,f.result,f.parsing),/identical original/);
});
