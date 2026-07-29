/**
 * Save the Date (with a live countdown) and the wedding Venue. Both are
 * config-driven — swap values here and the UI updates with no code changes.
 *
 * The celebration spans two days (11 & 12 December 2026) and the venue are
 * confirmed, real details. The countdown targets the start of Haldi on the
 * 11th (12:00 PM IST, matching the `celebrations` schedule in chapters.ts) —
 * that's when guests should arrive, since both days are part of the wedding.
 */

export interface SaveTheDateContent {
  eyebrow: string;
  lead: string;
  /** Human-readable wedding date shown large. */
  displayDate: string;
  /** ISO 8601 (with timezone) — the live countdown target. */
  targetDate: string;
}

export interface VenueContent {
  eyebrow: string;
  name: string;
  /** Address, one entry per line; joined with a gold middot. */
  addressLines: string[];
  /** Google Maps link — opened by the "View Venue" action. */
  mapUrl: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    /** object-position for the framed crop. */
    focalPoint: string;
  };
}

export const saveTheDate: SaveTheDateContent = {
  eyebrow: "Save the Date(s)",
  lead: "We can't wait to celebrate with you",
  displayDate: "11 & 12 December 2026",
  targetDate: "2026-12-11T12:00:00+05:30",
};

export const venue: VenueContent = {
  eyebrow: "The Celebration Venue",
  name: "The Grand Banquet and Lawn",
  addressLines: ["Mohanlalganj", "Lucknow, Uttar Pradesh, India"],
  mapUrl:
    "https://www.google.com/maps/place/The+Grand+Banquet+and+Lawn/@26.6355715,80.9967015,17z/data=!3m1!4b1!4m6!3m5!1s0x399bef00166cb393:0xf0ad21021525f5af!8m2!3d26.6355667!4d80.9992764!16s%2Fg%2F11yfms70v5?entry=ttu&g_ep=EgoyMDI2MDcwOC4wIKXMDSoASAFQAw%3D%3D",
  image: {
    src: "/images/grand_hotel.webp",
    alt: "The Grand Banquet and Lawn, aglow at sunset over its gardens.",
    width: 762,
    height: 1020,
    focalPoint: "center 42%",
  },
};
