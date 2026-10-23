import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { finalizeServiceWorker } from '../scripts/finalize-service-worker.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE = readFileSync(join(ROOT, 'public/sw.js'), 'utf8');

function simulate(source = TEMPLATE) {
  const handlers = new Map(), stores = new Map(), deleted = [];
  const CACHE = source.match(/const CACHE='([^']+)'/)?.[1];
  const caches = {
    open: async name => {
      if (!stores.has(name)) stores.set(name,new Map());
      const entries=stores.get(name);
      return {
        addAll: async urls => { for(const path of urls) entries.set(path,{ok:true,body:path}); },
        put: async (req,res) => entries.set(typeof req === 'string' ? req : req.url,res),
      };
    },
    keys: async () => [...stores.keys()],
    delete: async name => { deleted.push(name);return stores.delete(name); },
    match: async req => {
      const path=typeof req==='string'?req:req.url;
      for(const entries of stores.values()) if(entries.has(path))return entries.get(path);
    },
  };
  const fetch = async () => { throw new Error('offline'); };
  const self = {
    location:{origin:'https://salon.test'},
    addEventListener:(name,handler)=>handlers.set(name,handler),
    skipWaiting:async()=>{}, clients:{claim:async()=>{}},
  };
  runInNewContext(source,{self,caches,fetch,console,URL,Promise});
  const trigger=(kind,request)=>{
    let response;
    handlers.get(kind)({request,waitUntil:p=>response=p,respondWith:p=>response=p});
    return response;
  };
  return {CACHE,deleted,stores,trigger};
}

test('installer caches HTML, manifest and vector/raster brand assets',async()=>{
  const app=simulate();await app.trigger('install');
  for(const path of ['/','/index.html','/manifest.webmanifest',
    '/icons/hananeh-signature.svg','/icons/icon-192.png','/icons/icon-512.png',
    '/icons/apple-touch-icon.png'])assert.ok(app.stores.get(app.CACHE).has(path),path);
});

test('activation removes obsolete H-Beauty caches but preserves foreign caches',async()=>{
  const app=simulate();
  app.stores.set('h-beauty-v4',new Map());
  app.stores.set('other-project-data',new Map());
  await app.trigger('install');await app.trigger('activate');
  assert.equal(app.stores.has('h-beauty-v4'),false);
  assert.equal(app.stores.has('other-project-data'),true);
  assert.equal(app.stores.has(app.CACHE),true);
});

test('offline navigation returns cached application HTML',async()=>{
  const app=simulate();await app.trigger('install');
  const result=await app.trigger('fetch',{
    method:'GET',url:'https://salon.test/#/looks',mode:'navigate',
  });
  assert.equal(result.body,'/index.html');
});

function fixture(testBody) {
  const folder=mkdtempSync(join(tmpdir(),'hananeh-offline-'));
  mkdirSync(join(folder,'assets'));
  const put=(path,bytes)=>writeFileSync(join(folder,path),bytes);
  put('index.html','<html><script type="module" src="/assets/app.js"></script></html>');
  put('sw.js',TEMPLATE);
  put('assets/app.js','console.log("beauty")');
  put('assets/style.css','body{direction:rtl}');
  put('assets/font.woff2','dummy-font');
  try{return testBody({folder,put});}finally{rmSync(folder,{recursive:true,force:true});}
}

test('production finalizer explicitly precaches compiled JS, CSS and fonts',async()=>fixture(async({folder})=>{
  const output=finalizeServiceWorker(folder);
  assert.ok(output.version.startsWith('h-beauty-v5-'));
  for(const url of ['/assets/app.js','/assets/style.css','/assets/font.woff2'])
    assert.ok(output.urls.includes(url),url);
  assert.ok(!output.urls.some(path=>path.startsWith('/looks/')));
  const app=simulate(readFileSync(join(folder,'sw.js'),'utf8'));
  await app.trigger('install');
  for(const url of output.urls)assert.ok(app.stores.get(app.CACHE).has(url),url);
}));

test('new asset content creates a distinct cache version',()=>fixture(({folder,put})=>{
  const first=finalizeServiceWorker(folder).version;
  put('assets/app.js','console.log("new release")');
  put('sw.js',TEMPLATE);
  const second=finalizeServiceWorker(folder).version;
  assert.notEqual(first,second);
}));

test('production finalizer fails closed without build placeholders',()=>fixture(({folder,put})=>{
  put('sw.js','const CACHE="not-a-real-template"');
  assert.throws(()=>finalizeServiceWorker(folder),/placeholders/);
}));
