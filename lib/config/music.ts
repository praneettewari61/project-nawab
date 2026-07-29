/**
 * Background music for the experience.
 *
 * ⚠️ Replace `src` with a song you have the rights to use (a wedding site is a
 * public performance — use a track you've licensed or that's royalty-free).
 * Streaming links (Spotify / YouTube / Apple Music) can't be played through a
 * web audio element (DRM/terms) — this needs an actual audio file (mp3/ogg/m4a)
 * placed in /public/audio, or a direct audio URL.
 */

export interface MusicContent {
  /** Path under /public (or a direct audio URL). PLACEHOLDER is silent. */
  src: string;
  /** For attribution / a future "now playing" label. */
  title: string;
  artist: string;
  /** Loop the track for continuous background music. */
  loop: boolean;
  /** Gentle background volume, 0–1. */
  volume: number;
  /**
   * Start softly on the guest's first tap ("tap to continue"). Browsers block
   * audio until a gesture, so the first tap is the earliest reliable moment.
   * Set false to keep it silent until the guest presses the music button.
   */
  autoPlayOnEnter: boolean;
}

export const music: MusicContent = {
  src: "/audio/Haven.mp3",
  title: "Haven",
  artist: "",
  loop: true,
  volume: 0.4,
  autoPlayOnEnter: true,
};
