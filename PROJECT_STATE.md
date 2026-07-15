# Project Nawab — Project State

**Last updated:** 2026-07-14
**Stack:** Next.js 16 (App Router) · React 19 · Tailwind v4 · Framer Motion · Lenis · lucide-react

A luxury, mobile-first digital wedding experience. This file tracks phase progress,
architecture, and the placeholder content that still needs real data.

---

## Phase status

| Phase | Scope | Status |
|------|-------|--------|
| 1 | Project setup (Tailwind, fonts, theme, animation) | ✅ Complete |
| 2 | Design system (Button, Card, Container, Section, SectionTitle) | ✅ Complete (Forms & Nav pending) |
| 3 | Landing — splash + invitation card | ✅ Complete & approved |
| 4 | Invitation opening animation (gatefold unfold) | ✅ Complete & approved |
| 5 | Hero + "Our Journey" timeline (data-driven scaffold) | ✅ Built — **placeholder content** |
| 5b | Save the Date (live countdown) + Venue | ✅ Built — **real date & venue** |
| 6 | Chapters hub → Travel / Celebrations / RSVP (full-screen overlays) | ✅ Built — Travel + Celebrations real; **RSVP live** |
| 7 | Wedding Celebrations (expandable itinerary) | ✅ Built — **real schedule**; per-event venue placeholder |
| 11 | RSVP (backend) | ✅ **Live** — POST → Neon Postgres; dev file-store fallback |
| 8 | Discover Lucknow | ⏳ Not started |
| 9 | Venue explorer | ⏳ Not started |
| 10 | Gallery | ⏳ Not started |
| 12 | Guest dashboard | ⏳ Not started |
| 13 | Admin dashboard | ✅ **Live** — `/admin`, Basic Auth via `proxy.ts` |
| 14 | Production (perf, a11y, SEO, testing) | ⏳ Not started |

---

## Experience flow

