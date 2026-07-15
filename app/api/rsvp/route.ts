import { DbNotConfiguredError, getStore, type RsvpInput } from "@/lib/db";

/** Route Handlers aren't cached for POST; this one always runs at request time. */
export const dynamic = "force-dynamic";

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
/** Parse and validate the incoming body into a clean RsvpInput, or return an error. */
function parse(body: unknown): { input: RsvpInput } | { error: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "Invalid request." };
  }
  const data = body as Record<string, unknown>;

  const name = str(data.name).slice(0, 120);
  if (name.length < 2) {
    return { error: "Please share your name." };
  }

  const attendanceRaw = str(data.attendance).toLowerCase();
  if (attendanceRaw !== "yes" && attendanceRaw !== "no") {
    return { error: "Please let us know if you can attend." };
  }
  const attending = attendanceRaw === "yes";

  const guestsNum = Number(data.guests);
  const guests = Number.isFinite(guestsNum) ? Math.min(Math.max(Math.trunc(guestsNum), 1), 20) : 1;

  const noteText = str(data.note).slice(0, 1000);
  const note = noteText.length > 0 ? noteText : null;

  const sourceText = str(data.source).slice(0, 256);
  const source = sourceText.length > 0 ? sourceText : null;

  return { input: { name, attending, guests, note, source } };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = parse(body);
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  try {
    await getStore().insert(result.input);
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof DbNotConfiguredError) {
      return Response.json(
        { error: "RSVPs aren't being collected just yet. Please try again soon." },
        { status: 503 },
      );
    }
    console.error("RSVP insert failed:", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
