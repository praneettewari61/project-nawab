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

/* —————————————————————————————— Banners —————————————————————————————— */

/*
 * Wide banners (600×160) revealed inside an expanded card. Each carries a soft
 * ambient wash (its mood colour, low opacity) behind gold line art. Rendered
 * with `slice` so they fill the banner box and stay centred on all widths.
 */

const BANNER_VIEWBOX = "0 0 600 160";
const bannerProps = {
  "aria-hidden": true as const,
  preserveAspectRatio: "xMidYMid slice",
  viewBox: BANNER_VIEWBOX,
};

/** A row of small blooms along a gentle garland arc. */
function garland(y: number, dip: number) {
  return `M40 ${y}Q300 ${y + dip} 560 ${y}`;
}

/** Haldi — marigold garland, brass bowl, banana leaves, morning light. */
export function HaldiBanner({ className }: ArtProps) {
  return (
    <svg className={className} {...bannerProps}>
      <defs>
        <radialGradient id="haldiGlow" cx="50%" cy="22%" r="75%">
          <stop offset="0%" stopColor="#d79b35" stopOpacity="0.2" />
          <stop offset="60%" stopColor="#d79b35" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#d79b35" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect fill="url(#haldiGlow)" height="160" width="600" />
      <g fill="none" stroke="#b08d57" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4">
        {/* morning sun rays, top-right */}
        <g opacity="0.5">
          <path d="M540 30v-10M540 30 550 20M540 30 530 20M540 30h12M540 30h-12" strokeWidth="1" />
          <circle cx="540" cy="30" r="6" />
        </g>
        {/* garland swag with marigolds */}
        <path d={garland(34, 26)} opacity="0.7" />
        {[70, 130, 190, 250, 310, 370, 430, 490, 530].map((x, i) => {
          const y = 34 + Math.sin((i / 8) * Math.PI) * 22;
          return <circle cx={x} cy={y} fill="#d79b35" fillOpacity="0.5" key={x} r={i % 2 ? 4 : 5.5} stroke="none" />;
        })}
        {/* banana leaves */}
        <path d="M120 140c-24-6-40-26-42-52 26 6 40 24 42 52Z" opacity="0.7" />
        <path d="M120 140c-2-24 6-46 26-58" opacity="0.5" strokeWidth="1" />
        <path d="M480 140c24-6 40-26 42-52-26 6-40 24-42 52Z" opacity="0.7" />
        <path d="M480 140c2-24-6-46-26-58" opacity="0.5" strokeWidth="1" />
        {/* brass turmeric bowl, centre */}
        <path d="M262 95c8-15 19-22 38-22s30 7 38 22" strokeWidth="1.3" />
        <ellipse cx="300" cy="99" rx="58" ry="12" />
        <path d="M244 103c5 22 27 37 56 37s51-15 56-37" />
        <path d="M272 139 268 150h64l-4-11" />
        {/* aroma */}
        <path d="M286 60c-4-6-4-12 0-18M300 58c-4-6-4-12 0-18M314 60c-4-6-4-12 0-18" opacity="0.6" strokeWidth="1" />
        {/* side marigolds */}
        {[
          [150, 96],
          [450, 96],
        ].map(([cx, cy]) => (
          <g key={cx}>
            {Array.from({ length: 8 }, (_, i) => (i * 360) / 8).map((a) => (
              <ellipse cx={cx} cy={cy - 12} key={a} rx="2.6" ry="7" transform={`rotate(${a} ${cx} ${cy})`} />
            ))}
            <circle cx={cx} cy={cy} r="4.5" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Sangeet — string lights, tabla pair, dancing silhouettes, notes. */
export function SangeetBanner({ className }: ArtProps) {
  return (
    <svg className={className} {...bannerProps}>
      <defs>
        <radialGradient id="sangeetGlow" cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#b08d57" stopOpacity="0.22" />
          <stop offset="65%" stopColor="#8a5a2b" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#8a5a2b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect fill="url(#sangeetGlow)" height="160" width="600" />
      <g fill="none" stroke="#b08d57" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4">
        {/* string lights */}
        <path d="M20 18Q300 62 580 18" opacity="0.6" strokeWidth="1" />
        {[20, 80, 140, 200, 260, 320, 380, 440, 500, 560].map((x, i) => {
          const y = 18 + Math.sin((i / 9) * Math.PI) * 44;
          return (
            <g key={x}>
              <path d={`M${x} ${y}v8`} strokeWidth="0.8" />
              <circle cx={x} cy={y + 11} fill="#d79b35" fillOpacity="0.45" r="3" stroke="none" />
            </g>
          );
        })}
        {/* dancing silhouettes */}
        <g opacity="0.75">
          <circle cx="120" cy="86" r="6" />
          <path d="M120 92l-4 26M120 92l8 24M120 100l-14 6M120 100l16-8M116 118l-6 20M128 116l10 18" strokeWidth="1.3" />
        </g>
        <g opacity="0.75">
          <circle cx="480" cy="86" r="6" />
          <path d="M480 92l4 26M480 92l-8 24M480 100l14 6M480 100l-16-8M484 118l6 20M472 116l-10 18" strokeWidth="1.3" />
        </g>
        {/* tabla pair, centre */}
        <g transform="translate(268 92)">
          <ellipse cx="18" cy="0" rx="15" ry="4" />
          <circle cx="18" cy="0" r="4" />
          <path d="M3 0c0 22 4 34 15 34s15-12 15-34" />
          <ellipse cx="52" cy="6" rx="12" ry="3.4" />
          <circle cx="52" cy="6" r="3.2" />
          <path d="M40 6c0 16 2 26 12 26s12-10 12-26" />
        </g>
        {/* musical notes */}
        <g opacity="0.7" strokeWidth="1.2">
          <path d="M196 66V48l7-1.6V62" />
          <ellipse cx="193.6" cy="66.4" fill="#b08d57" rx="3" ry="2.3" stroke="none" transform="rotate(-18 193.6 66.4)" />
          <path d="M410 60V44l6-1.4V56" />
          <ellipse cx="408" cy="60.4" fill="#b08d57" rx="2.7" ry="2.1" stroke="none" transform="rotate(-18 408 60.4)" />
        </g>
      </g>
    </svg>
  );
}

/** Wedding — a mandap with floral canopy, temple bells, sacred fire, lotuses. */
export function WeddingBanner({ className }: ArtProps) {
  return (
    <svg className={className} {...bannerProps}>
      <defs>
        <radialGradient id="weddingGlow" cx="50%" cy="60%" r="70%">
          <stop offset="0%" stopColor="#c99a4e" stopOpacity="0.2" />
          <stop offset="55%" stopColor="#b08d57" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#b08d57" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect fill="url(#weddingGlow)" height="160" width="600" />
      <g fill="none" stroke="#b08d57" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4">
        {/* canopy dome + finial */}
        <path d="M300 14c34 10 58 26 70 40H230c12-14 36-30 70-40Z" />
        <path d="M300 14V4" />
        <circle cx="300" cy="2.5" fill="#b08d57" r="2" stroke="none" />
        <path d="M226 54h148" />
        {/* pillars */}
        <path d="M244 54v92M356 54v92" />
        <path d="M276 54v92M324 54v92" opacity="0.5" strokeWidth="1" />
        <path d="M214 146h172" />
        {/* floral canopy swags */}
        <path d="M244 58q56 22 112 0" opacity="0.7" strokeWidth="1" />
        <path d="M244 66q56 16 112 0" opacity="0.45" strokeWidth="1" />
        {/* temple bells */}
        <g opacity="0.8">
          <path d="M276 58v8M270 78c0-8 3-12 6-12s6 4 6 12Z" transform="translate(0 0)" />
          <circle cx="276" cy="80" fill="#b08d57" r="1.4" stroke="none" />
          <path d="M324 58v8M318 78c0-8 3-12 6-12s6 4 6 12Z" />
          <circle cx="324" cy="80" fill="#b08d57" r="1.4" stroke="none" />
        </g>
        {/* sacred fire in a kund */}
        <g transform="translate(300 118)">
          <path d="M0 8c-6-6-3-13 0-20 4 7 7 14 0 20Z" />
          <path d="M-10 8c-4-4-2-9 0-14 3 5 5 10 0 14ZM10 8c4-4 2-9 0-14-3 5-5 10 0 14Z" />
          <path d="M-16 12h32" />
          <path d="M-12 12 -8 6h16l4 6" />
        </g>
        {/* lotuses at the base */}
        {[190, 410].map((cx) => (
          <g key={cx} transform={`translate(${cx} 138)`}>
            <path d="M0 4c-2.6-4.4-2.6-8.6 0-13 2.6 4.4 2.6 8.6 0 13Z" />
            <path d="M0 4c-5-.4-8.6-3-10-7.4 5-1 8.8 1 10 7.4ZM0 4c5-.4 8.6-3 10-7.4-5-1-8.8 1-10 7.4Z" />
            <path d="M0 4c-9 0-15-3.4-17.4-8.4M0 4c9 0 15-3.4 17.4-8.4" opacity="0.55" strokeWidth="1" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Reception — chandelier, floral arch, candles, raised glasses. */
export function ReceptionBanner({ className }: ArtProps) {
  return (
    <svg className={className} {...bannerProps}>
      <defs>
        <radialGradient id="receptionGlow" cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#cdb98f" stopOpacity="0.24" />
          <stop offset="60%" stopColor="#b08d57" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#b08d57" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect fill="url(#receptionGlow)" height="160" width="600" />
      <g fill="none" stroke="#b08d57" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4">
        {/* floral arch */}
        <path d="M70 152V96a230 230 0 0 1 460 0v56" opacity="0.7" />
        {[
          [70, 96],
          [160, 44],
          [300, 26],
          [440, 44],
          [530, 96],
        ].map(([cx, cy]) => (
          <circle cx={cx} cy={cy} fill="#b08d57" fillOpacity="0.4" key={cx} r="4" stroke="none" />
        ))}
        {/* chandelier */}
        <g transform="translate(300 8)">
          <path d="M0 0v14" />
          <path d="M-34 26q34 20 68 0" />
          <path d="M0 14v10" />
          <path d="M-34 26v6M-17 32v6M0 24v10M17 32v6M34 26v6" />
          {[-34, -17, 0, 17, 34].map((x, i) => (
            <path d={`M${x} ${i === 2 ? 34 : 38}q3 6 0 10`} key={x} strokeWidth="1" />
          ))}
          <circle cx="0" cy="24" fill="#d79b35" fillOpacity="0.5" r="2" stroke="none" />
        </g>
        {/* candles + table line */}
        <path d="M150 150h300" opacity="0.6" />
        {[220, 300, 380].map((x) => (
          <g key={x}>
            <path d={`M${x} 150v-16`} />
            <path d={`M${x} 134c-2.6-3-1.3-6.4 0-9.6 1.4 3.2 2.6 6.6 0 9.6Z`} />
            <circle cx={x} cy="127" fill="#d79b35" fillOpacity="0.5" r="1.6" stroke="none" />
          </g>
        ))}
        {/* raised glasses */}
        <g opacity="0.85">
          <path d="M186 150 184 132M198 150 200 132M184 132 200 132 192 122 184 132ZM192 150v-18" transform="translate(-70 0)" />
          <path d="M186 150 184 132M198 150 200 132M184 132 200 132 192 122 184 132ZM192 150v-18" transform="translate(478 0) scale(-1 1)" />
        </g>
      </g>
    </svg>
  );
}

export const CELEBRATION_BANNER = {
  haldi: HaldiBanner,
  sangeet: SangeetBanner,
  wedding: WeddingBanner,
  reception: ReceptionBanner,
} as const;
