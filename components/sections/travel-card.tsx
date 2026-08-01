"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Compass, Plane, Stamp, type LucideIcon } from "lucide-react";
import { OrnamentalDivider } from "@/components/opening/ornamental-divider";
import { SOFT_EASE } from "@/lib/animation/motion";
import type {
  Destination,
  DestinationsNote,
  TravelCard as TravelCardData,
  TravelCardIcon,
  TravelLink,
} from "@/lib/config/travel";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { cn } from "@/lib/utils";
import { ScrollIndicator } from "./scroll-indicator";
import { DESTINATION_ART } from "./travel-art";
import { TravelJourney } from "./travel-journey";

/** Keeps the config a pure data file — icon keys resolve to components here. */
const HEADER_ICON: Record<TravelCardIcon, LucideIcon> = {
  visa: Stamp,
  flight: Plane,
  explore: Compass,
};

/*
 * Motion: cards fade + rise with an 80ms stagger across the grid (via `custom`),
 * then each card's contents settle in a short internal stagger. Only `initial`
 * is gated for reduced motion — `whileInView` and `variants` stay set so the
 * global MotionConfig can snap transforms without ever leaving content hidden.
 */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: SOFT_EASE,
      delay: index * 0.08,
      when: "beforeChildren",
      staggerChildren: 0.07,
    },
  }),
};
const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: SOFT_EASE } },
};
const riseVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: SOFT_EASE } },
};
// Destination tiles: a gentle stagger, each tile revealing its monument first.
const tilesContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const tileVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: SOFT_EASE, when: "beforeChildren", staggerChildren: 0.06 },
  },
};
const artVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 6 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: SOFT_EASE } },
};

interface TravelCardProps {
  card: TravelCardData;
  index: number;
  className?: string;
}

/**
 * A framed, handmade-paper Travel card. The luxury shell (border, inset gold
 * hairline, layered warm shadow, hover lift) is shared; the body is chosen by
 * the card's `kind`, so each card can be as visual as it needs to be.
 */
