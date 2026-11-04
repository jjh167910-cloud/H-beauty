/** H-Beauty v20.4 research-only 19-class anatomy safety gate.
 * Protects source eye openings, eyebrows, hair, mouth, nose, clothing and
 * all regions except semantic skin (class 1), upper/lower lips (12/13).
 * Region-specific cosmetics are still controlled by the earlier 478 mesh.
 * This is NOT a cosmetic generator or biometric identity recognizer.
 */
const ALLOWED=new Set([1,12,13]);
function check(labels,w,h){
 if(!(labels instanceof Uint8Array)||!Number.isInteger(w)||!Number.isInteger(h)||
    w<64||h<64||w>1024||h>1024||labels.length!==w*h)
    throw Error('Invalid semantic labels');
 let skin=0,eyes=0,lips=0,invalid=0;
 for(const cls of labels){
  if(cls>18)invalid++;
  if(cls===1)skin++;
  if(cls===4||cls===5)eyes++;
  if(cls===12||cls===13)lips++;
 }
 if(invalid||skin<.045*w*h||eyes<.00012*w*h||lips<.00020*w*h)
  throw Error('Face parsing confidence insufficient for protection');
 return {skin,eyes,lips};
}
export function semanticOpacity(parsing,radius=2){
 const w=parsing?.width,h=parsing?.height,labels=parsing?.labels;
 check(labels,w,h);
 if(!Number.isFinite(radius)||radius<0||radius>8)throw Error('Invalid semantic edge radius');
 const n=w*h,mask=new Uint8Array(n),distance=new Uint16Array(n);
 distance.fill(32767);
 for(let i=0;i<n;i++)if(!ALLOWED.has(labels[i]))distance[i]=0;
 if(radius===0){
  for(let i=0;i<n;i++)mask[i]=ALLOWED.has(labels[i])?255:0;
  return mask;
 }
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const i=y*w+x;let d=distance[i];
  if(x>0)d=Math.min(d,distance[i-1]+3);
  if(y>0){
   d=Math.min(d,distance[i-w]+3);
   if(x>0)d=Math.min(d,distance[i-w-1]+4);
   if(x+1<w)d=Math.min(d,distance[i-w+1]+4);
  }
  distance[i]=d;
 }
 for(let y=h-1;y>=0;y--)for(let x=w-1;x>=0;x--){
  const i=y*w+x;let d=distance[i];
  if(x+1<w)d=Math.min(d,distance[i+1]+3);
  if(y+1<h){
   d=Math.min(d,distance[i+w]+3);
   if(x>0)d=Math.min(d,distance[i+w-1]+4);
   if(x+1<w)d=Math.min(d,distance[i+w+1]+4);
  }
  distance[i]=d;
 }
 for(let i=0;i<n;i++){
  if(!ALLOWED.has(labels[i]))continue;
  const t=Math.min(1,distance[i]/Math.max(.01,radius*3));
  mask[i]=Math.round(255*(t*t*(3-2*t)));
 }
 return mask;
}
export function applySemanticProtection(source,rendered,parsing,{radius=2}={}){
 const w=source?.width,h=source?.height;
 if(!Number.isInteger(w)||!Number.isInteger(h)||w<64||h<64||
    !(source.data instanceof Uint8ClampedArray)||
    !(rendered?.data instanceof Uint8ClampedArray)||
    rendered.width!==w||rendered.height!==h||
    source.data.length!==w*h*4||rendered.data.length!==source.data.length)
    throw Error('Source and render must have identical original RGBA dimensions');
 const skinStats=check(parsing?.labels,parsing?.width,parsing?.height);
 const matte=semanticOpacity(parsing,radius);
 const out=new Uint8ClampedArray(source.data);
 const pw=parsing.width,ph=parsing.height;
 let edited=0,protectedEdits=0,feathered=0;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const q=4*(y*w+x);
  if(rendered.data[q]===source.data[q]&&
     rendered.data[q+1]===source.data[q+1]&&
     rendered.data[q+2]===source.data[q+2])continue;
  const px=Math.min(pw-1,Math.floor((x+.5)*pw/w));
  const py=Math.min(ph-1,Math.floor((y+.5)*ph/h));
  const a=matte[py*pw+px]/255;
  if(a===0){protectedEdits++;continue}
  if(a<1)feathered++;
  let changed=false;
  for(let c=0;c<3;c++){
   out[q+c]=Math.round(source.data[q+c]+a*(rendered.data[q+c]-source.data[q+c]));
   if(out[q+c]!==source.data[q+c])changed=true;
  }
  if(changed)edited++;
 }
 return {width:w,height:h,data:out,edited,protectedEdits,feathered,
   semanticStatus:'protect-skin-lips',skinPixels:skinStats.skin};
}