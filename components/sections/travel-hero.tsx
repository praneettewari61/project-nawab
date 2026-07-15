"use client";

import { motion, type Variants } from "framer-motion";
import { OrnamentalDivider } from "@/components/opening/ornamental-divider";
import { SOFT_EASE } from "@/lib/animation/motion";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { FlightMotif } from "./travel-flight-motif";

interface TravelHeroProps {
  eyebrow: string;
  title: string;
  intro: string;
  headingId: string;
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.04 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: SOFT_EASE } },
};
const blurRise: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: SOFT_EASE } },
};
const motif: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: SOFT_EASE } },
};

/**
 * The Travel section header. A delicate flight motif, a clear typographic
 * hierarchy (eyebrow → title → ornament → lead), and a soft blur-up entrance
 * so it reads as elegant rather than empty.
 */
export function TravelHero({ eyebrow, title, intro, headingId }: TravelHeroProps) {
  const reduce = useSafeReducedMotion();

  return (
    <motion.div
      className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center sm:gap-6"
      initial={reduce ? false : "hidden"}
      variants={container}
      viewport={{ once: true, amount: 0.5 }}
      whileInView="visible"
    >
      <motion.div className="text-antique-gold" variants={motif}>
        <FlightMotif className="h-10 w-auto sm:h-11" />
      </motion.div>

      <motion.p
        className="font-sans text-caption font-semibold uppercase tracking-[0.36em] text-antique-gold"
        variants={rise}
      >
        {eyebrow}
      </motion.p>

      <motion.h2
        className="font-display text-[2.6rem] font-medium leading-[1.05] tracking-[-0.01em] text-deep-maroon sm:text-[3.25rem] md:text-h1"
        id={headingId}
        variants={blurRise}
      >
        {title}
      </motion.h2>

      <motion.div variants={rise}>
        <OrnamentalDivider width={124} />
      </motion.div>

      <motion.p
        className="max-w-md font-display text-body-large italic text-charcoal/60 sm:text-h3"
        variants={rise}
      >
        {intro}
      </motion.p>
    </motion.div>
  );
}
