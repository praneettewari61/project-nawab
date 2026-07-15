import { DbNotConfiguredError, getStore } from "@/lib/db";

/**
 * Lightweight health / keep-warm endpoint.
 *
 * Ping this on a short interval (Vercel Cron or a free external uptime monitor)
 * to keep both the serverless function and the Neon database warm, so guests
 * never hit a cold start. See README → "Avoiding cold starts".
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = getStore();
    await store.ping();
    const db = store.mode === "postgres" ? "connected" : "dev-file";
    return Response.json({ ok: true, db, time: new Date().toISOString() });
  } catch (error) {
    if (error instanceof DbNotConfiguredError) {
      // The function is warm even if no database is wired up yet.
      return Response.json({ ok: true, db: "not-configured", time: new Date().toISOString() });
    }
    console.error("Health check DB ping failed:", error);
    return Response.json(
      { ok: false, db: "error", time: new Date().toISOString() },
      { status: 500 },
    );
  }
}
