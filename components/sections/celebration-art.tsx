import { cn } from "@/lib/utils";

/**
 * Bespoke single-weight gold line illustrations for the Wedding Celebrations
 * chapter. Two sets: small marks used on the closed cards, and wide banners
 * revealed inside each expanded card. All stay within the invitation's gold
 * line-art language — no photographs, no bright fills.
 */

interface ArtProps {
  className?: string;
}

/* ————————————————————————————— Card marks ————————————————————————————— */

/** Haldi — a brass turmeric bowl with rising aroma. */
export function BrassBowlMark({ className }: ArtProps) {
  return (
    <svg aria-hidden="true" className={cn("text-antique-gold", className)} fill="none" viewBox="0 0 44 44">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2">
        <path d="M19 13c-1-1.4-1-2.8 0-4.2" strokeWidth="1" />
        <path d="M25 13c-1-1.4-1-2.8 0-4.2" strokeWidth="1" />
        <path d="M14.5 22c1.8-3.4 4.2-5 7.5-5s5.7 1.6 7.5 5" />
        <ellipse cx="22" cy="23" rx="13" ry="3.2" />
        <path d="M9.4 23.6C10.5 29 15.6 33 22 33s11.5-4 12.6-9.4" />
        <path d="M17 33.4 16 36h12l-1-2.6" />
      </g>
    </svg>
  );
}

/** Sangeet — a tabla with a musical note. */
export function TablaMark({ className }: ArtProps) {
  return (
    <svg aria-hidden="true" className={cn("text-antique-gold", className)} fill="none" viewBox="0 0 44 44">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2">
        <ellipse cx="16" cy="16" rx="8" ry="2.6" />
        <circle cx="16" cy="16" r="2.3" />
        <path d="M8 16c0 8 1.6 14 8 14s8-6 8-14" />
        <path d="M11 18.5 12.4 27M21 18.5 19.6 27M16 18.6V29.8" strokeWidth="0.9" />
        <path d="M30 27V15.5l5-1.2V25" strokeWidth="1.2" />
        <ellipse cx="28.4" cy="27" fill="currentColor" rx="2.2" ry="1.7" stroke="none" transform="rotate(-18 28.4 27)" />
        <ellipse cx="33.4" cy="25.4" fill="currentColor" rx="2.2" ry="1.7" stroke="none" transform="rotate(-18 33.4 25.4)" />
      </g>
    </svg>
  );
}

/** Wedding — a mandap with a garland swag and a small sacred fire. */
export function MandapMark({ className }: ArtProps) {
  return (
    <svg aria-hidden="true" className={cn("text-antique-gold", className)} fill="none" viewBox="0 0 44 44">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2">
        <path d="M22 5 33 14H11L22 5Z" />
        <path d="M22 5V2.6" />
        <circle cx="22" cy="1.7" fill="currentColor" r="1.1" stroke="none" />
        <path d="M10 14h24" />
        <path d="M13 14v19M31 14v19" />
        <path d="M10 33h24" />
        <path d="M13 15.6c3.6 3 14.4 3 18 0" strokeWidth="0.9" />
        <path d="M22 32c-1.8-1.9-.9-3.9 0-6.2 1 2.3 1.8 4.3 0 6.2Z" strokeWidth="1" />
      </g>
    </svg>
  );
}

/** Reception — a floral arch framing two raised glasses. */
export function FloralArchMark({ className }: ArtProps) {
  return (
    <svg aria-hidden="true" className={cn("text-antique-gold", className)} fill="none" viewBox="0 0 44 44">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2">
        <path d="M8 36V22a14 14 0 0 1 28 0v14" />
        <circle cx="8" cy="22" fill="currentColor" r="1.5" stroke="none" />
        <circle cx="22" cy="8" fill="currentColor" r="1.5" stroke="none" />
        <circle cx="36" cy="22" fill="currentColor" r="1.5" stroke="none" />
        <circle cx="13" cy="13" fill="currentColor" r="1.1" stroke="none" />
        <circle cx="31" cy="13" fill="currentColor" r="1.1" stroke="none" />
        {/* two glasses raised */}
        <path d="M17 20.5 18.6 27M21.4 19.6 19.8 27M17 20.5 21.4 19.6M19.2 27 18.6 34M16.4 34h4.4" />
        <path d="M27 20.5 25.4 27M22.6 19.6 24.2 27M27 20.5 22.6 19.6M24.8 27 25.4 34M23.2 34h4.4" />
      </g>
    </svg>
  );
}

export const CELEBRATION_ART = {
  haldi: BrassBowlMark,
  sangeet: TablaMark,
  wedding: MandapMark,
  reception: FloralArchMark,
} as const;

