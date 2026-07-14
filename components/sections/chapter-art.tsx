import { cn } from "@/lib/utils";

/** Bespoke single-weight line marks for the chapter hub, in gold. */

interface ArtProps {
  className?: string;
}

/** Two interlocking rings with a small sparkle — the celebrations. */
export function RingsMark({ className }: ArtProps) {
  return (
    <svg aria-hidden="true" className={cn("text-antique-gold", className)} fill="none" viewBox="0 0 46 30">
      <circle cx="18" cy="18" r="9.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="30" cy="18" r="9.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M35 3v5M32.5 5.5h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.1" />
    </svg>
  );
}

/** A sealed envelope — the RSVP. */
export function EnvelopeMark({ className }: ArtProps) {
  return (
    <svg aria-hidden="true" className={cn("text-antique-gold", className)} fill="none" viewBox="0 0 42 30">
      <rect height="22" rx="2.5" stroke="currentColor" strokeWidth="1.3" width="36" x="3" y="4" />
      <path d="M4 6.5 21 18 38 6.5" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.3" />
      <circle cx="21" cy="19.5" r="2.4" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
