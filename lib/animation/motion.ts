import type { Transition, Variants } from "framer-motion";

/** Design-system "soft" easing — a gentle, luxurious ease-out. */
export const SOFT_EASE = [0.22, 1, 0.36, 1] as const;

/** Shared motion durations from the design system, in seconds. */
export const MOTION_TRANSITIONS = {
  micro: { duration: 0.15, ease: SOFT_EASE },
  normal: { duration: 0.3, ease: SOFT_EASE },
  large: { duration: 0.5, ease: SOFT_EASE },
  hero: { duration: 0.7, ease: SOFT_EASE },
} satisfies Record<string, Transition>;

/**
 * A calm fade-and-rise used for staggered entrances. Distance stays small so
 * the motion reads as "settling into place" rather than sliding in.
 */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

/** Simple opacity crossfade for whole-screen scene changes. */
export const sceneFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Shared scroll-reveal set. Gate ONLY `initial` for reduced motion and keep
 * `variants` + `whileInView` set, so the global MotionConfig can snap
 * transforms without ever stranding content at opacity 0.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.04 } },
};
export const revealItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: SOFT_EASE } },
};
export const revealBlur: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: SOFT_EASE } },
};
