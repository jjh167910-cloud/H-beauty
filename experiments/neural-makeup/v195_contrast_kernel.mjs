/**
 * H-Beauty v19.5 conservative region-aware high-contrast matte kernel.
 * Exact numerical formulation used in the separately built experimental UI
 * (reference-transfer-v21.js); this pure helper has no portrait/model assets.
 */
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));

export function referenceContrastDelta(
  sourceY,sourceSkinY,referenceY,referenceSkinY,
  eyeStrength=0,lipStrength=0,cheekStrength=0,
){
  const arr=[sourceY,sourceSkinY,referenceY,referenceSkinY,
             eyeStrength,lipStrength,cheekStrength];
  if (!arr.every(Number.isFinite) ||
      ![eyeStrength,lipStrength,cheekStrength].every(v=>v>=0&&v<=1)){
    throw new TypeError('Non-finite luminance or invalid normalized mask strength');
  }
  if(eyeStrength===0&&lipStrength===0&&cheekStrength===0)return 0;
  const r=(referenceY-referenceSkinY)-(sourceY-sourceSkinY);
  const eye=clamp(r*eyeStrength*1.05,-82,26);
  const lip=clamp(r*lipStrength*.80,-46,25);
  const cheek=clamp(r*cheekStrength*.24,-14,10);
  return clamp(eye+lip+cheek,-82,30);
}

/**
 * This module does not apply skin tint or change pixel alpha. Upstream must
 * mask eyes/lips/cheeks, exclude irises/teeth, and preserve untouched RGBA.
 */
export function exactOutsideMask(sourceRGBA, predictedRGBA, maskOpacity){
  if(sourceRGBA?.length!==4||predictedRGBA?.length!==4||
     !Number.isFinite(maskOpacity)||maskOpacity<0||maskOpacity>1)
    throw new TypeError('Expected RGBA bytes and finite mask opacity');
  if(maskOpacity===0)return sourceRGBA;
  const out=new Uint8ClampedArray(4);
  for(let k=0;k<3;k++)out[k]=predictedRGBA[k];
  out[3]=sourceRGBA[3];
  return out;
}
