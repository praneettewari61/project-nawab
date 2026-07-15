"use client";

import { motion } from "framer-motion";
import { MusicToggle } from "@/components/opening/music-toggle";
import { useMusic } from "@/components/providers/music-provider";
import { scrollToSection } from "@/components/providers/smooth-scroll-provider";
import { SOFT_EASE } from "@/lib/animation/motion";
import type { ChapterId } from "@/lib/config/chapters";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { cn } from "@/lib/utils";
import { useChapters } from "./chapters-context";

interface SiteNavProps {
  /** Monogram shown as the brand on desktop, e.g. "V & A". */
  monogram: string;
}

type NavItem =
  | { key: string; label: string; short: string; kind: "scroll"; target: string }
  | { key: string; label: string; short: string; kind: "chapter"; chapter: ChapterId };

/** Regular items (the RSVP call-to-action is rendered separately). */
const ITEMS: NavItem[] = [
  { key: "date", label: "Date & Venue", short: "Venue", kind: "scroll", target: "#save-the-date" },
  { key: "events", label: "Events", short: "Events", kind: "chapter", chapter: "celebrations" },
  { key: "travel", label: "Travel Info", short: "Travel", kind: "chapter", chapter: "travel" },
];

/**
 * A floating pill navigation shown once the invitation has opened. "Date &
 * Venue" smooth-scrolls to the countdown section; the others open the matching
 * full-screen chapter.
 *
 * Desktop keeps the monogram-led pill. On mobile every section is shown
 * directly in the bar (no hidden menu) so guests immediately see there's more
 * to explore.
 */
export function SiteNav({ monogram }: SiteNavProps) {
  const reduce = useSafeReducedMotion();
  const { open } = useChapters();
  const { enabled: musicEnabled, toggle: toggleMusic } = useMusic();

  function act(item: NavItem, trigger: HTMLElement) {
    if (item.kind === "scroll") {
      scrollToSection(item.target);
    } else {
      open(item.chapter, trigger);
    }
  }

  const linkClass =
    "rounded-full px-3 py-2 font-sans text-sm font-medium text-charcoal/75 transition-colors hover:text-deep-maroon motion-reduce:transition-none";
  const ctaClass =
    "inline-flex items-center justify-center rounded-full bg-antique-gold font-sans font-semibold text-warm-white transition-colors duration-300 hover:bg-deep-maroon motion-reduce:transition-none";

  const enter = {
    animate: { opacity: 1, y: 0 },
    initial: reduce ? false : { opacity: 0, y: -16 },
    transition: { duration: 0.6, ease: SOFT_EASE },
  } as const;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-30 px-4 pt-3 sm:pt-4">
      {/* Desktop — unchanged: monogram + links + RSVP */}
      <motion.nav
        aria-label="Primary"
        className="pointer-events-auto mx-auto hidden max-w-4xl items-center justify-between gap-3 rounded-full border border-antique-gold/20 bg-warm-white/85 py-2 pl-4 pr-2 shadow-[0_8px_30px_rgb(94_67_34/12%)] backdrop-blur-md sm:flex sm:gap-6 sm:py-2.5 sm:pl-7 sm:pr-3"
        {...enter}
      >
        <button
          className="rounded-full font-display text-[1.2rem] font-medium leading-none tracking-[0.06em] text-deep-maroon transition-colors hover:text-antique-gold motion-reduce:transition-none sm:text-[1.4rem]"
          onClick={() => scrollToSection("#main-content")}
          type="button"
        >
          {monogram}
        </button>

        <div className="flex items-center gap-3">
          <MusicToggle
            className="size-9 border-antique-gold/30 text-antique-gold"
            iconSize={16}
            isEnabled={musicEnabled}
            onToggle={toggleMusic}
          />
          <div className="flex items-center gap-2">
            {ITEMS.map((item) => (
              <button className={linkClass} key={item.key} onClick={(event) => act(item, event.currentTarget)} type="button">
                {item.label}
              </button>
            ))}
            <button
              className={cn(ctaClass, "min-h-10 px-5 text-sm")}
              onClick={(event) => open("rsvp", event.currentTarget)}
              type="button"
            >
              RSVP
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile — every section visible, no hidden menu */}
      <motion.nav
        aria-label="Primary"
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-antique-gold/20 bg-warm-white/90 p-1.5 shadow-[0_8px_30px_rgb(94_67_34/12%)] backdrop-blur-md sm:hidden"
        {...enter}
      >
        <MusicToggle
          className="size-9 shrink-0 border-antique-gold/30 text-antique-gold"
          iconSize={15}
          isEnabled={musicEnabled}
          onToggle={toggleMusic}
        />
        <div className="flex flex-1 items-stretch gap-0.5">
          {ITEMS.map((item) => (
            <button
              className="flex min-h-11 flex-1 items-center justify-center rounded-full px-1 text-center font-sans text-[0.75rem] font-semibold uppercase leading-none tracking-[0.08em] text-charcoal/75 transition-colors active:bg-antique-gold/10 active:text-deep-maroon motion-reduce:transition-none"
              key={item.key}
              onClick={(event) => act(item, event.currentTarget)}
              type="button"
            >
              {item.short}
            </button>
          ))}
          <button
            className="flex min-h-11 flex-1 items-center justify-center rounded-full bg-antique-gold px-1 text-center font-sans text-[0.75rem] font-semibold uppercase leading-none tracking-[0.08em] text-warm-white shadow-[0_2px_10px_rgb(176_141_87/35%)] transition-colors active:bg-deep-maroon motion-reduce:transition-none"
            onClick={(event) => open("rsvp", event.currentTarget)}
            type="button"
          >
            RSVP
          </button>
        </div>
      </motion.nav>
    </div>
  );
}
