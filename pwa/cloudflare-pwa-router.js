/*
  MA7ALAK PWA — CLOUDFLARE ROUTER

  Deploy this Worker only on the PWA asset routes.
  Normal Ma7alak pages remain on Hostinger.
*/

const SOURCE_BASE=
  "https://raw.githubusercontent.com/hadi89mok/ma7alak/main/pwa/";

const FILES={
  "/manifest.webmanifest":"manifest.webmanifest",
  "/sw.js":"ma7alak-service-worker.js",
  "/pwa-icon-192.svg":"icon-192.svg",
  "/pwa-icon-512.svg":"icon-512.svg",
  "/pwa-icon-maskable.svg":"icon-maskable.svg",
  "/pwa-offline":"offline.html"
};

const CONTENT_TYPES={
  "/manifest.webmanifest":"application/manifest+json; charset=utf-8",
  "/sw.js":"text/javascript; charset=utf-8",
  "/pwa-icon-192.svg":"image/svg+xml; charset=utf-8",
  "/pwa-icon-512.svg":"image/svg+xml; charset=utf-8",
  "/pwa-icon-maskable.svg":"image/svg+xml; charset=utf-8",
  "/pwa-offline":"text/html; charset=utf-8"
};

export default {
  async fetch(request){

    const url=new URL(request.url);
    const file=FILES[url.pathname];

    if(!file){
      return fetch(request);
    }

    const upstream=await fetch(
      SOURCE_BASE+
      file+
      "?v="+
      Date.now(),
      {
        headers:{
          "User-Agent":
            "Ma7alak-PWA-Worker/1.0"
        },
        cf:{
          cacheEverything:false,
          cacheTtl:0
        }
      }
    );

    if(!upstream.ok){
      return new Response(
        "Ma7alak PWA asset unavailable",
        {
          status:502,
          headers:{
            "Content-Type":
              "text/plain; charset=utf-8",

            "Cache-Control":
              "no-store"
          }
        }
      );
    }

    const headers=
      new Headers();

    headers.set(
      "Content-Type",
      CONTENT_TYPES[url.pathname] ||
      upstream.headers.get(
        "Content-Type"
      ) ||
      "application/octet-stream"
    );

    headers.set(
      "X-Content-Type-Options",
      "nosniff"
    );

    headers.set(
      "Access-Control-Allow-Origin",
      "*"
    );

    if(
      url.pathname==="/sw.js"
    ){
      headers.set(
        "Cache-Control",
        "no-cache, no-store, must-revalidate"
      );

      headers.set(
        "Service-Worker-Allowed",
        "/"
      );
    }
    else if(
      url.pathname===
      "/manifest.webmanifest"
    ){
      headers.set(
        "Cache-Control",
        "no-cache, max-age=0"
      );
    }
    else if(
      url.pathname.startsWith(
        "/pwa-icon-"
      )
    ){
      headers.set(
        "Cache-Control",
        "public, max-age=86400"
      );
    }
    else{
      headers.set(
        "Cache-Control",
        "no-cache, max-age=0"
      );
    }

    return new Response(
      upstream.body,
      {
        status:200,
        headers
      }
    );
  }
};