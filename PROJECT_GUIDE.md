# Project Nawab — Complete Project Guide

> A single, detailed handoff document for **Varnit & Akshita's** luxury digital
> wedding invitation. It explains **what the project is, what was built, how it
> was built, and the process behind it** — enough that a new developer *and* an
> AI assistant can pick it up with zero confusion.
>
> If you are an AI assistant, read the box **"Read this first (for AI assistants)"**
> below before writing any code.

---

## Table of contents

1. [Read this first (for AI assistants)](#1-read-this-first-for-ai-assistants)
2. [What this project is](#2-what-this-project-is)
3. [Quick start — run it in 60 seconds](#3-quick-start--run-it-in-60-seconds)
4. [Tech stack](#4-tech-stack)
5. [The guest experience (what it does)](#5-the-guest-experience-what-it-does)
6. [Architecture & directory map](#6-architecture--directory-map)
7. [How the front-end is built](#7-how-the-front-end-is-built)
8. [Content & configuration — how to re-skin](#8-content--configuration--how-to-re-skin)
9. [The RSVP system (backend)](#9-the-rsvp-system-backend)
10. [Assets & the image pipeline](#10-assets--the-image-pipeline)
11. [Styling, animation & accessibility](#11-styling-animation--accessibility)
12. [Running, building & verifying](#12-running-building--verifying)
13. [Deployment (Vercel + Neon)](#13-deployment-vercel--neon)
14. [What we achieved & how — the build journey](#14-what-we-achieved--how--the-build-journey)
15. [Common changes — a cheat-sheet](#15-common-changes--a-cheat-sheet)
16. [Gotchas & troubleshooting](#16-gotchas--troubleshooting)
17. [Handing this to an AI assistant](#17-handing-this-to-an-ai-assistant)

---

## 1. Read this first (for AI assistants)

These are the non-obvious rules that will otherwise trip you up. They override
your training-data assumptions.

- **This is Next.js 16 — not the version you remember.** APIs, conventions and
  file names have breaking changes. **Before writing any Next.js code, read the
  relevant guide in `node_modules/next/dist/docs/`.** This is also stated in
  [`AGENTS.md`](AGENTS.md) / [`CLAUDE.md`](CLAUDE.md).
- **`middleware.ts` is now `proxy.ts`.** The file at the repo root
  [`proxy.ts`](proxy.ts) exports a `proxy` function + a `config.matcher`. Do not
  create a `middleware.ts`.
- **Route params are Promises.** In Next 16, `params` in a page/route is a
  `Promise` and must be `await`ed — see [`app/[guest]/page.tsx`](app/[guest]/page.tsx).
- **All guest-facing text and event data lives in `lib/config/*.ts`.** Do not
  hardcode copy, dates, names, venues, links, or event details inside components.
  Change content by editing config, not JSX.
- **Only ever run one `next dev` at a time.** A second one fails with
  "Another next dev server is already running". If localhost is misbehaving,
  kill stray dev servers and start a single one on port 3000.
- **`sharp` (image tooling) must be run from the project root**, not from a temp
  directory, or it fails with `ERR_MODULE_NOT_FOUND` (it resolves from the
  project's `node_modules`).
- **Respect reduced motion.** Use the `useSafeReducedMotion` hook and the
  established pattern: gate only Framer Motion's `initial` prop
  (`initial={reduce ? false : "hidden"}`) — keep `variants` + `whileInView`/
  `animate` so content never gets stranded at `opacity: 0`.
- **HTTP header values must be ASCII (Latin-1).** The `WWW-Authenticate` realm in
  `proxy.ts` must not contain an em-dash or other non-ASCII character, or Node
  throws `Cannot convert argument to a ByteString`.
- **Local dev needs no database.** With `DATABASE_URL` unset, RSVPs save to a JSON
  file in the OS temp dir. Don't add a DB requirement to the dev flow.
- **The couple edits files directly on GitHub between pushes.** Always
  `git fetch` + `git rebase origin/main` before pushing. Commits by them look
  like "Update layout.tsx", "Update page.tsx", "Update route.ts".

---

## 2. What this project is

**Project Nawab** is a one-page, cinematic **digital wedding invitation** for
Varnit Tewari & Akshita Negi (wedding: **11 & 12 December 2026, Lucknow — "City
of Nawabs"**). It is meant to be sent to ~500 guests as a link (optionally
personalized, e.g. `/rahul`).

The aesthetic target is a **luxury Indian wedding invitation** — think
Sabyasachi / The Leela / Oberoi: antique gold, deep maroon, ivory paper,
hand-crafted ornaments, painterly florals, calm and unhurried motion. No loud
reds, no Bollywood styling.

It has two halves:

- **The guest-facing experience** — a wax-sealed invitation that opens into a
  scrolling site (hero → story → countdown → venue → a hub of three "chapters":
  Travel, Celebrations, RSVP).
- **A small, self-contained RSVP backend** — guests submit an RSVP, which is
  stored in a database; the couple views/exports responses at a password-
  protected `/admin` page. No third-party form service is used.

---

## 3. Quick start — run it in 60 seconds

**Prerequisites:** Node 20+ (developed on Node 22), npm.

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

- Personalized links work: **http://localhost:3000/rahul** greets "Rahul".
- **No database or env setup is needed for local dev.** Submitting an RSVP
  locally writes to a JSON file in your OS temp directory, so the whole flow
  (including `/admin`) works out of the box.
To exercise the admin page locally, create `.env.local` (see
[`.env.example`](.env.example)):

```bash
ADMIN_USER=admin
ADMIN_PASSWORD=change-me
```

Then visit **http://localhost:3000/admin** (the browser prompts for the
username/password).

**Scripts** (from [`package.json`](package.json)):

| Command         | What it does                        |
| --------------- | ----------------------------------- |
| `npm run dev`   | Start the dev server (Turbopack)    |
| `npm run build` | Production build                    |
| `npm run start` | Serve the production build          |
| `npm run lint`  | ESLint                              |

---

## 4. Tech stack

| Area            | Choice                                                                 |
| --------------- | ---------------------------------------------------------------------- |
| Framework       | **Next.js 16.2.10** (App Router, Turbopack)                            |
| UI runtime      | **React 19.2**                                                         |
| Language        | **TypeScript 5** (strict)                                              |
| Styling         | **Tailwind CSS v4** (`@tailwindcss/postcss`), design tokens in CSS     |
| Animation       | **Framer Motion 12** (primary), **GSAP 3** (select effects)            |
| Smooth scroll   | **Lenis** (disabled under reduced-motion)                              |
| Icons           | **lucide-react**                                                       |
| Class utilities | **clsx**, **tailwind-merge**, **class-variance-authority**             |
| Database        | **Neon Postgres** via **@neondatabase/serverless** (HTTP driver)       |
| Fonts           | **Cormorant Garamond** (display) + **Manrope** (sans) via `next/font`  |
| Hosting         | **Vercel** (Hobby tier is sufficient)                                  |

There is **no committed automated test suite**. Verification during development
was done by (a) `npm run build` (type-check + build) and (b) ad-hoc **Playwright**
scripts driving real Chrome (see [§12](#12-running-building--verifying)).

---

## 5. The guest experience (what it does)

The full entry sequence is orchestrated by
[`components/opening/opening-experience.tsx`](components/opening/opening-experience.tsx):

```
Welcome screen  →  Splash (proposal photo + music)  →  Invitation card (wax seal)  →  Website
   (first tap)       (tap to continue)                    (tap the seal to open)      (revealed underneath)
```

1. **Welcome screen** — a minimal "touch anywhere to continue" screen. Its only
   job is to capture the **first user gesture** so the browser permits audio to
   start. Personalized links greet the guest by name here.
2. **Splash** — the couple's photo with background **music now playing**
   (started on the welcome tap so it plays *over* the splash, iOS/Safari-safe).
3. **Invitation card** — an ornate card (monogram, names, city, dates) with a
   **wax seal** labelled "Open Invitation". Tapping the seal cracks it and
   unfolds into the site.
4. **The website** (always mounted underneath the opening "curtain"):
   - **Hero** — names, kicker, tagline.
   - **Story** — a timeline of milestones (photos/video).
   - **Countdown** — live countdown to the wedding.
   - **Venue** — save-the-date / venue details.
   - **Chapters hub** — three cards: **Travel Information**, **Wedding
     Celebrations**, **RSVP**. Each opens a full-screen, accessible modal
     "chapter" (focus-trapped, Escape closes, background made `inert`).
5. **Floating nav** (`SiteNav`) appears once opened. Desktop = monogram-led pill
   with links + gold RSVP CTA. Mobile = every section shown directly (no hidden
   hamburger menu) for discoverability.

The three chapters:

- **Travel Information** — visa/arrival info cards, a cinematic "Getting to
  Lucknow" vertical journey (globe → Delhi → animated plane → Lucknow → VA
  monogram), and a "Discover Beyond Lucknow" section (Agra/Taj, Lucknow/Bara
  Imambara, Ayodhya/Ram Mandir).
- **Wedding Celebrations** — four events (Haldi, Sangeet, Wedding, Reception),
  each an expandable card with a **real painted banner image**, per-event mood/
  atmosphere, and handcrafted ornaments.
- **RSVP** — the form (name, attendance, guests, note) with a cut-from-artwork
  "Send RSVP" plaque, corner florals, and a laurel-monogram sign-off. Submits to
  the backend.

---

## 6. Architecture & directory map

```
project-nawab/
├── app/                         # Next.js App Router
│   ├── layout.tsx               # html shell, fonts, metadata, providers
│   ├── page.tsx                 # "/" renders OpeningExperience
│   ├── providers.tsx            # MotionConfig + Music/ScrollLock/SmoothScroll providers
│   ├── globals.css              # Tailwind v4 + design tokens (colors, radii, texture)
│   ├── icon.png                 # favicon (wedding monogram)
│   ├── [guest]/page.tsx         # "/:name" personalized greeting (params is a Promise)
│   ├── admin/
│   │   ├── page.tsx             # Private RSVP dashboard (server component)
│   │   └── export/route.ts      # GET → CSV download (Excel-friendly, UTF-8 BOM)
│   └── api/
│       ├── rsvp/route.ts        # POST → validate + store an RSVP
│       └── health/route.ts      # GET → keep-warm ping (SELECT 1)
│
├── proxy.ts                     # Next 16 "middleware": Basic Auth over /admin*
│
├── components/
│   ├── opening/                 # The entry: welcome, splash, invitation, wax seal, music
│   ├── sections/                # Page sections + all the custom SVG/illustration art
│   ├── chapters/                # Hub, full-screen chapter overlay, nav, and the 3 chapters
│   ├── providers/               # Music, scroll-lock, smooth-scroll React contexts
│   └── ui/                      # Design-system primitives (Button, Card, Container, Section…)
│
├── lib/
│   ├── config/                  # ★ ALL content lives here (see §8)
│   │   ├── invitation.ts        #   couple names, dates, city, photos, monogram
│   │   ├── celebration.ts       #   save-the-date + venue
│   │   ├── chapters.ts          #   hub cards, the 4 celebration events, RSVP copy
│   │   ├── travel.ts            #   travel cards, the journey, destinations
│   │   ├── story.ts             #   love-story milestones
│   │   └── music.ts             #   background track + autoplay setting
│   ├── db.ts                    # RSVP data layer (Neon Postgres / dev JSON file)
│   ├── guest.ts                 # Format a URL segment into a display name
│   ├── calendar.ts              # "Add to calendar" helpers
│   ├── utils.ts                 # cn() etc.
│   ├── animation/               # motion variants + GSAP setup
│   └── hooks/                   # use-safe-reduced-motion
│
├── public/images/               # Photos + cut-out illustration assets (see §10)
│   ├── celebrations/            #   haldi/sangeet/wedding/reception banner WebPs
│   └── rsvp/                    #   button.png, crest.png, floral-*.webp
│
├── AGENTS.md / CLAUDE.md        # The "read node docs first" rule for AIs
├── README.md                    # Short quick-start + backend/deploy notes
└── PROJECT_GUIDE.md             # ← this document
```

---

## 7. How the front-end is built

**Providers** ([`app/providers.tsx`](app/providers.tsx)) wrap everything:

- `MotionConfig reducedMotion="user"` — honors the OS "reduce motion" setting
  globally.
- `MusicProvider` — background-music state (enabled/toggle), started on the first
  gesture.
- `ScrollLockProvider` — locks page scroll during the opening and while a chapter
  modal is open.
- `SmoothScrollProvider` — Lenis smooth scrolling (auto-off under reduced motion).

**The opening curtain** is a fixed overlay (`z-40`) that renders the current
phase (`welcome | splash | invitation`) via `AnimatePresence`. The actual website
(`#main-content`) is mounted underneath the whole time; when the seal is opened,
the curtain unmounts and the hero is revealed. This is why the transition feels
seamless.

**Chapters** ([`components/chapters/`](components/chapters/)):

- `ChaptersProvider` (context) tracks the `active` chapter and exposes
  `open(id, triggerEl)`. When a chapter is open it makes `#main-content` `inert`,
  locks scroll, and returns focus to the trigger on close.
- `ChaptersHub` renders the three entry cards.
- `ChapterOverlay` is the accessible full-screen modal (sticky "← Back" header +
  the chapter's short title). It renders `TravelChapter`, `CelebrationsChapter`,
  or `RsvpChapter` based on the active id.
- `SiteNav` is the floating pill nav (separate desktop and mobile markup).

**Sections & art** ([`components/sections/`](components/sections/)) contain the
page sections *and* the large collection of hand-built SVG illustrations and
atmosphere effects (e.g. `celebration-art.tsx`, `celebration-ornaments.tsx`,
`celebration-atmosphere.tsx`, `travel-art.tsx`, `travel-journey.tsx`,
`travel-flight-motif.tsx`, `fireworks.tsx`). These are drawn in code; the
*photographic* wedding art is handled separately as cut-out images (see §10).

---

## 8. Content & configuration — how to re-skin

**This is the most important section for making changes.** The app is
intentionally content-driven: components are generic, and everything specific to
this wedding is data in [`lib/config/`](lib/config/). To reuse the site for a
different couple you would mostly edit these files + swap the photos.

| File                    | Owns                                                                                      |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| `invitation.ts`         | Monogram, first/partner names & full names, invitation line, city + tagline, wedding dates, closing line, splash photo, wax-seal image, `monogramImageSrc`, hero kicker/tagline, optional hero portrait |
| `celebration.ts`        | Save-the-date content, venue content                                                      |
| `chapters.ts`           | The hub cards; the **4 celebration events** (`CelebrationEvent`: title, time, venue, description, `art`, `accent`); RSVP copy (`eyebrow`, `title`, `intro`, `note`, `thanks`) |
| `travel.ts`             | Travel info cards, the "Getting to Lucknow" journey, the "Discover Beyond Lucknow" destinations |
| `story.ts`              | Love-story milestones (text + image/video)                                                |
| `music.ts`              | Background track path + `autoPlayOnEnter`                                                  |

Types accompany every config (e.g. `CelebrationArt = "haldi" | "sangeet" |
"wedding" | "reception"`, `DestinationArt = "taj" | "imambara" | "ram"`), so the
compiler tells you exactly what a valid value is.

> **Rule:** if you're about to type wedding copy, a date, a name, a venue, or a
> link inside a component, stop — put it in the matching config file instead.

---

## 9. The RSVP system (backend)

A complete RSVP pipeline lives inside this one app — **no third-party service.**

```
Guest fills form ─POST /api/rsvp─►  validate  ─►  getStore().insert()  ─►  Postgres (prod) / JSON file (dev)
                                                                               │
Couple visits /admin ──(Basic Auth via proxy.ts)──► reads getStore().list() ──┘
                     └► /admin/export → CSV (Excel-friendly)
External uptime monitor ─GET /api/health─► SELECT 1 (keeps function + DB warm)
```

**Pieces:**

| Piece               | File                                                     | Notes |
| ------------------- | -------------------------------------------------------- | ----- |
| Submit endpoint     | [`app/api/rsvp/route.ts`](app/api/rsvp/route.ts)         | `POST`, `force-dynamic`. Validates name/attendance/guests/note/source. Returns 201 / 400 / 503 / 500. |
| Form UI             | [`components/chapters/rsvp-chapter.tsx`](components/chapters/rsvp-chapter.tsx) | Posts JSON; states: idle / submitting / success / error. |
| Data layer          | [`lib/db.ts`](lib/db.ts)                                 | `getStore()` returns a `RsvpStore` (`mode`, `insert`, `list`, `ping`). |
| Admin dashboard     | [`app/admin/page.tsx`](app/admin/page.tsx)               | Server component, `force-dynamic`, `robots: noindex`. Summary stat cards + responses table (IST timestamps). |
| Excel export        | [`app/admin/export/route.ts`](app/admin/export/route.ts) | `GET` → CSV with a UTF-8 BOM (opens cleanly in Excel), served as a download. |
| Admin auth          | [`proxy.ts`](proxy.ts)                                   | HTTP Basic Auth over `/admin` and `/admin/*`. **Fails closed** if creds unset. |
| Keep-warm ping      | [`app/api/health/route.ts`](app/api/health/route.ts)     | `GET` → `SELECT 1`; returns `{ ok, db }`. |

**The data layer ([`lib/db.ts`](lib/db.ts)) has two modes, chosen automatically:**

- **Postgres** (`postgresStore`) when `DATABASE_URL` (or `POSTGRES_URL`) is set.
  Uses the Neon HTTP driver (no connection pool / no connection cold start).
  It **auto-creates** the `rsvps` table on first use (`CREATE TABLE IF NOT
  EXISTS`). The `sql` client is cached per URL.
- **Dev JSON file** (`fileStore`) when no DB URL is set **and** not in production
  — writes to a JSON file in the OS temp dir, so local dev needs no database.
- In **production with no DB configured**, it throws `DbNotConfiguredError`
  (surfaced as a 503), rather than silently losing data.

**Environment variables** (`.env.local` locally; Vercel env vars in prod):

| Variable         | Required | Purpose                                                            |
| ---------------- | -------- | ------------------------------------------------------------------ |
| `DATABASE_URL`   | prod     | Postgres connection string (**auto-injected** by the Neon store)   |
| `ADMIN_USER`     | yes\*    | Username for `/admin`                                              |
| `ADMIN_PASSWORD` | yes\*    | Password for `/admin`                                             |

\* Required in any environment where `/admin` should be reachable. If unset,
`proxy.ts` returns 503 for `/admin` (fail-closed).

---

## 10. Assets & the image pipeline

There are two kinds of visuals:

1. **Code-drawn art** — the ornaments, motifs, flight paths, mandalas, fireworks,
   dividers, etc. These are hand-authored SVG/Framer Motion in
   `components/sections/*` and `components/opening/*`.
2. **Photographic / painted art cut from source images** — the celebration event
   banners and the RSVP plaque/crest/florals. **These are cut out with `sharp`,
   not recreated in CSS** (an explicit project requirement).

**How the cut-outs were produced (the repeatable process):**

- Source artwork was dropped into `public/images/` (the large
  `ChatGPT Image …png` files are the raw sources — kept for reference, not served
  in the UI).
- A short throwaway Node script using **`sharp`** — **run from the project root**
  — did one of two things per asset:
  - **Color-key** (for high-contrast subjects like the maroon **Send RSVP**
    plaque and the gold **laurel crest**): compute per-pixel alpha from distance
    to the cream background + saturation, then `trim()` to content. Output
    transparent **PNG**.
  - **Feathered crop** (for the near-white **florals** on cream, which can't be
    hard-keyed without fringing): crop the cluster, then fade the **inner** edges
    to transparent so the piece melts into the page's ivory (the source cream
    `#FBF6ED` and the site ivory `#f8f4ec` differ by ~2/channel — invisible).
    Output **WebP** with alpha.
- The celebration banners (`public/images/celebrations/{haldi,sangeet,wedding,reception}.webp`)
  were cut as horizontal bands from a single source sheet; the Sangeet band was
  additionally tone-matched (`.modulate` + a warm soft-light overlay).

**Where the finished assets live:**

- `public/images/celebrations/` — the four event banners (WebP).
- `public/images/rsvp/` — `button.png` (Send RSVP plaque), `crest.png` (laurel
  V|A monogram), `floral-tr/left/br/bl.webp` (corner florals).
- `public/images/` — `couple-splash.jpg`, `couple-illustration.png`,
  `monogram.png`, `wax-seal-open.png`, `logo.jpeg`, `grand_hotel.webp`, plus
  `floral-corner-top/bottom.png` (used on the opening card).

> If you cut new assets: keep source PNGs **out of git** (they're ~1.8 MB each and
> would be served publicly). Commit only the finished, optimized cut-outs.

---

## 11. Styling, animation & accessibility

**Design tokens** are defined in [`app/globals.css`](app/globals.css) and exposed
as Tailwind v4 color utilities. The core palette:

| Token          | Hex        | Use                          |
| -------------- | ---------- | ---------------------------- |
| `antique-gold` | `#b08d57`  | Lines, accents, CTAs         |
| `deep-maroon`  | `#6e1f2a`  | Headings, the RSVP plaque    |
| `ivory`        | `#f8f4ec`  | Page background              |
| `warm-white`   | `#fffdf8`  | Cards, inputs, surfaces      |
| `sand`         | `#dccbb3`  | Borders                      |
| `charcoal`     | `#2d2d2d`  | Body text                    |

Fonts: **Cormorant Garamond** (`font-display`) for headings, **Manrope**
(`font-sans`) for body — loaded via `next/font` in `layout.tsx`. There's a subtle
`paper-texture` utility for the ivory paper feel.

**Animation:** Framer Motion is the default (variants, `whileInView` with
`once: true`, staggered children, `pathLength` draw-on effects, Ken-Burns via
nested scaling). GSAP is used for a few specific effects. Everything sticks to
**transform/opacity** for 60fps.

**Accessibility is a first-class constraint:**

- `MotionConfig reducedMotion="user"` + the `useSafeReducedMotion` hook.
- **The reduced-motion pattern:** gate only `initial`
  (`initial={reduce ? false : "hidden"}`), and keep `variants` +
  `whileInView`/`animate`, so nothing is ever stranded invisible.
- Chapters are proper modals: focus trap, Escape to close, `inert` background,
  focus returned to the trigger.
- Touch targets on mobile are ≥ 44px; decorative art is `aria-hidden`.

---

## 12. Running, building & verifying

**Dev:** `npm run dev` → http://localhost:3000. Only run **one** dev server.

**Build (also the type-check gate):**

```bash
npm run build
```

A green build prints the route table and should list `/`, `/[guest]`, `/admin`,
`/admin/export`, `/api/health`, `/api/rsvp`, and `Proxy (Middleware)`.

**Manual/E2E verification:** there is no committed test suite. During development,
flows were verified by driving **real Chrome with Playwright** (using
`playwright-core` + the system Chrome binary) — opening the invitation, opening
each chapter, submitting the RSVP, and checking for console errors, across
desktop + mobile viewports and with `reducedMotion: "reduce"`. These scripts were
throwaway (kept in a scratch dir, not committed). If you add real tests, wire
them into a script in `package.json`.

---

## 13. Deployment (Vercel + Neon)

The site auto-deploys from the GitHub repo (`main`) on Vercel.

**One-time production setup:**

1. **Import** the repo at [vercel.com/new](https://vercel.com/new).
2. **Provision the database:** Vercel project → **Storage** → **Create Database**
   → **Neon (Postgres)** → connect to the project. Vercel injects `DATABASE_URL`
   automatically (no manual copy). The `rsvps` table is created on first use.
3. **Set admin creds:** Settings → **Environment Variables** → add `ADMIN_USER`
   and `ADMIN_PASSWORD`.
4. **Redeploy.** The couple then views responses at `/admin`.

**Avoiding cold starts** (a wedding crowd arrives in bursts after idle gaps):

- **Function warmth:** enable **Fluid Compute** (Settings → Functions) — on by
  default for new projects; just confirm.
- **Database warmth:** Neon's free tier scales to zero, so keep it awake by
  pinging **`/api/health`** every ~5 minutes with a **free external uptime
  monitor** (UptimeRobot, cron-job.org, …).
  - **On the Hobby plan, do NOT use a Vercel Cron for this** — Hobby only allows a
    once-a-day schedule, and a more frequent one *fails the deploy*. (This is why
    there is **no `vercel.json`** cron in the repo — an earlier one broke the
    build and was removed.) Use the external monitor.
  - On Pro/Enterprise you may instead add a `vercel.json` cron hitting
    `/api/health` every 5 minutes.

**Cost & scale:** everything fits **free tiers** and is comfortable for ~500
guests. Vercel Hobby covers hosting/functions/bandwidth; Neon free tier (0.5 GB)
stores RSVPs (each response is a fraction of a KB). Functions scale
automatically, so many guests can submit simultaneously.

---

## 14. What we achieved & how — the build journey

The project was built in phases (each maps to real commits, oldest → newest).
This is the "how we got here" narrative.

1. **Foundation** (`16c8d92`) — Initial Project Nawab: the opening experience,
   the scrolling site (hero/story/countdown/venue), the chapters hub, the design
   system, and all the code-drawn art.
2. **Reliable music + welcome screen** (`0f54a06`, `82d5897`) — start audio
   synchronously inside the first tap (Safari/iOS-safe), and add a minimal
   welcome screen *before* the splash so music plays over the proposal photo.
3. **Personalized links** (`53f6031`) — `/:name` greets the guest by name
   (`app/[guest]/page.tsx` + `lib/guest.ts`).
4. **Entry polish** (`7bf428e`, `4f93e14`, `9fb9716`) — make the wax seal
   obviously tappable, label the (then-hamburger) mobile nav, add the browser tab
   title + monogram favicon.
5. **RSVP backend** (`9fc7015`) — the whole self-contained pipeline: `POST
   /api/rsvp` → Neon Postgres (with the dev JSON-file fallback), the
   password-protected `/admin` dashboard via `proxy.ts` Basic Auth, and the
   `/api/health` keep-warm endpoint. *This is where the Next 16 `proxy.ts`
   convention and the ByteString/em-dash header fix came from.*
6. **Deploy fix** (`0f041a7`) — the Vercel Hobby cron rejected a `*/5` schedule
   and failed the deploy; removed `vercel.json` and documented the external
   pinger approach instead.
7. **Excel export** (`9b8ac54`) — a "Download for Excel" CSV route under
   `/admin/export` (UTF-8 BOM so Excel opens it directly).
8. **Travel refresh** (`178cdfe`) — "Discover Beyond Lucknow" destinations + the
   cinematic vertical "Getting to Lucknow" journey (globe → Delhi → animated
   plane → Lucknow → monogram), all reduced-motion aware.
9. **Celebrations art-direction** (`f909676`) — a full luxury-invitation polish
   pass: per-event moods, ceremonial ornaments, hero + closing section, jaali
   backdrop, atmosphere effects — no layout/feature changes.
10. **Real painted banners** (`1e3fb7b`) — replaced code-drawn celebration
    artwork with **real images cut via `sharp`** (Haldi/Sangeet/Wedding/
    Reception), integrated responsively (image-left on web, stacked on mobile),
    with the Sangeet band tone-matched.
11. **Mobile nav redesign** (`4e3b35c`) — guests didn't discover the hamburger
    "Menu"; the mobile nav now shows every section directly (no hidden menu),
    desktop unchanged.
12. **RSVP real invitation art** (`e6d6fa1`, current) — cut the ornamental **Send
    RSVP** plaque, four corner **florals**, and the **laurel crest** from the
    couple's RSVP mock; reworded the attendance options ("Joyfully joining" /
    "Sending love from afar"); added the "We look forward to welcoming you to
    Lucknow — With love, Varnit & Akshita" sign-off.

Commits labelled "Update layout.tsx / page.tsx / route.ts" are the couple's own
edits made directly on GitHub between pushes.

---

## 15. Common changes — a cheat-sheet

| I want to change…                          | Edit this                                                        |
| ------------------------------------------ | ---------------------------------------------------------------- |
| Couple names / dates / city / monogram     | `lib/config/invitation.ts`                                       |
| The splash / couple photos                 | `lib/config/invitation.ts` + the file in `public/images/`        |
| A celebration event's time/venue/text      | `lib/config/chapters.ts` (`celebrations.events`)                 |
| A celebration banner image                 | `public/images/celebrations/{event}.webp`                        |
| RSVP heading / intro / thank-you copy       | `lib/config/chapters.ts` (`rsvp`)                                |
| Attendance option wording                  | `components/chapters/rsvp-chapter.tsx` (`ATTENDANCE`)            |
| Travel cards / journey / destinations       | `lib/config/travel.ts`                                           |
| Love-story milestones                       | `lib/config/story.ts`                                            |
| Background music track                      | `lib/config/music.ts` + the file in `public/`                    |
| Colors / fonts / paper texture              | `app/globals.css` + `app/layout.tsx`                             |
| Admin username / password                   | `ADMIN_USER` / `ADMIN_PASSWORD` env vars (never hardcode)        |
| RSVP fields or validation                   | `components/chapters/rsvp-chapter.tsx` + `app/api/rsvp/route.ts` + `lib/db.ts` |
| Nav links / labels                          | `components/chapters/site-nav.tsx`                               |

---

## 16. Gotchas & troubleshooting

- **"Another next dev server is already running" / localhost misbehaves** — you
  have two dev servers. Kill all `next dev` processes and start exactly one on
  port 3000.
- **`sharp` → `ERR_MODULE_NOT_FOUND`** — you ran the script from a temp dir. Run
  it from the **project root** so it resolves the project's `node_modules`.
- **Admin returns 503** — `ADMIN_USER`/`ADMIN_PASSWORD` are not set in that
  environment. `proxy.ts` fails closed by design.
- **Admin auth throws `Cannot convert argument to a ByteString`** — a non-ASCII
  character crept into the `WWW-Authenticate` realm string in `proxy.ts`. Keep it
  ASCII-only.
- **RSVP returns 503 in production** — no database configured. Provision the Neon
  store so `DATABASE_URL` is injected.
- **Vercel deploy fails on a cron** — you added a sub-daily `vercel.json` cron on
  the Hobby plan. Remove it; use an external uptime pinger for `/api/health`.
- **Content animates in then vanishes / stays invisible** — you gated `variants`
  or `whileInView` on reduced motion instead of only `initial`. Follow the
  reduced-motion pattern in [§11](#11-styling-animation--accessibility).
- **Push rejected / behind remote** — the couple edited files on GitHub. `git
  fetch` then `git rebase origin/main` before pushing.

---

## 17. Handing this to an AI assistant

When you point an AI at this repo, give it this instruction:

> "This is a **Next.js 16** project (breaking changes vs. older Next). **Read
> `PROJECT_GUIDE.md` first**, and before writing any Next.js code, read the
> relevant guide in `node_modules/next/dist/docs/`. All wedding content lives in
> `lib/config/*.ts` — change content there, not in components. The admin
> 'middleware' is `proxy.ts` (not `middleware.ts`). Keep the luxury Indian
> aesthetic (antique gold / deep maroon / ivory; calm motion; no bright reds).
> Respect the reduced-motion pattern. Verify with `npm run build`. Don't commit
> or push unless asked; if you do, `git rebase origin/main` first."

That, plus [§1](#1-read-this-first-for-ai-assistants), is enough for an assistant
to work safely without breaking conventions.
