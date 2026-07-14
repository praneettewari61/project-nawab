"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { SOFT_EASE } from "@/lib/animation/motion";
import type { InvitationDetails } from "@/lib/config/invitation";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { OrnamentalDivider } from "@/components/opening/ornamental-divider";
import { ScrollIndicator } from "./scroll-indicator";

interface HeroSectionProps {
  details: InvitationDetails;
  /** Becomes true once the invitation has finished opening. */
  revealed: boolean;
}

const container: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.9, ease: SOFT_EASE } },
};

/**
 * The first chapter of the site, revealed as the invitation opens. Calm and
 * emotional: names, date and place, nothing more. All copy is config-driven.
 */
export function HeroSection({ details, revealed }: HeroSectionProps) {
  const shouldReduceMotion = useSafeReducedMotion();
  const state = revealed ? "shown" : "hidden";

  return (
    <section className="paper-texture relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-ivory px-6 text-center">
      {/* Soft, slow background glow — purely atmospheric. */}
      <motion.div
        aria-hidden="true"
        animate={shouldReduceMotion ? undefined : { opacity: [0.5, 0.8, 0.5], scale: [1, 1.08, 1] }}
        className="pointer-events-none absolute left-1/2 top-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(176,141,87,0.16),transparent_70%)] blur-2xl"
        transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
      />

      <motion.div
        animate={state}
        className="relative flex flex-col items-center gap-5 sm:gap-6"
        initial={shouldReduceMotion ? false : "hidden"}
        variants={container}
      >
        {details.heroPortrait ? (
          <motion.div variants={item}>
            <Image
              alt={details.heroPortrait.alt}
              className="h-[30vh] max-h-[300px] w-auto object-contain drop-shadow-[0_16px_28px_rgba(94,67,34,0.14)] sm:h-[34vh] sm:max-h-[360px]"
              height={640}
              src={details.heroPortrait.src}
              unoptimized
              width={480}
            />
          </motion.div>
        ) : null}

        <motion.p
          className="font-sans text-caption font-semibold uppercase tracking-[0.34em] text-antique-gold"
          variants={item}
        >
          {details.heroKicker}
        </motion.p>

        <motion.h1
          className="flex flex-col items-center font-display font-medium leading-[1.05] tracking-[-0.01em] text-deep-maroon"
          variants={item}
        >
          <span className="text-[2rem] sm:text-[2.75rem] md:text-[3.5rem]">{details.fullName}</span>
          <span className="my-1 flex items-center gap-3 font-display text-h3 italic text-antique-gold sm:my-1.5">
            <span aria-hidden="true" className="h-px w-8 bg-antique-gold/50 sm:w-10" />
            &amp;
            <span aria-hidden="true" className="h-px w-8 bg-antique-gold/50 sm:w-10" />
          </span>
          <span className="text-[2rem] sm:text-[2.75rem] md:text-[3.5rem]">{details.partnerFullName}</span>
        </motion.h1>

        <motion.div variants={item}>
          <OrnamentalDivider width={132} />
        </motion.div>

        <motion.p
          className="max-w-md font-display text-body-large italic text-charcoal/65 sm:text-h3"
          variants={item}
        >
          {details.heroTagline}
        </motion.p>
      </motion.div>

      <motion.div
        animate={{ opacity: revealed ? 1 : 0 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={false}
        transition={{ duration: 0.8, ease: SOFT_EASE, delay: 1 }}
      >
        <ScrollIndicator />
      </motion.div>
    </section>
  );
}
