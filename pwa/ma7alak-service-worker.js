/* MA7ALAK PWA SERVICE WORKER
   Safe strategy:
   - live backend/API traffic stays network-only
   - videos/audio stay network-only
   - page navigations stay network-first and are not stored as stale HTML
   - only PWA shell + immutable commit-pinned Ma7alak JS/CSS are cached
*/
"use strict";

const VERSION="m7-pwa-2026-09-19-1";
const CORE_CACHE=VERSION+"-core";
const IMMUTABLE_CACHE=VERSION+"-immutable";
const OFFLINE_URL="/pwa-offline";

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CORE_CACHE).then(cache=>
      cache.addAll([
        OFFLINE_URL,
        "/pwa-icon-192.svg",
        "/pwa-icon-512.svg",
        "/pwa-icon-maskable.svg"
      ])
    ).catch(()=>{})
  );
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

  if(hit){
    return hit;
  }

  const response=await fetch(request);

  if(
    response &&
    (
      response.ok ||
      response.type==="opaque"
    )
  ){
    cache.put(request,response.clone()).catch(()=>{});
  }

  return response;
}

self.addEventListener("fetch",event=>{
  const request=event.request;

  if(request.method!=="GET"){
    return;
  }

  const url=new URL(request.url);

  if(isLiveBackend(url)){
    event.respondWith(fetch(request));
    return;
  }

  if(
    request.destination==="video" ||
    request.destination==="audio"
  ){
    event.respondWith(fetch(request));
    return;
  }

  if(request.mode==="navigate"){
    event.respondWith(
      fetch(request).catch(async()=>{
        return (
          await caches.match(OFFLINE_URL) ||
          new Response(
            "Ma7alak is offline.",
            {
              status:503,
              headers:{
                "Content-Type":"text/plain; charset=utf-8"
              }
            }
          )
        );
      })
    );
    return;
  }

  if(
    url.origin===self.location.origin &&
    (
      url.pathname==="/pwa-icon-192.svg" ||
      url.pathname==="/pwa-icon-512.svg" ||
      url.pathname==="/pwa-icon-maskable.svg" ||
      url.pathname==="/pwa-offline"
    )
  ){
    event.respondWith(
      caches.match(request).then(hit=>
        hit ||
        fetch(request).then(response=>{
          if(response.ok){
            caches.open(CORE_CACHE).then(cache=>
              cache.put(request,response.clone())
            ).catch(()=>{});
          }

          return response;
        })
      )
    );
    return;
  }

  if(
    isMa7alakImmutableCdn(url) &&
    (
      request.destination==="script" ||
      request.destination==="style" ||
      /\.(?:js|css)(?:$|\?)/i.test(url.pathname+url.search)
    )
  ){
    event.respondWith(
      immutableCacheFirst(request)
        .catch(()=>fetch(request))
    );
    return;
  }

  // Everything else keeps normal browser/network behavior.
});