import { cn } from "@/lib/utils";

/**
 * Bespoke single-weight line illustrations giving each celebration its own
 * character while staying within the invitation's gold line-art language.
 */

interface ArtProps {
  className?: string;
}

/** Haldi — a delicate marigold bloom with a leaf. */
export function MarigoldMark({ className }: ArtProps) {
  const petals = Array.from({ length: 10 }, (_, i) => i * 36);
  return (
    <svg aria-hidden="true" className={cn("text-antique-gold", className)} fill="none" viewBox="0 0 44 44">
      <g stroke="currentColor" strokeWidth="1.2">
        {petals.map((angle) => (
          <ellipse cx="22" cy="12.5" key={angle} rx="2.5" ry="6" transform={`rotate(${angle} 22 22)`} />
        ))}
        <circle cx="22" cy="22" r="4.4" />
        <circle cx="22" cy="22" fill="currentColor" r="1.1" stroke="none" />
        {/* stem + leaf */}
        <path d="M22 38v-6" strokeLinecap="round" />
        <path d="M22 35c-3 0-5-1.6-5.6-4.4 2.8-.4 4.8.8 5.6 4.4Z" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** Sangeet & Cocktail — beamed musical notes with a flourish. */
export function MusicMark({ className }: ArtProps) {
  return (
    <svg aria-hidden="true" className={cn("text-antique-gold", className)} fill="none" viewBox="0 0 44 44">
      <g stroke="currentColor">
        <path d="M16 30V13l14-3.2v16.4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M16 18.4 30 15.2" strokeLinecap="round" strokeWidth="1.3" />
        <ellipse cx="12.6" cy="30.4" fill="currentColor" rx="4" ry="3" stroke="none" transform="rotate(-20 12.6 30.4)" />
        <ellipse cx="26.6" cy="26.6" fill="currentColor" rx="4" ry="3" stroke="none" transform="rotate(-20 26.6 26.6)" />
        <path d="M33 12.5c2.2-1 3.4-2.6 3.4-4.5" strokeLinecap="round" strokeWidth="1.1" />
      </g>
    </svg>
  );
}

/** Wedding — the sacred fire (agni) rising from a kund. */
export function SacredFireMark({ className }: ArtProps) {
  return (
    <svg aria-hidden="true" className={cn("text-antique-gold", className)} fill="none" viewBox="0 0 44 44">
      <g stroke="currentColor" strokeLinejoin="round" strokeWidth="1.3">
        {/* flames */}
        <path d="M22 27c-3.4-3.6-1.6-7.6 0-12 1.8 4.2 3.6 8.2 0 12Z" />
        <path d="M15.5 27c-2.4-2.6-1.3-5.6 0-8.6 1.4 3 2.6 6 0 8.6Z" />
        <path d="M28.5 27c2.4-2.6 1.3-5.6 0-8.6-1.4 3-2.6 6 0 8.6Z" />
        {/* kund + logs */}
        <path d="M12 33h20" strokeLinecap="round" />
        <path d="M14.5 33 17 28h10l2.5 5" />
        <path d="m17.5 30.5 9 2M26.5 30.5l-9 2" strokeWidth="1" />
      </g>
    </svg>
  );
}

/** Reception — two champagne flutes raised in a toast. */
export function ChampagneMark({ className }: ArtProps) {
  return (
    <svg aria-hidden="true" className={cn("text-antique-gold", className)} fill="none" viewBox="0 0 44 44">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3">
        {/* left flute */}
        <path d="M12 9.5 15.8 22" />
        <path d="M20 8 18 22" />
        <path d="M12 9.5 20 8" />
        <path d="m16.9 22-2.4 11" />
        <path d="M11 34h8" />
        {/* right flute */}
        <path d="M32 9.5 28.2 22" />
        <path d="M24 8l2 14" />
        <path d="M32 9.5 24 8" />
        <path d="m27.1 22 2.4 11" />
        <path d="M25 34h8" />
        {/* sparkle */}
        <path d="M22 5v4M20 7h4" strokeWidth="1.1" />
      </g>
    </svg>
  );
}

export const CELEBRATION_ART = {
  haldi: MarigoldMark,
  sangeet: MusicMark,
  wedding: SacredFireMark,
  reception: ChampagneMark,
} as const;
