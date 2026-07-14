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

/**
 * Hero motif: a delicate dotted flight-path arc with a paper plane arriving at
 * the crest — an editorial "journey" mark for the section header.
 */
export function HeroFlightMotif({ className }: ArtProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 148 46">
      <circle cx="10" cy="38" fill="currentColor" r="2.2" />
      <path
        d="M10 38C46 34 74 24 118 8"
        stroke="currentColor"
        strokeDasharray="0.5 6"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
      {/* Paper plane at the crest, banking up-right. */}
      <g transform="translate(120 6) rotate(28)">
        <path
          d="M0 6 18 0 8 18 5.5 11 Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.3"
        />
        <path d="M18 0 5.5 11" stroke="currentColor" strokeLinecap="round" strokeWidth="1.1" />
      </g>
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

/** Minimal Nagara-style temple — curvilinear shikhara, amalaka + kalash, doorway. */
export function TempleLine({ className }: ArtProps) {
  return (
    <svg aria-hidden="true" className={cn("text-antique-gold", className)} fill="none" viewBox="0 0 72 54">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3">
        {/* plinth + sanctum base */}
        <path d="M8 50h56" />
        <path d="M24 50V33h24v17" />
        {/* doorway */}
        <path d="M31 50v-7a5 5 0 0 1 10 0v7" />
        {/* shikhara spire */}
        <path d="M24 33C24 24 28 12 36 6c8 6 12 18 12 27" />
        {/* ribs following the curve */}
        <path d="M36 8v25" />
        <path d="M30 14c-1.4 8-1.4 13 0 19" />
        <path d="M42 14c1.4 8 1.4 13 0 19" />
        {/* horizontal bands */}
        <path d="M27 27h18M29 20.5h14" />
        {/* amalaka + kalash */}
        <ellipse cx="36" cy="6.4" rx="4" ry="1.7" />
        <path d="M36 6.4V2.4" />
        <circle cx="36" cy="1.8" fill="currentColor" r="1.2" stroke="none" />
      </g>
    </svg>
  );
}

export const DESTINATION_ART = {
  taj: TajMahalLine,
  temple: TempleLine,
} as const;
