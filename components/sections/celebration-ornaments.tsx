"use client";

import { motion } from "framer-motion";
import { SOFT_EASE } from "@/lib/animation/motion";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { cn } from "@/lib/utils";

/*
 * Shared "gold-foil" ornaments for the Wedding Celebrations chapter: a nearly
 * invisible Mughal jaali backdrop, a divider that draws itself in gold ink,
 * and a scatter of petals that drift and fade. All decorative (aria-hidden)
 * and reduced-motion aware.
 */

interface OrnamentProps {
  className?: string;
}

/** A nearly invisible interlocking-circle jaali lattice laid over the paper. */
export function JaaliBackdrop({ className }: OrnamentProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full text-antique-gold", className)}
      style={{ opacity: 0.025 }}
    >
      <defs>
        <pattern height="44" id="nawab-jaali" patternUnits="userSpaceOnUse" width="44">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="0" cy="0" r="22" />
            <circle cx="44" cy="0" r="22" />
            <circle cx="0" cy="44" r="22" />
            <circle cx="44" cy="44" r="22" />
            <circle cx="22" cy="22" r="22" />
          </g>
        </pattern>
      </defs>
      <rect fill="url(#nawab-jaali)" height="100%" width="100%" />
    </svg>
  );
}

/**
 * A gold-ink divider: two hairlines draw outward from a central lotus-bud
 * diamond when it scrolls into view. Reused in the hero and inside each card.
 */
export function GoldInkDivider({ width = 120, className, delay = 0 }: OrnamentProps & { width?: number; delay?: number }) {
  const reduce = useSafeReducedMotion();
  const line = {
    initial: reduce ? false : { pathLength: 0 },
    whileInView: { pathLength: 1 },
    viewport: { once: true, amount: 0.6 },
    transition: { duration: 0.75, ease: SOFT_EASE, delay },
  } as const;
  const dot = {
    initial: reduce ? false : { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, amount: 0.6 },
    transition: { duration: 0.5, ease: SOFT_EASE, delay: delay + 0.35 },
  } as const;
  const bloom = {
    initial: reduce ? false : { opacity: 0, scale: 0.6 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, amount: 0.6 },
    transition: { duration: 0.5, ease: SOFT_EASE, delay: delay + 0.3 },
  } as const;

  return (
    <svg
      aria-hidden="true"
      className={cn("text-antique-gold", className)}
      fill="none"
      height={(width / 120) * 14}
      viewBox="0 0 120 14"
      width={width}
    >
      <motion.path d="M50 7H16" stroke="currentColor" strokeLinecap="round" strokeWidth="1" {...line} />
      <motion.path d="M70 7H104" stroke="currentColor" strokeLinecap="round" strokeWidth="1" {...line} />
      <motion.circle cx="14" cy="7" fill="currentColor" r="1.1" {...dot} />
      <motion.circle cx="106" cy="7" fill="currentColor" r="1.1" {...dot} />
      <motion.circle cx="48" cy="7" fill="currentColor" r="1" {...dot} />
      <motion.circle cx="72" cy="7" fill="currentColor" r="1" {...dot} />
      <motion.path
        d="M60 1.8c2.7 1.9 4.6 3.2 6.2 4.7-1.6 1.5-3.5 2.8-6.2 4.7-2.7-1.9-4.6-3.2-6.2-4.7 1.6-1.5 3.5-2.8 6.2-4.7Z"
        stroke="currentColor"
        strokeWidth="1"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        {...bloom}
      />
    </svg>
  );
}

/** A single soft petal. */
function Petal({ className }: OrnamentProps) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 12 16">
      <path d="M6 0C9.5 4.5 9.5 11 6 16 2.5 11 2.5 4.5 6 0Z" />
    </svg>
  );
}

interface FloatingPetalsProps {
  className?: string;
  /** Ambient tone. */
  tone?: "gold" | "marigold";
  /** How many petals to drift. Kept small for calm and performance. */
  count?: number;
}

// Stable, hand-tuned drift so the scatter feels arranged rather than random.
const PETAL_SEEDS = [
  { left: "12%", size: 12, dur: 11, delay: 0, gap: 3, drift: 120, sway: 14, rot: -12 },
  { left: "28%", size: 9, dur: 14, delay: 2.5, gap: 4, drift: 150, sway: -18, rot: 20 },
  { left: "52%", size: 14, dur: 12.5, delay: 1.2, gap: 5, drift: 135, sway: 20, rot: 8 },
  { left: "71%", size: 10, dur: 15, delay: 3.4, gap: 3.5, drift: 160, sway: -14, rot: -18 },
  { left: "87%", size: 11, dur: 13, delay: 0.8, gap: 4.5, drift: 130, sway: 12, rot: 14 },
] as const;

/** A few petals drifting gently downward and fading — never busy. */
export function FloatingPetals({ className, tone = "gold", count = 5 }: FloatingPetalsProps) {
  const reduce = useSafeReducedMotion();
  if (reduce) return null;

  const color = tone === "marigold" ? "text-warning/40" : "text-antique-gold/35";

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {PETAL_SEEDS.slice(0, count).map((p, i) => (
        <motion.span
          animate={{ opacity: [0, 0.55, 0], y: [0, p.drift], x: [0, p.sway, 0], rotate: [p.rot, p.rot + 36] }}
          className={cn("absolute -top-4 block", color)}
          key={i}
          style={{ left: p.left, width: p.size, height: (p.size / 12) * 16 }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, repeatDelay: p.gap, ease: "easeInOut" }}
        >
          <Petal className="h-full w-full" />
        </motion.span>
      ))}
    </div>
  );
}

/** A tiny lotus flourish to flank headings. */
export function LotusFlourish({ className }: OrnamentProps) {
  return (
    <svg aria-hidden="true" className={cn("text-antique-gold", className)} fill="none" viewBox="0 0 28 16">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
        <path d="M14 14c0-4 0-6 0-8" />
        <path d="M14 14c-2.4 0-4.6-1.4-5.4-4 2.6-.6 4.6.6 5.4 4Z" />
        <path d="M14 14c2.4 0 4.6-1.4 5.4-4-2.6-.6-4.6.6-5.4 4Z" />
        <path d="M14 13c-1.2-2.2-1.2-4.4 0-6.6 1.2 2.2 1.2 4.4 0 6.6Z" />
        <path d="M2 12h4M22 12h4" />
      </g>
    </svg>
  );
}
