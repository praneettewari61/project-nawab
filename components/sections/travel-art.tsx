import { cn } from "@/lib/utils";

/**
 * Bespoke, single-weight line illustrations for the Travel section. All use
 * `currentColor` so colour comes from the parent's text colour, and carry no
 * fills beyond the small finial marks — keeping them delicate and "engraved".
 */

interface ArtProps {
  className?: string;
}

/** A small up-pointing airliner silhouette. */
export function PlaneMark({ className }: ArtProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M12 2c1 0 1.7 1.5 1.7 3.6v2.9l7.3 4.3v1.9l-7.3-2.1v4.3l2.1 1.5v1.5L12 22.3l-3.8 1.2v-1.5l2.1-1.5v-4.3L3 18.6v-1.9l7.3-4.3V5.6C10.3 3.5 11 2 12 2Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

/** Minimal Taj Mahal — central onion dome, chhatris, two flanking minarets. */
export function TajMahalLine({ className }: ArtProps) {
  return (
    <svg aria-hidden="true" className={cn("text-antique-gold", className)} fill="none" viewBox="0 0 72 54">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3">
        {/* platform + main body */}
        <path d="M4 50h64" />
        <path d="M20 46V29h32v17" />
        {/* central iwan arch */}
        <path d="M30 46v-8a6 6 0 0 1 12 0v8" />
        {/* onion dome + drum + finial */}
        <path d="M28 29h16" />
        <path d="M28 29c-1-9 3-15 8-15s9 6 8 15" />
        <path d="M36 14V7" />
        <circle cx="36" cy="5.4" fill="currentColor" r="1.3" stroke="none" />
        {/* corner chhatris */}
        <path d="M22 29c0-3.6 1.6-5.4 3-5.4s3 1.8 3 5.4" />
        <path d="M44 29c0-3.6 1.6-5.4 3-5.4s3 1.8 3 5.4" />
        {/* left minaret */}
        <path d="M8 46V24h5v22" />
        <path d="M8 24c0-2 1.1-3.4 2.5-3.4S13 22 13 24" />
        <path d="M10.5 20.4V17" />
        <path d="M8 31h5M8 37.5h5" />
        {/* right minaret */}
        <path d="M59 46V24h5v22" />
        <path d="M59 24c0-2 1.1-3.4 2.5-3.4S64 22 64 24" />
        <path d="M61.5 20.4V17" />
        <path d="M59 31h5M59 37.5h5" />
      </g>
    </svg>
  );
}

/**
 * Minimal Bara Imambara (Lucknow) — a grand Nawabi facade: three arches, a
 * central dome with finial, flanking chhatri domes, and corner minaret tips.
 */
export function BaraImambaraLine({ className }: ArtProps) {
  return (
    <svg aria-hidden="true" className={cn("text-antique-gold", className)} fill="none" viewBox="0 0 72 54">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3">
        {/* ground + facade block */}
        <path d="M4 50h64" />
        <path d="M12 50V24h48v26" />
        {/* three arches */}
        <path d="M30 50V36a6 6 0 0 1 12 0v14" />
        <path d="M17 50V40a3.5 3.5 0 0 1 7 0v10" />
        <path d="M48 50V40a3.5 3.5 0 0 1 7 0v10" />
        {/* cornice */}
        <path d="M12 24h48" />
        {/* central dome + finial */}
        <path d="M30 24c0-7 3-11 6-11s6 4 6 11" />
        <path d="M36 13V8" />
        <circle cx="36" cy="6.6" fill="currentColor" r="1.2" stroke="none" />
        {/* flanking chhatri domes */}
        <path d="M16 24c0-3.4 1.4-5 3-5s3 1.6 3 5" />
        <path d="M50 24c0-3.4 1.4-5 3-5s3 1.6 3 5" />
        {/* corner minaret tips */}
        <path d="M12 24V16" />
        <circle cx="12" cy="14.6" fill="currentColor" r="1" stroke="none" />
        <path d="M60 24V16" />
        <circle cx="60" cy="14.6" fill="currentColor" r="1" stroke="none" />
      </g>
    </svg>
  );
}

/**
 * Minimal Shri Ram Mandir (Ayodhya) — a tall central Nagara shikhara flanked by
 * two smaller spires over a pillared plinth with a doorway; kalash finials.
 */
export function RamMandirLine({ className }: ArtProps) {
  return (
    <svg aria-hidden="true" className={cn("text-antique-gold", className)} fill="none" viewBox="0 0 72 54">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3">
        {/* platform + pillared plinth */}
        <path d="M6 50h60" />
        <path d="M14 50V40h44v10" />
        <path d="M23 50V40M32 50V40M41 50V40M50 50V40" />
        {/* doorway */}
        <path d="M33 50v-6a3 3 0 0 1 6 0v6" />
        {/* central shikhara */}
        <path d="M30 40C30 28 32 16 36 11" />
        <path d="M42 40C42 28 40 16 36 11" />
        <path d="M36 12V40" />
        <path d="M31 22c-1 7-1 11 0 18M41 22c1 7 1 11 0 18" />
        {/* central amalaka + kalash */}
        <ellipse cx="36" cy="10" rx="3.2" ry="1.5" />
        <path d="M36 10V6.4" />
        <circle cx="36" cy="5.2" fill="currentColor" r="1.1" stroke="none" />
        {/* flanking spires */}
        <path d="M16 40C16 33 18 28 20 26c2 2 4 7 4 14" />
        <path d="M20 26V22" />
        <circle cx="20" cy="21" fill="currentColor" r="0.9" stroke="none" />
        <path d="M48 40c0-7 2-12 4-14 2 2 4 7 4 14" />
        <path d="M52 26V22" />
        <circle cx="52" cy="21" fill="currentColor" r="0.9" stroke="none" />
      </g>
    </svg>
  );
}

/**
 * Minimal Varanasi — riverside temple spires rising from the ghat steps by the
 * Ganga, with kalash finials and a soft ripple of water.
 */
export function GhatsLine({ className }: ArtProps) {
  return (
    <svg aria-hidden="true" className={cn("text-antique-gold", className)} fill="none" viewBox="0 0 72 54">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3">
        {/* river + a soft ripple */}
        <path d="M3 50h66" />
        <path d="M6 47.4q2.4-1.3 4.8 0M61 47.4q2.4-1.3 4.8 0" />
        {/* stepped ghat rising to the temple platform */}
        <path d="M7 47h54" />
        <path d="M11 44h46" />
        <path d="M15 41h38" />
        <path d="M19 38h34" />
        {/* central shikhara + ribs */}
        <path d="M30 38C30 27 32 19 36 15" />
        <path d="M42 38C42 27 40 19 36 15" />
        <path d="M32 24c-1 6-1 9 0 14M40 24c1 6 1 9 0 14" />
        {/* amalaka + kalash */}
        <ellipse cx="36" cy="14" rx="3" ry="1.4" />
        <path d="M36 14V10.4" />
        <circle cx="36" cy="9.2" fill="currentColor" r="1.1" stroke="none" />
        {/* arched doorway */}
        <path d="M33 38v-6a3 3 0 0 1 6 0v6" />
        {/* left flanking spire */}
        <path d="M22 38C22 31 23.5 26 25 24.5c1.5 1.5 3 6 3 13.5" />
        <path d="M25 24.5V21" />
        <circle cx="25" cy="19.8" fill="currentColor" r="0.9" stroke="none" />
        {/* right flanking spire */}
        <path d="M44 38c0-7.5 1.5-12.5 3-14 1.5 1.5 3 6.5 3 13.5" />
        <path d="M47 24V20.5" />
        <circle cx="47" cy="19.3" fill="currentColor" r="0.9" stroke="none" />
      </g>
    </svg>
  );
}

export const DESTINATION_ART = {
  taj: TajMahalLine,
  imambara: BaraImambaraLine,
  ram: RamMandirLine,
  ghats: GhatsLine,
} as const;
