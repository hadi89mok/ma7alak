/*
  SHOUFHON PWA — CLOUDFLARE ROUTER

  Route only the PWA root assets through this Worker:
    /manifest.webmanifest*
    /sw.js*
    /pwa-icon-*
    /pwa-offline*

  Normal ShoufHon pages stay on Hostinger.
*/

const VERSION="20260921-2";

const SOURCE_BASE=
  "https://raw.githubusercontent.com/hadi89mok/ma7alak/main/pwa/";

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

async function serveIcon(size){
  return serveRepoFile(
    "icon-"+size+".png",
    "image/png",
    "public, max-age=3600"
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
    */
    if(url.pathname==="/manifest.webmanifest"){
      const legacyIcon=url.searchParams.get("icon");

      if(legacyIcon==="192"){
        return serveIcon(192);
      }

      if(legacyIcon==="512"){
        return serveIcon(512);
      }

      return serveRepoFile(
        "manifest.webmanifest",
        "application/manifest+json; charset=utf-8",
        "no-cache, no-store, must-revalidate"
      );
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
