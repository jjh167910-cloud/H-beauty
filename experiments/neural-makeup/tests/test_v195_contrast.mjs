import test from 'node:test';
import assert from 'node:assert/strict';
import {referenceContrastDelta,exactOutsideMask} from '../v195_contrast_kernel.mjs';
import {relativeCosmeticLuminance} from '../v194_matte_kernel.mjs';

test('no effect and same-reference skin contrast are exact positive zero',()=>{
  assert.equal(referenceContrastDelta(100,120,20,120,0,0,0),0);
  for(const value of [0,20,80,140,220]){
    assert.equal(referenceContrastDelta(value,150,value,150,1,1,1),0);
  }
});
test('strong eye makeup has increased dark-range compared with v19.4',()=>{
  const previous=relativeCosmeticLuminance(160,180,35,180,1,0,0);
  const next=referenceContrastDelta(160,180,35,180,1,0,0);
  assert.equal(previous,-46);
  assert.equal(next,-82);
});
test('lips can be darker than v19.4 without affecting other regions',()=>{
  assert.equal(referenceContrastDelta(160,180,40,180,0,1,0),-46);
  assert.equal(referenceContrastDelta(160,180,40,180,0,0,0),0);
});
test('hard clamps forbid unbounded transfer and keep neutral RGBA protected',()=>{
  assert.equal(referenceContrastDelta(180,180,-1000,180,1,1,1),-82);
  assert.equal(referenceContrastDelta(0,50,1000,50,1,1,1),30);
  const src=new Uint8ClampedArray([41,95,130,205]);
  const model=new Uint8ClampedArray([230,5,30,100]);
  assert.strictEqual(exactOutsideMask(src,model,0),src);
  assert.deepEqual([...exactOutsideMask(src,model,1)],[230,5,30,205]);
});
test('reject invalid pixels/weights',()=>{
  assert.throws(()=>referenceContrastDelta(NaN,0,40,0,1,0,0),/Non-finite/);
  assert.throws(()=>referenceContrastDelta(0,0,40,0,1.2,0,0),/Non-finite/);
  assert.throws(()=>exactOutsideMask([1,2,3,4],[1,2,3,4],Infinity),/Expected/);
});
