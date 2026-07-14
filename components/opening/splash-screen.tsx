"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { CouplePhoto } from "@/lib/config/invitation";
import { MOTION_TRANSITIONS, SOFT_EASE } from "@/lib/animation/motion";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { DriftingPetals } from "./drifting-petals";
import { ForegroundFlora } from "./foreground-flora";
import { OrnamentalDivider } from "./ornamental-divider";

interface SplashScreenProps {
  photo: CouplePhoto;
  firstName: string;
  partnerName: string;
  /** Called when the guest taps anywhere to reveal the invitation. */
  onContinue: () => void;
}

/**
 * A cinematic, full-screen opening. The couple photograph is the scene; every
 * overlay stays subordinate to it. The whole surface is one tap target so a
 * guest can continue from anywhere, and every motion is disabled under the
 * user's reduced-motion preference.
 */
export function SplashScreen({ photo, firstName, partnerName, onContinue }: SplashScreenProps) {
  const shouldReduceMotion = useSafeReducedMotion();

  const kenBurns = shouldReduceMotion
    ? undefined
    : { scale: [1, 1.12], x: ["0%", "-1.5%"], y: ["0%", "-2%"] };
  const kenBurnsTransition = { duration: 24, ease: "easeInOut" as const, repeat: Infinity, repeatType: "mirror" as const };

  // A slow float on the flora, opposite the photo drift, reads as parallax.
  const floraFloat = shouldReduceMotion ? undefined : { y: [0, -10, 0], x: [0, 6, 0] };
  const floraTransition = { duration: 15, ease: "easeInOut" as const, repeat: Infinity, repeatType: "mirror" as const };

  return (
    <motion.section
      animate={{ opacity: 1 }}
      aria-label="Wedding invitation — tap to open"
      className="absolute inset-0 overflow-hidden bg-charcoal"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : MOTION_TRANSITIONS.hero}
    >
      {/* Scene: couple photograph with a slow Ken Burns move */}
      <motion.div
        animate={kenBurns}
        className="absolute inset-[-4%]"
        transition={kenBurnsTransition}
      >
        <Image
          alt={photo.alt}
          blurDataURL={photo.blurDataURL}
          className="object-cover"
          fill
          placeholder="blur"
          preload
          quality={90}
          sizes="100vw"
          src={photo.src}
          style={{ objectPosition: photo.focalPoint }}
        />
      </motion.div>

      {/* Warm color grade + legibility gradients */}
      <div aria-hidden="true" className="absolute inset-0 bg-antique-gold/18 mix-blend-soft-light" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-deep-maroon/20 via-transparent to-antique-gold/12 mix-blend-soft-light"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-charcoal/5 to-charcoal/65"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_38%,transparent_38%,rgba(45,45,45,0.4)_100%)]"
      />

      {/* Depth-of-field foreground flora, gently parallaxing */}
      <motion.div animate={floraFloat} className="absolute inset-0" transition={floraTransition}>
        <ForegroundFlora side="left" />
        <ForegroundFlora side="right" />
      </motion.div>

      <DriftingPetals />

      {/* Overlaid content — non-interactive; the tap button below handles input */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-between px-6 py-14 text-center sm:py-20">
        <motion.header
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
          transition={{ ...MOTION_TRANSITIONS.hero, delay: shouldReduceMotion ? 0 : 0.5, duration: 1.1, ease: SOFT_EASE }}
        >
          {/* Mobile stacks the names over three lines (name / & / name);
              tablet and up place them on a single line. */}
          <h1 className="font-display text-h2 font-medium uppercase tracking-[0.2em] text-warm-white [text-shadow:0_2px_18px_rgba(30,20,10,0.55)] sm:text-h1">
            <span className="flex flex-col items-center leading-[1.08] md:flex-row md:gap-[0.4em]">
              <span>{firstName}</span>
              <span className="my-1 text-[0.82em] text-warm-white/90 md:my-0 md:text-[1em]">
                &amp;
              </span>
              <span>{partnerName}</span>
            </span>
          </h1>
          <OrnamentalDivider className="text-warm-white/80" width={112} />
        </motion.header>

        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="font-sans text-caption font-medium uppercase tracking-[0.32em] text-warm-white/85 [text-shadow:0_1px_10px_rgba(30,20,10,0.5)]"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          transition={{ ...MOTION_TRANSITIONS.hero, delay: shouldReduceMotion ? 0 : 0.9, duration: 1.1, ease: SOFT_EASE }}
        >
          <motion.span
            animate={shouldReduceMotion ? undefined : { opacity: [0.6, 0.95, 0.6] }}
            className="inline-block"
            transition={{ duration: 3.4, ease: "easeInOut", repeat: Infinity }}
          >
            Tap anywhere to continue
          </motion.span>
        </motion.p>
      </div>

      {/* Full-screen tap target: keyboard-focusable, labelled, no visual chrome */}
      <button
        aria-label="Open the invitation"
        className="absolute inset-0 z-20 h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-warm-white/70"
        onClick={onContinue}
        type="button"
      />
    </motion.section>
  );
}
