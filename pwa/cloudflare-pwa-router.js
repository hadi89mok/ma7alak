/*
  MA7ALAK PWA — CLOUDFLARE ROUTER
  Deploy this Worker only on the PWA asset routes.

  IMPORTANT:
  The manifest route also serves the PNG app icons through:
    /manifest.webmanifest?icon=192
    /manifest.webmanifest?icon=512

  This keeps the PWA icons SAME-ORIGIN with ma7alak.com and avoids
  Hostinger/CSP/installability issues with separate icon routes.
*/

const SOURCE_BASE =
  "https://raw.githubusercontent.com/hadi89mok/ma7alak/main/pwa/";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    let file = null;
    let contentType = null;
    let cacheControl = "no-cache, max-age=0";

    if (url.pathname === "/manifest.webmanifest") {
      const icon = url.searchParams.get("icon");

      if (icon === "192") {
        file = "icon-192.png";
        contentType = "image/png";
        cacheControl = "public, max-age=86400";
      } else if (icon === "512") {
        file = "icon-512.png";
        contentType = "image/png";
        cacheControl = "public, max-age=86400";
      } else {
        file = "manifest.webmanifest";
        contentType = "application/manifest+json; charset=utf-8";
      }
    } else if (url.pathname === "/sw.js") {
      file = "ma7alak-service-worker.js";
      contentType = "text/javascript; charset=utf-8";
      cacheControl = "no-cache, no-store, must-revalidate";
    } else if (url.pathname === "/pwa-offline") {
      file = "offline.html";
      contentType = "text/html; charset=utf-8";
    } else if (url.pathname === "/pwa-icon-192.png") {
      file = "icon-192.png";
      contentType = "image/png";
      cacheControl = "public, max-age=86400";
    } else if (url.pathname === "/pwa-icon-512.png") {
      file = "icon-512.png";
      contentType = "image/png";
      cacheControl = "public, max-age=86400";
    } else {
      return fetch(request);
    }

    const upstream = await fetch(
      SOURCE_BASE + file + "?v=" + Date.now(),
      {
        headers: {
          "User-Agent": "Ma7alak-PWA-Worker/1.2"
        },
        cf: {
          cacheEverything: false,
          cacheTtl: 0
        }
      }
    );

    if (!upstream.ok) {
      return new Response("Ma7alak PWA asset unavailable", {
        status: 502,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store"
        }
      });
    }

    const headers = new Headers();

    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", cacheControl);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Access-Control-Allow-Origin", "*");

    if (url.pathname === "/sw.js") {
      headers.set("Service-Worker-Allowed", "/");
    }

    return new Response(upstream.body, {
      status: 200,
      headers
    });
  }
};