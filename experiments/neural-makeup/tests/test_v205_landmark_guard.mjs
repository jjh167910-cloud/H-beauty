import test from 'node:test';
import assert from 'node:assert/strict';
import {makeAnatomyAllow,makeAnatomyOpacity,applyLandmarkAnatomy} from '../v205_landmark_guard.mjs';
const W=512,H=512;
const groups={
 oval:[10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109],
 brow1:[70,63,105,66,107,55,65,52,53,46],brow2:[336,296,334,293,300,276,283,282,295,285],
 eye1:[33,7,163,144,145,153,154,155,133,173,157,158,159,160,161,246],
 eye2:[362,382,381,380,374,373,390,249,263,466,388,387,386,385,384,398],
 mouth:[78,95,88,178,87,14,317,402,318,324,308,415,310,311,312,13,82,81,80,191],
 nose:[168,6,217,45,49,64,98,97,2,326,327,294,279,275,437]
};
function fixture(){
 const pts=Array.from({length:478},()=>[256,256]);
 const ring=(ids,x,y,rx,ry)=>ids.forEach((id,j)=>{
  const a=2*Math.PI*j/ids.length-Math.PI/2;
  pts[id]=[x+rx*Math.cos(a),y+ry*Math.sin(a)];
 });
 ring(groups.oval,256,256,192,205);
 ring(groups.brow1,190,172,43,11);ring(groups.brow2,322,172,43,11);
 ring(groups.eye1,190,220,32,15);ring(groups.eye2,322,220,32,15);
 ring(groups.mouth,256,333,45,9);ring(groups.nose,256,279,21,30);
 pts[9]=[256,150];pts[6]=[256,250];pts[1]=[256,290];
 const a=new Uint8ClampedArray(W*H*4),b=new Uint8ClampedArray(W*H*4);
 for(let i=0;i<W*H;i++){a.set([100,134,165,213],i*4);b.set([60,205,80,85],i*4)}
 return {pts,src:{width:W,height:H,data:a},styled:{width:W,height:H,data:b}};
}
const sample=(bytes,x,y)=>[...bytes.slice(4*(y*W+x),4*(y*W+x)+4)];
test('exact source pixels outside face, eyes, brows, nose and mouth',()=>{
 const f=fixture(),out=applyLandmarkAnatomy(f.src,f.styled,f.pts);
 for(const [x,y] of [[10,10],[190,220],[322,220],[190,172],[322,172],[256,279],[256,333]])
  assert.deepEqual(sample(out.data,x,y),sample(f.src.data,x,y));
 assert.deepEqual(sample(out.data,190,295),[60,205,80,213]);
 assert.ok(out.blocked>0&&out.edited>0);
});
test('alpha bytes are identical to the original selfie',()=>{
 const f=fixture(),out=applyLandmarkAnatomy(f.src,f.styled,f.pts);
 for(let i=3;i<out.data.length;i+=4)assert.equal(out.data[i],213);
});
test('unchanged image input is exact identity',()=>{
 const f=fixture(),out=applyLandmarkAnatomy(f.src,f.src,f.pts);
 assert.deepEqual(out.data,f.src.data);assert.equal(out.edited,0);
});
test('soft feather never changes explicitly prohibited pixel',()=>{
 const f=fixture(),allow=makeAnatomyAllow(f.pts,W,H);
 const a=makeAnatomyOpacity(allow,W,H,{corePx:2,featherPx:5});
 for(let i=0;i<W*H;i++)if(!allow[i])assert.equal(a[i],0);
 assert.equal(a[295*W+190],255);
});
test('mirrored face retains equivalent left-right anatomical masks',()=>{
 const f=fixture(),flip=f.pts.map(([x,y])=>[W-x,y]);
 const a=makeAnatomyAllow(f.pts,W,H),b=makeAnatomyAllow(flip,W,H);
 for(let y=0;y<H;y++)for(let x=5;x<W-5;x+=25)
  assert.equal(a[y*W+x],b[y*W+W-1-x]);
});
test('invalid geometry and image sizes cannot pass silently',()=>{
 const f=fixture();
 assert.throws(()=>applyLandmarkAnatomy(f.src,f.styled,[]),/478 landmarks/);
 assert.throws(()=>applyLandmarkAnatomy(f.src,{...f.styled,width:300},f.pts),/same original/);
 assert.throws(()=>applyLandmarkAnatomy(f.src,f.styled,f.pts,{featherPx:100}),/Invalid protection/);
});
