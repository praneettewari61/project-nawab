import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface WaxSealProps {
  /** Diameter in pixels. Defaults to a comfortable 128px touch target. */
  size?: number;
  /** Optional embossed caption, split on "\n" into stacked lines. */
  label?: string;
  /**
   * Path to a rendered seal image. When provided it replaces the CSS dome —
   * used for the photoreal seal on the invitation card.
   */
  imageSrc?: string;
  /** Adds the soft antique-gold halo used on the splash screen. */
  glow?: boolean;
  /** Renders a real <button> with focus/hover affordances. */
  interactive?: boolean;
  onPress?: () => void;
  /** Accessible name; required when interactive. */
  ariaLabel?: string;
  className?: string;
}

/*
 * The dome, rim and specular highlight are layered gradients — expressed as a
 * style object because multi-stop radial gradients are far more legible here
 * than escaped Tailwind arbitrary values. Everything else stays utility-first.
 */
const domeStyle: CSSProperties = {
  backgroundImage:
    "radial-gradient(120% 120% at 32% 26%, #dcbd86 0%, #c39f6a 34%, #a9814d 64%, #7d5c33 100%)",
  boxShadow:
    "inset 0 3px 4px rgba(255,246,230,0.55), inset 0 -6px 12px rgba(64,42,18,0.5), 0 12px 26px rgba(70,48,20,0.32)",
};

const innerDiscStyle: CSSProperties = {
  backgroundImage:
    "radial-gradient(110% 110% at 50% 34%, #c8a878 0%, #b0925c 55%, #8f6f42 100%)",
  boxShadow:
    "inset 0 2px 5px rgba(54,34,12,0.5), inset 0 -2px 4px rgba(255,244,224,0.4)",
};

/** Small engraved flourish used above and below the caption. */
function SealFlourish({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 40 8"
    >
      <path d="M20 4c-4-3-8-3-12 0M20 4c4-3 8-3 12 0" stroke="currentColor" strokeLinecap="round" strokeWidth="0.9" />
      <circle cx="20" cy="4" r="1.4" fill="currentColor" />
    </svg>
  );
}

/** Centered four-petal motif for the caption-less (splash) seal. */
function SealMotif() {
  return (
    <svg aria-hidden="true" className="size-2/5 text-warm-white/85" fill="none" viewBox="0 0 48 48">
      <path d="M24 8C29 13 29 19 24 22C19 19 19 13 24 8Z" fill="currentColor" />
      <path d="M40 24C35 29 29 29 26 24C29 19 35 19 40 24Z" fill="currentColor" />
      <path d="M24 40C19 35 19 29 24 26C29 29 29 35 24 40Z" fill="currentColor" />
      <path d="M8 24C13 19 19 19 22 24C19 29 13 29 8 24Z" fill="currentColor" />
      <circle cx="24" cy="24" r="2.4" fill="currentColor" />
    </svg>
  );
}

/** A realistic embossed wax seal, usable as decoration or as a button. */
export function WaxSeal({
  size = 128,
  label,
  imageSrc,
  glow = false,
  interactive = false,
  onPress,
  ariaLabel,
  className,
}: WaxSealProps) {
  const lines = label?.split("\n") ?? [];

  const content = imageSrc ? (
    // Transparent PNG (background cut out), so it drops onto any paper tone; a
    // soft drop-shadow grounds the wax on the card.
    <Image
      alt=""
      className="pointer-events-none select-none drop-shadow-[0_6px_12px_rgba(94,67,34,0.28)]"
      height={size}
      src={imageSrc}
      unoptimized
      width={size}
    />
  ) : (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid place-items-center rounded-full",
        glow && "shadow-gold-glow",
      )}
      style={{ ...domeStyle, width: size, height: size }}
    >
      {/* specular highlight */}
      <span className="pointer-events-none absolute left-[18%] top-[14%] size-1/3 rounded-full bg-warm-white/40 blur-md" />
      {/* engraved inner medallion */}
      <span
        className="relative grid size-[76%] place-items-center rounded-full text-[#5e4322]"
        style={innerDiscStyle}
      >
        <span className="absolute inset-[6%] rounded-full border border-[#5e4322]/25" />
        {lines.length > 0 ? (
          <span className="flex flex-col items-center gap-1 px-2 text-center">
            <SealFlourish className="w-8 text-[#5e4322]/70" />
            {lines.map((line) => (
              <span
                key={line}
                className="font-display text-caption font-semibold uppercase leading-tight tracking-[0.14em] text-[#4d3618] [text-shadow:0_1px_0_rgba(255,244,224,0.45)]"
              >
                {line}
              </span>
            ))}
            <SealFlourish className="w-8 rotate-180 text-[#5e4322]/70" />
          </span>
        ) : (
          <SealMotif />
        )}
      </span>
    </span>
  );

  if (interactive) {
    return (
      <button
        aria-label={ariaLabel}
        className={cn(
          "group inline-grid place-items-center rounded-full transition-transform duration-300 ease-out",
          "hover:scale-[1.04] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:ring-offset-4 focus-visible:ring-offset-ivory",
          className,
        )}
        onClick={onPress}
        type="button"
      >
        {content}
      </button>
    );
  }

  return <span className={cn("inline-grid", className)}>{content}</span>;
}
