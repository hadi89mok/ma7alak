/* SHOUFHON PWA SERVICE WORKER
   Live-first strategy:
   - never intercept page navigations
   - never cache Supabase/API traffic
   - never cache video/audio
   - only cache immutable commit-pinned ShoufHon JS/CSS
   - receive Web Push for installed ShoufHon PWAs
*/
"use strict";

const VERSION="m7-pwa-2026-09-24-2";
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

function safePushPayload(event){
  if(!event.data){
    return {};
  }

  try{
    return event.data.json()||{};
  }catch(_){}

  try{
    return {
      body:event.data.text()
    };
  }catch(_){
    return {};
  }
}

function safeNotificationUrl(value){
  try{
    const url=
      new URL(
        String(value||"/"),
        self.location.origin
      );

    if(
      url.origin===
        self.location.origin ||
      url.hostname===
        "shoufhon.com" ||
      url.hostname===
        "www.shoufhon.com"
    ){
      return url.href;
    }
  }catch(_){}

  return self.location.origin+"/";
}

self.addEventListener("push",event=>{
  const payload=
    safePushPayload(event);

  const title=
    String(
      payload.title||
      "ShoufHon"
    );

  const options={
    body:String(
      payload.body||
      "New update on ShoufHon"
    ),
    icon:String(
      payload.icon||
      "/pwa-icon-192.png"
    ),
    badge:String(
      payload.badge||
      "https://cdn.jsdelivr.net/gh/hadi89mok/ma7alak@main/pwa/icon-badge-96.png"
    ),
    tag:String(
      payload.tag||
      "shoufhon-update"
    ),
    renotify:false,
    requireInteraction:false,
    data:{
      url:
        safeNotificationUrl(
          payload.url
        ),
      type:String(
        payload.type||""
      ),
      shop_slug:String(
        payload.shop_slug||""
      ),
      content_id:String(
        payload.content_id||""
      )
    }
  };

  if(payload.image){
    options.image=
      String(payload.image);
  }

  event.waitUntil(
    self.registration
      .showNotification(
        title,
        options
      )
  );
});

self.addEventListener("notificationclick",event=>{
  event.notification.close();

  const targetUrl=
    safeNotificationUrl(
      event.notification?.data?.url
    );

  event.waitUntil(
    (async()=>{
      const windows=
        await self.clients.matchAll({
          type:"window",
          includeUncontrolled:true
        });

      for(const client of windows){
        try{
          const current=
            new URL(client.url);

          if(
            current.origin===
            self.location.origin
          ){
            if(
              "navigate" in client
            ){
              await client.navigate(
                targetUrl
              );
            }

            return client.focus();
          }
        }catch(_){}
      }

      return self.clients.openWindow(
        targetUrl
      );
    })()
  );
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
