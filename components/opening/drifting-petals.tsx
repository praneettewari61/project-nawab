"use client";

import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";

/*
 * A handful of petals drifting down the screen. The layout is a fixed, hand-
 * tuned list (never random) so the server and client render identically and
 * hydration stays clean. Petals are tinted from the design-system palette and
 * kept faint so they frame the scene without competing with the couple.
 */
interface Petal {
  left: string;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  rotate: number;
  opacity: number;
  tint: string;
}

const PETALS: Petal[] = [
  { left: "8%", size: 16, duration: 17, delay: 0, drift: 26, rotate: 150, opacity: 0.45, tint: "text-soft-rose" },
  { left: "24%", size: 12, duration: 22, delay: 5, drift: -34, rotate: -120, opacity: 0.35, tint: "text-antique-gold" },
  { left: "46%", size: 20, duration: 19, delay: 2.5, drift: 30, rotate: 200, opacity: 0.4, tint: "text-sand" },
  { left: "63%", size: 14, duration: 24, delay: 8, drift: -22, rotate: -160, opacity: 0.4, tint: "text-soft-rose" },
  { left: "80%", size: 18, duration: 20, delay: 4, drift: 34, rotate: 130, opacity: 0.38, tint: "text-antique-gold" },
  { left: "92%", size: 11, duration: 26, delay: 11, drift: -18, rotate: -140, opacity: 0.3, tint: "text-sand" },
];

function PetalShape({ size, tint }: { size: number; tint: string }) {
  return (
    <svg
      aria-hidden="true"
      className={tint}
      fill="currentColor"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {/* Soft asymmetric petal to read as a drifting flower petal. */}
      <path d="M12 1C18 5 22 12 18 19C15 23 9 23 6 19C2 12 6 5 12 1Z" />
    </svg>
  );
}

/** Slow, faint petals drifting across the splash. Silent under reduced motion. */
export function DriftingPetals() {
  const shouldReduceMotion = useSafeReducedMotion();
  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {PETALS.map((petal) => (
        <motion.span
          animate={{
            y: ["-12vh", "114vh"],
            x: [0, petal.drift, petal.drift * -0.4, 0],
            rotate: [0, petal.rotate],
            opacity: [0, petal.opacity, petal.opacity, 0],
          }}
          className="absolute top-0 blur-[1px]"
          initial={{ opacity: 0 }}
          key={petal.left}
          style={{ left: petal.left }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.12, 0.85, 1],
          }}
        >
          <PetalShape size={petal.size} tint={petal.tint} />
        </motion.span>
      ))}
    </div>
  );
}
