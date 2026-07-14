"use client";

import { motion } from "framer-motion";
import { OrnamentalDivider } from "@/components/opening/ornamental-divider";
import { revealBlur, revealItem, staggerContainer } from "@/lib/animation/motion";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { cn } from "@/lib/utils";

interface StoryHeaderProps {
  eyebrow: string;
  title: string;
  intro: string;
  headingId: string;
}

/** A delicate line heart crowned with a lotus bud — the "our story" motif. */
function StoryMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={cn("text-antique-gold", className)} fill="none" viewBox="0 0 48 44">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3">
        <path d="M24 38C13 30 9 17 17 12c4-3 7-1 7 4" />
        <path d="M24 38c11-8 15-21 7-26-4-3-7-1-7 4" />
        <path d="M24 5c1.3 2 2.3 3 3.5 4-1.2 1-2.2 2-3.5 4-1.3-2-2.3-3-3.5-4 1.2-1 2.2-2 3.5-4Z" />
      </g>
    </svg>
  );
}

/**
 * The "Our Journey" section header — brought in line with the rest of the site:
 * a motif, a clear hierarchy, and a soft staggered blur-up reveal.
 */
export function StoryHeader({ eyebrow, title, intro, headingId }: StoryHeaderProps) {
  const reduce = useSafeReducedMotion();

  return (
    <motion.div
      className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center sm:gap-6"
      initial={reduce ? false : "hidden"}
      variants={staggerContainer}
      viewport={{ once: true, amount: 0.5 }}
      whileInView="visible"
    >
      <motion.div className="text-antique-gold" variants={revealItem}>
        <StoryMark className="h-10 w-auto sm:h-11" />
      </motion.div>

      <motion.p
        className="font-sans text-caption font-semibold uppercase tracking-[0.36em] text-antique-gold"
        variants={revealItem}
      >
        {eyebrow}
      </motion.p>

      <motion.h2
        className="font-display text-[2.6rem] font-medium leading-[1.05] tracking-[-0.01em] text-deep-maroon sm:text-[3.25rem] md:text-h1"
        id={headingId}
        variants={revealBlur}
      >
        {title}
      </motion.h2>

      <motion.div variants={revealItem}>
        <OrnamentalDivider width={124} />
      </motion.div>

      <motion.p
        className="max-w-md font-display text-body-large italic text-charcoal/60 sm:text-h3"
        variants={revealItem}
      >
        {intro}
      </motion.p>
    </motion.div>
  );
}
