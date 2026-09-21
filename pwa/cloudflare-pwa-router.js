/*
  SHOUFHON PWA — CLOUDFLARE ROUTER

  Route only the PWA root assets through this Worker:
    /manifest.webmanifest*
    /sw.js*
    /pwa-icon-*
    /pwa-offline*

  Normal ShoufHon pages stay on Hostinger.
*/

const VERSION="20260921-1";

const SOURCE_BASE=
  "https://raw.githubusercontent.com/hadi89mok/ma7alak/main/pwa/";

const BRAND_ICON=
  "https://6aa2c9b0ea08b9137fd5ada9.imgix.net/sandbox/hadi%20new.png";

function iconUrl(size){
  return (
    BRAND_ICON+
    "?w="+size+
    "&h="+size+
    "&fit=crop"+
    "&fm=png"+
    "&auto=compress"+
    "&v="+VERSION
  );
}

async function fetchUpstream(url,userAgent){
  return fetch(
    url,
    {
      headers:{
        "User-Agent":userAgent||"ShoufHon-PWA-Worker/2.0"
      },
      cf:{
        cacheEverything:false,
        cacheTtl:0
      }
    }
  );
}

function responseHeaders(contentType,cacheControl){
  const headers=new Headers();
  headers.set("Content-Type",contentType);
  headers.set("Cache-Control",cacheControl);
  headers.set("X-Content-Type-Options","nosniff");
  headers.set("Access-Control-Allow-Origin","*");
  return headers;
}

async function serveIcon(size){
  const upstream=
    await fetchUpstream(
      iconUrl(size),
      "ShoufHon-PWA-Worker/2.0"
    );

  if(!upstream.ok){
    return new Response(
      "ShoufHon PWA icon unavailable",
      {
        status:502,
        headers:responseHeaders(
          "text/plain; charset=utf-8",
          "no-store"
        )
      }
    );
  }

  return new Response(
    upstream.body,
    {
      status:200,
      headers:responseHeaders(
        "image/png",
        "public, max-age=3600"
      )
    }
  );
}

async function serveRepoFile(file,contentType,cacheControl){
  const upstream=
    await fetchUpstream(
      SOURCE_BASE+
      file+
      "?v="+
      VERSION
    );

  if(!upstream.ok){
    return new Response(
      "ShoufHon PWA asset unavailable",
      {
        status:502,
        headers:responseHeaders(
          "text/plain; charset=utf-8",
          "no-store"
        )
      }
    );
  }

  return new Response(
    upstream.body,
    {
      status:200,
      headers:responseHeaders(
        contentType,
        cacheControl
      )
    }
  );
}

export default {
  async fetch(request){
    const url=new URL(request.url);

    if(
      request.method!=="GET" &&
      request.method!=="HEAD"
    ){
      return fetch(request);
    }

    /*
      Backward compatibility:
      older ShoufHon manifests used
      /manifest.webmanifest?icon=192|512.
      Keep those URLs valid while browsers clear old manifest caches.
    */
    if(url.pathname==="/manifest.webmanifest"){
      const legacyIcon=url.searchParams.get("icon");

      if(legacyIcon==="192"){
        return serveIcon(192);
      }

      if(legacyIcon==="512"){
        return serveIcon(512);
      }

      const response=
        await serveRepoFile(
          "manifest.webmanifest",
          "application/manifest+json; charset=utf-8",
          "no-cache, no-store, must-revalidate"
        );

      return response;
    }

    if(url.pathname==="/sw.js"){
      const response=
        await serveRepoFile(
          "ma7alak-service-worker.js",
          "text/javascript; charset=utf-8",
          "no-cache, no-store, must-revalidate"
        );

      response.headers.set(
        "Service-Worker-Allowed",
        "/"
      );

      return response;
    }

    if(url.pathname==="/pwa-icon-192.png"){
      return serveIcon(192);
    }

    if(url.pathname==="/pwa-icon-512.png"){
      return serveIcon(512);
    }

    if(url.pathname==="/pwa-offline"){
      return serveRepoFile(
        "offline.html",
        "text/html; charset=utf-8",
        "no-cache, max-age=0"
      );
    }

    return fetch(request);
  }
};
