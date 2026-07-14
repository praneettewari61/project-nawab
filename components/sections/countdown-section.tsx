"use client";

import { motion } from "framer-motion";
import { OrnamentalDivider } from "@/components/opening/ornamental-divider";
import { Container, Section } from "@/components/ui";
import { revealBlur, revealItem, staggerContainer } from "@/lib/animation/motion";
import { saveTheDate } from "@/lib/config/celebration";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { CountdownTimer } from "./countdown-timer";
import { Fireworks } from "./fireworks";

/**
 * "Save the Date" — a warm invitation line, the wedding date shown large, and a
 * live countdown. Content is config-driven; motion mirrors the rest of the site
 * (staggered blur-up reveal, reduced-motion safe).
 */
export function CountdownSection() {
  const reduce = useSafeReducedMotion();

  return (
    <Section
      aria-labelledby="save-the-date-heading"
      className="relative scroll-mt-24 overflow-hidden py-16 md:py-24"
      id="save-the-date"
      tone="ivory"
    >
      {/* Soft atmospheric glow, purely decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[62vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(176_141_87/10%),transparent_70%)] blur-2xl"
      />

      {/* Celebratory bursts flanking the countdown, animating in when in view. */}
      <Fireworks />

      <Container>
        <motion.div
          className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 text-center"
          initial={reduce ? false : "hidden"}
          variants={staggerContainer}
          viewport={{ once: true, amount: 0.4 }}
          whileInView="visible"
        >
          <motion.p
            className="font-sans text-caption font-semibold uppercase tracking-[0.36em] text-antique-gold"
            variants={revealItem}
          >
            {saveTheDate.eyebrow}
          </motion.p>

          <motion.div variants={revealItem}>
            <OrnamentalDivider width={124} />
          </motion.div>

          <motion.p
            className="font-display text-h3 italic text-charcoal/65 sm:text-h2"
            variants={revealItem}
          >
            {saveTheDate.lead}
          </motion.p>

          <motion.h2
            className="font-display text-[3rem] font-medium leading-[1.02] tracking-[-0.02em] text-deep-maroon sm:text-[4.25rem] md:text-[5.25rem]"
            id="save-the-date-heading"
            variants={revealBlur}
          >
            {saveTheDate.displayDate}
          </motion.h2>

          <motion.div className="pt-2 sm:pt-4" variants={revealItem}>
            <CountdownTimer targetDate={saveTheDate.targetDate} />
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
