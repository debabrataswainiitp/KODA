# KODA.AI — 3D Glassmorphic UI/UX Design System

A premium, **3D · glassmorphic · interactive** redesign of the KODA.AI frontend.
This document is the design spec + Figma handoff: it captures every token,
effect, component and screen so the UI can be reproduced or extended in either
code or Figma.

> **Figma file:** _KODA.AI — 3D Glassmorphic UI/UX Redesign_
> https://www.figma.com/design/7AIDZbCLhq20unXby4rNoE
> Contains a **Cover** and a full **Design System** board (color tokens,
> typography, glassmorphism, effects, components). Screen mockups are documented
> in full below and implemented 1:1 in code (see screenshots / live app).

---

## 1. Design philosophy

The redesign elevates KODA from a flat dark theme to an "advanced UI" language
built around four ideas:

1. **Depth over flatness** — every surface is a layer with light, shadow and
   parallax. Cards tilt toward the cursor in 3D; chips float above panels.
2. **Glass, not gradients-on-black** — frosted glassmorphism (background blur +
   inset highlight + soft border) gives structure and a sense of physical material.
3. **Light reacts to you** — cursor-following spotlights, specular glare on tilt,
   and magnetic buttons make the interface feel alive and responsive.
4. **One coherent identity** — violet → fuchsia → cyan brand gradient, an aurora
   mesh background, and the Space Grotesk display face used consistently.

Performance & accessibility: all 3D/parallax is pure CSS transforms + Motion
(no WebGL), backgrounds are `pointer-events-none`, and everything collapses
under `prefers-reduced-motion`.

---

## 2. Design tokens

### Colors
| Token | Hex | Use |
|-------|-----|-----|
| `koda-bg` | `#050507` | App background |
| `koda-bg-soft` | `#0a0a12` | Panels / inset gradient stops |
| `koda-violet` | `#8B5CF6` | Primary brand |
| `koda-purple` | `#A855F7` | Brand support |
| `koda-fuchsia` | `#D946EF` | Gradient mid-stop |
| `koda-pink` | `#EC4899` | Accent |
| `koda-cyan` | `#22D3EE` | Cool accent / gradient end |
| `koda-blue` | `#3B82F6` | Ambient blobs |

**Signature gradients**
- Brand fill (buttons): `linear-gradient(90deg, #8B5CF6 → #D946EF → #22D3EE)`
- Gradient text: `linear-gradient(135deg, #C4B5FD → #F0ABFC → #67E8F9)`

### Typography
- **Display:** `Space Grotesk` (600/700) — headings, hero, numbers.
- **Body / UI:** `Inter` (300–700).
- Scale: Hero 72–96 · H2 30–48 · H3 18–20 · Body 16–18 · Caption 12–13.

### Radius & spacing
- Radii: pills `999px` · cards `24–32px` · buttons/controls `12–16px`.
- Container max-width `1152px` (`max-w-6xl`); section padding `96px` vertical.

### Elevation / shadow
- Glow (brand): `0 0 28px -4px rgba(139,92,246,.55), 0 0 60px -10px rgba(236,72,153,.35)`
- Card depth: `0 12px 48px -12px rgba(0,0,0,.7)` + `inset 0 1px 0 rgba(255,255,255,.22)`

---

## 3. Glassmorphism

Three surface tiers (defined as utilities in `src/index.css`):

| Class | Background | Blur | Border | Use |
|-------|-----------|------|--------|-----|
| `.glass` | white 5% | 20px | white 10% | Cards, chips, badges |
| `.glass-strong` | white 8% | 28px | white 14% | Hero panel, CTA band, modal-ish |
| `.glass-dark` | `#0a0a12` 55% | 24px | white 8% | Navbars, side panels, drawers |

Every glass surface carries an **inset top highlight** (`inset 0 1px 0
rgba(255,255,255,.22)`) to simulate a lit top edge, and sits over the aurora so
the blur has color to refract.

---

## 4. 3D & interaction system

