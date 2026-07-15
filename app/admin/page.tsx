import { Check, X } from "lucide-react";
import type { Metadata } from "next";
import { DbNotConfiguredError, getStore, type RsvpRecord } from "@/lib/db";

/** Always render fresh — this is a live view of the responses table. */
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "RSVP Responses",
  robots: { index: false, follow: false },
};

const IST = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : IST.format(date);
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-large border border-antique-gold/25 bg-warm-white p-5 shadow-soft">
      <p className="font-display text-[2.5rem] font-medium leading-none text-deep-maroon">{value}</p>
      <p className="mt-1.5 font-sans text-caption font-medium uppercase tracking-[0.16em] text-charcoal/55">
        {label}
      </p>
    </div>
  );
}

export default async function AdminPage() {
  let records: RsvpRecord[] = [];
  let notConfigured = false;
  let loadError = false;

  try {
    records = await getStore().list();
  } catch (error) {
    if (error instanceof DbNotConfiguredError) {
      notConfigured = true;
    } else {
      console.error("Failed to load RSVPs:", error);
      loadError = true;
    }
  }

  const accepts = records.filter((record) => record.attending);
  const headcount = accepts.reduce((sum, record) => sum + record.guests, 0);

  return (
    <main className="min-h-dvh bg-ivory px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 md:mb-10">
          <p className="font-sans text-caption font-semibold uppercase tracking-[0.36em] text-antique-gold">
            Varnit &amp; Akshita
          </p>
          <h1 className="mt-2 font-display text-[2.5rem] font-medium leading-tight text-deep-maroon md:text-h1">
            RSVP Responses
          </h1>
        </header>

        {notConfigured ? (
          <div className="rounded-large border border-antique-gold/30 bg-warm-white p-8 text-charcoal/75 shadow-soft">
            <h2 className="font-display text-h3 font-medium text-deep-maroon">Database not configured</h2>
            <p className="mt-3 max-w-prose font-sans text-body leading-7">
              Create a Postgres store in the Vercel dashboard (Storage → Neon) and it will inject
              <code className="mx-1 rounded bg-ivory px-1.5 py-0.5 text-small">DATABASE_URL</code>
              automatically. Responses will appear here once it&apos;s connected.
            </p>
          </div>
        ) : loadError ? (
          <div className="rounded-large border border-deep-maroon/30 bg-deep-maroon/5 p-8 text-deep-maroon shadow-soft">
            <h2 className="font-display text-h3 font-medium">Couldn&apos;t load responses</h2>
            <p className="mt-3 max-w-prose font-sans text-body leading-7">
              There was a problem reading from the database. Please refresh in a moment.
            </p>
          </div>
        ) : (
          <>
            <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <StatCard label="Responses" value={records.length} />
              <StatCard label="Accepting" value={accepts.length} />
              <StatCard label="Declining" value={records.length - accepts.length} />
              <StatCard label="Guests coming" value={headcount} />
            </section>

            {records.length === 0 ? (
              <div className="rounded-large border border-antique-gold/25 bg-warm-white p-10 text-center shadow-soft">
                <p className="font-display text-h3 italic text-charcoal/55">No responses yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-large border border-antique-gold/25 bg-warm-white shadow-soft">
                <table className="w-full min-w-[720px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-antique-gold/20 bg-ivory/60">
                      {["Name", "Attending", "Guests", "Note", "From", "Received"].map((heading) => (
                        <th
                          key={heading}
                          className="px-4 py-3 font-sans text-caption font-semibold uppercase tracking-[0.12em] text-charcoal/55"
                          scope="col"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b border-antique-gold/10 align-top last:border-b-0"
                      >
                        <td className="px-4 py-3 font-sans text-body font-medium text-charcoal">
                          {record.name}
                        </td>
                        <td className="px-4 py-3">
                          {record.attending ? (
                            <span className="inline-flex items-center gap-1.5 font-sans text-small font-semibold text-green-700">
                              <Check size={15} strokeWidth={2.2} /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 font-sans text-small font-semibold text-charcoal/45">
                              <X size={15} strokeWidth={2.2} /> No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-sans text-body tabular-nums text-charcoal/80">
                          {record.guests}
                        </td>
                        <td className="max-w-xs px-4 py-3 font-sans text-small leading-6 text-charcoal/70">
                          {record.note ?? <span className="text-charcoal/30">—</span>}
                        </td>
                        <td className="px-4 py-3 font-sans text-small text-charcoal/60">
                          {record.source ?? <span className="text-charcoal/30">—</span>}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-sans text-small text-charcoal/60">
                          {formatDate(record.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
