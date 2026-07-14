"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import { SOFT_EASE } from "@/lib/animation/motion";

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getRemaining(target: number): Remaining {
  const diff = Math.max(0, target - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

/** Two stacked gold dots — a delicate separator between units. */
function Separator() {
  return (
    <span className="flex h-[1em] flex-col items-center justify-center gap-1.5 text-[2.5rem] sm:text-[3.5rem] md:text-[4.25rem]">
      <span className="size-[0.06em] rounded-full bg-antique-gold/45" />
      <span className="size-[0.06em] rounded-full bg-antique-gold/45" />
    </span>
  );
}

function Unit({ label, value }: { label: string; value: number | null }) {
  const display = value === null ? "––" : String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2.5">
      <span className="relative flex items-center justify-center overflow-hidden font-display text-[2.5rem] font-medium leading-none tracking-[-0.01em] text-deep-maroon tabular-nums sm:text-[3.5rem] md:text-[4.25rem]">
        {/* Reserves width/height so the animated swap never shifts layout. */}
        <span className="invisible">{display}</span>
        <AnimatePresence initial={false}>
          <motion.span
            animate={{ y: "0%", opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center"
            exit={{ y: "-55%", opacity: 0 }}
            initial={{ y: "55%", opacity: 0 }}
            key={display}
            transition={{ duration: 0.4, ease: SOFT_EASE }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-charcoal/50 sm:text-small">
        {label}
      </span>
    </div>
  );
}

/**
 * A live wedding-day countdown with a gentle per-second digit swap. It mounts
 * showing placeholders (so SSR and first client render match), then ticks once
 * per second. Marked aria-hidden — the readable date carries the information,
 * so screen readers aren't spammed every second.
 */
export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const target = new Date(targetDate).getTime();
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(getRemaining(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div aria-hidden="true" className="flex items-start justify-center gap-3 sm:gap-5 md:gap-7">
      {UNITS.map((unit, index) => (
        <Fragment key={unit.key}>
          {index > 0 ? <Separator /> : null}
          <Unit label={unit.label} value={remaining ? remaining[unit.key] : null} />
        </Fragment>
      ))}
    </div>
  );
}
