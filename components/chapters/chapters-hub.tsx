"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { OrnamentalDivider } from "@/components/opening/ornamental-divider";
import { EnvelopeMark, RingsMark } from "@/components/sections/chapter-art";
import { PlaneMark } from "@/components/sections/travel-art";
import { Container, Section } from "@/components/ui";
import { SOFT_EASE, revealBlur, revealItem, staggerContainer } from "@/lib/animation/motion";
import { chaptersHub } from "@/lib/config/chapters";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { useChapters } from "./chapters-context";

const CARD_ICON = {
  travel: PlaneMark,
  celebrations: RingsMark,
  rsvp: EnvelopeMark,
} as const;

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: SOFT_EASE } },
};

/**
 * The short "Explore & Celebrate" hub. Three framed cards; tapping one opens
 * that chapter full-screen (via the shared chapters context). Keeps the page
 * from becoming an endless scroll.
 */
export function ChaptersHub() {
  const reduce = useSafeReducedMotion();
  const { open } = useChapters();

  return (
    <Section aria-labelledby="chapters-heading" className="py-16 md:py-24" tone="ivory">
      <Container>
        <motion.div
          className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center"
          initial={reduce ? false : "hidden"}
          variants={staggerContainer}
          viewport={{ once: true, amount: 0.4 }}
          whileInView="visible"
        >
          <motion.p
            className="font-sans text-caption font-semibold uppercase tracking-[0.36em] text-antique-gold"
            variants={revealItem}
          >
            {chaptersHub.eyebrow}
          </motion.p>
          <motion.h2
            className="font-display text-[2.5rem] font-medium leading-[1.04] tracking-[-0.01em] text-deep-maroon sm:text-[3.25rem] md:text-h1"
            id="chapters-heading"
            variants={revealBlur}
          >
            {chaptersHub.title}
          </motion.h2>
          <motion.div variants={revealItem}>
            <OrnamentalDivider width={120} />
          </motion.div>
        </motion.div>

        <motion.ul
          className="mx-auto mt-12 grid max-w-5xl gap-5 sm:gap-6 md:mt-14 md:grid-cols-3"
          initial={reduce ? false : "hidden"}
          variants={staggerContainer}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          {chaptersHub.cards.map((card) => {
            const Icon = CARD_ICON[card.id];
            return (
              <motion.li className="list-none" key={card.id} variants={cardReveal}>
                <button
                  className="group relative flex h-full w-full flex-col items-center gap-4 rounded-card border border-antique-gold/25 bg-warm-white p-8 text-center shadow-card transition-[transform,box-shadow] duration-500 ease-out will-change-transform paper-texture [@media(hover:hover)]:hover:-translate-y-1.5 [@media(hover:hover)]:hover:shadow-card-hover motion-reduce:transition-none"
                  onClick={(event) => open(card.id, event.currentTarget)}
                  type="button"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-[7px] rounded-[1.05rem] border border-antique-gold/12"
                  />
                  <span
                    aria-hidden="true"
                    className="relative grid size-14 place-items-center rounded-full border border-antique-gold/35 bg-ivory text-antique-gold shadow-[inset_0_0_0_1px_rgb(176_141_87/8%)]"
                  >
                    <Icon className="h-6 w-auto" />
                  </span>
                  <h3 className="relative font-display text-h3 font-medium leading-tight text-deep-maroon">
                    {card.title}
                  </h3>
                  <p className="relative max-w-[26ch] font-sans text-body leading-7 text-charcoal/70">
                    {card.teaser}
                  </p>
                  <span className="relative mt-auto inline-flex items-center gap-1.5 pt-2 font-sans text-caption font-semibold uppercase tracking-[0.18em] text-antique-gold">
                    Open
                    <ArrowRight
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                      size={15}
                      strokeWidth={1.9}
                    />
                  </span>
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
      </Container>
    </Section>
  );
}
