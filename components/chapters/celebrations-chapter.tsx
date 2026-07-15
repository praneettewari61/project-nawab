"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowUpRight, CalendarPlus, ChevronDown, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CELEBRATION_ART, CELEBRATION_BANNER } from "@/components/sections/celebration-art";
import {
  FloatingPetals,
  GoldInkDivider,
  JaaliBackdrop,
  LotusFlourish,
} from "@/components/sections/celebration-ornaments";
import { RingsMark } from "@/components/sections/chapter-art";
import { Container } from "@/components/ui";
import { SOFT_EASE, revealBlur, revealItem, staggerContainer } from "@/lib/animation/motion";
import { downloadIcs } from "@/lib/calendar";
import { venue } from "@/lib/config/celebration";
import { celebrations, type CelebrationArt, type CelebrationEvent } from "@/lib/config/chapters";
import { invitationDetails } from "@/lib/config/invitation";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { cn } from "@/lib/utils";

/** Soft, mood-specific ambient wash behind each card — no bright colour. */
const AMBIENT: Record<CelebrationArt, string> = {
  haldi: "radial-gradient(130% 90% at 50% 0%, rgba(215,155,53,0.10), transparent 68%)",
  sangeet: "radial-gradient(130% 90% at 50% 0%, rgba(176,141,87,0.11), transparent 68%)",
  wedding: "radial-gradient(130% 95% at 50% 0%, rgba(201,154,78,0.09), transparent 66%)",
  reception: "radial-gradient(130% 90% at 50% 0%, rgba(205,185,143,0.12), transparent 68%)",
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: SOFT_EASE, when: "beforeChildren", staggerChildren: 0.08 },
  },
};
const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: SOFT_EASE } },
};

/* The handcrafted opening sequence inside an expanded card. */
const panelStagger: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.1, staggerChildren: 0.08, when: "beforeChildren" } },
};
const panelItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: SOFT_EASE } },
};
const bannerReveal: Variants = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: SOFT_EASE } },
};
const chipsContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const chipItem: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: SOFT_EASE } },
};

/** A gold ripple that blooms from the centre on press (CSS-only, tap feedback). */
function GoldRipple() {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full",
        "bg-[radial-gradient(circle,rgba(176,141,87,0.22),transparent_60%)] opacity-0 scale-50",
        "transition-[transform,opacity] duration-500 ease-out group-active:scale-100 group-active:opacity-100",
        "motion-reduce:hidden",
      )}
    />
  );
}

