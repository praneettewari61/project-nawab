"use client";

import { motion, type Variants } from "framer-motion";
import { HeroDust } from "@/components/opening/hero-dust";
import { SOFT_EASE } from "@/lib/animation/motion";
import type { InvitationDetails } from "@/lib/config/invitation";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { ScrollIndicator } from "./scroll-indicator";

/** The proposal photograph the opening film morphs into — also the Hero scene. */
const HERO_BG = "/images/splashScreen/opt/proposal.webp";

interface HeroSectionProps {
  details: InvitationDetails;
  /** Becomes true once the opening film has settled onto the Hero. */
  revealed: boolean;
}

const container: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.16, delayChildren: 0.35 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  shown: { opacity: 1, y: 0, transition: { duration: 1, ease: SOFT_EASE } },
};

/**
 * The landing Hero — the proposal photograph the opening film settles onto.
 * Keeps the splash's cinematic language: the photo as the scene, warm colour
 * grade, drifting petals and parallaxing flora, with the couple's names and a
 * quiet "Scroll to Begin" cue over it. Names fade in once `revealed` is true, so
 * the finale morph flows straight into the typography.
 */
export function HeroSection({ details, revealed }: HeroSectionProps) {
  const reduce = useSafeReducedMotion();
  const state = revealed ? "shown" : "hidden";

  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-charcoal px-6 text-center">
      {/* Scene: the proposal photograph, a slow one-shot Ken Burns (103% → 100%
          over ~19s, ease-in-out, no loop/snap). A plain <img> with the SAME
          cached URL the finale morph used — and identical object-cover/center
          framing — so the opening film hands off to the Hero with no flash. */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: 1 }}
          className="absolute inset-0"
          initial={reduce ? false : { scale: 1.03 }}
          transition={reduce ? { duration: 0 } : { duration: 19, ease: "easeInOut" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute inset-0 h-full w-full object-cover object-center" src={HERO_BG} />
        </motion.div>
      </div>

      {/* Light warm grade only (lighting, not a dark overlay). */}
      <div aria-hidden="true" className="absolute inset-0 bg-antique-gold/15 mix-blend-soft-light" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-deep-maroon/15 via-transparent to-antique-gold/10 mix-blend-soft-light"
      />
      {/* Extremely subtle edge vignette (~6%) to focus the centre. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_50%,transparent_60%,rgb(20_14_8/6%)_100%)]"
      />

      {/* Warm dust/light particles */}
      <HeroDust />

      {/* Hero type sits in the upper third, against the ocean — the proposal
          scene below stays unobstructed. One elegant line for the names. */}
      <motion.div
        animate={state}
        className="absolute left-1/2 top-[14%] z-10 flex w-full max-w-4xl -translate-x-1/2 flex-col items-center px-6 text-center"
        initial={reduce ? false : "hidden"}
        variants={container}
      >
        {/* Very soft radial only behind the type (~8%) for readability. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[210%] w-[150%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(20_14_8/8%),transparent)]"
        />

        <motion.p
          className="font-sans text-caption font-semibold uppercase tracking-[0.34em] text-warm-white/80 [text-shadow:0_1px_14px_rgb(20_14_8/45%)]"
          variants={item}
        >
          {details.heroKicker}
        </motion.p>

        <motion.h1
          className="mt-[3.6vh] whitespace-nowrap font-display font-medium leading-none tracking-[-0.01em] text-warm-white [text-shadow:0_2px_22px_rgb(20_14_8/50%)]"
          variants={item}
        >
          <span className="text-[2.2rem] sm:text-[3.25rem] md:text-[4rem]">{details.partnerName}</span>
          <span className="mx-2.5 align-baseline text-[0.62em] italic text-warm-white/85 sm:mx-3.5">&amp;</span>
          <span className="text-[2.2rem] sm:text-[3.25rem] md:text-[4rem]">{details.firstName}</span>
        </motion.h1>

        <motion.p
          className="mt-[4vh] font-sans text-small font-medium uppercase tracking-[0.3em] text-warm-white/85 [text-shadow:0_1px_14px_rgb(20_14_8/45%)] sm:mt-[4.5vh] sm:text-caption"
          variants={item}
        >
          {details.weddingDates.replace(" & ", " • ")}
        </motion.p>
      </motion.div>

      {/* Scroll cue — fades in last, after the title has settled. A soft drop
          shadow keeps it legible over the foreground flowers. */}
      <motion.div
        animate={{ opacity: revealed ? 1 : 0 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 [filter:drop-shadow(0_1px_8px_rgb(20_14_8/55%))]"
        initial={false}
        transition={{ duration: 0.9, ease: SOFT_EASE, delay: 1.6 }}
      >
        <ScrollIndicator label="Scroll to Begin" labelClassName="text-warm-white/80" />
      </motion.div>
    </section>
  );
}
