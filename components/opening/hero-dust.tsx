"use client";

import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";

/*
 * A few slow, warm motes of light/dust drifting through the Hero — the quiet
 * atmosphere of late-afternoon sun. Deliberately sparse, low-opacity and soft
 * (no glitter, no twinkle, no sparkle). Transform/opacity only; nothing renders
 * under prefers-reduced-motion.
 */

// Hand-placed so the scatter feels arranged, not random. Slow + faint.
const MOTES = [
  { left: "16%", top: "72%", size: 4, dur: 30, delay: 0, rise: 130, sway: 16, op: 0.22 },
  { left: "33%", top: "84%", size: 3, dur: 36, delay: 5, rise: 160, sway: -14, op: 0.16 },
  { left: "52%", top: "68%", size: 5, dur: 33, delay: 2.5, rise: 120, sway: 12, op: 0.2 },
  { left: "68%", top: "80%", size: 3, dur: 38, delay: 8, rise: 150, sway: -18, op: 0.15 },
  { left: "82%", top: "74%", size: 4, dur: 32, delay: 4, rise: 135, sway: 14, op: 0.2 },
  { left: "24%", top: "58%", size: 3, dur: 40, delay: 11, rise: 170, sway: -10, op: 0.13 },
  { left: "74%", top: "60%", size: 4, dur: 34, delay: 7, rise: 145, sway: 16, op: 0.17 },
] as const;

export function HeroDust() {
  const reduce = useSafeReducedMotion();
  if (reduce) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {MOTES.map((m, i) => (
        <motion.span
          animate={{ y: [0, -m.rise], x: [0, m.sway, 0], opacity: [0, m.op, m.op, 0] }}
          className="absolute rounded-full blur-[1.5px]"
          key={i}
          style={{
            left: m.left,
            top: m.top,
            width: m.size,
            height: m.size,
            background: "radial-gradient(circle, rgba(242,226,192,0.9), rgba(242,226,192,0) 70%)",
          }}
          transition={{ duration: m.dur, delay: m.delay, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
        />
      ))}
    </div>
  );
}
