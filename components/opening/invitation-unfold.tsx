"use client";

import { motion, useAnimate } from "framer-motion";
import { useRef, useState } from "react";
import { SOFT_EASE } from "@/lib/animation/motion";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { cn } from "@/lib/utils";
import type { InvitationDetails } from "@/lib/config/invitation";
import { InvitationFace, SEAL_SIZE } from "./invitation-face";
import { SealCrack } from "./seal-crack";
import { WaxSeal } from "./wax-seal";

interface InvitationUnfoldProps {
  details: InvitationDetails;
  /** Fired once the gatefold has fully opened and the hero is revealed. */
  onOpened: () => void;
}

/** Ease used for the gatefold: gentle start, smooth settle. */
const UNFOLD_EASE = [0.66, 0, 0.34, 1] as const;

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function haptic() {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate(18);
  }
}

/**
 * Drives the invitation opening: press → crack → unfold. The card is rendered
 * as two overflow-clipped halves ("doors") that share one design, plus a single
 * hidden overlay carrying the interactive seal so it can animate as one piece.
 * The hero already sits behind this layer and is revealed physically as the
 * doors swing open — never a crossfade.
 */
export function InvitationUnfold({ details, onOpened }: InvitationUnfoldProps) {
  const shouldReduceMotion = useSafeReducedMotion();
  const [scope, animate] = useAnimate();
  const [isOpening, setIsOpening] = useState(false);

  const sealRef = useRef<HTMLDivElement>(null);
  const crackRef = useRef<SVGSVGElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  async function handleOpen() {
    if (isOpening) return;
    setIsOpening(true);
    haptic();

    if (shouldReduceMotion || !sealRef.current) {
      onOpened();
      return;
    }

    // Step 1 — the seal depresses under the press.
    await animate(sealRef.current, { scale: [1, 0.9, 1], y: [0, 4, 0] }, { duration: 0.4, ease: "easeInOut" });

    // Step 2 — a fracture spreads across the wax.
    if (crackRef.current) {
      await animate(crackRef.current, { opacity: [0, 1] }, { duration: 0.4, ease: "easeOut" });
    }
    await delay(240);

    // Step 3 — the seal breaks away as the invitation unfolds like thick paper.
    animate(sealRef.current, { scale: 0.6, opacity: 0, rotate: -8, y: 14 }, { duration: 0.7, ease: SOFT_EASE });
    if (leftRef.current) {
      animate(leftRef.current, { rotateY: 105 }, { duration: 1.25, ease: UNFOLD_EASE });
    }
    if (rightRef.current) {
      await animate(rightRef.current, { rotateY: -105 }, { duration: 1.25, ease: UNFOLD_EASE });
    }

    // Steps 4 & 5 — the hero is fully revealed; hand back so scrolling unlocks.
    onOpened();
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="absolute inset-0"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
      transition={{ duration: 0.7, ease: SOFT_EASE }}
    >
      <h1 className="sr-only">
        {details.firstName} &amp; {details.partnerName} — wedding invitation, {details.city},{" "}
        {details.weddingDates}. Activate the wax seal to open the invitation.
      </h1>

      {/* Perspective wrapper; the two doors are its direct children. */}
      <div className="absolute inset-0 [perspective:2000px]" ref={scope}>
        {/* Left half */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1/2 origin-left overflow-hidden will-change-transform [backface-visibility:hidden]"
          ref={leftRef}
        >
          <div className="absolute inset-y-0 left-0 w-screen">
            <InvitationFace details={details} variant="panel" />
          </div>
          {/* Inner-edge shadow — only while opening, so the closed card shows no seam. */}
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/12 via-black/[0.04] to-transparent transition-opacity duration-500",
              isOpening ? "opacity-100" : "opacity-0",
            )}
          />
        </div>

        {/* Right half */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-1/2 origin-right overflow-hidden will-change-transform [backface-visibility:hidden]"
          ref={rightRef}
        >
          <div className="absolute inset-y-0 left-[-50vw] w-screen">
            <InvitationFace details={details} variant="panel" />
          </div>
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/12 via-black/[0.04] to-transparent transition-opacity duration-500",
              isOpening ? "opacity-100" : "opacity-0",
            )}
          />
        </div>

        {/* Single interactive seal, aligned to the reserved slot in the doors */}
        <InvitationFace
          details={details}
          sealSlot={
            <div className="relative grid place-items-center" ref={sealRef}>
              {/* Pulsing gold halo — draws the eye so guests know to tap the seal. */}
              {isOpening ? null : (
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
                  <motion.span
                    animate={
                      shouldReduceMotion
                        ? { opacity: 0.5 }
                        : { opacity: [0.35, 0.7, 0.35], scale: [0.9, 1.12, 0.9] }
                    }
                    className="block rounded-full"
                    style={{
                      width: SEAL_SIZE * 1.65,
                      height: SEAL_SIZE * 1.65,
                      background:
                        "radial-gradient(circle, rgba(176,141,87,0.45), rgba(176,141,87,0.12) 45%, transparent 70%)",
                    }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0.3 }
                        : { duration: 2.3, ease: "easeInOut", repeat: Infinity }
                    }
                  />
                </span>
              )}
              {/* Gentle breathing so the seal feels alive and tappable. */}
              <motion.div
                animate={isOpening || shouldReduceMotion ? { scale: 1 } : { scale: [1, 1.05, 1] }}
                transition={
                  isOpening || shouldReduceMotion
                    ? { duration: 0.3 }
                    : { duration: 2.3, ease: "easeInOut", repeat: Infinity }
                }
              >
                <WaxSeal
                  ariaLabel="Open the invitation"
                  imageSrc={details.sealImageSrc}
                  interactive
                  onPress={handleOpen}
                  size={SEAL_SIZE}
                />
              </motion.div>
              <SealCrack ref={crackRef} />
            </div>
          }
          variant="seal"
        />
      </div>
    </motion.div>
  );
}
