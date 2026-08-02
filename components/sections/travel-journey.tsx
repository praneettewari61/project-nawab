"use client";

import { motion, type Variants } from "framer-motion";
import { Car, Globe, MapPin, Plane } from "lucide-react";
import Image from "next/image";
import { Monogram } from "@/components/opening/monogram";
import { SOFT_EASE } from "@/lib/animation/motion";
import { ScrollIndicator } from "./scroll-indicator";
import { invitationDetails } from "@/lib/config/invitation";
import type { JourneyChip, RoutesCard } from "@/lib/config/travel";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { cn } from "@/lib/utils";

/*
 * A cinematic ~6s journey timeline that plays once when the card enters view:
 * the path draws itself, the globe → Delhi appear, a plane glides to Lucknow,
 * Lucknow glows on arrival, then the couple's monogram shimmers in and the
 * arrival message fades up. Purely declarative timing (per-element delays) so
 * there's no animation JavaScript running every frame beyond Framer's own.
 *
 * Reduced motion: the orchestrator's `initial` is disabled, so every element
 * starts at its resting state — no sequence, no plane, no looping shimmer.
 */

const GOLD = "rgba(176,141,87,";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: SOFT_EASE, delay } }),
};
const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (delay = 0) => ({ opacity: 1, scale: 1, transition: { duration: 0.55, ease: SOFT_EASE, delay } }),
};
const drawV: Variants = {
  hidden: { scaleY: 0 },
  visible: (delay = 0) => ({ scaleY: 1, transition: { duration: 0.6, ease: SOFT_EASE, delay } }),
};
const flightLineV: Variants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 0.9, ease: SOFT_EASE, delay: 1.2 } },
};
const planeV: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: [0, 1, 1, 0],
    y: [0, 6, 40, 46],
    transition: { duration: 1.4, ease: SOFT_EASE, delay: 1.9, times: [0, 0.12, 0.85, 1] },
  },
};
const glowV: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: [0, 0.85, 0], scale: [0.5, 1.4, 1.85], transition: { duration: 1.4, ease: SOFT_EASE, delay: 3.2 } },
};
const monogramV: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: SOFT_EASE, delay: 3.9 } },
};
const shimmerV: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: [0, 0.45, 0.2, 0.45, 0.2],
    scale: [0.9, 1.12, 1, 1.12, 1],
    transition: { duration: 3.6, ease: "easeInOut", delay: 4.9, repeat: Infinity, repeatDelay: 0.8 },
  },
};

/** A short vertical segment of the path that draws itself downward. */
function Connector({ delay, className }: { delay: number; className?: string }) {
  return (
    <span aria-hidden="true" className={cn("pointer-events-none w-px", className)}>
      <motion.span
        className="block h-full w-full origin-top bg-gradient-to-b from-antique-gold/50 to-antique-gold/40"
        custom={delay}
        variants={drawV}
      />
    </span>
  );
}

function CityNode({ city, code, delay }: { city: string; code: string; delay: number }) {
  return (
    <motion.div className="mt-2 flex flex-col items-center" custom={delay} variants={fadeUp}>
      <span className="font-display text-body-large font-medium leading-none text-deep-maroon">{city}</span>
      <span className="mt-1 font-sans text-small font-medium uppercase tracking-[0.22em] text-charcoal/45">{code}</span>
    </motion.div>
  );
}

function Chip({ chip }: { chip: JourneyChip }) {
  const Icon = chip.icon === "road" ? Car : Plane;
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center gap-2.5 rounded-full border border-antique-gold/30 bg-ivory/60 px-4 py-2.5",
        "transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out",
        "[@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:border-antique-gold/60 [@media(hover:hover)]:hover:bg-warm-white [@media(hover:hover)]:hover:shadow-gold-glow",
        "motion-reduce:transition-none",
      )}
    >
      <Icon aria-hidden="true" className="shrink-0 text-antique-gold" size={16} strokeWidth={1.6} />
      <span className="font-sans text-caption leading-5 text-charcoal/75">{chip.label}</span>
    </div>
  );
}

