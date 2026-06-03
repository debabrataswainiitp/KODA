# KODA.AI — App version, native build & publishing

KODA ships in two app forms:

1. **PWA** — installs from the browser, runs fullscreen. ($0)
2. **Native Android app (Capacitor)** — a real APK/AAB that **bundles its own
   copy of the app** (it does *not* just load the website in a webview), ready
   for the **Amazon Appstore** (free) or **Google Play** ($25 one‑time).

The app icon (PWA + native launcher) is the project's **`vite.svg`** mark.

---

## Cost reality

| Target | Real store? | Cost |
|--------|-------------|------|
| **PWA install** (done ✅) | from browser | **$0** |
| **Amazon Appstore** (done‑ready ✅) | ✅ | **$0** (free dev account) |
| **Google Play** | ✅ | **$25 one‑time** (Google's fee) |
| **Direct APK** (GitHub Releases) | — | **$0** |

> Google Play has a mandatory one‑time **$25** fee and the upload must be done
> from your own Play Console — I can't do that part. Amazon's store is free.

---

## 1. PWA (installable, $0)

Built with `vite-plugin-pwa` (`vite.config.js`): service worker + web manifest +
icons in `client/public/`. Deploy the client over HTTPS and:
- **Android/Chrome:** ⋮ → *Install app*  · **iOS/Safari:** Share → *Add to Home Screen*.

---

## 2. Native Android app (Capacitor) — bundled, works on its own

Capacitor is configured in `client/capacitor.config.json` with `webDir: dist`
and **no `server.url`**, so the built app is packaged *inside* the APK
(`android/app/src/main/assets/public`) and runs locally — not fetched from the web.

```bash
cd client
npm install
npm run app:sync     # vite build  +  cap sync android  (refresh bundled app)
npm run app:open     # open the project in Android Studio
```

**Build an installable file** (needs Android Studio / Android SDK + JDK 17):
- In Android Studio: **Build ▸ Generate Signed Bundle / APK**
  - **APK** → best for Amazon Appstore & direct distribution
  - **AAB** → required by Google Play
- Or via CLI:
  ```bash
  cd android
  ./gradlew assembleRelease     # → app/build/outputs/apk/release/*.apk
  ./gradlew bundleRelease       # → app/build/outputs/bundle/release/*.aab
  ```

**Signing:** the Android Studio wizard creates a keystore the first time — **back
it up** (you can't update the app later without it).

**Re‑skin the launcher icon:** sources live in `client/assets/`
(`icon-foreground.png`, `icon-background.png`, `icon-only.png`, `splash*.png`).
Edit them, then `npm run app:icons` to regenerate all Android densities.

---

## 3. Publish to the Amazon Appstore (free)

1. Create a free developer account: https://developer.amazon.com/apps-and-games
2. **Add New App ▸ Android** → fill title, description, screenshots, and the
   512px icon (`client/public/pwa-512x512.png`).
3. Upload the **APK** (or AAB) from step 2.
4. Set content rating + privacy policy URL → **Submit**. No fee.

## 4. Publish to Google Play ($25 one‑time)

Either upload the Capacitor **AAB** above, or wrap the PWA as a TWA:
```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest https://your-koda-site.com/manifest.webmanifest
bubblewrap build      # → app-release-bundle.aab
```
Then in the Play Console (after the $25 signup): create app → upload the AAB →
listing, content rating, data‑safety, privacy policy → roll out.

---

## 5. Backend connectivity in the native app (important)

The native app's UI runs locally, but login/generation still call the live API
(`https://koda-b.onrender.com`). For that to work from the app's `https://localhost`
origin:

- **CORS** — already handled: `server/index.js` now allows the Capacitor origins
  (`https://localhost`, `capacitor://localhost`) alongside the web origin.
  **Redeploy the server** for this to take effect.
- **Cookies** — KODA uses cookie auth (`withCredentials`). For cookies to flow
  cross‑site into the WebView, the auth cookie must be set
  `SameSite=None; Secure` on the backend. (Today it isn't, so login won't persist
  in the native app until that's changed.)
- **Google sign‑in** — `signInWithPopup` does **not** work inside an Android
  WebView. The native app needs redirect‑based auth or a native plugin
  (e.g. `@codetrix-studio/capacitor-google-auth`).

> Want me to wire up the cookie change + native Google auth so login works fully
> inside the packaged app? Say the word and I'll implement it.

---

## What I committed
- `client/vite.config.js`, `client/index.html` — PWA (manifest, SW, meta)
- `client/public/*.png` — app icons (the `vite.svg` mark on a dark tile)
- `client/capacitor.config.json`, `client/android/**`, `client/assets/**` — native app
- `client/package.json` — `app:sync` / `app:open` / `app:icons` scripts
- `server/index.js` — CORS allowlist incl. Capacitor origins
