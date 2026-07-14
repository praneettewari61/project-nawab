"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MusicToggle } from "@/components/opening/music-toggle";
import { useMusic } from "@/components/providers/music-provider";
import { scrollToSection } from "@/components/providers/smooth-scroll-provider";
import { SOFT_EASE } from "@/lib/animation/motion";
import type { ChapterId } from "@/lib/config/chapters";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { cn } from "@/lib/utils";
import { useChapters } from "./chapters-context";

interface SiteNavProps {
  /** Monogram shown as the brand, e.g. "V & A". */
  monogram: string;
}

type NavItem =
  | { key: string; label: string; kind: "scroll"; target: string }
  | { key: string; label: string; kind: "chapter"; chapter: ChapterId };

/** Regular items (the RSVP call-to-action is rendered separately). */
const ITEMS: NavItem[] = [
  { key: "date", label: "Date & Venue", kind: "scroll", target: "#save-the-date" },
  { key: "events", label: "Events", kind: "chapter", chapter: "celebrations" },
  { key: "travel", label: "Travel Info", kind: "chapter", chapter: "travel" },
];

/**
 * A floating pill navigation shown once the invitation has opened. "Date &
 * Venue" smooth-scrolls to the countdown section; the others open the matching
 * full-screen chapter. Collapses into a menu on mobile.
 */
export function SiteNav({ monogram }: SiteNavProps) {
  const reduce = useSafeReducedMotion();
  const { open } = useChapters();
  const { enabled: musicEnabled, toggle: toggleMusic } = useMusic();
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function act(item: NavItem, trigger: HTMLElement) {
    if (item.kind === "scroll") {
      scrollToSection(item.target);
    } else {
      open(item.chapter, trigger);
    }
    setMenuOpen(false);
  }

  // Close the mobile menu on Escape or a click outside the nav.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  const linkClass =
    "rounded-full px-3 py-2 font-sans text-sm font-medium text-charcoal/75 transition-colors hover:text-deep-maroon motion-reduce:transition-none";
  const ctaClass =
    "inline-flex items-center justify-center rounded-full bg-antique-gold font-sans font-semibold text-warm-white transition-colors duration-300 hover:bg-deep-maroon motion-reduce:transition-none";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-30 px-4 pt-3 sm:pt-4" ref={containerRef}>
      <motion.nav
        animate={{ opacity: 1, y: 0 }}
        aria-label="Primary"
        className="pointer-events-auto mx-auto flex max-w-4xl items-center justify-between gap-3 rounded-full border border-antique-gold/20 bg-warm-white/85 py-2 pl-4 pr-2 shadow-[0_8px_30px_rgb(94_67_34/12%)] backdrop-blur-md sm:gap-6 sm:py-2.5 sm:pl-7 sm:pr-3"
        initial={reduce ? false : { opacity: 0, y: -16 }}
        transition={{ duration: 0.6, ease: SOFT_EASE }}
      >
        <button
          className="rounded-full font-display text-[1.2rem] font-medium leading-none tracking-[0.06em] text-deep-maroon transition-colors hover:text-antique-gold motion-reduce:transition-none sm:text-[1.4rem]"
          onClick={() => scrollToSection("#main-content")}
          type="button"
        >
          {monogram}
        </button>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <MusicToggle
            className="size-9 border-antique-gold/30 text-antique-gold"
            iconSize={16}
            isEnabled={musicEnabled}
            onToggle={toggleMusic}
          />

          {/* Desktop links */}
          <div className="hidden items-center gap-2 sm:flex">
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

          {/* Mobile menu toggle — labeled so guests know it opens the menu */}
          <button
            aria-controls="site-nav-menu"
            aria-expanded={menuOpen}
            className="inline-flex items-center gap-1.5 rounded-full border border-antique-gold/50 py-1.5 pl-2.5 pr-3.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-antique-gold transition-colors hover:bg-antique-gold/10 motion-reduce:transition-none sm:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            type="button"
          >
            {menuOpen ? <X size={16} strokeWidth={2} /> : <Menu size={16} strokeWidth={2} />}
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </motion.nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-auto mx-auto mt-2 max-w-4xl origin-top rounded-3xl border border-antique-gold/20 bg-warm-white/95 p-2 shadow-[0_12px_36px_rgb(94_67_34/16%)] backdrop-blur-md sm:hidden"
            exit={{ opacity: 0, y: -8 }}
            id="site-nav-menu"
            initial={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: SOFT_EASE }}
          >
            {ITEMS.map((item) => (
              <button
                className="flex w-full items-center rounded-2xl px-4 py-3 text-left font-sans text-sm font-medium text-charcoal/80 transition-colors hover:bg-ivory hover:text-deep-maroon motion-reduce:transition-none"
                key={item.key}
                onClick={(event) => act(item, event.currentTarget)}
                type="button"
              >
                {item.label}
              </button>
            ))}
            <button
              className={cn(ctaClass, "mt-1 w-full px-4 py-3 text-sm")}
              onClick={(event) => {
                open("rsvp", event.currentTarget);
                setMenuOpen(false);
              }}
              type="button"
            >
              RSVP
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
