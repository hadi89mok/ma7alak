# ShoufHon Capacitor preview

This folder is deliberately isolated from the live Hostinger website.

## Safety

The preview app loads the existing live ShoufHon website at:

`https://shoufhon.com`

It does not replace or modify Hostinger pages, custom embed elements, Supabase tables, SQL, or the existing website scripts.

The Android native project is generated during GitHub Actions builds and is not committed to the repository.

## Current goal

Version 0.1 is a preview shell so ShoufHon can be installed as a real Android APK and tested on a physical phone before any Google Play release.

This first preview proves:

- real Android app installation
- ShoufHon opens inside a native Capacitor container
- current Hostinger pages and embeds render from the live site
- the same Supabase-backed live data is used

Store-specific/native refinements such as Google OAuth, native push notifications, deep links, Android Back handling, status bars, uploads and external-link routing are handled in later app-only phases without replacing the website.

## Build

GitHub Actions workflow:

`.github/workflows/build-shoufhon-android-preview.yml`

It generates a debug APK and uploads it as the artifact:

`ShoufHon-Android-Debug`
