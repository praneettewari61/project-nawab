"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChaptersProvider } from "@/components/chapters/chapters-context";
import { ChaptersHub } from "@/components/chapters/chapters-hub";
import { SiteNav } from "@/components/chapters/site-nav";
import { useMusic } from "@/components/providers/music-provider";
import { useScrollLock } from "@/components/providers/scroll-lock-context";
import { CountdownSection } from "@/components/sections/countdown-section";
import { HeroSection } from "@/components/sections/hero-section";
import { VenueSection } from "@/components/sections/venue-section";
import { SOFT_EASE } from "@/lib/animation/motion";
import { invitationDetails } from "@/lib/config/invitation";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { MemoryGallery } from "./memory-gallery";
import { MusicToggle } from "./music-toggle";
import { DESKTOP_MQ, SketchReveal } from "./sketch-reveal";

type Phase = "sketch" | "gallery";

const opt = (f: string) => `/images/splashScreen/opt/${f}`;
/** Gallery + finale frames — shared across devices. */
const GALLERY_PRELOAD = ["fourth.webp", "first.webp", "fifth.webp", "onemore.webp", "second.webp", "proposal.webp"].map(opt);
/** Splash reveal pair — a different artwork per device (only preload the one shown). */
const MOBILE_SPLASH = ["sketch-hero.webp", "actual.webp"].map(opt);
const DESKTOP_SPLASH = ["desktop-sketch.webp", "desktop-photo.webp"].map(opt);

interface OpeningExperienceProps {
  /** Optional guest name from a personalized link (e.g. /daniel). */
  guestName?: string;
}

/**
 * The opening film: a sketch the guest rubs away to reveal their first memory,
 * an editorial gallery of photographs, and a finale where the proposal photo
 * grows into the Hero — one uninterrupted, cinematic sequence.
 *
 * The website (Hero → Countdown → Venue → Chapters) is always mounted beneath
 * an opaque curtain; when the film settles onto the Hero the curtain fades away,
 * revealing the identical photograph so there's never a visible screen change.
 */
export function OpeningExperience({ guestName }: OpeningExperienceProps = {}) {
  const [phase, setPhase] = useState<Phase>("sketch");
  const [hasOpened, setHasOpened] = useState(false);
  const [hintScroll, setHintScroll] = useState(false);
  const { setLocked } = useScrollLock();
  const { enabled: musicEnabled, toggle: toggleMusic } = useMusic();
  const reduce = useSafeReducedMotion();

  // Preload the frames this device will actually show, so nothing stutters.
  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_MQ).matches;
    const sources = [...(desktop ? DESKTOP_SPLASH : MOBILE_SPLASH), ...GALLERY_PRELOAD];
    const imgs = sources.map((src) => {
      const img = new window.Image();
      img.src = src;
      return img;
    });
    return () => imgs.forEach((img) => (img.src = ""));
  }, []);

  // Lock the page behind the curtain until the film has finished.
  useEffect(() => {
    if (hasOpened) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [hasOpened]);

  function handleOpened() {
    window.scrollTo(0, 0);
    setLocked(false);
    setHasOpened(true);
  }

  // Once the Hero has settled, gently bounce the whole page to invite a scroll —
  // it peeks the next section, then stops for good the moment the guest scrolls.
  useEffect(() => {
    if (!hasOpened || reduce) return;
    const start = window.setTimeout(() => setHintScroll(true), 1400);
    const onScroll = () => {
      if (window.scrollY > 4) {
        setHintScroll(false);
        window.clearTimeout(start);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(start);
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasOpened, reduce]);

  return (
    <ChaptersProvider>
      <main id="main-content" tabIndex={-1}>
        {hasOpened ? <SiteNav monogram={invitationDetails.monogram} /> : null}
        {/* The page content (not the fixed nav) gently bounces as a scroll hint. */}
        <motion.div
          animate={hintScroll ? { y: [0, -16, -5, -11, 0] } : { y: 0 }}
          className="will-change-transform"
          transition={
            hintScroll
              ? {
                  duration: 1.7,
                  times: [0, 0.26, 0.44, 0.62, 1],
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: 2,
                }
              : { duration: 0.4, ease: SOFT_EASE }
          }
        >
          <HeroSection details={invitationDetails} revealed={hasOpened} />
          <CountdownSection />
          <VenueSection />
          <ChaptersHub />
        </motion.div>
      </main>

      {/* The curtain fades out (rather than unmounting instantly) once the film
          settles onto the Hero — the finale photograph dissolves into the
          identical, already-cached Hero background with no visible cut. */}
      <AnimatePresence>
        {!hasOpened ? (
          <motion.div
            className="paper-texture fixed inset-0 z-40 overflow-hidden bg-ivory"
            exit={{ opacity: 0 }}
            initial={false}
            key="curtain"
            transition={{ duration: 0.7, ease: SOFT_EASE }}
          >
            <AnimatePresence>
              {phase === "sketch" ? (
                <SketchReveal guestName={guestName} key="sketch" onComplete={() => setPhase("gallery")} />
              ) : (
                <MemoryGallery key="gallery" onComplete={handleOpened} />
              )}
            </AnimatePresence>

            <div className="fixed right-5 top-5 z-50 text-antique-gold">
              <MusicToggle isEnabled={musicEnabled} onToggle={toggleMusic} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ChaptersProvider>
  );
}
