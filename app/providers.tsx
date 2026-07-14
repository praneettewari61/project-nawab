"use client";

import { MotionConfig } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { MusicProvider } from "@/components/providers/music-provider";
import { ScrollLockProvider } from "@/components/providers/scroll-lock-context";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { configureGsap } from "@/lib/animation/gsap";
import { MOTION_TRANSITIONS } from "@/lib/animation/motion";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Shared client-side behaviour for all routes. MotionConfig honors the user's
 * system reduced-motion setting; Lenis is likewise disabled for those users.
 */
export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    configureGsap();
  }, []);

  return (
    <MotionConfig reducedMotion="user" transition={MOTION_TRANSITIONS.normal}>
      <MusicProvider>
        <ScrollLockProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </ScrollLockProvider>
      </MusicProvider>
    </MotionConfig>
  );
}
