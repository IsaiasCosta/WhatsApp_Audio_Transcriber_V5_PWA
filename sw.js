const CACHE='whatsapp-transcriber-v5-shell-17';
const SHELL=['./','./index.html','./manifest.webmanifest','./assets/css/styles.css','./assets/icons/icon.svg','./js/main.js','./js/audio/decode.js','./js/text/revision.js','./js/transcription/whisper.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.origin!==self.location.origin||e.request.method!=='GET')return;

  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(res=>{
      if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
      return res;
    }).catch(()=>caches.match(e.request).then(hit=>hit||caches.match('./index.html'))));
    return;
  }

  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{
    if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
    return res;
  })));
});



