/**
 * Save the Date (with a live countdown) and the wedding Venue. Both are
 * config-driven — swap values here and the UI updates with no code changes.
 *
 * The wedding date (12 December 2026) and the venue are confirmed, real details.
 * Only the exact ceremony time is assumed: the countdown targets the start of
 * the wedding day in IST — set a precise time on `targetDate` when known.
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
  eyebrow: "Save the Date",
  lead: "So please join us…",
  displayDate: "12 December 2026",
  targetDate: "2026-12-12T00:00:00+05:30",
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