function EventCard({ event }: { event: CelebrationEvent }) {
  const reduce = useSafeReducedMotion();
  const [open, setOpen] = useState(false);
  const Art = CELEBRATION_ART[event.art];
  const Banner = CELEBRATION_BANNER[event.art];
  const panelId = `celebration-${event.id}-panel`;
  const buttonId = `celebration-${event.id}-button`;

  return (
    <motion.li className="list-none" variants={cardVariants}>
      <div
        className={cn(
          "paper-texture group relative overflow-hidden rounded-card border border-antique-gold/25 bg-warm-white shadow-card",
          "transition-[transform,box-shadow,border-color] duration-500 ease-out",
          "[@media(hover:hover)]:hover:-translate-y-[3px] [@media(hover:hover)]:hover:border-antique-gold/50 [@media(hover:hover)]:hover:shadow-card-hover",
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        )}
      >
        {/* Mood ambient wash. */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" style={{ background: AMBIENT[event.art] }} />
        {/* Haldi alone drifts a few marigold petals. */}
        {event.art === "haldi" ? <FloatingPetals className="z-0" count={4} tone="marigold" /> : null}
        {/* Inset gold hairline — brightens on hover. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[7px] z-0 rounded-[1.05rem] border border-antique-gold/12 transition-colors duration-500 group-hover:border-antique-gold/25 motion-reduce:transition-none"
        />

        {/* Closed essentials — always visible, toggles the panel. */}
        <button
          aria-controls={panelId}
          aria-expanded={open}
          className="group/tap relative z-[1] flex w-full items-center gap-4 p-6 text-left transition-transform duration-200 active:scale-[0.995] motion-reduce:transition-none sm:gap-5 sm:p-7"
          id={buttonId}
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <GoldRipple />
          <span
            aria-hidden="true"
            className={cn(
              "grid size-14 shrink-0 place-items-center rounded-full border border-antique-gold/35 bg-ivory/70 text-antique-gold",
              "transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:scale-105 motion-reduce:transition-none",
            )}
          >
            <motion.span variants={iconVariants}>
              <Art className="h-9 w-auto" />
            </motion.span>
          </span>

          <span className="min-w-0 flex-1">
            <span className="block font-display text-h3 font-medium leading-tight text-deep-maroon">{event.name}</span>
            <span className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 font-sans text-caption font-medium uppercase tracking-[0.16em] text-charcoal/55">
              {event.date}
              <span aria-hidden="true" className="text-antique-gold">
                &middot;
              </span>
              {event.time}
            </span>
          </span>

          <ChevronDown
            aria-hidden="true"
            className={cn(
              "shrink-0 text-antique-gold/70 transition-transform duration-300 motion-reduce:transition-none",
              open && "rotate-180",
            )}
            size={22}
            strokeWidth={1.6}
          />
        </button>

        {/* Expanded detail. */}
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              animate={{ height: "auto", opacity: 1 }}
              aria-labelledby={buttonId}
              className="relative z-[1] overflow-hidden"
              exit={{ height: 0, opacity: 0 }}
              id={panelId}
              initial={{ height: 0, opacity: 0 }}
              key="panel"
              role="region"
              transition={{
                height: { duration: reduce ? 0 : 0.5, ease: SOFT_EASE },
                opacity: { duration: reduce ? 0 : 0.3, ease: "easeOut" },
              }}
            >
              <motion.div animate="visible" initial={reduce ? false : "hidden"} variants={panelStagger}>
                {/* Illustration banner. */}
                <motion.div
                  className="relative h-32 overflow-hidden border-t border-antique-gold/15"
                  variants={bannerReveal}
                >
                  <Banner className="h-full w-full" />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-warm-white to-transparent"
                  />
                </motion.div>

                <div className="px-6 pb-6 pt-5 sm:px-7 sm:pb-7">
                  <motion.div className="flex justify-center" variants={panelItem}>
                    <GoldInkDivider delay={0.1} width={128} />
                  </motion.div>

                  <motion.p
                    className="mt-4 flex items-center justify-center gap-2 text-center font-sans text-caption font-medium uppercase tracking-[0.16em] text-charcoal/60"
                    variants={panelItem}
                  >
                    <MapPin aria-hidden="true" className="text-antique-gold" size={15} strokeWidth={1.7} />
                    {event.venue}
                  </motion.p>

                  <motion.p
                    className="mx-auto mt-4 max-w-prose text-center font-display text-body-large italic leading-relaxed text-charcoal/80"
                    variants={panelItem}
                  >
                    {event.description}
                  </motion.p>

                  <motion.p
                    className="mt-6 text-center font-sans text-small font-semibold uppercase tracking-[0.24em] text-antique-gold"
                    variants={panelItem}
                  >
                    What to Expect
                  </motion.p>
                  <motion.ul className="mt-3 flex flex-wrap justify-center gap-2" variants={chipsContainer}>
                    {event.highlights.map((highlight) => (
                      <motion.li
                        className="rounded-full border border-antique-gold/30 bg-ivory px-3.5 py-1.5 font-sans text-caption text-charcoal/75"
                        key={highlight}
                        variants={chipItem}
                      >
                        {highlight}
                      </motion.li>
                    ))}
                  </motion.ul>

                  <motion.div
                    className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
                    variants={panelItem}
                  >
                    <button
                      className="group/cta relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-full border border-antique-gold/70 bg-transparent px-5 py-2 font-sans text-sm font-medium text-antique-gold transition-[background-color,color,box-shadow,transform] duration-300 ease-out hover:bg-antique-gold hover:text-warm-white hover:shadow-gold-glow active:scale-[0.98] motion-reduce:transition-none"
                      onClick={() =>
                        downloadIcs(
                          {
                            title: `${event.name} — Varnit & Akshita`,
                            description: event.description,
                            location: event.venue,
                            start: event.start,
                            end: event.end,
                          },
                          `${event.id}.ics`,
                        )
                      }
                      type="button"
                    >
                      <GoldRipple />
                      <CalendarPlus aria-hidden="true" size={16} strokeWidth={1.8} />
                      Add to Calendar
                    </button>

                    <a
                      className="group/venue inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-2 py-2 font-sans text-sm font-medium text-charcoal/60 underline decoration-antique-gold/40 underline-offset-4 transition-colors duration-300 hover:text-deep-maroon hover:decoration-antique-gold motion-reduce:transition-none"
                      href={venue.mapUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <MapPin aria-hidden="true" size={15} strokeWidth={1.7} />
                      View Venue
                      <ArrowUpRight
                        aria-hidden="true"
                        className="text-antique-gold transition-transform duration-300 group-hover/venue:-translate-y-0.5 group-hover/venue:translate-x-0.5 motion-reduce:transition-none"
                        size={14}
                        strokeWidth={1.8}
                      />
                      <span className="sr-only"> on Google Maps (opens in a new tab)</span>
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.li>
  );
}

/** Wedding Celebrations — a curated, expandable itinerary of the four events. */
export function CelebrationsChapter() {
  const reduce = useSafeReducedMotion();

  return (
    <div className="relative">
      <JaaliBackdrop />

      <Container className="relative py-14 md:py-20">
        {/* Hero */}
        <motion.div
          className="relative mx-auto flex max-w-2xl flex-col items-center gap-5 text-center"
          initial={reduce ? false : "hidden"}
          variants={staggerContainer}
          viewport={{ once: true, amount: 0.4 }}
          whileInView="visible"
        >
          <FloatingPetals className="-top-6 h-56" count={5} />

          <motion.div className="text-antique-gold" variants={revealItem}>
            <motion.span
              animate={reduce ? undefined : { scale: [1, 1.045, 1] }}
              className="inline-block"
              transition={reduce ? undefined : { duration: 5, ease: "easeInOut", repeat: Infinity }}
            >
              <RingsMark className="h-8 w-auto" />
            </motion.span>
          </motion.div>

          <motion.div className="flex items-center gap-3 text-antique-gold" variants={revealItem}>
            <LotusFlourish className="h-3.5 w-auto opacity-70" />
            <p className="font-sans text-caption font-semibold uppercase tracking-[0.36em] text-antique-gold">
              {celebrations.eyebrow}
            </p>
            <LotusFlourish className="h-3.5 w-auto -scale-x-100 opacity-70" />
          </motion.div>

          <motion.h2
            className="font-display text-[2.5rem] font-medium leading-[1.05] tracking-[-0.01em] text-deep-maroon sm:text-[3.25rem] md:text-h1"
            id="celebrations-chapter-heading"
            variants={revealBlur}
          >
            {celebrations.title}
          </motion.h2>
          <motion.div variants={revealItem}>
            <GoldInkDivider width={132} />
          </motion.div>
          <motion.p
            className="max-w-md font-display text-body-large italic text-charcoal/60 sm:text-h3"
            variants={revealItem}
          >
            {celebrations.intro}
          </motion.p>
        </motion.div>

        {/* Itinerary */}
        <motion.ol
          className="relative mx-auto mt-12 flex max-w-2xl flex-col gap-5 md:mt-16"
          initial={reduce ? false : "hidden"}
          variants={staggerContainer}
          viewport={{ once: true, amount: 0.15 }}
          whileInView="visible"
        >
          {celebrations.events.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </motion.ol>

        {/* Closing */}
        <motion.div
          className="mx-auto mt-16 flex max-w-xl flex-col items-center gap-5 text-center md:mt-24"
          initial={reduce ? false : "hidden"}
          variants={staggerContainer}
          viewport={{ once: true, amount: 0.5 }}
          whileInView="visible"
        >
          <motion.div
            className="grid size-16 place-items-center rounded-full border border-antique-gold/40 bg-ivory shadow-[inset_0_0_0_1px_rgb(176_141_87/8%)]"
            variants={revealItem}
          >
            {invitationDetails.monogramImageSrc ? (
              <Image
                alt="Varnit & Akshita monogram"
                className="h-auto w-9"
                height={522}
                src={invitationDetails.monogramImageSrc}
                unoptimized
                width={380}
              />
            ) : null}
          </motion.div>
          <motion.div variants={revealItem}>
            <GoldInkDivider width={150} />
          </motion.div>
          <motion.p
            className="max-w-md font-display text-[1.6rem] italic leading-relaxed text-deep-maroon sm:text-[1.9rem]"
            variants={revealBlur}
          >
            We cannot wait to celebrate these beautiful moments with you.
          </motion.p>
          <motion.p className="font-display text-body-large italic text-charcoal/70" variants={revealItem}>
            See you in Lucknow.
          </motion.p>
          <motion.p className="font-display text-body-large italic text-antique-gold" variants={revealItem}>
            — Varnit &amp; Akshita
          </motion.p>
        </motion.div>
      </Container>
    </div>
  );
}
