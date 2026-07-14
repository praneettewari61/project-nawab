"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { music } from "@/lib/config/music";

interface MusicContextValue {
  enabled: boolean;
  /** Flip play/pause (the persistent music button). */
  toggle: () => void;
  /** Start playback — called synchronously from the guest's first tap. */
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
 * Owns a single looping <audio> element shared across the site.
 *
 * `play()` / `pause()` are called **synchronously** from the click handlers so
 * they stay inside the browser's user-gesture window (Safari/iOS reject a play
 * that happens later in an effect). The visible on/off state is driven by the
 * audio element's own play/pause events, so the icon always matches reality
 * even if a play attempt is blocked.
 */
export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = music.volume;
    const onPlay = () => setEnabled(true);
    const onPause = () => setEnabled(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  const enable = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.paused) {
      void audio.play().catch(() => {
        // Blocked (no gesture yet) — the guest can start it with the button.
      });
    }
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  return (
    <MusicContext.Provider value={{ enabled, toggle, enable }}>
      {children}
      <audio loop={music.loop} preload="auto" ref={audioRef} src={music.src} />
    </MusicContext.Provider>
  );
}
