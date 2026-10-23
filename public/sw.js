/* H-Beauty offline shell: build step injects hashed app assets and cache identity.
 * Hairstyle photos are intentionally cached as viewed, not all preloaded. */
const PREFIX='h-beauty-';
const CACHE='h-beauty-v5-unbuilt';
const CORE=['/','/index.html','/manifest.webmanifest','/icons/favicon-32.png','/icons/icon-192.png','/icons/icon-512.png','/icons/apple-touch-icon.png','/icons/hananeh-signature.svg'];
const BUILD_ASSETS=[]; /* __H_BEAUTY_PRECACHE__ */

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE)
    .then(cache => cache.addAll([...new Set([...CORE,...BUILD_ASSETS])]))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys
      .filter(key => key.startsWith(PREFIX) && key !== CACHE)
      .map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req=event.request;
  if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin) return;
  if(req.mode==='navigate') {
    event.respondWith((async () => {
      try {
        const response=await fetch(req);
        if (response.ok) {
          try { (await caches.open(CACHE)).put('/index.html', response.clone()); }
          catch (error) { console.warn('Could not cache salon shell',error); }
        }
        return response;
      } catch (error) {
        const shell=await caches.match('/index.html');
        if (shell) return shell;
        throw error;
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cached=await caches.match(req);
    if (cached) return cached;
    const response=await fetch(req);
    if (response.ok && response.type==='basic') {
      try { await (await caches.open(CACHE)).put(req,response.clone()); }
      catch (error) { console.warn('Could not cache salon asset',error); }
    }
    return response;
  })());
});
