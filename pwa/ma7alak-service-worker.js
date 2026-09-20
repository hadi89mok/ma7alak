/* SHOUFHON PWA SERVICE WORKER
   Live-first strategy:
   - never intercept page navigations
   - never cache Supabase/API traffic
   - never cache video/audio
   - only cache immutable commit-pinned ShoufHon JS/CSS
*/
"use strict";

const VERSION="m7-pwa-2026-09-20-8";
const IMMUTABLE_CACHE=VERSION+"-immutable";

self.addEventListener("install",event=>{
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys=>
        Promise.all(
          keys
            .filter(key=>key.startsWith("m7-pwa-")&&!key.startsWith(VERSION))
            .map(key=>caches.delete(key))
        )
      ),
      self.clients.claim()
    ])
  );
});

self.addEventListener("message",event=>{
  if(event.data&&event.data.type==="SKIP_WAITING"){
    self.skipWaiting();
  }
});

function isLiveBackend(url){
  const host=url.hostname.toLowerCase();
  return (
    host.endsWith(".supabase.co") ||
    host.includes("supabase") ||
    url.pathname.includes("/rest/v1/") ||
    url.pathname.includes("/realtime/") ||
    url.pathname.includes("/auth/v1/") ||
    url.pathname.includes("/storage/v1/")
  );
}

function isMa7alakImmutableCdn(url){
  return (
    url.hostname==="cdn.jsdelivr.net" &&
    /\/gh\/hadi89mok\/ma7alak@[0-9a-f]{40}\//i.test(url.pathname)
  );
}

async function immutableCacheFirst(request){
  const cache=await caches.open(IMMUTABLE_CACHE);
  const hit=await cache.match(request);
  if(hit) return hit;

  const response=await fetch(request);
  if(response&&(response.ok||response.type==="opaque")){
    cache.put(request,response.clone()).catch(()=>{});
  }
  return response;
}

self.addEventListener("fetch",event=>{
  const request=event.request;

  if(request.method!=="GET") return;

  const url=new URL(request.url);

  // IMPORTANT: let the browser load all page navigations directly from the live site.
  // This prevents an old/offline fallback page from appearing while the user is online.
  if(request.mode==="navigate") return;

  if(isLiveBackend(url)) return;

  if(request.destination==="video"||request.destination==="audio") return;

  if(
    isMa7alakImmutableCdn(url) &&
    (
      request.destination==="script" ||
      request.destination==="style" ||
      /\.(?:js|css)(?:$|\?)/i.test(url.pathname+url.search)
    )
  ){
    event.respondWith(
      immutableCacheFirst(request).catch(()=>fetch(request))
    );
  }
});