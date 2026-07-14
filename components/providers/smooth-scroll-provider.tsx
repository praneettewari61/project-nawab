"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { useScrollLock } from "./scroll-lock-context";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

/** The live Lenis instance (when smooth scrolling is active), for programmatic scrolls. */
let activeLenis: Lenis | null = null;

/**
 * Smoothly scroll to an in-page section. Uses Lenis when available so it doesn't
 * fight the smooth-scroll loop; otherwise falls back to native scrolling
 * (instant for reduced-motion users). The offset clears the fixed top nav.
 */
export function scrollToSection(target: string): void {
  if (activeLenis) {
    activeLenis.scrollTo(target, { offset: -96, duration: 1.1 });
    return;
  }
  const element = document.querySelector(target);
  if (!element) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

/**
 * Enables Lenis only when scrolling is unlocked (i.e. the invitation has
 * opened) and the user has not requested reduced motion. Keeping Lenis
 * un-instantiated while locked prevents it from scrolling the page behind the
 * closed invitation.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const { locked } = useScrollLock();

  useEffect(() => {
    if (locked) {
      return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotionQuery.matches) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1,
    });
    activeLenis = lenis;

    return () => {
      lenis.destroy();
      if (activeLenis === lenis) {
        activeLenis = null;
      }
    };
  }, [locked]);

  return children;
}
