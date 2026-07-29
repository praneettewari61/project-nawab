"use client";

import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { cn } from "@/lib/utils";

interface ScrollIndicatorProps {
  label?: string;
  className?: string;
  /** Override the label colour (e.g. light text over a photo). */
  labelClassName?: string;
}

/**
 * A quiet cue inviting the guest to scroll: a label, a gold thread with a
 * travelling dot, and a small chevron — the whole cue floats gently every few
 * seconds. Reduced-motion keeps it perfectly still.
 */
export function ScrollIndicator({ label = "Scroll", className, labelClassName }: ScrollIndicatorProps) {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <motion.div
      animate={shouldReduceMotion ? undefined : { y: [0, 6, 0] }}
      className={cn("flex flex-col items-center gap-2.5 text-antique-gold", className)}
      transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
    >
      <span
        className={cn(
          "font-sans text-small font-medium uppercase tracking-[0.32em] text-charcoal/45",
          labelClassName,
        )}
      >
        {label}
      </span>
      <span className="relative h-9 w-px overflow-hidden bg-antique-gold/35">
        <motion.span
          animate={shouldReduceMotion ? undefined : { y: ["-40%", "150%"] }}
          className="absolute inset-x-0 top-0 h-4 bg-antique-gold"
          transition={{ duration: 1.9, ease: "easeInOut", repeat: Infinity }}
        />
      </span>
      <svg
        aria-hidden="true"
        className={cn("h-3 w-3 text-antique-gold", labelClassName)}
        fill="none"
        viewBox="0 0 12 8"
      >
        <path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
      </svg>
    </motion.div>
  );
}
