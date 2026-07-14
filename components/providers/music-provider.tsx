"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { music } from "@/lib/config/music";

interface MusicContextValue {
  enabled: boolean;
  /** Flip play/pause (the persistent music button). */
  toggle: () => void;
  /** Start playback (used when the guest first taps to enter). */
  enable: () => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function useMusic(): MusicContextValue {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}

/**
 * Owns a single looping <audio> element and the play/pause state, shared across
 * the site (curtain toggle + persistent nav toggle). Playback is driven from an
 * effect that runs synchronously after a click, so it stays inside the browser's
 * user-gesture window; if a play is still blocked it fails quietly.
 */
export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = music.volume;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (enabled) {
      void audio.play().catch(() => {
        // Autoplay blocked (no gesture yet) — the next toggle/tap will start it.
      });
    } else {
      audio.pause();
    }
  }, [enabled]);

  const toggle = useCallback(() => setEnabled((value) => !value), []);
  const enable = useCallback(() => setEnabled(true), []);

  return (
    <MusicContext.Provider value={{ enabled, toggle, enable }}>
      {children}
      {/* Single shared audio element. */}
      <audio loop={music.loop} preload="auto" ref={audioRef} src={music.src} />
    </MusicContext.Provider>
  );
}
