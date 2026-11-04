/**
 * H-Beauty v19.6. Research-only offline makeup detail atlas.
 * Loads signed RGB makeup deltas and maps them to a new face with its own
 * landmark geometry; does not copy reference identity pixels.
 */
const LIP_IN=[78,191,80,81,82,13,312,311,310,415,308,324,318,402,317,14,87,178,88,95];
const EYE_OPENINGS=[[33,160,158,133,153,144],[362,385,387,263,373,380]];
const clip=(n,lo,hi)=>Math.min(hi,Math.max(lo,n));
const okPoint=p=>p&&Number.isFinite(p[0])&&Number.isFinite(p[1]);
function checkImage(v,label){
  if(!v||!Number.isInteger(v.width)||!Number.isInteger(v.height)||
    v.width<=0||v.height<=0||v.width>3072||v.height>3072||
    !(v.data instanceof Uint8ClampedArray)&&!(v.data instanceof Uint8Array)||
    v.data.length!==v.width*v.height*4)throw Error('Invalid '+label+' RGBA image');
}
function sampleByte(image,x,y,channel){
  const xx=clip(x,0,image.width-1),yy=clip(y,0,image.height-1);
  const x0=Math.floor(xx),y0=Math.floor(yy);
  const x1=Math.min(image.width-1,x0+1),y1=Math.min(image.height-1,y0+1);
  const dx=xx-x0,dy=yy-y0,d=image.data,w=image.width;
  const a=d[4*(y0*w+x0)+channel],b=d[4*(y0*w+x1)+channel];
  const c=d[4*(y1*w+x0)+channel],e=d[4*(y1*w+x1)+channel];
  return a*(1-dx)*(1-dy)+b*dx*(1-dy)+c*(1-dx)*dy+e*dx*dy;
}
function inside(poly,x,y){
  let yes=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const a=poly[i],b=poly[j];
    if(((a[1]>y)!==(b[1]>y))&&
      x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])yes=!yes;
  }
  return yes;
}
function opticalGuard(points,w,h){
  const guard=new Uint8Array(w*h);
  for(const ids of [...EYE_OPENINGS,LIP_IN]){
    if(!ids.every(i=>okPoint(points[i])))throw Error('Missing optical landmark');
    const poly=ids.map(i=>points[i]);
    let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    for(const [x,y] of poly){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}
    const pad=3;
    for(let y=Math.max(0,Math.floor(minY-pad));y<=Math.min(h-1,Math.ceil(maxY+pad));y++){
      for(let x=Math.max(0,Math.floor(minX-pad));x<=Math.min(w-1,Math.ceil(maxX+pad));x++){
        if(inside(poly,x+.5,y+.5)){
          for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){
            if(x+dx>=0&&x+dx<w&&y+dy>=0&&y+dy<h)guard[(y+dy)*w+(x+dx)]=1;
          }
        }
      }
    }
  }
  return guard;
}
export function transferDetailAtlas(source,deltaAtlas,regionMap,sourcePoints,templatePoints,triangles,options={}){
  checkImage(source,'source');checkImage(deltaAtlas,'atlas');checkImage(regionMap,'region map');
  if(deltaAtlas.width!==regionMap.width||deltaAtlas.height!==regionMap.height)
    throw Error('Atlas and region map sizes differ');
  if(!Array.isArray(sourcePoints)||!Array.isArray(templatePoints)||
     sourcePoints.length<468||templatePoints.length<468||
     !Array.isArray(triangles)||triangles.length<3||triangles.length%3!==0||
     triangles.length>15000)throw Error('Valid face mesh required');
  const strengths=[Number(options.eyes??.92),Number(options.lips??.92),Number(options.blush??.4)];
  if(!strengths.every(v=>Number.isFinite(v)&&v>=0&&v<=1))throw Error('Invalid cosmetic strengths');
  const output=new Uint8ClampedArray(source.data);
  if(strengths.every(v=>v===0))return {data:output,width:source.width,height:source.height,edited:0};
  const w=source.width,h=source.height,aw=deltaAtlas.width,ah=deltaAtlas.height;
  const guard=opticalGuard(sourcePoints,w,h);
  const visited=new Uint8Array(w*h);
  let edited=0;
  for(let t=0;t<triangles.length;t+=3){
    const [ia,ib,ic]=triangles.slice(t,t+3);
    const a=sourcePoints[ia],b=sourcePoints[ib],c=sourcePoints[ic];
    const u0=templatePoints[ia],u1=templatePoints[ib],u2=templatePoints[ic];
    if(![a,b,c,u0,u1,u2].every(okPoint))continue;
    const dx=b[0]-a[0],dy=b[1]-a[1],ex=c[0]-a[0],ey=c[1]-a[1],det=dx*ey-dy*ex;
    if(Math.abs(det)<1e-4)continue;
    const x0=Math.max(0,Math.floor(Math.min(a[0],b[0],c[0])));
    const x1=Math.min(w-1,Math.ceil(Math.max(a[0],b[0],c[0])));
    const y0=Math.max(0,Math.floor(Math.min(a[1],b[1],c[1])));
    const y1=Math.min(h-1,Math.ceil(Math.max(a[1],b[1],c[1])));
    if(x0>x1||y0>y1)continue;
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
      const index=y*w+x;
      if(visited[index]||guard[index])continue;
      const px=x+.5-a[0],py=y+.5-a[1];
      const u=(px*ey-py*ex)/det,v=(py*dx-px*dy)/det;
      if(u<-.0001||v<-.0001||u+v>1.0001)continue;
      const rx=u0[0]+u*(u1[0]-u0[0])+v*(u2[0]-u0[0])-.5;
      const ry=u0[1]+u*(u1[1]-u0[1])+v*(u2[1]-u0[1])-.5;
      if(rx<0||ry<0||rx>=aw||ry>=ah)continue;
      const strength=Math.max(...strengths.map((s,k)=>s*sampleByte(regionMap,rx,ry,k)/255));
      if(strength<=.006)continue;
      visited[index]=1;
      const q=index*4;let any=false;
      for(let channel=0;channel<3;channel++){
        const delta=2*(sampleByte(deltaAtlas,rx,ry,channel)-128);
        const next=clip(Math.round(source.data[q+channel]+strength*delta),0,255);
        if(next!==source.data[q+channel])any=true;
        output[q+channel]=next;
      }
      if(any)edited++;
    }
  }
  return {data:output,width:w,height:h,edited};
}
export async function loadDetailAtlas(styleId,assetRoot='./detail-atlas/'){
  if(!/^[a-z0-9-]{2,48}$/.test(styleId))throw Error('Invalid style id');
  const resources=await Promise.all([
    fetch(assetRoot+'atlas/'+styleId+'.png',{cache:'force-cache'}),
    fetch(assetRoot+'regions.png',{cache:'force-cache'}),
    fetch(assetRoot+'template-points.json',{cache:'force-cache'}),
  ]);
  if(resources.some(r=>!r.ok))throw Error('Offline detail atlas asset not available');
  const [style,region,points]=resources;
  async function canvasData(res){
    const blob=await res.blob(),bmp=await createImageBitmap(blob);
    try{
      const canvas=document.createElement('canvas');canvas.width=bmp.width;canvas.height=bmp.height;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(bmp,0,0);
      return ctx.getImageData(0,0,canvas.width,canvas.height);
    }finally{bmp.close?.();}
  }
  const [atlasImage,regionImage,meta]=await Promise.all([canvasData(style),canvasData(region),points.json()]);
  if(meta?.schema!=='hbeauty.detail.atlas.v1'||meta.width!==atlasImage.width||meta.height!==atlasImage.height||
     !Array.isArray(meta.points)||meta.points.length<468)throw Error('Invalid local template metadata');
  return {atlasImage,regionImage,templatePoints:meta.points};
}