`app/page.tsx` → `OpeningExperience` renders:
- **Base layer** (`<main>`, scrollable): `HeroSection` → `StorySection` → `CountdownSection` → `VenueSection` → `ChaptersExperience` (the real site).
- **Chapters** (`components/chapters/`): chapter open/close state lives in `ChaptersProvider` (context via `useChapters()`), which also renders the single **full-screen overlay** (`ChapterOverlay`, portaled to `<body>`): the page (`#main-content`) is made `inert` + scroll-locked, focus is trapped, Esc/Back close it, a history entry is pushed so the device Back button closes the chapter (not the site), and focus returns to whatever opened it.
- Two entry points open the chapters: the **`ChaptersHub`** (after Venue — three framed cards) and the persistent **`SiteNav`** (a floating pill at the top, shown once the invitation opens; collapses to a hamburger menu on mobile): monogram + **Date & Venue** (smooth-scrolls to `#save-the-date` via `scrollToSection`, Lenis-aware) + **Events** (→ celebrations) + **Travel Info** (→ travel) + **RSVP** (gold CTA → rsvp). Travel, Celebrations, and RSVP chapters are all live.
- `venue.mapUrl` (in `lib/config/celebration.ts`) is the real Google Maps link, used by both the Venue section's "View Venue" button and every Celebrations event's "View Venue".
- **Background music** (`components/providers/music-provider.tsx` + `lib/config/music.ts`): one shared looping `<audio>`, started softly on the guest's first tap (`autoPlayOnEnter`) and controlled by a persistent toggle (curtain top-right + the nav speaker button share the same state via `useMusic()`). ⚠️ `music.src` is a **silent placeholder** (`/audio/placeholder.wav`) — drop the couple's licensed track in `public/audio/` and point `src` at it (must be an audio file; Spotify/YouTube links won't play via `<audio>`).
- **Curtain overlay** (`fixed`, removed once opened): `SplashScreen` → `InvitationUnfold`.

Splash (tap anywhere) → invitation → tap wax seal → press + crack + gatefold unfold →
hero revealed underneath → scroll unlocks → Hero → Our Journey.

---

## Content is fully config-driven

- `lib/config/invitation.ts` — couple, dates, city, invitation copy, splash photo, seal, hero kicker/tagline.
- `lib/config/story.ts` — "Our Journey" timeline: any number of milestones (`date, title, description, location, image, optional video`).
- `lib/config/celebration.ts` — Save-the-Date (`saveTheDate`: eyebrow, lead, `displayDate`, ISO `targetDate` for the live countdown) and `venue` (name, address lines, image). **Confirmed real data:** wedding date **12 December 2026** and venue **The Grand Banquet and Lawn, Mohanlalganj, Lucknow**. Only the exact ceremony *time* is assumed (countdown targets start of day IST).
- `lib/config/chapters.ts` — hub copy + the three chapter cards; the real `celebrations` itinerary (4 events: date/time/venue/description/highlights/art/accent/ISO start-end); and **placeholder** `rsvp` copy.
  - Celebrations chapter is an expandable itinerary: bespoke line art per event (`components/sections/celebration-art.tsx`: marigold / music / sacred-fire / champagne), a faint palette-only accent tint per event, smooth height expand/collapse, and "Add to Calendar" via a universal `.ics` download (`lib/calendar.ts`). "View Venue" is a placeholder action.
- `lib/config/travel.ts` — "Travel Information" cards as a typed discriminated union (`info | routes | destinations`). Icon keys → lucide icons and destination `art` keys → bespoke SVGs, both resolved in components (config stays pure data).

Swap these values / files and the UI updates with **no code changes**.

> **Notes:**
> - Save-the-Date / countdown is intentionally deferred ("no countdown for now"). Phase 6 was reassigned to Travel Information.
> - The Travel section was given a Creative-Director polish pass: bespoke line art (`travel-art.tsx`: flight motif, Taj Mahal, temple), framed handmade-paper cards (`shadow-card` token + inset gold hairline), an editorial 12-column layout, and premium motion. "Need Help?" was removed; the section now ends with a `SectionTransition` lead-in into **Wedding Celebrations** (title only — the full section is a later phase).

---

## ⚠️ Placeholder content awaiting real data (do NOT treat as final)

Provided so far: **couple names** (Varnit Tewari & Akshita Negi), monogram **V & A**, splash photo.

Still placeholders — **please confirm or provide**:
1. Wedding **date** confirmed: **12 December 2026** (Save the Date + countdown). The hero no longer prints a date (just the city). The **invitation card** still reads **"11 & 12 December 2026"** (`invitation.ts` `weddingDates`) — intended as the two-day celebration (11th = Haldi/Sangeet, 12th = Wedding/Reception).
2. Wedding **city** (currently "Lucknow / City of Nawabs")
3. Hero **kicker & tagline** (currently "The Wedding Of" / "Together with our families…")
4. **Story timeline** — real dates, titles, descriptions, locations for each milestone
5. Engagement date · proposal story · important milestones (order matters)
6. **Photos** — replace files in `public/images/story/story-1..5.jpg` (test images from the web) with real photos, same filenames
7. **Videos** (optional) — add `video: { src, poster? }` to any milestone in `story.ts`
8. Real **logo/monogram** image if available (currently the coded V & A crest)
9. **Travel** (`lib/config/travel.ts`): official **Indian e-Visa URL** (`EVISA_URL`, currently defaulted to the Government-of-India portal — confirm/replace)
10. **Wedding Celebrations** (`lib/config/chapters.ts` `celebrations`): schedule is real (Haldi · Sangeet & Cocktail · Wedding · Reception, 11–12 Dec 2026). Remaining placeholders: per-event **`venue`** (all set to "The Grand Banquet and Lawn" — confirm specific hall/lawn) and assumed **end times** on `start`/`end` (used only for the .ics). "View Venue" now opens the real Google Maps link.
11. **RSVP** — ✅ now **live** (see the RSVP backend section below). Remaining optional: real reCAPTCHA/spam guard, per-event RSVP, email notification to the couple.

---

## RSVP backend (live)

Self-contained, no third-party service. Free-tier sized for a ~500-guest list.

- **Submit**: `components/chapters/rsvp-chapter.tsx` `POST`s JSON to `app/api/rsvp/route.ts` (validates name/attendance/guests/note + captures `source` = the invite path, e.g. `/daniel`). Form shows Sending → Thank you / inline error.
- **Storage** (`lib/db.ts`): **Neon Postgres** in production via `@neondatabase/serverless` (HTTP driver — no connection cold start), table `rsvps` auto-created on first use. **Dev fallback**: when `DATABASE_URL` is unset and not in production, RSVPs save to a JSON file in the OS temp dir, so local dev works with zero setup. Production without a DB throws `DbNotConfiguredError` (never writes to Vercel's read-only FS).
- **Admin**: `app/admin/page.tsx` (server component, `force-dynamic`) lists responses + summary counts (Responses / Accepting / Declining / Guests coming), `noindex`.
- **Auth**: `proxy.ts` (Next 16's renamed `middleware`) — HTTP Basic Auth over `/admin` using `ADMIN_USER` / `ADMIN_PASSWORD`. Realm string must stay ASCII (header = Latin-1). Fails closed if creds unset.
- **Cold starts**: `app/api/health/route.ts` (`SELECT 1`) kept warm by a free external uptime pinger every 5 min (UptimeRobot / cron-job.org). No `vercel.json` cron — Hobby rejects sub-daily schedules at deploy time, and daily is useless for warming; Pro users can add one. Enable Vercel **Fluid Compute** to keep the function warm. See README → "Avoiding cold starts".
- **Env**: `DATABASE_URL` (auto-injected by the Vercel Neon store), `ADMIN_USER`, `ADMIN_PASSWORD`. Template in `.env.example`; local values in `.env.local` (gitignored).

---

## Assets

- `public/images/couple-splash.jpg` — splash background (real couple photo)
- `public/images/couple-illustration.png` — hero couple illustration, background cut to transparent (`heroPortrait` in config; set to `undefined` to hide). Do NOT re-encode this transparent PNG with `sips` — it flattens the alpha to white. Re-run the in-canvas cutout instead.
- `public/images/grand_hotel.webp` — real venue photo (762×1020). Framed in `VenueSection`; landscape crop on desktop, portrait on mobile. Carries the venue's own "THE GRAND" logo watermark (visible in the mobile/portrait crop) — swap for a clean image if that should go.
- `public/images/wax-seal-open.png` — seal (cut from reference)
- `public/images/monogram.png` — invitation crest, background cut to transparent from `logo.jpeg` (`monogramImageSrc` in config; omit for the coded V&A crest). Same rule as the illustration: never `sips` a transparent PNG.
- `public/images/floral-corner-top.png`, `…-bottom.png` — invitation florals (cut from reference)
- `public/images/story/story-1..5.jpg` — **placeholder** timeline photos (replace)
- `public/images/ChatGPT Image ….png` — original reference mockup (art source only; can be removed from `public/`)

---

## Conventions

- Reduced motion: use `useSafeReducedMotion()` (SSR-safe) — never branch render output on the raw media query. For scroll reveals, gate **only** `initial` (`initial={reduce ? false : "hidden"}`) and keep `variants` + `whileInView` always set, so the global `MotionConfig reducedMotion="user"` snaps transforms without ever leaving content stuck at opacity 0. (Gating `whileInView` itself is a bug — it strands content hidden after the client reduced-motion flip.)
- Elevation: `shadow-soft` for base surfaces, `shadow-card` / `shadow-card-hover` (layered, warm-tinted) for framed cards.
- Animations use transform/opacity only; scroll reveals via `whileInView` (`once: true`).
- Images via `next/image`; non-default quality must be allow-listed in `next.config.ts` (`images.qualities`).
- Design tokens/colors live in `app/globals.css`; never hardcode hex outside the token set.
- The closed invitation card (`invitation-face.tsx`) must fit one screen with its full frame visible — the crest, names, gaps/padding and seal use `dvh`-based `clamp()` so it scales to the viewport **height** (a width breakpoint can't fix a short-but-wide viewport). Both gatefold panels and the seal overlay share the same layout, so the seal stays aligned.
- Scroll is locked until the invitation opens via `ScrollLockProvider` — Lenis is only started once unlocked (otherwise it scrolls the page behind the closed invitation despite `overflow: hidden`).
