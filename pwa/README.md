# Ma7alak PWA deployment

This folder contains the production PWA layer for ma7alak.com.

## Live-data safety

The service worker does not cache Supabase REST/Auth/Storage/Realtime traffic, videos/audio, or navigated HTML pages as stale copies. It only pre-caches the PWA shell and caches immutable commit-pinned Ma7alak JS/CSS from jsDelivr.

## Cloudflare setup

Hostinger Website Builder does not expose the normal root file system needed for a root-scoped service worker. Keep Hostinger as the origin and use a Cloudflare Worker only for the PWA root files.

1. Add ma7alak.com to Cloudflare and keep the existing Hostinger DNS records.
2. Proxy the web A/CNAME records through Cloudflare (orange cloud).
3. Create a Cloudflare Worker and paste pwa/cloudflare-pwa-router.js.
4. Add these Worker routes:

    ma7alak.com/manifest.webmanifest*
    ma7alak.com/sw.js*
    ma7alak.com/pwa-icon-*
    ma7alak.com/pwa-offline*

If www.ma7alak.com directly serves the website, add the same four routes for www.

Do not route ma7alak.com/* to this Worker. Normal pages should continue to Hostinger.

## Hostinger global Custom Code

Load ma7alak-pwa-client.js globally on the top-level site using a commit-pinned jsDelivr URL.

The client injects the manifest/meta tags, registers /sw.js, shows the install card only when the browser says installation is available, and never runs inside Hostinger embed iframes.

## Verify

Open these URLs after the Cloudflare Worker routes are active:

    https://ma7alak.com/manifest.webmanifest
    https://ma7alak.com/sw.js
    https://ma7alak.com/pwa-icon-192.svg
    https://ma7alak.com/pwa-offline

Then open ma7alak.com in Chrome on Android and test installation plus Stories, Reels, messages, Live Offers, Admin design updates, and owner uploads.