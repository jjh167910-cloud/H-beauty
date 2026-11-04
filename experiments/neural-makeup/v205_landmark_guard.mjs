/** H-Beauty v20.5 research: anatomy protection using the existing 478-point
 * CPU face mesh. NO CelebAMask-derived segmentation weights, no network.
 * Conservative geometric region exclusion is NOT learned face parsing.
 */
const OVAL=[10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109];
const BROW_L=[70,63,105,66,107,55,65,52,53,46];
const BROW_R=[336,296,334,293,300,276,283,282,295,285];
const EYE_L=[33,7,163,144,145,153,154,155,133,173,157,158,159,160,161,246];
const EYE_R=[362,382,381,380,374,373,390,249,263,466,388,387,386,385,384,398];
const MOUTH=[78,95,88,178,87,14,317,402,318,324,308,415,310,311,312,13,82,81,80,191];
const NOSE=[168,6,217,45,49,64,98,97,2,326,327,294,279,275,437];
const REGIONS=[BROW_L,BROW_R,EYE_L,EYE_R,MOUTH,NOSE];
const point=p=>Array.isArray(p)&&p.length>=2&&Number.isFinite(p[0])&&Number.isFinite(p[1]);
function polygon(out,w,h,pts,ids,value){
 const a=ids.map(i=>pts[i]);if(!a.every(point))throw Error('Invalid face polygon landmarks');
 const y0=Math.max(0,Math.ceil(Math.min(...a.map(p=>p[1]))-.5));
 const y1=Math.min(h-1,Math.floor(Math.max(...a.map(p=>p[1]))-.5));
 for(let y=y0;y<=y1;y++){
  const xHits=[],cy=y+.5;
  for(let j=0;j<a.length;j++){
   const [ax,ay]=a[j],[bx,by]=a[(j+1)%a.length];
   if((ay<=cy&&by>cy)||(by<=cy&&ay>cy))xHits.push(ax+(cy-ay)*(bx-ax)/(by-ay));
  }
  xHits.sort((x,y)=>x-y);
  for(let j=0;j+1<xHits.length;j+=2){
   const left=Math.max(0,Math.ceil(xHits[j]-.5));
   const right=Math.min(w-1,Math.floor(xHits[j+1]-.5));
   if(left<=right)out.fill(value,y*w+left,y*w+right+1);
  }
 }
}
function capsule(out,w,h,a,b,r){
 if(!point(a)||!point(b)||!Number.isFinite(r)||r<1||r>w)throw Error('Invalid nasal geometry');
 const x0=Math.max(0,Math.floor(Math.min(a[0],b[0])-r));
 const x1=Math.min(w-1,Math.ceil(Math.max(a[0],b[0])+r));
 const y0=Math.max(0,Math.floor(Math.min(a[1],b[1])-r));
 const y1=Math.min(h-1,Math.ceil(Math.max(a[1],b[1])+r));
 const dx=b[0]-a[0],dy=b[1]-a[1],den=Math.max(1e-8,dx*dx+dy*dy);
 for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
  const px=x+.5,py=y+.5;
  const t=Math.max(0,Math.min(1,((px-a[0])*dx+(py-a[1])*dy)/den));
  if((px-a[0]-t*dx)**2+(py-a[1]-t*dy)**2<=r*r)out[y*w+x]=0;
 }
}
export function makeAnatomyAllow(points,width,height){
 if(!Array.isArray(points)||points.length<478||
    !Number.isInteger(width)||!Number.isInteger(height)||
    width<64||height<64||width>3072||height>3072)
  throw Error('Valid 478 landmarks and dimensions required');
 const mask=new Uint8Array(width*height);
 polygon(mask,width,height,points,OVAL,1);
 const area=mask.reduce((n,v)=>n+v,0);
 if(area<width*height*.05||area>width*height*.9)throw Error('Invalid face oval size');
 for(const ids of REGIONS)polygon(mask,width,height,points,ids,0);
 if(![9,6,1,33,263].every(i=>point(points[i])))throw Error('Missing nasal points');
 const eyeSpan=Math.hypot(points[33][0]-points[263][0],points[33][1]-points[263][1]);
 capsule(mask,width,height,points[9],points[6],eyeSpan*.09);
 capsule(mask,width,height,points[6],points[1],eyeSpan*.11);
 return mask;
}
export function makeAnatomyOpacity(allow,width,height,{corePx=2,featherPx=3}={}){
 if(!(allow instanceof Uint8Array)||allow.length!==width*height||
    !Number.isFinite(corePx)||corePx<0||corePx>16||
    !Number.isFinite(featherPx)||featherPx<0||featherPx>16)
  throw Error('Invalid protection or feather radius');
 const n=width*height,out=new Uint8Array(n);
 if(corePx===0&&featherPx===0){
  for(let i=0;i<n;i++)out[i]=allow[i]?255:0;
  return out;
 }
 const distance=new Uint16Array(n);distance.fill(32767);
 for(let i=0;i<n;i++)if(!allow[i])distance[i]=0;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const i=y*width+x;let d=distance[i];
  if(x>0)d=Math.min(d,distance[i-1]+3);
  if(y>0){
   d=Math.min(d,distance[i-width]+3);
   if(x>0)d=Math.min(d,distance[i-width-1]+4);
   if(x+1<width)d=Math.min(d,distance[i-width+1]+4);
  }distance[i]=d;
 }
 for(let y=height-1;y>=0;y--)for(let x=width-1;x>=0;x--){
  const i=y*width+x;let d=distance[i];
  if(x+1<width)d=Math.min(d,distance[i+1]+3);
  if(y+1<height){
   d=Math.min(d,distance[i+width]+3);
   if(x>0)d=Math.min(d,distance[i+width-1]+4);
   if(x+1<width)d=Math.min(d,distance[i+width+1]+4);
  }distance[i]=d;
 }
 const core=3*corePx,feather=Math.max(.03,3*featherPx);
 for(let i=0;i<n;i++){
  if(!allow[i])continue;
  const t=Math.max(0,Math.min(1,(distance[i]-core)/feather));
  out[i]=Math.round(255*(t*t*(3-2*t)));
 }
 return out;
}
export function applyLandmarkAnatomy(source,rendered,points,options={}){
 const w=source?.width,h=source?.height;
 if(!Number.isInteger(w)||!Number.isInteger(h)||w<64||h<64||w>3072||h>3072||
    !(source.data instanceof Uint8ClampedArray)||
    !(rendered?.data instanceof Uint8ClampedArray)||
    source.data.length!==w*h*4||rendered.width!==w||rendered.height!==h||
    rendered.data.length!==w*h*4)
  throw Error('Expected same original RGBA size');
 const matte=makeAnatomyOpacity(makeAnatomyAllow(points,w,h),w,h,options);
 const output=new Uint8ClampedArray(source.data);
 let edited=0,blocked=0,feathered=0;
 for(let i=0;i<w*h;i++){
  const q=4*i;
  if(source.data[q]===rendered.data[q]&&
     source.data[q+1]===rendered.data[q+1]&&
     source.data[q+2]===rendered.data[q+2])continue;
  const alpha=matte[i];
  if(alpha===0){blocked++;continue}
  if(alpha<255)feathered++;
  let touched=false;
  for(let c=0;c<3;c++){
   const v=Math.round(source.data[q+c]+alpha/255*(rendered.data[q+c]-source.data[q+c]));
   output[q+c]=v;if(v!==source.data[q+c])touched=true;
  }
  if(touched)edited++;
 }
 return {data:output,width:w,height:h,edited,blocked,feathered,
   protectedMethod:'landmark-geometry-no-celeba-weights'};
}
