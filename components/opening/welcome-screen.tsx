"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { SOFT_EASE } from "@/lib/animation/motion";
import type { InvitationDetails } from "@/lib/config/invitation";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";

interface WelcomeScreenProps {
  details: InvitationDetails;
  /** Fired on the entry tap — starts the music and reveals the splash. */
  onBegin: () => void;
  /** Optional guest name from a personalized link — greeted after "Welcome". */
  guestName?: string;
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.28, delayChildren: 0.15 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: SOFT_EASE } },
};
const crest: Variants = {
  hidden: { opacity: 0, scale: 0.86 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1.1, ease: SOFT_EASE } },
};

/**
 * A minimal entry screen: the monogram, "Welcome", and a prompt. Its purpose is
 * to capture the first tap so the browser lets audio start — the proposal-photo
 * splash then appears with the music already playing. The whole screen is the
 * tap target.
 */
export function WelcomeScreen({ details, onBegin, guestName }: WelcomeScreenProps) {
  const reduce = useSafeReducedMotion();
  const greeted = Boolean(guestName);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="paper-texture absolute inset-0 overflow-hidden bg-ivory"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: SOFT_EASE }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[64vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(176_141_87/12%),transparent_70%)] blur-2xl"
      />

      <button
        aria-label="Touch anywhere to continue"
        className="absolute inset-0 grid place-items-center px-6 focus-visible:outline-none"
        onClick={onBegin}
        type="button"
      >
        <motion.div
          animate="visible"
          className="flex flex-col items-center gap-8 text-center"
          initial={reduce ? false : "hidden"}
          variants={container}
        >
          {details.monogramImageSrc ? (
            <motion.div variants={crest}>
              <motion.div
                animate={reduce ? undefined : { y: [0, -7, 0] }}
                transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity }}
              >
                <Image
                  alt={`${details.firstName} & ${details.partnerName} monogram`}
                  className="h-auto w-56 sm:w-72 md:w-80"
                  height={788}
                  src={details.monogramImageSrc}
                  unoptimized
                  width={1238}
                />
              </motion.div>
            </motion.div>
          ) : null}

          <motion.div className="flex flex-col items-center gap-2" variants={item}>
            <p className="font-display text-[2.5rem] font-medium leading-none tracking-[0.02em] text-deep-maroon sm:text-[3.25rem]">
              Welcome{greeted ? "," : ""}
            </p>
            {greeted ? (
              <p className="font-display text-[2rem] italic leading-tight text-antique-gold sm:text-[2.75rem]">
                {guestName}
              </p>
            ) : null}
          </motion.div>

          <motion.p
            animate={reduce ? { opacity: 0.55 } : { opacity: [0.3, 0.6, 0.3] }}
            className="font-sans text-caption font-medium uppercase tracking-[0.28em] text-charcoal/60"
            initial={{ opacity: 0 }}
            transition={
              reduce
                ? { duration: 0.4, delay: 1 }
                : { duration: 2.8, ease: "easeInOut", repeat: Infinity, delay: 1 }
            }
          >
            Touch anywhere to continue
          </motion.p>
        </motion.div>
      </button>
    </motion.div>
  );
}
