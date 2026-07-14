"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";

/**
 * Restrained, palette-only firework bursts that flank a section — celebratory
 * without being garish. They only animate while the section is in view (and
 * never for reduced-motion users). Purely decorative; transform/opacity only.
 */

const GOLD = "var(--nawab-color-antique-gold)";
const ROSE = "var(--nawab-color-soft-rose)";
const PARTICLE_COUNT = 12;
const CYCLE = 1.7;
const REPEAT_DELAY = 2.1;

interface BurstDef {
  position: { left?: string; right?: string; top: string };
  size: number;
  color: string;
  delay: number;
}

const BURSTS: BurstDef[] = [
  { position: { left: "6%", top: "20%" }, size: 34, color: GOLD, delay: 0 },
  { position: { left: "12%", top: "70%" }, size: 26, color: ROSE, delay: 1.25 },
  { position: { right: "6%", top: "24%" }, size: 30, color: ROSE, delay: 0.65 },
  { position: { right: "11%", top: "72%" }, size: 36, color: GOLD, delay: 1.85 },
];

function Burst({ size, color, delay, active }: Omit<BurstDef, "position"> & { active: boolean }) {
  return (
    <>
      {/* central flash */}
      <motion.span
        animate={active ? { opacity: [0, 0.85, 0], scale: [0.4, 1.5, 0.6] } : { opacity: 0 }}
        className="absolute rounded-full"
        initial={{ opacity: 0, scale: 0.4 }}
        style={{ width: 6, height: 6, backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
        transition={active ? { duration: CYCLE, ease: "easeOut", repeat: Infinity, repeatDelay: REPEAT_DELAY, delay } : undefined}
      />
      {Array.from({ length: PARTICLE_COUNT }).map((_, index) => {
        const angle = (index / PARTICLE_COUNT) * Math.PI * 2;
        const x = Math.cos(angle) * size;
        const y = Math.sin(angle) * size;
        return (
          <motion.span
            animate={
              active
                ? { x: [0, x], y: [0, y + size * 0.35], opacity: [0, 0.85, 0], scale: [0.5, 1, 0.7] }
                : { opacity: 0 }
            }
            className="absolute rounded-full"
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
            key={index}
            style={{ width: 3.5, height: 3.5, backgroundColor: color }}
            transition={
              active
                ? { duration: CYCLE, ease: [0.15, 0.6, 0.4, 1], repeat: Infinity, repeatDelay: REPEAT_DELAY, delay }
                : undefined
            }
          />
        );
      })}
    </>
  );
}

export function Fireworks() {
  const reduce = useSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const active = inView && !reduce;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" ref={ref}>
      {BURSTS.map((burst, index) => (
        <div className="absolute" key={index} style={burst.position}>
          <Burst active={active} color={burst.color} delay={burst.delay} size={burst.size} />
        </div>
      ))}
    </div>
  );
}
