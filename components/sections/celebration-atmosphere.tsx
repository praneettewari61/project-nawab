"use client";

import { motion } from "framer-motion";
import { FloatingPetals } from "@/components/sections/celebration-ornaments";
import type { CelebrationArt } from "@/lib/config/chapters";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";

/*
 * Tiny, slow atmospheric details layered over each card's illustration to give
 * a cinematic sense of depth — a foreground of light, petals and particles in
 * front of the painting. Deliberately faint and unhurried, so guests notice it
 * only after a few seconds. Transform/opacity only; nothing renders under
 * prefers-reduced-motion except a single static glow.
 */

const GOLD = "rgba(176,141,87,";
const AMBER = "rgba(217,155,53,";
const WARM = "rgba(255,244,224,";
const MAGENTA = "rgba(150,88,140,";
const IVORY = "rgba(214,196,150,";

interface AtmosphereProps {
  art: CelebrationArt;
}

/** A soft radial glow; gently breathes unless reduced motion. */
function Glow({
  css,
  duration,
  reduce,
  base = 0.6,
}: {
  css: React.CSSProperties;
  duration: number;
  reduce: boolean;
  base?: number;
}) {
  return (
    <motion.span
      aria-hidden="true"
      animate={reduce ? undefined : { opacity: [base, Math.min(1, base + 0.3), base] }}
      className="pointer-events-none absolute"
      style={{ opacity: base, ...css }}
      transition={reduce ? undefined : { duration, ease: "easeInOut", repeat: Infinity }}
    />
  );
}

const PARTICLES = [
  { left: "18%", size: 3, dur: 9, delay: 0, rise: 70 },
  { left: "38%", size: 2, dur: 11, delay: 2.4, rise: 90 },
  { left: "62%", size: 3, dur: 10, delay: 1.2, rise: 80 },
  { left: "82%", size: 2, dur: 12, delay: 3.1, rise: 95 },
];

/** Tiny golden motes drifting slowly upward (Sangeet). */
function Particles() {
  return (
    <>
      {PARTICLES.map((p, i) => (
        <motion.span
          aria-hidden="true"
          animate={{ y: [0, -p.rise], opacity: [0, 0.7, 0] }}
          className="pointer-events-none absolute bottom-4 rounded-full"
          key={i}
          style={{ left: p.left, width: p.size, height: p.size, background: `${GOLD}0.9)` }}
          transition={{ duration: p.dur, delay: p.delay, ease: "easeInOut", repeat: Infinity }}
        />
      ))}
    </>
  );
}

/** Two soft light beams that slowly shift (Sangeet). */
function Beams() {
  return (
    <>
      {[0, 4.5].map((delay, i) => (
        <motion.span
          aria-hidden="true"
          animate={{ opacity: [0.15, 0.5, 0.15], x: ["-6%", "6%"] }}
          className="pointer-events-none absolute inset-0"
          key={i}
          style={{
            background: `linear-gradient(${112 + i * 20}deg, transparent 34%, ${WARM}0.12) 47%, transparent 60%)`,
          }}
          transition={{ duration: 9, delay, ease: "easeInOut", repeat: Infinity }}
        />
      ))}
    </>
  );
}

