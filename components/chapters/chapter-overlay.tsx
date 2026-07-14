"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import { SOFT_EASE } from "@/lib/animation/motion";
import type { ChapterId } from "@/lib/config/chapters";
import { CelebrationsChapter } from "./celebrations-chapter";
import { RsvpChapter } from "./rsvp-chapter";
import { TravelChapter } from "./travel-chapter";

const SHORT_TITLE: Record<ChapterId, string> = {
  travel: "Travel",
  celebrations: "Celebrations",
  rsvp: "RSVP",
};

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

interface ChapterOverlayProps {
  chapter: ChapterId;
  onClose: () => void;
}

/**
 * A full-screen chapter, opened from the hub. It's an accessible modal dialog:
 * focus is trapped, Escape closes, and its own region scrolls (the page behind
 * is scroll-locked + inert by the orchestrator). Entrance/exit is a soft
 * fade-and-rise handled by the parent AnimatePresence.
 */
export function ChapterOverlay({ chapter, onClose }: ChapterOverlayProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = `chapter-${chapter}-label`;

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);

    (container.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0])?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => container.removeEventListener("keydown", onKeyDown);
  }, [chapter, onClose]);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      aria-labelledby={titleId}
      aria-modal="true"
      className="paper-texture fixed inset-0 z-50 flex flex-col bg-ivory"
      exit={{ opacity: 0, y: 24 }}
      initial={{ opacity: 0, y: 24 }}
      ref={ref}
      role="dialog"
      transition={{ duration: 0.5, ease: SOFT_EASE }}
    >
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-antique-gold/15 bg-ivory/85 px-5 py-4 backdrop-blur sm:px-8">
        <button
          className="group inline-flex items-center gap-2 font-sans text-sm font-medium text-antique-gold transition-colors hover:text-deep-maroon motion-reduce:transition-none"
          data-autofocus
          onClick={onClose}
          type="button"
        >
          <ArrowLeft
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-x-0.5 motion-reduce:transition-none"
            size={18}
            strokeWidth={1.8}
          />
          Back
        </button>
        <span
          className="font-sans text-caption font-semibold uppercase tracking-[0.28em] text-charcoal/50"
          id={titleId}
        >
          {SHORT_TITLE[chapter]}
        </span>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
        {chapter === "travel" ? <TravelChapter /> : null}
        {chapter === "celebrations" ? <CelebrationsChapter /> : null}
        {chapter === "rsvp" ? <RsvpChapter /> : null}
      </div>
    </motion.div>
  );
}
