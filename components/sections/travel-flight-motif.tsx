"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { SOFT_EASE } from "@/lib/animation/motion";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";

interface FlightMotifProps {
  className?: string;
}

const ARC = "M10 38C46 34 74 24 118 8";
// Points sampled along ARC (t = 0, .25, .5, .75, 1) so the plane follows the
// curve rather than cutting a straight chord.
const PX = [10, 35.9, 61, 87.6, 118];
const PY = [38, 33.9, 27.5, 18.9, 8];

/** A small paper plane, centred on the origin and banking up-right (~-14°). */
function PlaneShape() {
  return (
    <g transform="rotate(-14)">
      <path d="M-6 -4 8 0 -6 4 -3 0 Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.2" />
      <path d="M8 0 -3 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1" />
    </g>
  );
}

/**
 * The Travel hero's journey mark: a dotted flight path that draws itself when
 * it enters view, with a paper plane that gently glides along it every few
 * seconds. Purely decorative; fully static under prefers-reduced-motion.
 */
export function FlightMotif({ className }: FlightMotifProps) {
  const reduce = useSafeReducedMotion();
  // Sanitise so the id is safe inside url(#...).
  const clipId = `flight-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;

  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 148 46">
      <defs>
        <clipPath id={clipId}>
          {/* A rect that widens left→right, revealing the dotted path as it "draws". */}
          <motion.rect
            height="46"
            initial={reduce ? false : { width: 0 }}
            transition={{ duration: 1.2, ease: SOFT_EASE }}
            viewport={{ once: true, amount: 0.6 }}
            whileInView={{ width: 148 }}
            width={reduce ? 148 : 0}
            x="0"
            y="0"
          />
        </clipPath>
      </defs>

      {/* Origin dot + dotted arc, revealed by the clip as it draws in. */}
      <g clipPath={`url(#${clipId})`}>
        <circle cx="10" cy="38" fill="currentColor" r="2.2" />
        <path d={ARC} stroke="currentColor" strokeDasharray="0.5 6" strokeLinecap="round" strokeWidth="1.4" />
      </g>

      {/* Paper plane — glides along the path on a loop, or rests at the crest. */}
      {reduce ? (
        <g transform="translate(118 8)">
          <PlaneShape />
        </g>
      ) : (
        <motion.g
          animate={{ x: PX, y: PY, opacity: [0, 1, 1, 1, 0] }}
          initial={{ x: PX[0], y: PY[0], opacity: 0 }}
          transition={{
            duration: 4.4,
            ease: "easeInOut",
            times: [0, 0.18, 0.5, 0.82, 1],
            repeat: Infinity,
            repeatDelay: 1.8,
          }}
        >
          <PlaneShape />
        </motion.g>
      )}
    </svg>
  );
}
