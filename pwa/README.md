# ShoufHon PWA deployment

This folder contains the production PWA layer for shoufhon.com.

## Live-data safety

The service worker does not cache Supabase REST/Auth/Storage/Realtime traffic, videos/audio, or navigated HTML pages as stale copies. It only pre-caches the PWA shell and caches immutable commit-pinned ShoufHon JS/CSS from jsDelivr.

## Cloudflare setup

Hostinger Website Builder does not expose the normal root file system needed for a root-scoped service worker. Keep Hostinger as the origin and use a Cloudflare Worker only for the PWA root files.

1. Add shoufhon.com to Cloudflare and keep the existing Hostinger DNS records.
2. Proxy the web A/CNAME records through Cloudflare (orange cloud).
3. Create a Cloudflare Worker and paste pwa/cloudflare-pwa-router.js.
4. Add these Worker routes:

    shoufhon.com/manifest.webmanifest*
    shoufhon.com/sw.js*
    shoufhon.com/pwa-icon-*
    shoufhon.com/pwa-offline*

If www.shoufhon.com directly serves the website, add the same four routes for www.

Do not route shoufhon.com/* to this Worker. Normal pages should continue to Hostinger.

## Hostinger global Custom Code

Load ma7alak-pwa-client.js globally on the top-level site using a commit-pinned jsDelivr URL.

The client injects the manifest/meta tags, registers /sw.js, shows the install card only when the browser says installation is available, and never runs inside Hostinger embed iframes.

## Verify

Open these URLs after the Cloudflare Worker routes are active:

    https://shoufhon.com/manifest.webmanifest
    https://shoufhon.com/sw.js
    https://shoufhon.com/pwa-icon-192.svg
    https://shoufhon.com/pwa-offline

Then open shoufhon.com in Chrome on Android and test installation plus Stories, Reels, messages, Live Offers, Admin design updates, and owner uploads.