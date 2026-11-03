/**
 * H-Beauty v20.3 (research-only): pixel-exact protected eye/mouth cores with
 * anti-aliased optical makeup boundaries. No trained model or customer data.
 * Uses bounded 3/4 chamfer distance, O(width*height), deterministic on CPU.
 */
export function featherOutsideProtected(guard,width,height,radiusPx=6){
  if(!(guard instanceof Uint8Array)||guard.length!==width*height||
     !Number.isInteger(width)||!Number.isInteger(height)||
     width<1||height<1||!Number.isFinite(radiusPx)||radiusPx<0||radiusPx>24)
    throw Error('Invalid protection map or feather radius');
  const n=width*height,out=new Uint8Array(n);
  if(radiusPx===0){
    for(let i=0;i<n;i++)out[i]=guard[i]?0:255;
    return out;
  }
  const cutoff=Math.ceil((radiusPx+1)*3),distance=new Uint8Array(n);
  distance.fill(Math.min(cutoff,254));
  for(let i=0;i<n;i++)if(guard[i])distance[i]=0;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const i=y*width+x;let d=distance[i];
    if(x>0)d=Math.min(d,distance[i-1]+3);
    if(y>0){
      d=Math.min(d,distance[i-width]+3);
      if(x>0)d=Math.min(d,distance[i-width-1]+4);
      if(x<width-1)d=Math.min(d,distance[i-width+1]+4);
    }
    distance[i]=Math.min(d,254);
  }
  for(let y=height-1;y>=0;y--)for(let x=width-1;x>=0;x--){
    const i=y*width+x;let d=distance[i];
    if(x<width-1)d=Math.min(d,distance[i+1]+3);
    if(y<height-1){
      d=Math.min(d,distance[i+width]+3);
      if(x>0)d=Math.min(d,distance[i+width-1]+4);
      if(x<width-1)d=Math.min(d,distance[i+width+1]+4);
    }
    distance[i]=Math.min(d,254);
  }
  const denom=Math.max(1,radiusPx*3);
  for(let i=0;i<n;i++){
    if(guard[i]){out[i]=0;continue}
    const t=Math.max(0,Math.min(1,(distance[i]-.25)/denom));
    out[i]=Math.round(255*(t*t*(3-2*t)));
  }
  return out;
}