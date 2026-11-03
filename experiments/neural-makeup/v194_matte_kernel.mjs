/**
 * Original mathematical reference kernel for v19.4 perceptual cosmetic matte.
 * Pure JS, no face photos, no network, no pretrained model weights.
 *
 * For commercial release the real DOM/browser implementation and its model
 * assets require additional validation on actual Android devices.
 */
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));

export function relativeCosmeticLuminance(
  sourcePixelY,sourceSkinY,referencePixelY,referenceSkinY,
  eyeOpacity=0,lipOpacity=0,cheekOpacity=0,
){
  const v=[sourcePixelY,sourceSkinY,referencePixelY,referenceSkinY,
    eyeOpacity,lipOpacity,cheekOpacity];
  if(!v.every(Number.isFinite) ||
      ![eyeOpacity,lipOpacity,cheekOpacity].every(x=>x>=0&&x<=1)){
    throw Error('Expected finite luminance and normalized cosmetic strengths');
  }
  // Canonical no-effect path: return +0 (not negative zero).
  if(eyeOpacity===0&&lipOpacity===0&&cheekOpacity===0)return 0;
  const rel=(referencePixelY-referenceSkinY)-
            (sourcePixelY-sourceSkinY);
  return clamp(
    clamp(rel*eyeOpacity*.78,-46,18)+
    clamp(rel*lipOpacity*.48,-25,20)+
    clamp(rel*cheekOpacity*.20,-12,8),
    -48,24,
  );
}

/**
 * Barycentric vertices are pixel-centre indexed (x+.5,y+.5).
 * Image sampling is array-pixel indexed (integer x,y).
 * This corrected offset avoids unintended self-reference blur.
 */
export function referencePixelSample(refX,refY){
  if(!Number.isFinite(refX)||!Number.isFinite(refY))
    throw Error('Invalid reference-coordinate value');
  return [refX-.5,refY-.5];
}

/** Hard pixel gate: return exact original RGBA when no cosmetic mask exists. */
export function protectedRGBA(sourceRGBA, predictedRGBA, maskOpacity){
  if(sourceRGBA?.length!==4||predictedRGBA?.length!==4||
      !Number.isFinite(maskOpacity)||maskOpacity<0||maskOpacity>1)
    throw Error('RGBA and mask opacity required');
  if(maskOpacity===0)return sourceRGBA;
  return new Uint8ClampedArray([
    Math.round(predictedRGBA[0]),Math.round(predictedRGBA[1]),
    Math.round(predictedRGBA[2]),sourceRGBA[3],
  ]);
}
