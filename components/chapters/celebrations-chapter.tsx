"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { CalendarPlus, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CardAtmosphere } from "@/components/sections/celebration-atmosphere";
import {
  CornerFiligree,
  ExpandEmblem,
  FloatingPetals,
  GoldInkDivider,
  JaaliBackdrop,
  LotusFlourish,
  MandalaMark,
} from "@/components/sections/celebration-ornaments";
import { RingsMark } from "@/components/sections/chapter-art";
import { Container } from "@/components/ui";
import { SOFT_EASE, revealBlur, revealItem, staggerContainer } from "@/lib/animation/motion";
import { downloadIcs } from "@/lib/calendar";
import { celebrations, type CelebrationArt, type CelebrationEvent } from "@/lib/config/chapters";
import { invitationDetails } from "@/lib/config/invitation";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { cn } from "@/lib/utils";

/** Soft, mood-specific ambient wash behind each card — no bright colour. */
const AMBIENT: Record<CelebrationArt, string> = {
  haldi: "radial-gradient(130% 90% at 50% 0%, rgba(215,155,53,0.10), transparent 68%)",
  sangeet: "radial-gradient(130% 90% at 50% 0%, rgba(150,88,140,0.10), transparent 68%)",
  wedding: "radial-gradient(130% 95% at 50% 0%, rgba(214,196,150,0.11), transparent 66%)",
  reception: "radial-gradient(130% 90% at 50% 0%, rgba(205,185,143,0.12), transparent 68%)",
};

