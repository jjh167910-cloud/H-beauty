import test from 'node:test';
import assert from 'node:assert/strict';
import {
  relativeCosmeticLuminance,
  referencePixelSample,
  protectedRGBA,
} from '../v194_matte_kernel.mjs';

test('self-reference has mathematically zero luminance transfer',()=>{
  for(const y of [0,12,50,128,200,255]) {
    for(const skin of [20,100,180]) {
      const result=relativeCosmeticLuminance(y,skin,y,skin,1,1,1);
      assert.equal(result,0);
    }
  }
});

test('reference sample aligns integer pixel centers',()=>{
  for(const x of [0,1,20,159,500]) {
    const [u,v]=referencePixelSample(x+.5,x+40.5);
    assert.equal(u,x);
    assert.equal(v,x+40);
  }
});

test('hard outside-mask gate retains all original RGBA bytes',()=>{
  const original=new Uint8ClampedArray([49,82,133,230]);
  const generated=new Uint8ClampedArray([240,10,25,100]);
  assert.strictEqual(protectedRGBA(original,generated,0),original);
  const changed=protectedRGBA(original,generated,.4);
  assert.equal(changed[3],230);
});

test('cosmetic lum correction is bounded, region-specific and opt-out',()=>{
  assert.equal(relativeCosmeticLuminance(120,150,20,140,0,0,0),0);
  assert.equal(relativeCosmeticLuminance(120,150,20,140,1,0,0),-46);
  assert.equal(relativeCosmeticLuminance(120,150,20,140,0,1,0),-25);
  assert.equal(relativeCosmeticLuminance(120,150,20,140,0,0,1),-12);
  assert.equal(relativeCosmeticLuminance(120,150,255,140,1,1,1),24);
});

test('reject non-finite strengths and sample coordinates',()=>{
  assert.throws(()=>relativeCosmeticLuminance(20,40,60,80,2),/Expected/);
  assert.throws(()=>relativeCosmeticLuminance(NaN,40,60,80,1),/Expected/);
  assert.throws(()=>referencePixelSample(Infinity,0),/Invalid/);
  assert.throws(()=>protectedRGBA([1,2,3,4],[2,3,4,5],-1),/required/);
});
