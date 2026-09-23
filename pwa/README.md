# ShoufHon PWA deployment

This folder contains the production PWA layer for shoufhon.com.

## Live-data safety

The service worker does not cache Supabase REST/Auth/Storage/Realtime traffic, videos/audio, or navigated HTML pages as stale copies. It only caches immutable commit-pinned ShoufHon JS/CSS from jsDelivr.

## Cloudflare setup

Hostinger Website Builder does not expose the root file system needed for a root-scoped service worker. Keep Hostinger as the website origin and use a Cloudflare Worker only for the PWA root files.

Deploy the current `pwa/cloudflare-pwa-router.js` Worker and add these routes:

    shoufhon.com/manifest.webmanifest*
    shoufhon.com/sw.js*
    shoufhon.com/pwa-icon-*
    shoufhon.com/pwa-offline*

If `www.shoufhon.com` directly serves the site, add the same four routes for `www`.

Do not route `shoufhon.com/*` to this Worker. Normal pages must continue to Hostinger.

## Hostinger global Custom Code

Load `ma7alak-pwa-client.js` once globally on the top-level site using a commit-pinned jsDelivr URL.

Do not add a duplicate copy.

The client:
- injects the Web App Manifest and Apple PWA meta tags
- registers `/sw.js`
- shows the native Android/Chromium install button when `beforeinstallprompt` is available
- shows a simple iPhone/iPad "Share → Add to Home Screen" flow
- falls back to browser-menu installation instructions when the PWA assets are valid but a native prompt is not supplied
- exposes `window.Ma7alakPWA.checkInstallAssets()` for diagnostics

## Required PWA URLs

These four URLs must return the correct content from the ShoufHon origin:

    https://shoufhon.com/manifest.webmanifest
    https://shoufhon.com/sw.js
    https://shoufhon.com/pwa-icon-192.png
    https://shoufhon.com/pwa-icon-512.png

Expected content types:
- manifest: `application/manifest+json` or JSON
- service worker: JavaScript
- both icon endpoints: `image/png`

The 192 icon must be 192×192 and the 512 icon must be 512×512.

Older cached manifests that still request:

    /manifest.webmanifest?icon=192
    /manifest.webmanifest?icon=512

remain supported by the Worker during the transition.

## Testing

After deploying the Worker and updating the Hostinger PWA client script:

1. Open the four required URLs above.
2. In Chrome/Brave Android, refresh ShoufHon and wait for the install card.
3. Tap Install.
4. On iPhone/iPad Safari, use the ShoufHon install card and follow Share → Add to Home Screen.
5. Verify the installed app opens in standalone mode and that Stories, Reels, messages, Live Offers, Admin updates, and owner uploads still use live data.


## Web Push notifications

The PWA client also loads `shoufhon-web-push.js` from the same commit-pinned jsDelivr revision.

For installed PWAs, the push client:
- waits for the root service worker
- shows a user-controlled "Turn on ShoufHon notifications" prompt
- requests notification permission only after the user taps the button
- creates a standards-based Web Push subscription
- stores the subscription through the `push-subscribe` Supabase Edge Function
- sends a one-time welcome/test notification for a newly-created subscription
- silently re-syncs an existing subscription on later launches

On iPhone/iPad, the automatic push prompt only appears when ShoufHon is already running from the Home Screen as a web app.

The service worker receives push payloads, displays a ShoufHon-branded system notification, and opens/focuses the target ShoufHon URL when the notification is tapped.

Current automatic backend push producers include new Stories and new Reels.
