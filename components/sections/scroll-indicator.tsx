"use client";

import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { cn } from "@/lib/utils";

interface ScrollIndicatorProps {
  label?: string;
  className?: string;
}

/** A quiet cue inviting the guest to scroll: a gold thread with a travelling dot. */
export function ScrollIndicator({ label = "Scroll", className }: ScrollIndicatorProps) {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <div className={cn("flex flex-col items-center gap-3 text-antique-gold", className)}>
      <span className="font-sans text-small font-medium uppercase tracking-[0.32em] text-charcoal/45">
        {label}
      </span>
      <span className="relative h-10 w-px overflow-hidden bg-antique-gold/30">
        <motion.span
          animate={shouldReduceMotion ? undefined : { y: ["-40%", "150%"] }}
          className="absolute inset-x-0 top-0 h-4 bg-antique-gold"
          transition={{ duration: 1.9, ease: "easeInOut", repeat: Infinity }}
        />
      </span>
    </div>
  );
}
