import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateFaceCount} from '../face-safety-core.mjs';
const W=810,H=1080;
function selected(){
 const pts=Array.from({length:478},()=>[400,540]);
 pts[1]=[400,535];pts[33]=[310,500];pts[263]=[490,500];
 return pts;
}
const face=(p=selected())=>Array.from({length:478},(_,i)=>({x:p[i][0]/W,y:p[i][1]/H,z:0}));
test('single matching face is permitted',()=>{
 const r=evaluateFaceCount({faceLandmarks:[face()]},selected(),W,H);
 assert.equal(r.ok,true);assert.equal(r.faceCount,1);
});
test('two people are rejected, not silently rendered onto first',()=>{
 const a=face(),b=face().map(p=>({...p,x:p.x+.1}));
 assert.equal(evaluateFaceCount({faceLandmarks:[a,b]},selected(),W,H).reason,'multiple-faces');
});
test('no face and malformed result are rejected',()=>{
 assert.equal(evaluateFaceCount({faceLandmarks:[]},selected(),W,H).reason,'no-face');
 assert.equal(evaluateFaceCount(null,selected(),W,H).reason,'invalid-detector-output');
});
test('wrong selected face is rejected even if the detector finds one',()=>{
 const shifted=face().map(p=>({...p,x:p.x+.26}));
 assert.equal(evaluateFaceCount({faceLandmarks:[shifted]},selected(),W,H).reason,'different-selected-face');
});
test('eye-span disagreement rejects wrong scale',()=>{
 const altered=face();altered[33]={...altered[33],x:altered[1].x-.02};
 altered[263]={...altered[263],x:altered[1].x+.02};
 assert.equal(evaluateFaceCount({faceLandmarks:[altered]},selected(),W,H).reason,'different-selected-face');
});
test('invalid user landmarks and partial detector result fail closed',()=>{
 assert.equal(evaluateFaceCount({faceLandmarks:[face()]},[],W,H).reason,'invalid-selection');
 const bad=face();delete bad[263];
 assert.equal(evaluateFaceCount({faceLandmarks:[bad]},selected(),W,H).reason,'missing-landmarks');
});
