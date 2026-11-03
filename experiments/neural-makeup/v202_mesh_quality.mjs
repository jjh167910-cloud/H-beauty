/**
 * H-Beauty v20.2 research: reject locally torn/stretched cosmetic mesh
 * triangles without changing the customer's underlying selfie pixels.
 * Matrix differential is source geometry × inverse(template geometry).
 *
 * This is a geometric safety test, not a perceptual quality model.
 */
const f=n=>Number.isFinite(n);
const p=v=>Array.isArray(v)&&v.length>=2&&f(v[0])&&f(v[1]);
export function measureTriangleWarp(a,b,c,u0,u1,u2,settings={}){
  if(![a,b,c,u0,u1,u2].every(p))return {valid:false,reason:'missing-coordinates'};
  const sdx=b[0]-a[0],sdy=b[1]-a[1],sex=c[0]-a[0],sey=c[1]-a[1];
  const tdx=u1[0]-u0[0],tdy=u1[1]-u0[1],tex=u2[0]-u0[0],tey=u2[1]-u0[1];
  const sourceDet=sdx*sey-sdy*sex,templateDet=tdx*tey-tdy*tex;
  if(!f(sourceDet)||!f(templateDet)||Math.abs(sourceDet)<1e-4||Math.abs(templateDet)<1e-4)
    return {valid:false,reason:'degenerate'};
  const orientation=settings.orientation===-1?-1:1;
  if(sourceDet*templateDet*orientation<=0)
    return {valid:false,reason:'folded'};
  const a00=(sdx*tey-sex*tdy)/templateDet;
  const a01=(-sdx*tex+sex*tdx)/templateDet;
  const a10=(sdy*tey-sey*tdy)/templateDet;
  const a11=(-sdy*tex+sey*tdx)/templateDet;
  const g00=a00*a00+a10*a10,g11=a01*a01+a11*a11,g01=a00*a01+a10*a11;
  const disc=Math.sqrt(Math.max(0,(g00-g11)**2+4*g01**2));
  const singularMax=Math.sqrt(Math.max(0,(g00+g11+disc)/2));
  const singularMin=Math.sqrt(Math.max(0,(g00+g11-disc)/2));
  const anisotropy=singularMax/Math.max(1e-10,singularMin);
  const scale=Math.sqrt(Math.abs(sourceDet/templateDet));
  const globalScale=Number(settings.globalScale??1);
  if(!f(globalScale)||globalScale<=0)return {valid:false,reason:'invalid-global-scale'};
  const relativeScale=scale/globalScale;
  if(!f(anisotropy)||!f(relativeScale)||anisotropy>4||relativeScale<.33||relativeScale>3)
    return {valid:false,reason:'stretched',anisotropy,relativeScale};
  return {valid:true,reason:'stable',anisotropy,relativeScale,scale};
}
