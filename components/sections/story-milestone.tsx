"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { SOFT_EASE } from "@/lib/animation/motion";
import type { StoryMilestone } from "@/lib/config/story";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { cn } from "@/lib/utils";
import { MilestoneMedia } from "./milestone-media";

interface StoryMilestoneItemProps {
  milestone: StoryMilestone;
  index: number;
}

/**
 * A single, fully data-driven timeline milestone that reveals on scroll.
 * Mobile: single column beside a left rail. Desktop: alternates left/right of a
 * centre rail (even → left, odd → right).
 */
export function StoryMilestoneItem({ milestone, index }: StoryMilestoneItemProps) {
  const shouldReduceMotion = useSafeReducedMotion();
  const isLeft = index % 2 === 0;

  return (
    <motion.li
      className="relative pb-16 pl-10 last:pb-0 sm:pl-14 md:pb-24 md:pl-0"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
      transition={{ duration: 0.8, ease: SOFT_EASE }}
      viewport={{ once: true, amount: 0.3 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* Node on the rail (left on mobile, centre on desktop) */}
      <span
        aria-hidden="true"
        className="absolute left-4 top-2 size-3 -translate-x-1/2 rounded-full border border-antique-gold bg-warm-white shadow-[0_0_0_4px_var(--nawab-color-warm-white)] sm:left-6 md:left-1/2"
      />
      {/* Short connector tying the node to the content (desktop only) */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-[0.85rem] hidden h-px w-10 bg-antique-gold/30 md:block",
          isLeft ? "right-1/2 mr-1.5" : "left-1/2 ml-1.5",
        )}
      />

      <div
        className={cn(
          "flex flex-col md:w-1/2",
          isLeft
            ? "md:mr-auto md:items-end md:pr-14 md:text-right"
            : "md:ml-auto md:items-start md:pl-14 md:text-left",
        )}
      >
        <p className="font-sans text-caption font-semibold uppercase tracking-[0.24em] text-antique-gold">
          {milestone.date}
        </p>
        <h3 className="mt-2 font-display text-h3 font-medium leading-tight text-deep-maroon md:text-h2">
          {milestone.title}
        </h3>

        <div className="mt-6 w-full max-w-md">
          <MilestoneMedia image={milestone.image} video={milestone.video} />
        </div>

        <p className="mt-6 max-w-prose font-sans text-body leading-7 text-charcoal/80">
          {milestone.description}
        </p>

        <p
          className={cn(
            "mt-4 flex items-center gap-2 font-sans text-caption font-medium uppercase tracking-[0.16em] text-charcoal/55",
            isLeft && "md:flex-row-reverse",
          )}
        >
          <MapPin aria-hidden="true" size={15} strokeWidth={1.6} />
          {milestone.location}
        </p>
      </div>
    </motion.li>
  );
}
