/**
 * Experimental v19.8 geometry admissibility and alignment.
 * Landmarks cannot detect occlusion, cosmetic coverage, spoofing, identity.
 */
const P={leftEye:33,rightEye:263,nose:1,forehead:10,chin:152,leftCheek:234,rightCheek:454,upperLip:13,lowerLip:14};
const pointValid=p=>Array.isArray(p)&&p.length>=2&&Number.isFinite(p[0])&&Number.isFinite(p[1]);
const length=(x,y)=>Math.hypot(x,y);
const fail=(reason,details={})=>({ok:false,reason,...details});
export function evaluateFaceGeometry(points,width,height){
 if(!Array.isArray(points)||points.length<468||!Number.isInteger(width)||!Number.isInteger(height)||width<64||height<64)return fail('invalid-input');
 const d={};
 for(const [name,id] of Object.entries(P)){
  const p=points[id];if(!pointValid(p))return fail('missing-landmark',{landmark:id});
  if(p[0]<-width*.05-1.5||p[0]>width*1.05+1.5||p[1]<-height*.05-1.5||p[1]>height*1.05+1.5)return fail('out-of-frame',{landmark:id});
  d[name]=p;
 }
 const le=d.leftEye,re=d.rightEye,n=d.nose;
 const vx=re[0]-le[0],vy=re[1]-le[1],eyeSpan=length(vx,vy);
 const cheeks=length(d.rightCheek[0]-d.leftCheek[0],d.rightCheek[1]-d.leftCheek[1]);
 const faceHeight=length(d.chin[0]-d.forehead[0],d.chin[1]-d.forehead[1]);
 if(eyeSpan<Math.max(16,width*.09)||eyeSpan>width*.95||cheeks<width*.18||cheeks>width*1.15||faceHeight<height*.19||faceHeight>height*1.15)return fail('face-size',{eyeSpan,cheeks,faceHeight});
 const roll=Math.atan2(vy,vx)*180/Math.PI;
 const rollMod=((roll+90)%180+180)%180-90;
 if(Math.abs(rollMod)>33)return fail('excessive-roll',{rollDeg:rollMod});
 const noseAlong=((n[0]-le[0])*vx+(n[1]-le[1])*vy)/(eyeSpan*eyeSpan);
 if(noseAlong<.07||noseAlong>.93)return fail('extreme-pose-or-bad-fit',{noseAlong});
 const eyeMidY=(le[1]+re[1])/2;
 if(d.forehead[1]>eyeMidY+faceHeight*.18||d.chin[1]<eyeMidY+faceHeight*.12||d.upperLip[1]<eyeMidY-faceHeight*.07||d.lowerLip[1]<d.upperLip[1]-faceHeight*.04)return fail('inconsistent-landmark-topology');
 return {ok:true,reason:'geometry-valid',eyeSpan,faceHeight,rollDeg:rollMod,noseAlong};
}
export function eyeSimilarity(templatePoints,sourcePoints){
 if(!Array.isArray(templatePoints)||!Array.isArray(sourcePoints)||![templatePoints[33],templatePoints[263],sourcePoints[33],sourcePoints[263]].every(pointValid))return null;
 const t0=templatePoints[33],t1=templatePoints[263],s0=sourcePoints[33],s1=sourcePoints[263];
 const tx=t1[0]-t0[0],ty=t1[1]-t0[1],sx=s1[0]-s0[0],sy=s1[1]-s0[1],d=tx*tx+ty*ty;
 if(d<256)return null;
 const tv0=templatePoints[10],tv1=templatePoints[152],sv0=sourcePoints[10],sv1=sourcePoints[152];
 if(![tv0,tv1,sv0,sv1].every(pointValid))return null;
 const tc=tx*(tv1[1]-tv0[1])-ty*(tv1[0]-tv0[0]);
 const sc=sx*(sv1[1]-sv0[1])-sy*(sv1[0]-sv0[0]);
 if(Math.abs(tc)<1e-4||Math.abs(sc)<1e-4)return null;
 const reflected=tc*sc<0;
 const a=reflected?(sx*tx-sy*ty)/d:(sx*tx+sy*ty)/d;
 const b=reflected?(sy*tx+sx*ty)/d:(sy*tx-sx*ty)/d;
 const scale=Math.hypot(a,b);if(!Number.isFinite(scale)||scale<.35||scale>3.3)return null;
 return {scale,a,b,reflected,offset:reflected?((x,y)=>[a*x+b*y,b*x-a*y]):((x,y)=>[a*x-b*y,b*x+a*y])};
}