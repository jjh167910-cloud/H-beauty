import test from 'node:test';
import assert from 'node:assert/strict';
import {featherOutsideProtected} from '../v203_soft_protection.mjs';
test('legacy radius zero is byte-identical',()=>{
 const g=new Uint8Array(100);g[55]=1;
 const a=featherOutsideProtected(g,10,10,0);
 for(let i=0;i<100;i++)assert.equal(a[i],i===55?0:255);
});
test('iris and teeth optical core is never changed; outside border is soft',()=>{
 const w=25,h=25,g=new Uint8Array(w*h);g[12*w+12]=1;
 const a=featherOutsideProtected(g,w,h,6);
 assert.equal(a[12*w+12],0);
 assert.ok(a[12*w+13]>0&&a[12*w+13]<150);
 assert.ok(a[12*w+15]>a[12*w+13]);
 assert.equal(a[12*w+22],255);
});
test('the feather is symmetric in X and Y for a protected center pixel',()=>{
 const w=31,h=31,g=new Uint8Array(w*h);g[15*w+15]=1;
 const a=featherOutsideProtected(g,w,h,7);
 for(let j=0;j<=8;j++)assert.equal(a[15*w+15+j],a[(15+j)*w+15]);
});
test('a protected image edge retains exact original source pixels',()=>{
 const w=40,h=20,g=new Uint8Array(w*h);for(let i=0;i<w;i++)g[i]=1;
 const a=featherOutsideProtected(g,w,h,8);
 for(let i=0;i<w;i++)assert.equal(a[i],0);
 assert.equal(a[(h-1)*w+w-1],255);
});
test('bad dimensions and invalid radii fail closed',()=>{
 assert.throws(()=>featherOutsideProtected(new Uint8Array(2),5,5,5),/Invalid/);
 assert.throws(()=>featherOutsideProtected(new Uint8Array(25),5,5,Infinity),/Invalid/);
 assert.throws(()=>featherOutsideProtected(new Uint8Array(25),5,5,25),/Invalid/);
});