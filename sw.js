/* QG DAS URNAS v236 — Service Worker para GitHub Pages */
const CACHE = 'qg-das-urnas-v236-static-1';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.ico',
  './icons/qg-icon-192.png',
  './icons/qg-icon-512.png',
  './icons/apple-touch-icon.png',
  './qg_intro_audio.mpeg'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req=event.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(req.mode==='navigate'){
    event.respondWith(fetch(req,{cache:'no-store'}).then(res=>{
      const copy=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy)).catch(()=>{});return res;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  if(url.origin===self.location.origin){
    event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{
      if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});}return res;
    })));
    return;
  }
  event.respondWith(fetch(req).catch(()=>caches.match(req)));
});
