import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';

const dir=dirname(fileURLToPath(import.meta.url));
const source=readFileSync(resolve(dir, '../reference-hybrid.js'), 'utf8')
  .replace(/^import [^\n]+\n/gm, '')
  .replace('export async function transferReferenceHybrid', 'async function transferReferenceHybrid');

function harness({paint,transfer}={}) {
  const calls=[];
  const fake=document => document;
  const mockedDocument={
    createElement(type){
      assert.equal(type,'canvas');
      return {
        width:0,height:0,
        getContext(type){
          assert.equal(type,'2d');
          return {drawImage:(image)=>calls.push(['identityCopy',image])};
        },
      };
    },
  };
  const paintLook=paint || (async (src,id,level)=>{
    calls.push(['paint',src,id,level]);
    return {width:64,height:80};
  });
  const transferReference=transfer || ((detailed,points,photo,refPoints,triangles,intensities)=>{
    calls.push(['transfer',detailed,points,photo,refPoints,triangles,intensities]);
    return {width:64,height:80};
  });
  const create=new Function('paintLook','transferReference','document',
    source+'\nreturn transferReferenceHybrid;');
  return {run:create(paintLook,transferReference,mockedDocument),calls};
}

function fixtures(){
  return {
    source:{photo:{width:64,height:80},points:[[1,1]]},
    reference:{photo:{width:64,height:80},points:[[2,2]]},
    triangles:[0,1,2],
    params:{preset:'electric-blue',level:'bold',eyes:.88,lips:.9,blush:.4},
  };
}

test('hybrid always paints the ORIGINAL identity before transferring style colors',async()=>{
  const t=harness();
  const f=fixtures();
  const out=await t.run(f.source,f.reference,f.triangles,f.params);
  assert.equal(out.renderer,'offline-hybrid');
  assert.equal(t.calls[0][0],'paint');
  assert.strictEqual(t.calls[0][1],f.source);
  assert.equal(t.calls[0][2],'electric-blue');
  assert.equal(t.calls[0][3],'bold');
  assert.equal(t.calls[1][0],'transfer');
  assert.strictEqual(t.calls[1][2],f.source.points);
  assert.strictEqual(t.calls[1][3],f.reference.photo);
  assert.strictEqual(t.calls[1][4],f.reference.points);
  assert.deepEqual(t.calls[1][6],{eyes:.88,lips:.9,blush:.4});
});

test('zero-strength is pixel-identity request and skips both cosmetic renderers',async()=>{
  const t=harness();const f=fixtures();
  const out=await t.run(f.source,f.reference,f.triangles,{...f.params,eyes:0,lips:0,blush:0});
  assert.equal(out.renderer,'identity');
  assert.deepEqual(t.calls.map(x=>x[0]),['identityCopy']);
  assert.strictEqual(t.calls[0][1],f.source.photo);
  assert.equal(out.canvas.width,64);
  assert.equal(out.canvas.height,80);
});

test('invalid intensities, image sizes and unknown presets fail closed',async()=>{
  const t=harness();const f=fixtures();
  await assert.rejects(t.run(f.source,f.reference,f.triangles,{...f.params,eyes:1.1}),/Invalid intensity/);
  await assert.rejects(t.run(f.source,f.reference,f.triangles,{...f.params,preset:'../../evil'}),/supported detailed/);
  await assert.rejects(t.run({...f.source,photo:{width:0,height:80}},f.reference,f.triangles,f.params),/Unsupported/);
  assert.equal(t.calls.length,0);
});

test('wrong-size paint result fails before reference transfer',async()=>{
  const t=harness({paint:async()=>({width:32,height:32})});const f=fixtures();
  await assert.rejects(t.run(f.source,f.reference,f.triangles,f.params),/dimensions/);
  assert.equal(t.calls.length,0);
});
