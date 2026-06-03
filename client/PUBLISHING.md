# KODA.AI — App version & publishing guide

KODA is now an **installable app (PWA)**. This document explains what that means,
how to install it for free, and every path to getting it onto an app store —
including an honest note on cost.

---

## TL;DR (the cost reality)

| Path | Real store? | Cost | Who does it |
|------|-------------|------|-------------|
| **PWA install** (done ✅) | No (installs from browser) | **$0** | Anyone, now |
| **Google Play** (TWA) | Yes | **$25 one‑time** (Google's fee) | You — needs your Play account |
| **Amazon Appstore** | Yes | **$0** (free dev account) | You |
| **Direct APK** (GitHub Releases / site) | No | **$0** | You |
| **F‑Droid** | Yes | **$0** (open‑source only) | You + their review |

> ⚠️ **There is no $0 route onto the *Google Play* store specifically.** Google
> charges a one‑time **$25** developer‑registration fee. That fee, and the actual
> upload, can only be done by you from your Play Console — I can't do it for you.
> If "free" matters more than "Play specifically", use the **PWA** (already done)
> or the **Amazon Appstore** (free), both below.

---

## 1. What's already built (the app version) — $0

The web app is now a Progressive Web App:
- `vite-plugin-pwa` generates a **service worker** (offline app shell) + **web manifest**
- App icons live in `client/public/` (`pwa-192x192.png`, `pwa-512x512.png`, `pwa-maskable-512x512.png`, `apple-touch-icon.png`)
- Configured in `client/vite.config.js`; mobile meta tags in `client/index.html`
- `display: standalone` → launches fullscreen with no browser chrome, like a native app

### Install it (no store, free)
- **Android / Chrome:** open the deployed site → menu (⋮) → **Install app / Add to Home screen**. A KODA icon lands on the home screen and opens fullscreen.
- **iOS / Safari:** Share → **Add to Home Screen**.
- Desktop Chrome/Edge: an **install icon** appears in the address bar.

> Requirement: the site must be served over **HTTPS**. Your Render deployment already is — just deploy this branch and the install prompt appears automatically.

---

## 2. Publish to Google Play (TWA via Bubblewrap)

A **TWA** (Trusted Web Activity) wraps the PWA in a tiny native Android app. This
is Google's recommended way to put a web app on Play, using the free, open‑source
**Bubblewrap** CLI.

**Prerequisites**
1. The PWA deployed at a stable HTTPS URL (e.g. `https://your-koda-site.com`).
2. A **Google Play Developer account** — **$25 one‑time** (https://play.google.com/console/signup).
3. JDK 17 + Android SDK (Bubblewrap can install these for you).

**Steps**
```bash
npm i -g @bubblewrap/cli

# scaffold from the live manifest
bubblewrap init --manifest https://your-koda-site.com/manifest.webmanifest

# build the release bundle (signs it; keep the keystore safe!)
bubblewrap build
# → produces app-release-bundle.aab  (upload this to Play)
```

**Verify the link (Digital Asset Links)** so the app opens with no browser UI:
host the file Bubblewrap prints at
`https://your-koda-site.com/.well-known/assetlinks.json`.

**Then in the Play Console:** create an app → upload the `.aab` → fill the store
listing (title, description, screenshots, the 512 icon in `public/`), content
rating, data‑safety form, and a **privacy policy URL** → roll out to testing →
production. Review usually takes a few hours to a couple of days.

---

## 3. 100% free alternatives

### a) Amazon Appstore — a real store, free account
- Sign up free: https://developer.amazon.com/apps-and-games
- Amazon accepts the **same AAB/APK** Bubblewrap (or Capacitor) produces, and even has a web‑app/PWA submission flow. No yearly or signup fee.

### b) Direct APK distribution — free
- Build an APK (`bubblewrap build` or Capacitor), attach it to a **GitHub Release** or host it on your site, and share the link. Users enable "install from unknown sources".

### c) F‑Droid — free, open‑source store
- Free to list, but the app must be FOSS and go through their build/review process. Good if you open‑source KODA.

---

## 4. Optional: native wrapper with Capacitor

If you later need **native device APIs** (camera, push, biometrics), wrap the
build with Capacitor instead of a TWA:
```bash
npm i @capacitor/core @capacitor/cli @capacitor/android
npx cap init "KODA.AI" "ai.koda.app" --web-dir dist
npm run build && npx cap add android && npx cap sync
npx cap open android   # build the AAB/APK in Android Studio
```
The same AAB then goes to Play ($25) or Amazon (free).

---

## 5. Notes & gotchas
- **Backend/auth:** KODA's cookie auth (`withCredentials`) works in a TWA because a TWA runs the real site in Chrome (same cookies). A Capacitor wrapper uses a `https://localhost` origin, so set the backend CORS + cookie `SameSite=None; Secure` accordingly.
- **Keystore:** back up the signing keystore Bubblewrap/Capacitor generates — losing it means you can't update the app.
- **Icons:** swap any `client/public/pwa-*.png` to rebrand the launcher icon; re‑deploy.
- **HTTPS is mandatory** for install, service workers and TWAs.
