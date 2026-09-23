# ShoufHon Local Performance Test

This is an isolated A/B experiment. It does not replace the existing ShoufHon website or the first Capacitor preview.

## What is local in this APK

At GitHub Actions build time it downloads the current ShoufHon homepage HTML and stores that HTML inside the APK. It also copies the current root-level ShoufHon GitHub JavaScript files into the APK and rewrites matching jsDelivr/raw GitHub script references to the local copies.

## What stays live

Supabase/API traffic, media, Hostinger platform assets, and other external resources remain network-backed. This is intentional: the test isolates part of the frontend-loading cost without cloning the production backend.

## What to compare

Install this next to the original preview. The package IDs differ, so both can coexist.

Compare:
- cold launch to usable home screen
- initial scroll smoothness
- animation/reel responsiveness
- reopening after force-close

This is a performance experiment, not the final store architecture. Internal navigation may leave the local snapshot and load a live Hostinger page; that is expected for this first A/B test.

## Safety

No Hostinger custom embed, production JavaScript file, Supabase table/RPC, SQL migration, or live website route is modified by this test.
