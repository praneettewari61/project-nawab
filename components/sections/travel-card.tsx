"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, ChevronDown, Compass, Plane, Stamp, type LucideIcon } from "lucide-react";
import { SOFT_EASE } from "@/lib/animation/motion";
import type {
  Destination,
  RouteOption,
  RouteStop,
  TravelCard as TravelCardData,
  TravelCardIcon,
  TravelLink,
} from "@/lib/config/travel";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { cn } from "@/lib/utils";
import { DESTINATION_ART } from "./travel-art";

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
      viewport={{ once: true, amount: 0.25 }}
      whileInView="visible"
    >
      <div
        className={cn(
          "paper-texture group relative flex h-full flex-col rounded-card border border-antique-gold/25 bg-warm-white p-7 shadow-card sm:p-8",
          "transition-[transform,box-shadow] duration-500 ease-out will-change-transform",
          "[@media(hover:hover)]:hover:-translate-y-1.5 [@media(hover:hover)]:hover:shadow-card-hover",
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
        {card.kind === "routes" ? <RoutesBody options={card.options} /> : null}
        {card.kind === "destinations" ? <DestinationsBody destinations={card.destinations} /> : null}
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

/* ——————————————————————————————— Routes ——————————————————————————————— */

function StopNode({ stop }: { stop: RouteStop }) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-full border border-antique-gold/40 bg-ivory text-antique-gold"
      >
        <Plane size={16} strokeWidth={1.6} />
      </span>
      <span className="text-left">
        <span className="block font-display text-body-large font-medium leading-none text-deep-maroon">
          {stop.city}
        </span>
        <span className="mt-1 block font-sans text-small font-medium uppercase tracking-[0.22em] text-charcoal/45">
          {stop.code}
        </span>
      </span>
    </div>
  );
}

function RouteConnector() {
  return (
    <span aria-hidden="true" className="ml-[17px] flex h-7 flex-col items-center justify-center gap-0.5">
      <span className="w-px flex-1 border-l border-dashed border-antique-gold/50" />
      <ChevronDown className="text-antique-gold/70" size={13} strokeWidth={1.8} />
      <span className="w-px flex-1 border-l border-dashed border-antique-gold/50" />
    </span>
  );
}

function RouteColumn({ option }: { option: RouteOption }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-3 text-center">
      <span className="font-sans text-small font-semibold uppercase tracking-[0.22em] text-antique-gold">
        {option.heading}
      </span>
      <div className="flex flex-col items-start">
        {option.stops.map((stop, i) => (
          <div key={stop.code}>
            {i > 0 ? <RouteConnector /> : null}
            <StopNode stop={stop} />
          </div>
        ))}
      </div>
      <span className="font-sans text-caption leading-6 text-charcoal/55">{option.caption}</span>
    </div>
  );
}

function OrSeparator() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center gap-3 sm:flex-col sm:gap-2 sm:self-center">
      <span className="h-px w-8 bg-antique-gold/25 sm:h-10 sm:w-px" />
      <span className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-antique-gold/70">
        or
      </span>
      <span className="h-px w-8 bg-antique-gold/25 sm:h-10 sm:w-px" />
    </div>
  );
}

function RoutesBody({ options }: { options: RouteOption[] }) {
  return (
    <motion.div
      className="relative mt-6 flex flex-col items-stretch gap-5 sm:flex-row sm:items-start sm:gap-4"
      variants={riseVariants}
    >
      <RouteColumn option={options[0]} />
      <OrSeparator />
      <RouteColumn option={options[1]} />
    </motion.div>
  );
}

/* ———————————————————————————— Destinations ———————————————————————————— */

function DestinationTile({ destination }: { destination: Destination }) {
  const Art = DESTINATION_ART[destination.art];
  return (
    <div className="paper-texture flex flex-col items-center gap-3 rounded-[1.15rem] border border-antique-gold/20 bg-ivory/70 px-5 py-7 text-center">
      <Art className="h-16 w-auto text-antique-gold/85" />
      <h4 className="font-display text-h3 font-medium leading-none text-deep-maroon">{destination.name}</h4>
      <p className="max-w-[24ch] font-sans text-caption leading-6 text-charcoal/60">{destination.blurb}</p>
    </div>
  );
}

function DestinationsBody({ destinations }: { destinations: Destination[] }) {
  return (
    <motion.div className="relative mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6" variants={riseVariants}>
      {destinations.map((destination) => (
        <DestinationTile destination={destination} key={destination.id} />
      ))}
    </motion.div>
  );
}
