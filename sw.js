const CACHE='helm-v5';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'];
const CDNS=['cdnjs.cloudflare.com','cdn.jsdelivr.net'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET')return;
  if(CDNS.includes(u.hostname)){
    // viewer libraries: cache after first load so documents open offline
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok)caches.open(CACHE).then(c=>c.put(r,res.clone()));return res})));
    return;
  }
  if(u.origin!==location.origin)return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>{
    const net=fetch(r).then(res=>{if(res.ok)caches.open(CACHE).then(c=>c.put(r,res.clone()));return res}).catch(()=>hit);
    return hit||net;
  }));
});
