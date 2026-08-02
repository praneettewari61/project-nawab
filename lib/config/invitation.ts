/**
 * All couple- and event-specific content lives here so the presentation
 * components stay generic and reusable for future weddings. Nothing below is
 * hardcoded inside a component — swap these values (and the photo asset) and
 * the opening experience re-skins itself.
 */

export interface CouplePhoto {
  /** Path under /public. Served and optimized by next/image. */
  src: string;
  /** Empty string marks the photo as decorative for screen readers. */
  alt: string;
  /** Tiny base64 preview shown while the full image loads (no flash). */
  blurDataURL: string;
  /** CSS object-position keeping the couple in frame across aspect ratios. */
  focalPoint: string;
}

export interface InvitationDetails {
  monogram: string;
  firstName: string;
  partnerName: string;
  /** Full names, used on the hero. */
  fullName: string;
  partnerFullName: string;
  invitationLine: string;
  city: string;
  cityTagline: string;
  weddingDates: string;
  closingLine: string;
  splashPhoto: CouplePhoto;
  /** Rendered wax seal used as the "Open Invitation" control on the card. */
  sealImageSrc: string;
  /** Optional monogram/logo image for the invitation crest. Omit for the coded crest. */
  monogramImageSrc?: string;
  /** Small kicker above the couple's names on the hero. */
  heroKicker: string;
  /** Short line beneath the hero details. PLACEHOLDER — confirm/replace. */
  heroTagline: string;
  /** Optional cut-out couple illustration shown on the hero. Omit to hide. */
  heroPortrait?: { src: string; alt: string };
}

export const invitationDetails: InvitationDetails = {
  monogram: "A & V",
  firstName: "Akshita",
  partnerName: "Varnit",
  fullName: "Akshita Negi",
  partnerFullName: "Varnit Tewari",
  invitationLine: "Together with our families, we invite you to celebrate our wedding",
  city: "Lucknow",
  cityTagline: "City of Nawabs",
  weddingDates: "11 & 12 December 2026",
  closingLine: "Crafted with love for our family and friends",
  splashPhoto: {
    src: "/images/couple-splash.jpg",
    alt: "",
    blurDataURL:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAAEAAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8IAEQgAEAAYAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAMCBAEFAAYHCAkKC//EAMMQAAEDAwIEAwQGBAcGBAgGcwECAAMRBBIhBTETIhAGQVEyFGFxIweBIJFCFaFSM7EkYjAWwXLRQ5I0ggjhU0AlYxc18JNzolBEsoPxJlQ2ZJR0wmDShKMYcOInRTdls1V1pJXDhfLTRnaA40dWZrQJChkaKCkqODk6SElKV1hZWmdoaWp3eHl6hoeIiYqQlpeYmZqgpaanqKmqsLW2t7i5usDExcbHyMnK0NTV1tfY2drg5OXm5+jp6vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAQIAAwQFBgcICQoL/8QAwxEAAgIBAwMDAgMFAgUCBASHAQACEQMQEiEEIDFBEwUwIjJRFEAGMyNhQhVxUjSBUCSRoUOxFgdiNVPw0SVgwUThcvEXgmM2cCZFVJInotIICQoYGRooKSo3ODk6RkdISUpVVldYWVpkZWZnaGlqc3R1dnd4eXqAg4SFhoeIiYqQk5SVlpeYmZqgo6SlpqeoqaqwsrO0tba3uLm6wMLDxMXGx8jJytDT1NXW19jZ2uDi4+Tl5ufo6ery8/T19vf4+fr/2wBDAAkJCQkJCRAJCRAWEBAQFh4WFhYWHiYeHh4eHiYuJiYmJiYmLi4uLi4uLi43Nzc3NzdAQEBAQEhISEhISEhISEj/2wBDAQsMDBIREh8RER9LMyozS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0v/2gAMAwEAAhEDEQAAAbcNeJGtyUOj/9oACAEBAAEFAmVgMLSppkRQzJISEY//2gAIAQMRAT8B2u1//9oACAECEQE/Adzuf//aAAgBAQAGPwJ6vp7Gmr0JD//EADMQAQADAAICAgICAwEBAAACCwERACExQVFhcYGRobHB8NEQ4fEgMEBQYHCAkKCwwNDg/9oACAEBAAE/IYbKsoObzIa7OBWf1XD8jF//2gAMAwEAAhEDEQAAEEyv/8QAMxEBAQEAAwABAgUFAQEAAQEJAQARITEQQVFhIHHwkYGhsdHB4fEwQFBgcICQoLDA0OD/2gAIAQMRAT8Q4ef/2gAIAQIRAT8Q+i/Jf//aAAgBAQABPxAhyPzSwSUQYRH++qc4sTHU1hGDh15j1Qo8ovnECllDopec1ni//9k=",
    focalPoint: "49% 46%",
  },
  sealImageSrc: "/images/wax-seal-open.png",
  monogramImageSrc: "/images/rsvp/crest-2.png",
  heroKicker: "The Wedding Of",
  heroTagline: "You're cordially invited to celebrate the story of…",
  heroPortrait: {
    src: "/images/couple-illustration.png",
    alt: "Illustration of Akshita and Varnit in traditional Indian attire",
  },
};
