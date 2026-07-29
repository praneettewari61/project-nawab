"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { SOFT_EASE } from "@/lib/animation/motion";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";

const OPT = "/images/splashScreen/opt";
/** The proposal image is also the Hero background — the finale morphs into it. */
const PROPOSAL = `${OPT}/proposal.webp`;

/**
 * The "memories" — photographs 2 onward. The first memory is the one the guest
 * just revealed from the sketch, so the slideshow does NOT repeat it here; it
 * continues from the second photograph. The finale (proposal) is separate.
 */
const MEMORIES = [
  `${OPT}/fourth.webp`,
  `${OPT}/first.webp`,
  `${OPT}/fifth.webp`,
  `${OPT}/onemore.webp`,
  `${OPT}/second.webp`,
];

// Hand-tuned entrance offsets so the photographs feel scattered like prints,
// never like a mechanical carousel.
const POSES = [
  { rot: -2.5, x: -26 },
  { rot: 2, x: 30 },
  { rot: -1.5, x: -20 },
  { rot: 2.8, x: 24 },
  { rot: -2, x: -28 },
];

interface MemoryGalleryProps {
  /** Fired once the finale photograph has grown to fill the screen. */
  onComplete: () => void;
}

/**
 * Step 4 + 4.5 of the opening film. A slow, editorial slideshow of printed
 * photographs, ending with the proposal photo scaling up to become the Hero —
 * one continuous move, no hard cut. Tap anywhere to skip ahead to the finale.
 */
export function MemoryGallery({ onComplete }: MemoryGalleryProps) {
  const reduce = useSafeReducedMotion();
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<"play" | "morph">("play");
  const [expand, setExpand] = useState(false);

  const dims = useMemo(() => {
    if (typeof window === "undefined") return { cardW: 300, cardH: 450, fullW: 1200, fullH: 800 };
    const vh = window.innerHeight;
    const w = window.innerWidth;
    // Larger prints on tablet/laptop; mobile stays exactly as it was. These must
    // mirror the slideshow card's responsive height classes below so the finale
    // morph starts at the same size the last photo ended at.
    const cardH = w >= 1024 ? Math.min(vh * 0.74, 780) : w >= 768 ? Math.min(vh * 0.7, 720) : Math.min(vh * 0.6, 520);
    return { cardW: cardH * (2 / 3), cardH, fullW: window.innerWidth, fullH: vh };
  }, []);

  // Slideshow timeline.
  useEffect(() => {
    if (stage !== "play") return;
    if (index >= MEMORIES.length - 1) {
      const t = window.setTimeout(() => setStage("morph"), reduce ? 700 : 1500);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setIndex((i) => i + 1), reduce ? 900 : 1650);
    return () => window.clearTimeout(t);
  }, [index, stage, reduce]);

  // Finale morph timeline: let the proposal print fade in first, hold, then grow.
  useEffect(() => {
    if (stage !== "morph") return;
    const hold = window.setTimeout(() => setExpand(true), reduce ? 250 : 1050);
    const done = window.setTimeout(onComplete, reduce ? 950 : 2750);
    return () => {
      window.clearTimeout(hold);
      window.clearTimeout(done);
    };
  }, [stage, reduce, onComplete]);

  const pose = POSES[index % POSES.length];

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="paper-texture absolute inset-0 overflow-hidden bg-ivory"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: SOFT_EASE }}
    >
      {/* Soft vignette so the printed photographs sit forward. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_40%,rgb(94_67_34/14%)_100%)]"
      />

      {/* Slideshow of memories. AnimatePresence stays mounted so that when the
          finale begins, the last photograph exit-animates (drifts + fades)
          instead of popping away. */}
      <AnimatePresence custom={pose} mode="sync">
        {stage === "play" ? (
          <motion.div
            animate={{
              opacity: 1,
              scale: 1,
              rotate: reduce ? 0 : pose.rot,
              x: 0,
              transition: { duration: reduce ? 0.6 : 1.2, ease: SOFT_EASE },
            }}
            className="absolute left-1/2 top-1/2 aspect-[2/3] h-[60vh] max-h-[520px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[6px] bg-warm-white p-2 shadow-[0_28px_70px_-20px_rgb(94_67_34/50%)] ring-1 ring-antique-gold/20 will-change-transform md:h-[70vh] md:max-h-[720px] lg:h-[74vh] lg:max-h-[780px]"
            exit={{
              opacity: 0,
              scale: reduce ? 1 : 1.05,
              rotate: reduce ? 0 : -pose.rot * 0.6,
              x: reduce ? 0 : -pose.x * 0.9,
              transition: { duration: reduce ? 0.5 : 0.95, ease: SOFT_EASE },
            }}
            initial={{
              opacity: 0,
              scale: reduce ? 1 : 0.9,
              rotate: reduce ? 0 : pose.rot,
              x: reduce ? 0 : pose.x,
            }}
            key={index}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[3px]">
              <motion.img
                alt=""
                animate={reduce ? undefined : { scale: 1.06 }}
                className="h-full w-full object-cover"
                initial={reduce ? undefined : { scale: 1 }}
                src={MEMORIES[index]}
                transition={{ duration: 2.8, ease: "easeOut" }}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 shadow-[inset_0_0_44px_rgb(94_67_34/16%)]"
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Finale: the proposal photograph fades in over the departing photo (as a
          matching print), holds, then grows to fill the screen and become the
          Hero — one continuous move, no hard cut. */}
      {stage === "morph" ? (
        <motion.div
          animate={
            expand
              ? { opacity: 1, width: dims.fullW, height: dims.fullH, padding: 0, borderRadius: 0, boxShadow: "0 0px 0px rgba(0,0,0,0)" }
              : { opacity: 1, width: dims.cardW, height: dims.cardH, padding: 8, borderRadius: 6, boxShadow: "0 28px 70px -20px rgba(94,67,34,0.5)" }
          }
          className="absolute left-1/2 top-1/2 overflow-hidden bg-warm-white"
          initial={{ opacity: 0, width: dims.cardW, height: dims.cardH, padding: 8, borderRadius: 6, boxShadow: "0 28px 70px -20px rgba(94,67,34,0.5)" }}
          style={{ x: "-50%", y: "-50%" }}
          transition={{ opacity: { duration: reduce ? 0.3 : 0.9, ease: SOFT_EASE }, default: { duration: reduce ? 0.4 : 1.5, ease: SOFT_EASE } }}
        >
          {/* Same URL + object-cover/center as the Hero background, so the
              finale settles into the Hero with no reload or jump. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="h-full w-full object-cover object-center" src={PROPOSAL} />
        </motion.div>
      ) : null}
    </motion.div>
  );
}
