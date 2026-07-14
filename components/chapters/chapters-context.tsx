"use client";

import { AnimatePresence } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import type { ChapterId } from "@/lib/config/chapters";
import { ChapterOverlay } from "./chapter-overlay";

interface ChaptersContextValue {
  active: ChapterId | null;
  open: (id: ChapterId, trigger?: HTMLElement | null) => void;
  close: () => void;
}

const ChaptersContext = createContext<ChaptersContextValue | null>(null);

/** Open/close the full-screen chapters from anywhere (hub cards, top nav, …). */
export function useChapters(): ChaptersContextValue {
  const context = useContext(ChaptersContext);
  if (!context) {
    throw new Error("useChapters must be used within a ChaptersProvider");
  }
  return context;
}

/** SSR-safe "are we on the client yet?" — the overlay portal needs a DOM target. */
const subscribeNoop = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

/**
 * Owns the active chapter and renders the single full-screen overlay (portaled
 * to <body>). While a chapter is open the page (#main-content) is made `inert`
 * and scroll-locked, a history entry is pushed so the device Back closes the
 * chapter, and focus returns to whatever opened it.
 */
export function ChaptersProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ChapterId | null>(null);
  const mounted = useMounted();
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((id: ChapterId, trigger?: HTMLElement | null) => {
    triggerRef.current = trigger ?? null;
    window.history.pushState({ __chapter: id }, "");
    setActive(id);
  }, []);

  const close = useCallback(() => {
    if (typeof window !== "undefined" && (window.history.state as { __chapter?: string } | null)?.__chapter) {
      window.history.back();
    } else {
      setActive(null);
    }
  }, []);

  useEffect(() => {
    if (!active) return;

    const main = document.getElementById("main-content");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (main) main.inert = true;

    const onPopState = () => setActive(null);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.body.style.overflow = previousOverflow;
      if (main) main.inert = false;
      window.removeEventListener("popstate", onPopState);
      triggerRef.current?.focus();
    };
  }, [active]);

  return (
    <ChaptersContext.Provider value={{ active, open, close }}>
      {children}
      {mounted
        ? createPortal(
            <AnimatePresence>
              {active ? <ChapterOverlay chapter={active} key={active} onClose={close} /> : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </ChaptersContext.Provider>
  );
}