/** The "Getting to Lucknow" card body — replaces the old airport flowchart. */
export function TravelJourney({ card }: { card: RoutesCard }) {
  const reduce = useSafeReducedMotion();
  const { subtitle, journey, note, chips } = card;

  return (
    <>
      <motion.p
        className="relative mt-3 font-sans text-body leading-7 text-charcoal/75"
        variants={fadeUp}
      >
        {subtitle}
      </motion.p>

      <motion.div
        aria-hidden="true"
        className="relative mt-7 flex flex-col items-center text-center"
        initial={reduce ? false : "hidden"}
        viewport={{ once: true, amount: 0.15 }}
        whileInView="visible"
      >
        {/* Origin */}
        <motion.span
          className="grid size-12 place-items-center rounded-full border border-antique-gold/40 bg-ivory text-antique-gold shadow-[inset_0_0_0_1px_rgb(176_141_87/8%)]"
          custom={0.3}
          variants={popIn}
        >
          <Globe size={20} strokeWidth={1.4} />
        </motion.span>
        <motion.span
          className="mt-2 font-sans text-caption font-semibold uppercase tracking-[0.24em] text-antique-gold"
          custom={0.6}
          variants={fadeUp}
        >
          {journey.origin}
        </motion.span>

        <Connector className="my-2 h-7" delay={0.7} />

        {/* Delhi */}
        <motion.span
          className="grid size-10 place-items-center rounded-full border border-antique-gold/45 bg-ivory text-antique-gold"
          custom={1.15}
          variants={popIn}
        >
          <MapPin size={17} strokeWidth={1.5} />
        </motion.span>
        <CityNode city={journey.hub.city} code={journey.hub.code} delay={1.2} />

        {/* Flight segment — the path draws, then a plane glides down it. */}
        <div className="relative my-2 h-16 w-full">
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2">
            <motion.span
              className="block h-full w-full origin-top bg-gradient-to-b from-antique-gold/45 to-antique-gold/45"
              variants={flightLineV}
            />
          </span>
          {reduce ? null : (
            <div className="absolute left-1/2 top-0 -translate-x-1/2">
              <motion.div variants={planeV}>
                <Plane className="rotate-[135deg] text-antique-gold" size={18} strokeWidth={1.5} />
              </motion.div>
            </div>
          )}
        </div>

        {/* Lucknow — softly glows as the plane arrives. */}
        <div className="relative grid place-items-center">
          {reduce ? null : (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute size-20 rounded-full"
              style={{ background: `radial-gradient(circle, ${GOLD}0.5), transparent 70%)` }}
              variants={glowV}
            />
          )}
          <motion.span
            className="relative z-10 grid size-10 place-items-center rounded-full border border-antique-gold/50 bg-ivory text-antique-gold"
            custom={3.1}
            variants={popIn}
          >
            <MapPin size={17} strokeWidth={1.5} />
          </motion.span>
        </div>
        <CityNode city={journey.destination.city} code={journey.destination.code} delay={3.2} />

        <Connector className="my-2 h-7" delay={3.5} />

        {/* Monogram — fades in, then a soft golden pulse. */}
        <div className="relative grid place-items-center">
          {reduce ? null : (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute size-24 rounded-full"
              style={{ background: `radial-gradient(circle, ${GOLD}0.45), ${GOLD}0.08) 45%, transparent 70%)` }}
              variants={shimmerV}
            />
          )}
          <motion.div
            className="relative z-10 grid size-16 place-items-center rounded-full border border-antique-gold/50 bg-ivory shadow-[inset_0_0_0_1px_rgb(176_141_87/8%)]"
            variants={monogramV}
          >
            {invitationDetails.monogramImageSrc ? (
              <Image
                alt="Akshita & Varnit monogram"
                className="h-auto w-9"
                height={788}
                src={invitationDetails.monogramImageSrc}
                unoptimized
                width={1238}
              />
            ) : (
              <Monogram className="text-[1.05rem]" value={invitationDetails.monogram} />
            )}
          </motion.div>
        </div>

        <Connector className="my-2 h-6" delay={4.3} />

        {/* Arrival message */}
        <motion.p
          className="font-display text-h3 font-medium italic leading-tight text-deep-maroon"
          custom={4.6}
          variants={fadeUp}
        >
          {journey.arrivalSubtitle}
        </motion.p>

        {/* Supporting information */}
        <motion.p
          className="mt-8 max-w-md font-sans text-caption leading-6 text-charcoal/60"
          custom={5.5}
          variants={fadeUp}
        >
          {note}
        </motion.p>
        <motion.div
          className="mt-4 flex w-full flex-col items-stretch gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center"
          custom={5.7}
          variants={fadeUp}
        >
          {chips.map((chip) => (
            <Chip chip={chip} key={chip.label} />
          ))}
        </motion.div>
      </motion.div>

      {/* This card's finale (arrival monogram + chips) reads as a natural
          stopping point, so on phones — where the next card isn't visible in
          the same glance — a quiet cue nudges guests to keep scrolling to
          "Discover Beyond Lucknow" rather than assuming the page ends here. */}
      <ScrollIndicator className="relative mt-9 sm:hidden" label="More to Discover" />
    </>
  );
}