| Effect | Where | How |
|--------|-------|-----|
| **3D tilt** | Feature / project / pricing cards, hero panel | `TiltCard` — cursor position → spring-damped `rotateX/Y` (±8–12°) with `transform-perspective: 1000`. |
| **Specular glare** | On tilt | Radial white highlight that tracks the cursor, `mix-blend: soft-light`, fades in on hover. |
| **Spotlight** | On tilt | 440px violet radial glow following the cursor behind content. |
| **Parallax depth** | Hero mockup chips, card icons | `.translate-z-10/20` lift children toward the viewer inside a `preserve-3d` parent. |
| **Magnetic buttons** | All primary CTAs | `MagneticButton` — contents drift toward the cursor (spring), gradient fill + sweeping shine. |
| **Aurora mesh** | Every page background | `Aurora` — animated blurred blobs (violet/fuchsia/cyan) + perspective grid + film grain. |
| **Rotating headline** | Home hero | Word swaps with 3D `rotateX` flip via `AnimatePresence`. |

---

## 5. Component library (`src/components/ui/`)

- **`Aurora.jsx`** — fixed, `-z-10` ambient background (mesh blobs + grid + grain + top vignette). `props: { grid }`.
- **`TiltCard.jsx`** — interactive 3D tilt wrapper with glare + spotlight. `props: { intensity, glare, spotlight }`.
- **`MagneticButton.jsx`** — magnetic, gradient/glass/ghost button with shine. `props: { variant, strength }`.
- **`Navbar.jsx`** — floating glass navbar: 3D logo mark, credits pill, profile menu + AI-model switcher.

---

## 6. Screen specifications

### Home (`/`)
Floating glass navbar → hero badge → 3-line rotating gradient headline → magnetic
CTAs → **3D app-window mockup** (browser chrome + faux generated site + floating
"Clean code / Deployed / On-brand" depth chips) → stats strip (4 glass tiles) →
features (3 TiltCards, gradient icon badges + top accents) → "How it works" (3
numbered steps) → your-websites grid → glowing CTA band → footer. Persistent
glass "Try another model" banner.

### Dashboard (`/dashboard`)
Glass top bar (back + title + magnetic "New Project") → welcome heading →
responsive grid of **TiltCard** project cards (live `iframe` thumbnail, "Live"
badge, Deploy/Share). Empty + loading + error states styled with glass.

### Generate (`/generate`)
Glass top bar → centered hero → **gradient-bordered prompt console** (model
switcher chips, large textarea, suggestion chips) → magnetic Generate button →
animated multi-phase progress card (gradient bar).

### Editor (`/editor/:id`)
Two-pane workspace: `glass-dark` chat sidebar (gradient user bubbles / glass AI
bubbles, glass composer with gradient send) + live preview with a glass toolbar
(Deploy, code drawer, full-preview). Mobile chat & Monaco code drawer slide in
as spring overlays.

### Pricing (`/pricing`)
Centered gradient heading → 3 **TiltCard** tiers; the Pro tier is elevated with a
gradient border + violet glow + "Popular" badge. Gradient prices, credit pills,
check-list, magnetic CTAs.

### Login modal
Gradient-bordered `glass-dark` card with animated ambient glows, gradient logo
mark, gradient wordmark, white Google button. Enters with a 3D `rotateX` tilt.

### LiveSite (`/site/:id`)
Full-bleed `iframe`; glass "Site not found" empty state.

---

## 7. Changed & added files

**Added — reusable 3D/glass primitives**
- `src/components/ui/Aurora.jsx`
- `src/components/ui/TiltCard.jsx`
- `src/components/ui/MagneticButton.jsx`
- `src/components/ui/Navbar.jsx`
- `DESIGN.md` (this file)

**Modified — design system & pages**
- `src/index.css` — full design system (tokens, glass, 3D, animations, keyframes)
- `index.html` — Space Grotesk + Inter fonts, meta
- `src/pages/Home.jsx`
- `src/pages/Dashboard.jsx`
- `src/pages/Generate.jsx`
- `src/pages/Editor.jsx`
- `src/pages/Pricing.jsx`
- `src/pages/LiveSite.jsx`
- `src/components/LoginModal.jsx`
- `eslint.config.js` — added `react/jsx-uses-vars` (recognise JSX usage)
- `package.json` / `package-lock.json` — added `eslint-plugin-react` (dev)

No backend, routing, state, or API contracts were changed — purely presentation.

---

## 8. Run locally

```bash
cd client
npm install
# Firebase auth needs a key (the public UI renders without it):
echo "VITE_FIREBASE_API_KEY=your_key" > .env.local
npm run dev      # http://localhost:5173
npm run build    # production build (verified ✓)
npm run lint     # 0 errors ✓
```
