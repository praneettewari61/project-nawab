import { DbNotConfiguredError, getStore, type RsvpRecord } from "@/lib/db";

/**
 * Downloads all RSVPs as a spreadsheet. Lives under /admin so it is covered by
 * the same Basic Auth as the dashboard (see proxy.ts).
 *
 * Served as UTF-8 CSV with a byte-order mark so it opens directly in Excel —
 * correct columns and accented names, no import wizard, no format warning.
 */
export const dynamic = "force-dynamic";

const IST = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  dateStyle: "medium",
  timeStyle: "short",
});

/** Escape a value for CSV: wrap in quotes and double any inner quotes. */
function cell(value: string | number | boolean): string {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(records: RsvpRecord[]): string {
  const header = ["Name", "Attending", "Guests", "Note", "From", "Received (IST)"];
  const rows = records.map((r) => [
    cell(r.name),
    cell(r.attending ? "Yes" : "No"),
    cell(r.guests),
    cell(r.note ?? ""),
    cell(r.source ?? ""),
    cell(IST.format(new Date(r.createdAt))),
  ].join(","));
  // Leading ﻿ is the UTF-8 BOM that tells Excel the encoding.
  return `﻿${[header.join(","), ...rows].join("\r\n")}\r\n`;
}

export async function GET() {
  let records: RsvpRecord[] = [];
  try {
    records = await getStore().list();
  } catch (error) {
    if (!(error instanceof DbNotConfiguredError)) {
      console.error("RSVP export failed:", error);
      return new Response("Unable to export responses.", { status: 500 });
    }
    // Not configured → export an empty (header-only) sheet.
  }

  const date = new Date().toISOString().slice(0, 10);
  return new Response(toCsv(records), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="varnit-akshita-rsvps-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
