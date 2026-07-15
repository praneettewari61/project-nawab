# Varnit & Akshita — Wedding Invitation

A luxury digital wedding invitation built with Next.js 16, React 19, Tailwind v4,
and Framer Motion. Guests open a wax-sealed invitation, explore the celebrations
and travel information, and RSVP.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Personalized links work too —
e.g. `/daniel` greets the guest by name.

## RSVP backend

RSVPs are collected by a small, self-contained backend that lives entirely inside
this app — no third-party service:

| Piece            | Location                     | Notes                                        |
| ---------------- | ---------------------------- | -------------------------------------------- |
| Submit endpoint  | `app/api/rsvp/route.ts`      | `POST` — validates and stores a response     |
| Data layer       | `lib/db.ts`                  | Neon Postgres in prod; JSON file in dev      |
| Admin dashboard  | `app/admin/page.tsx`         | Lists responses + summary counts             |
| Admin auth       | `proxy.ts`                   | HTTP Basic Auth over `/admin`                |
| Keep-warm ping   | `app/api/health/route.ts`    | Warms the function + database                |

**Local development needs no database.** When `DATABASE_URL` is unset, RSVPs are
saved to a JSON file in the OS temp directory so the full flow works out of the box.

### Environment variables

Copy `.env.example` to `.env.local` and fill it in. In production, set the same
variables in **Vercel → Project → Settings → Environment Variables**.

| Variable         | Required | Purpose                                                        |
| ---------------- | -------- | -------------------------------------------------------------- |
| `DATABASE_URL`   | prod     | Postgres connection string (auto-injected by the Neon store)   |
| `ADMIN_USER`     | yes      | Username for the `/admin` dashboard                            |
| `ADMIN_PASSWORD` | yes      | Password for the `/admin` dashboard                            |

### Provisioning the database (one time, in Vercel)

1. Vercel dashboard → your project → **Storage** → **Create Database** → **Neon** (Postgres).
2. Connect it to the project. Vercel injects `DATABASE_URL` automatically — no manual copy needed.
3. Add `ADMIN_USER` and `ADMIN_PASSWORD` under **Settings → Environment Variables**.
4. Redeploy. The `rsvps` table is created automatically on first use.

The couple can then view responses at **`/admin`** (the browser will prompt for the
username and password).

## Avoiding cold starts

A wedding audience arrives in bursts after long idle gaps, which is exactly when
serverless cold starts hurt. Two sources are handled:

1. **The Vercel function.** Enable **Fluid Compute** (Vercel → Project → Settings →
   Functions). It keeps instances warm and reuses them across invocations. It is on
   by default for new projects — just confirm it's enabled.
2. **The Neon database** (free tier scales to zero). Keep it awake by pinging
   `/api/health` on a short interval with a **free external uptime monitor**
   (e.g. [UptimeRobot](https://uptimerobot.com) or [cron-job.org](https://cron-job.org)):
   point it at `https://<your-domain>/api/health` every 5 minutes.
   - On the **Hobby** plan, don't use a Vercel Cron for this — Hobby only allows
     a once-a-day schedule (a more frequent one *fails the deploy*), and once a
     day is useless for warming. The external monitor is the way.
   - On **Pro/Enterprise**, you can instead add a `vercel.json` cron:
     `{ "crons": [{ "path": "/api/health", "schedule": "*/5 * * * *" }] }`.

`/api/health` does a cheap `SELECT 1`, which both keeps the function hot and wakes
the Neon compute, so the first real guest never pays the cold-start cost.

## Cost & scale

Everything runs on free tiers and is comfortably sized for a ~500-guest list:

- **Vercel Hobby** (free, non-commercial) covers the hosting, functions, and bandwidth.
- **Neon free tier** (0.5 GB) stores RSVPs — each response is a fraction of a
  kilobyte, so 500+ responses use a negligible amount of space. Functions scale
  automatically, so many guests can submit at the same time without issue.

## Deploy

Push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new).
Set the environment variables above, provision the Neon store, and redeploy.