/** Soft blurred bokeh orbs (Sangeet). */
function Bokeh() {
  return (
    <>
      {[
        { left: "22%", top: "28%", size: 54, delay: 0 },
        { left: "68%", top: "22%", size: 40, delay: 2.6 },
      ].map((b, i) => (
        <motion.span
          aria-hidden="true"
          animate={{ opacity: [0.12, 0.34, 0.12], scale: [1, 1.18, 1] }}
          className="pointer-events-none absolute rounded-full blur-md"
          key={i}
          style={{
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle, ${GOLD}0.4), transparent 70%)`,
          }}
          transition={{ duration: 7, delay: b.delay, ease: "easeInOut", repeat: Infinity }}
        />
      ))}
    </>
  );
}

/** A faint ribbon of incense smoke rising (Wedding). */
function Smoke() {
  return (
    <motion.span
      aria-hidden="true"
      animate={{ opacity: [0, 0.35, 0], y: [8, -26], scaleX: [1, 1.5] }}
      className="pointer-events-none absolute bottom-2 w-6 blur-md"
      style={{
        left: "47%",
        height: "62%",
        transformOrigin: "bottom",
        background: `linear-gradient(to top, ${WARM}0.28), transparent)`,
      }}
      transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
    />
  );
}

const FLICKERS = [
  { left: "16%", top: "62%", delay: 0 },
  { left: "34%", top: "70%", delay: 0.8 },
  { left: "72%", top: "64%", delay: 1.5 },
];
const SPARKLES = [
  { left: "50%", top: "30%", delay: 0.5 },
  { left: "80%", top: "40%", delay: 2 },
  { left: "28%", top: "38%", delay: 3.2 },
];

/** Candle flicker + champagne sparkle (Reception). */
function CandlesAndSparkles() {
  return (
    <>
      {FLICKERS.map((f, i) => (
        <motion.span
          aria-hidden="true"
          animate={{ opacity: [0.3, 1, 0.55, 0.9, 0.35] }}
          className="pointer-events-none absolute rounded-full blur-[1px]"
          key={`f${i}`}
          style={{ left: f.left, top: f.top, width: 4, height: 5, background: `${AMBER}0.95)` }}
          transition={{ duration: 2.4, delay: f.delay, ease: "easeInOut", repeat: Infinity }}
        />
      ))}
      {SPARKLES.map((sp, i) => (
        <motion.span
          aria-hidden="true"
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
          className="pointer-events-none absolute rounded-full"
          key={`s${i}`}
          style={{ left: sp.left, top: sp.top, width: 3, height: 3, background: `${WARM}0.95)` }}
          transition={{ duration: 2.8, delay: sp.delay, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.5 }}
        />
      ))}
    </>
  );
}

/** Per-event atmosphere layered over the illustration. */
export function CardAtmosphere({ art }: AtmosphereProps) {
  const reduce = useSafeReducedMotion();

  if (art === "haldi") {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Glow
          base={0.55}
          css={{ top: "-25%", left: "-12%", width: "75%", height: "95%", background: `radial-gradient(circle, ${AMBER}0.22), transparent 70%)` }}
          duration={7}
          reduce={reduce}
        />
        <FloatingPetals count={3} tone="marigold" />
      </div>
    );
  }

  if (art === "sangeet") {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Glow
          base={0.5}
          css={{ top: "-32%", left: "4%", width: "58%", height: "92%", background: `radial-gradient(circle, ${MAGENTA}0.2), transparent 70%)` }}
          duration={8}
          reduce={reduce}
        />
        <Glow
          base={0.4}
          css={{ top: "-24%", right: "6%", width: "50%", height: "85%", background: `radial-gradient(circle, ${GOLD}0.2), transparent 70%)` }}
          duration={9}
          reduce={reduce}
        />
        {reduce ? null : (
          <>
            <Beams />
            <Bokeh />
            <Particles />
          </>
        )}
      </div>
    );
  }

  if (art === "wedding") {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Glow
          base={0.5}
          css={{ top: "-24%", left: "22%", width: "56%", height: "88%", background: `radial-gradient(circle, ${IVORY}0.2), transparent 72%)` }}
          duration={7}
          reduce={reduce}
        />
        <Glow
          base={0.55}
          css={{ bottom: "-22%", left: "34%", width: "38%", height: "70%", background: `radial-gradient(circle, ${AMBER}0.16), transparent 70%)` }}
          duration={6}
          reduce={reduce}
        />
        {reduce ? null : <Smoke />}
        <FloatingPetals count={2} tone="gold" />
      </div>
    );
  }

  // reception
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <Glow
        base={0.5}
        css={{ top: "-28%", left: "25%", width: "55%", height: "85%", background: `radial-gradient(circle, ${GOLD}0.24), transparent 70%)` }}
        duration={7}
        reduce={reduce}
      />
      {reduce ? null : <CandlesAndSparkles />}
    </div>
  );
}
