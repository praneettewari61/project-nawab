"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { CalendarPlus, ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";
import { OrnamentalDivider } from "@/components/opening/ornamental-divider";
import { CELEBRATION_ART } from "@/components/sections/celebration-art";
import { RingsMark } from "@/components/sections/chapter-art";
import { Container } from "@/components/ui";
import { SOFT_EASE, revealBlur, revealItem, staggerContainer } from "@/lib/animation/motion";
import { downloadIcs } from "@/lib/calendar";
import { venue } from "@/lib/config/celebration";
import { celebrations, type CelebrationAccent, type CelebrationEvent } from "@/lib/config/chapters";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { cn } from "@/lib/utils";

/** Faint, palette-only accent behind each event's icon — subtle personality, no bright colour. */
const ACCENT_BG: Record<CelebrationAccent, string> = {
  gold: "bg-antique-gold/10",
  rose: "bg-soft-rose/15",
  maroon: "bg-deep-maroon/[0.07]",
  sage: "bg-muted-sage/15",
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

function EventCard({ event }: { event: CelebrationEvent }) {
  const reduce = useSafeReducedMotion();
  const [open, setOpen] = useState(false);
  const Art = CELEBRATION_ART[event.art];
  const panelId = `celebration-${event.id}-panel`;
  const buttonId = `celebration-${event.id}-button`;

  return (
    <motion.li className="list-none" variants={cardVariants}>
      <div
        className={cn(
          "paper-texture group relative overflow-hidden rounded-card border border-antique-gold/25 bg-warm-white shadow-card",
          "transition-[transform,box-shadow] duration-500 ease-out",
          "[@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-card-hover motion-reduce:transition-none",
        )}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[7px] z-0 rounded-[1.05rem] border border-antique-gold/12"
        />

        {/* Closed essentials — always visible, toggles the panel. */}
        <button
          aria-controls={panelId}
          aria-expanded={open}
          className="relative z-[1] flex w-full items-center gap-4 p-6 text-left transition-transform duration-200 active:scale-[0.995] motion-reduce:transition-none sm:gap-5 sm:p-7"
          id={buttonId}
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <motion.span
            aria-hidden="true"
            className={cn(
              "grid size-14 shrink-0 place-items-center rounded-full border border-antique-gold/35 text-antique-gold",
              ACCENT_BG[event.accent],
            )}
            variants={iconVariants}
          >
            <Art className="h-9 w-auto" />
          </motion.span>

          <span className="min-w-0 flex-1">
            <span className="block font-display text-h3 font-medium leading-tight text-deep-maroon">
              {event.name}
            </span>
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
                height: { duration: reduce ? 0 : 0.4, ease: SOFT_EASE },
                opacity: { duration: reduce ? 0 : 0.3, ease: "easeOut" },
              }}
            >
              <div className="border-t border-antique-gold/15 px-6 pb-6 pt-5 sm:px-7 sm:pb-7">
                <p className="flex items-center gap-2 font-sans text-caption font-medium uppercase tracking-[0.16em] text-charcoal/60">
                  <MapPin aria-hidden="true" className="text-antique-gold" size={15} strokeWidth={1.7} />
                  {event.venue}
                </p>

                <p className="mt-4 max-w-prose font-sans text-body leading-7 text-charcoal/80">
                  {event.description}
                </p>

                <p className="mt-5 font-sans text-small font-semibold uppercase tracking-[0.2em] text-antique-gold">
                  What to Expect
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {event.highlights.map((highlight) => (
                    <li
                      className="rounded-full border border-antique-gold/30 bg-ivory px-3.5 py-1.5 font-sans text-caption text-charcoal/75"
                      key={highlight}
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    className="group/cta inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-antique-gold/70 bg-transparent px-5 py-2 font-sans text-sm font-medium text-antique-gold transition-[background-color,color,box-shadow] duration-300 hover:bg-antique-gold hover:text-warm-white hover:shadow-gold-glow motion-reduce:transition-none"
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
                    <CalendarPlus aria-hidden="true" size={16} strokeWidth={1.8} />
                    Add to Calendar
                  </button>

                  <a
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-2 py-2 font-sans text-sm font-medium text-charcoal/60 underline decoration-antique-gold/40 underline-offset-4 transition-colors duration-300 hover:text-deep-maroon hover:decoration-antique-gold motion-reduce:transition-none"
                    href={venue.mapUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <MapPin aria-hidden="true" size={15} strokeWidth={1.7} />
                    View Venue
                    <span className="sr-only"> on Google Maps (opens in a new tab)</span>
                  </a>
                </div>
              </div>
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
    <Container className="py-14 md:py-20">
      <motion.div
        className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center"
        initial={reduce ? false : "hidden"}
        variants={staggerContainer}
        viewport={{ once: true, amount: 0.4 }}
        whileInView="visible"
      >
        <motion.div className="text-antique-gold" variants={revealItem}>
          <RingsMark className="h-8 w-auto" />
        </motion.div>
        <motion.p
          className="font-sans text-caption font-semibold uppercase tracking-[0.36em] text-antique-gold"
          variants={revealItem}
        >
          {celebrations.eyebrow}
        </motion.p>
        <motion.h2
          className="font-display text-[2.5rem] font-medium leading-[1.05] tracking-[-0.01em] text-deep-maroon sm:text-[3.25rem] md:text-h1"
          id="celebrations-chapter-heading"
          variants={revealBlur}
        >
          {celebrations.title}
        </motion.h2>
        <motion.div variants={revealItem}>
          <OrnamentalDivider width={120} />
        </motion.div>
        <motion.p
          className="max-w-md font-display text-body-large italic text-charcoal/60 sm:text-h3"
          variants={revealItem}
        >
          {celebrations.intro}
        </motion.p>
      </motion.div>

      <motion.ol
        className="mx-auto mt-12 flex max-w-2xl flex-col gap-5 md:mt-16"
        initial={reduce ? false : "hidden"}
        variants={staggerContainer}
        viewport={{ once: true, amount: 0.15 }}
        whileInView="visible"
      >
        {celebrations.events.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </motion.ol>
    </Container>
  );
}
