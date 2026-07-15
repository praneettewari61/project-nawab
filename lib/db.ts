/**
 * RSVP persistence — deliberately light.
 *
 * Production runs on Neon Postgres (provisioned through the Vercel Storage tab,
 * which injects `DATABASE_URL`). Local development, where no database is
 * configured, falls back to a small JSON file in the OS temp directory so the
 * whole flow can be run end-to-end without any setup. Production with no
 * database throws, rather than silently writing to Vercel's read-only disk.
 */

import { neon } from "@neondatabase/serverless";
import { readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface RsvpInput {
  name: string;
  attending: boolean;
  guests: number;
  note: string | null;
  /** The path the guest submitted from, e.g. "/daniel" — handy for the couple. */
  source: string | null;
}

export interface RsvpRecord extends RsvpInput {
  id: string;
  createdAt: string;
}

export interface RsvpStore {
  /** "postgres" in production, "file" in local development. */
  readonly mode: "postgres" | "file";
  insert(input: RsvpInput): Promise<void>;
  list(): Promise<RsvpRecord[]>;
  /** Cheap round-trip used by the keep-warm health check. */
  ping(): Promise<void>;
}

/** Thrown when running in production without a database configured. */
export class DbNotConfiguredError extends Error {
  constructor() {
    super("No database is configured. Set DATABASE_URL (Vercel → Storage → Neon).");
    this.name = "DbNotConfiguredError";
  }
}

/* ───────────────────────────── Neon Postgres ───────────────────────────── */

type Sql = ReturnType<typeof neon>;

let cachedSql: { url: string; sql: Sql } | null = null;
let ensured: Promise<void> | null = null;

function getSql(url: string): Sql {
  if (cachedSql?.url !== url) {
    cachedSql = { url, sql: neon(url) };
  }
  return cachedSql.sql;
}

/** Create the table once per warm instance. */
function ensureTable(sql: Sql): Promise<void> {
  ensured ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS rsvps (
        id         BIGSERIAL PRIMARY KEY,
        name       TEXT        NOT NULL,
        attending  BOOLEAN     NOT NULL,
        guests     INTEGER     NOT NULL DEFAULT 1,
        note       TEXT,
        source     TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
  })();
  return ensured;
}

function postgresStore(url: string): RsvpStore {
  const sql = getSql(url);
  return {
    mode: "postgres",
    async ping() {
      // Wakes the Neon compute if it has scaled to zero, keeping it warm.
      await sql`SELECT 1`;
    },
    async insert(input) {
      await ensureTable(sql);
      await sql`
        INSERT INTO rsvps (name, attending, guests, note, source)
        VALUES (${input.name}, ${input.attending}, ${input.guests}, ${input.note}, ${input.source})
      `;
    },
    async list() {
      await ensureTable(sql);
      const rows = (await sql`
        SELECT id, name, attending, guests, note, source, created_at
        FROM rsvps
        ORDER BY created_at DESC
      `) as Record<string, unknown>[];
      return rows.map((row) => ({
        id: String(row.id),
        name: row.name as string,
        attending: row.attending as boolean,
        guests: row.guests as number,
        note: (row.note as string | null) ?? null,
        source: (row.source as string | null) ?? null,
        createdAt: new Date(row.created_at as string).toISOString(),
      }));
    },
  };
}

/* ───────────────────── Dev-only JSON file fallback ─────────────────────── */

const DEV_FILE = join(tmpdir(), "project-nawab-rsvp-dev.json");

async function readDevFile(): Promise<RsvpRecord[]> {
  try {
    const raw = await readFile(DEV_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RsvpRecord[]) : [];
  } catch {
    return [];
  }
}

function fileStore(): RsvpStore {
  return {
    mode: "file",
    async ping() {
      // Nothing to warm for the local file store.
    },
    async insert(input) {
      const records = await readDevFile();
      records.push({
        ...input,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
      });
      await writeFile(DEV_FILE, JSON.stringify(records, null, 2), "utf8");
    },
    async list() {
      const records = await readDevFile();
      return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
  };
}

/* ─────────────────────────────── Selection ─────────────────────────────── */

export function getStore(): RsvpStore {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (url) return postgresStore(url);
  if (process.env.NODE_ENV !== "production") return fileStore();
  throw new DbNotConfiguredError();
}