export function TravelCard({ card, index, className }: TravelCardProps) {
  const reduce = useSafeReducedMotion();
  const HeaderIcon = HEADER_ICON[card.icon];

  return (
    <motion.li
      className={cn("list-none", className)}
      custom={index}
      initial={reduce ? false : "hidden"}
      variants={cardVariants}
      viewport={{ once: true, amount: 0.12 }}
      whileInView="visible"
    >
      <div
        className={cn(
          "paper-texture group relative flex h-full flex-col rounded-card border border-antique-gold/25 bg-warm-white p-6 shadow-card sm:p-7",
          "transition-[transform,box-shadow,border-color] duration-500 ease-out will-change-transform",
          "[@media(hover:hover)]:hover:-translate-y-1.5 [@media(hover:hover)]:hover:border-antique-gold/45 [@media(hover:hover)]:hover:shadow-card-hover",
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        )}
      >
        {/* Inset gold hairline — the "framed invitation" detail. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[7px] rounded-[1.05rem] border border-antique-gold/15"
        />

        <motion.span
          aria-hidden="true"
          className="relative grid size-12 place-items-center rounded-full border border-antique-gold/35 bg-ivory text-antique-gold shadow-[inset_0_0_0_1px_rgb(176_141_87/8%)]"
          variants={iconVariants}
        >
          <HeaderIcon size={20} strokeWidth={1.5} />
        </motion.span>

        <motion.h3
          className="relative mt-5 font-display text-h3 font-medium leading-tight text-deep-maroon"
          variants={riseVariants}
        >
          {card.title}
        </motion.h3>

        {card.kind === "info" ? <InfoBody body={card.body} action={card.action} reduce={reduce} /> : null}
        {card.kind === "routes" ? <TravelJourney card={card} /> : null}
        {card.kind === "destinations" ? (
          <DestinationsBody destinations={card.destinations} note={card.note} subtitle={card.subtitle} />
        ) : null}
      </div>
    </motion.li>
  );
}

/* ————————————————————————————————— Info ————————————————————————————————— */

function InfoBody({ body, action, reduce }: { body: string; action?: TravelLink; reduce: boolean }) {
  return (
    <>
      <motion.p
        className="relative mt-3 max-w-[36ch] font-sans text-body leading-7 text-charcoal/75"
        variants={riseVariants}
      >
        {body}
      </motion.p>
      {action ? (
        <motion.div className="relative mt-auto pt-7" variants={riseVariants}>
          <ActionLink action={action} reduce={reduce} />
        </motion.div>
      ) : null}

      {/* This is a short card, so on phones there's a long, quiet stretch
          before "Getting to Lucknow" visibly kicks off its animation below —
          long enough that people give up scrolling before it starts. */}
      <motion.div className="relative mt-7 sm:hidden" variants={riseVariants}>
        <ScrollIndicator label="Keep Scrolling" />
      </motion.div>
    </>
  );
}

function ActionLink({ action, reduce }: { action: TravelLink; reduce: boolean }) {
  return (
    <motion.a
      className={cn(
        "group/btn inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-antique-gold/70 bg-transparent px-5 py-2",
        "font-sans text-sm font-medium leading-6 text-antique-gold",
        "transition-[background-color,color,box-shadow] duration-300 hover:bg-antique-gold hover:text-warm-white hover:shadow-gold-glow",
        "motion-reduce:transition-none sm:w-auto",
      )}
      href={action.href}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {action.label}
      {action.external ? (
        <>
          <ArrowUpRight
            aria-hidden="true"
            className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 motion-reduce:transition-none"
            size={16}
            strokeWidth={1.8}
          />
          <span className="sr-only"> (opens in a new tab)</span>
        </>
      ) : null}
    </motion.a>
  );
}

/* ———————————————————————————— Destinations ———————————————————————————— */

function DestinationTile({ destination }: { destination: Destination }) {
  const Art = DESTINATION_ART[destination.art];
  return (
    <motion.div
      className={cn(
        "paper-texture group/tile overflow-hidden rounded-[1.15rem] border border-antique-gold/20 bg-ivory/70",
        "transition-colors duration-500 [@media(hover:hover)]:hover:border-antique-gold/45 [@media(hover:hover)]:hover:bg-ivory motion-reduce:transition-none",
      )}
      variants={tileVariants}
    >
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:gap-7 sm:p-7">
        {/* Left: monument icon + name, divider, blurb */}
        <div className="flex items-start gap-4 sm:w-[40%] sm:shrink-0">
          <motion.span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-full border border-antique-gold/35 bg-ivory text-antique-gold shadow-[inset_0_0_0_1px_rgb(176_141_87/8%)]"
            variants={artVariants}
          >
            <Art className="h-7 w-auto" />
          </motion.span>
          <div className="flex flex-col items-start gap-2.5">
            <motion.h4 className="font-display text-h3 font-medium leading-none text-deep-maroon" variants={riseVariants}>
              {destination.name}
            </motion.h4>
            <motion.div variants={riseVariants}>
              <OrnamentalDivider width={72} />
            </motion.div>
            <motion.p className="max-w-[46ch] font-sans text-caption leading-6 text-charcoal/60" variants={riseVariants}>
              {destination.blurb}
            </motion.p>
          </div>
        </div>

        {/* Right: the city's gold line-illustration. Multiply blends the paper
            background into the tile so only the linework shows. */}
        <motion.div className="w-full sm:flex-1" variants={artVariants}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            className={cn(
              "h-auto w-full mix-blend-multiply transition-transform duration-500 ease-out will-change-transform",
              "[@media(hover:hover)]:group-hover/tile:scale-[1.015] motion-reduce:transition-none",
            )}
            src={`/images/discover/${destination.id}.webp`}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

/** The couple's closing note — an italic, handwritten-feeling recommendation. */
function DestinationsNoteBlock({ note }: { note: DestinationsNote }) {
  return (
    <motion.div className="relative mt-9 flex flex-col items-center gap-4 text-center" variants={riseVariants}>
      <OrnamentalDivider width={96} />
      <h4 className="font-display text-h3 font-medium italic leading-tight text-deep-maroon">{note.title}</h4>
      <p className="max-w-xl font-display text-body-large italic leading-relaxed text-charcoal/70 sm:text-h3">
        {note.body}
      </p>
      {note.signature ? (
        <p className="font-display text-body-large italic text-antique-gold">— {note.signature}</p>
      ) : null}
    </motion.div>
  );
}

function DestinationsBody({
  subtitle,
  destinations,
  note,
}: {
  subtitle: string;
  destinations: Destination[];
  note: DestinationsNote;
}) {
  return (
    <>
      <motion.p
        className="relative mt-3 max-w-[62ch] font-sans text-body leading-7 text-charcoal/75"
        variants={riseVariants}
      >
        {subtitle}
      </motion.p>
      <motion.div className="relative mt-7 flex flex-col gap-4 sm:gap-5" variants={tilesContainer}>
        {destinations.map((destination) => (
          <DestinationTile destination={destination} key={destination.id} />
        ))}
      </motion.div>
      <DestinationsNoteBlock note={note} />
    </>
  );
}
