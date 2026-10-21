/* Offline-first shell and on-demand hairstyle image caching. */
const CACHE='h-beauty-v1';
const CORE=['/','/index.html','/manifest.webmanifest','/favicon.svg'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]));
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin) return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(res=>{if(res.ok)caches.open(CACHE).then(c=>c.put('/index.html',res.clone()));return res;}).catch(()=>caches.match('/index.html')));
    return;
  }
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{
    if(res.ok&&res.type==='basic')caches.open(CACHE).then(c=>c.put(req,res.clone()));
    return res;
  })));
});
