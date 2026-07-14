"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useMusic } from "@/components/providers/music-provider";
import { useScrollLock } from "@/components/providers/scroll-lock-context";
import { ChaptersProvider } from "@/components/chapters/chapters-context";
import { ChaptersHub } from "@/components/chapters/chapters-hub";
import { SiteNav } from "@/components/chapters/site-nav";
import { CountdownSection } from "@/components/sections/countdown-section";
import { HeroSection } from "@/components/sections/hero-section";
import { StorySection } from "@/components/sections/story-section";
import { VenueSection } from "@/components/sections/venue-section";
import { invitationDetails } from "@/lib/config/invitation";
import { music } from "@/lib/config/music";
import { InvitationUnfold } from "./invitation-unfold";
import { MusicToggle } from "./music-toggle";
import { SplashScreen } from "./splash-screen";
import { WelcomeScreen } from "./welcome-screen";

type Phase = "welcome" | "splash" | "invitation";

/**
 * Orchestrates the full entry: welcome → splash → invitation → unfold → website.
 * The welcome screen captures the first tap (so the browser lets audio start),
 * meaning the proposal-photo splash appears with the music already playing. The
 * website (hero) is always mounted underneath; the opening lives in a fixed
 * curtain on top that is removed once the invitation has opened.
 */
interface OpeningExperienceProps {
  /** Optional guest name from a personalized link (e.g. /daniel). */
  guestName?: string;
}

export function OpeningExperience({ guestName }: OpeningExperienceProps = {}) {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [hasOpened, setHasOpened] = useState(false);
  const { setLocked } = useScrollLock();
  const { enabled: isMusicEnabled, toggle: toggleMusic, enable: enableMusic } = useMusic();

  function handleBegin() {
    // First user gesture — start the music now so it plays over the splash photo.
    if (music.autoPlayOnEnter) enableMusic();
    setPhase("splash");
  }

  function handleSplashContinue() {
    // Fallback: (re)start music if it didn't begin on the welcome tap.
    if (music.autoPlayOnEnter) enableMusic();
    setPhase("invitation");
  }

  useEffect(() => {
    if (hasOpened) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [hasOpened]);

  function handleOpened() {
    // Release the lock, snap to the top so the hero is what's revealed, then
    // remove the curtain.
    window.scrollTo(0, 0);
    setLocked(false);
    setHasOpened(true);
  }

  return (
    <ChaptersProvider>
      <main id="main-content" tabIndex={-1}>
        {hasOpened ? <SiteNav monogram={invitationDetails.monogram} /> : null}
        <HeroSection details={invitationDetails} revealed={hasOpened} />
        <StorySection />
        <CountdownSection />
        <VenueSection />
        <ChaptersHub />
      </main>

      {!hasOpened ? (
        <div className="fixed inset-0 z-40 overflow-hidden">
          <AnimatePresence mode="wait">
            {phase === "welcome" ? (
              <WelcomeScreen
                details={invitationDetails}
                guestName={guestName}
                key="welcome"
                onBegin={handleBegin}
              />
            ) : phase === "splash" ? (
              <SplashScreen
                firstName={invitationDetails.firstName}
                key="splash"
                onContinue={handleSplashContinue}
                partnerName={invitationDetails.partnerName}
                photo={invitationDetails.splashPhoto}
              />
            ) : (
              <InvitationUnfold
                details={invitationDetails}
                key="invitation"
                onOpened={handleOpened}
              />
            )}
          </AnimatePresence>

          {/* Music toggle appears once music can play (from the splash onward). */}
          {phase !== "welcome" ? (
            <div
              className={`fixed right-5 top-5 z-50 ${
                phase === "splash" ? "text-warm-white" : "text-antique-gold"
              }`}
            >
              <MusicToggle isEnabled={isMusicEnabled} onToggle={toggleMusic} />
            </div>
          ) : null}
        </div>
      ) : null}
    </ChaptersProvider>
  );
}