/** Hand-painted illustration for each card, with a focal point for cropping. */
const BANNER_IMG: Record<CelebrationArt, { src: string; position: string }> = {
  haldi: { src: "/images/celebrations/haldi.webp", position: "32% center" },
  sangeet: { src: "/images/celebrations/sangeet.webp", position: "48% center" },
  wedding: { src: "/images/celebrations/wedding.webp", position: "42% center" },
  reception: { src: "/images/celebrations/reception.webp", position: "30% center" },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: SOFT_EASE, when: "beforeChildren", staggerChildren: 0.08 },
  },
};
/** The illustration settles from a whisper of zoom as the card reveals. */
const imgReveal: Variants = {
  hidden: { opacity: 0, scale: 1.03 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: SOFT_EASE } },
};
/* The handcrafted opening sequence inside an expanded card. */
const panelStagger: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.05, staggerChildren: 0.055, when: "beforeChildren" } },
};
const panelItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: SOFT_EASE } },
};
const chipsContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
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
  const img = BANNER_IMG[event.art];
  const panelId = `celebration-${event.id}-panel`;
  const buttonId = `celebration-${event.id}-button`;

  return (
    <motion.li className="list-none" variants={cardVariants}>
      <div
        className={cn(
          "paper-texture group relative overflow-hidden rounded-card border border-antique-gold/30 bg-warm-white shadow-card",
          "transition-[transform,box-shadow,border-color] duration-500 ease-out",
          "[@media(hover:hover)]:hover:-translate-y-[3px] [@media(hover:hover)]:hover:border-antique-gold/55 [@media(hover:hover)]:hover:shadow-card-hover",
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
          open && "-translate-y-[2px] border-antique-gold/45 shadow-card-hover",
        )}
      >
        {/* Mood ambient wash. */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" style={{ background: AMBIENT[event.art] }} />
        {/* Embossed paper — soft top highlight + inner depth. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2] rounded-card shadow-[inset_0_1px_0_rgba(255,253,248,0.7),inset_0_-16px_28px_-20px_rgba(94,67,34,0.16)]"
        />
        {/* Faint vignette for a richer handmade-paper surface. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2] rounded-card"
          style={{ background: "radial-gradient(135% 105% at 50% 0%, transparent 60%, rgba(94,67,34,0.05))" }}
        />
        {/* Inset gold hairline — frames the card, brightens on hover. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[7px] z-[2] rounded-[1.05rem] border border-antique-gold/15 transition-colors duration-500 group-hover:border-antique-gold/30 motion-reduce:transition-none"
        />

        {/* Closed header — hand-painted illustration + title; toggles the panel. */}
        <button
          aria-controls={panelId}
          aria-expanded={open}
          className="group/tap relative z-[1] block w-full text-left"
          id={buttonId}
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <div className="flex flex-col sm:flex-row sm:items-stretch">
            {/* Illustration */}
            <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-auto sm:min-h-[13.5rem] sm:w-[48%]">
              <motion.div className="absolute inset-0" variants={imgReveal}>
                <motion.div
                  animate={reduce ? { scale: 1 } : { scale: open ? 1.06 : 1 }}
                  className="absolute inset-0 will-change-transform"
                  transition={
                    reduce
                      ? { duration: 0 }
                      : open
                        ? { duration: 16, ease: "linear" }
                        : { duration: 0.7, ease: SOFT_EASE }
                  }
                >
                  <div className="absolute inset-0 transition-transform duration-700 ease-out [@media(hover:hover)]:group-hover:scale-[1.02] motion-reduce:transition-none">
                    <Image
                      alt=""
                      className="object-cover"
                      fill
                      sizes="(max-width: 640px) 100vw, 380px"
                      src={img.src}
                      style={{ objectPosition: img.position }}
                    />
                  </div>
                </motion.div>
              </motion.div>
              {/* Subtle ivory wash so the art reads as printed onto the paper. */}
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ivory/[0.10]" />
              {/* Foreground atmosphere — light, petals, particles. */}
              <CardAtmosphere art={event.art} />
              {/* Gently fade the painting into the paper — let the art breathe. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-warm-white via-warm-white/45 to-transparent sm:hidden"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-warm-white via-warm-white/45 to-transparent sm:block"
              />
            </div>

            {/* Title block — nudged up to overlap the faded artwork on mobile. */}
            <div className="relative z-[3] -mt-7 flex flex-1 flex-col items-center justify-center gap-2 overflow-hidden px-9 pb-7 pt-3 text-center sm:mt-0 sm:py-9">
              <GoldRipple />
              {/* Tiny gold corner ornaments frame the content diagonally. */}
              <CornerFiligree className="pointer-events-none absolute right-0 top-0 w-12 opacity-40" />
              <CornerFiligree className="pointer-events-none absolute bottom-0 left-0 w-12 -scale-100 opacity-[0.22]" />
              <span className="relative font-display text-h3 font-medium leading-tight text-deep-maroon">{event.name}</span>
              <GoldInkDivider width={58} />
              <span className="relative flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5 font-sans text-caption font-medium uppercase tracking-[0.18em] text-charcoal/55">
                {event.date}
                <span aria-hidden="true" className="text-antique-gold">
                  &middot;
                </span>
                {event.time}
              </span>
              <ExpandEmblem className="absolute right-3 top-1/2 -translate-y-1/2" open={open} />
            </div>
          </div>
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
                <div className="border-t border-antique-gold/15 px-6 pb-8 pt-7 sm:px-8 sm:pb-9">
                  <motion.div className="flex justify-center" variants={panelItem}>
                    <GoldInkDivider width={110} />
                  </motion.div>
                  <motion.p
                    className="mt-6 flex items-center justify-center gap-2 text-center font-sans text-caption font-medium uppercase tracking-[0.18em] text-charcoal/60"
                    variants={panelItem}
                  >
                    <MapPin aria-hidden="true" className="text-antique-gold" size={15} strokeWidth={1.7} />
                    {event.venue}
                  </motion.p>

                  <motion.p
                    className="mx-auto mt-5 max-w-prose text-center font-display text-body-large italic leading-loose text-charcoal/80"
                    variants={panelItem}
                  >
                    {event.description}
                  </motion.p>

                  <motion.p
                    className="mt-8 text-center font-sans text-small font-semibold uppercase tracking-[0.26em] text-antique-gold"
                    variants={panelItem}
                  >
                    What to Expect
                  </motion.p>
                  <motion.ul className="mt-4 flex flex-wrap justify-center gap-2.5" variants={chipsContainer}>
                    {event.highlights.map((highlight) => (
                      <motion.li
                        className="rounded-full border border-antique-gold/30 bg-ivory px-4 py-2 font-sans text-caption text-charcoal/75"
                        key={highlight}
                        variants={chipItem}
                      >
                        {highlight}
                      </motion.li>
                    ))}
                  </motion.ul>

                  <motion.div className="mt-8 flex justify-center" variants={panelItem}>
                    <button
                      className="group/cta relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-full border border-antique-gold/70 bg-transparent px-5 py-2 font-sans text-sm font-medium text-antique-gold transition-[background-color,color,box-shadow,transform] duration-300 ease-out hover:bg-antique-gold hover:text-warm-white hover:shadow-gold-glow active:scale-[0.98] motion-reduce:transition-none"
                      onClick={() =>
                        downloadIcs(
                          {
                            title: `${event.name} — Akshita & Varnit`,
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
                  </motion.div>

                  <motion.div className="mt-7 flex justify-center" variants={panelItem}>
                    <MandalaMark className="w-6 opacity-40" />
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
          className="relative mx-auto mt-12 flex max-w-2xl flex-col gap-7 md:mt-16 md:gap-8"
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
                alt="Akshita & Varnit monogram"
                className="h-auto w-9"
                height={788}
                src={invitationDetails.monogramImageSrc}
                unoptimized
                width={1238}
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
