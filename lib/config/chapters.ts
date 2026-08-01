/**
 * The "Explore & Celebrate" hub and its three chapters. The hub stays short;
 * each card opens its chapter full-screen. All copy is config-driven.
 *
 * Travel Information is real & complete (see lib/config/travel.ts). Wedding
 * Celebrations and RSVP are ⚠️ PLACEHOLDER scaffolds awaiting real content.
 */

export type ChapterId = "travel" | "celebrations" | "rsvp";

export interface ChapterCard {
  id: ChapterId;
  title: string;
  teaser: string;
}

export interface ChaptersHubContent {
  eyebrow: string;
  title: string;
  cards: ChapterCard[];
}

export const chaptersHub: ChaptersHubContent = {
  eyebrow: "Explore & Celebrate",
  title: "Everything for the Day",
  cards: [
    {
      id: "travel",
      title: "Travel Information",
      teaser: "Reaching Lucknow, the e-Visa, and a little inspiration for the trip.",
    },
    {
      id: "celebrations",
      title: "Wedding Celebrations",
      teaser: "The events that make up our celebration, day by day.",
    },
    {
      id: "rsvp",
      title: "RSVP",
      teaser: "Kindly let us know you'll be joining us.",
    },
  ],
};

/* ————————————————————————— Wedding Celebrations ————————————————————————— */

export type CelebrationArt = "haldi" | "sangeet" | "wedding" | "reception";
export type CelebrationAccent = "gold" | "rose" | "maroon" | "sage";

export interface CelebrationEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  /** ⚠️ Venue is a placeholder — confirm the specific hall/lawn per event. */
  venue: string;
  description: string;
  /** "What to Expect" chips. */
  highlights: string[];
  art: CelebrationArt;
  accent: CelebrationAccent;
  /** ISO 8601 with offset — for "Add to Calendar" (.ics). End times are assumed. */
  start: string;
  end: string;
}

export interface CelebrationsContent {
  eyebrow: string;
  title: string;
  intro: string;
  events: CelebrationEvent[];
}

// Schedule is real (couple-provided). Venue per event is a placeholder for now.
export const celebrations: CelebrationsContent = {
  eyebrow: "Wedding Celebrations",
  title: "The Days of Celebration",
  intro: "Four gatherings across two joyful days. Tap any card to see what each celebration holds.",
  events: [
    {
      id: "haldi",
      name: "Haldi",
      date: "11 December 2026",
      time: "12:00 PM onwards",
      venue: "The Grand Banquet and Lawn",
      description:
        "A joyful pre-wedding ritual where a turmeric paste is applied to the couple as an auspicious ubtan (traditional facial) to bless and prepare them for the big day.",
      highlights: ["Turmeric ceremony", "Music", "Family fun"],
      art: "haldi",
      accent: "gold",
      start: "2026-12-11T12:00:00+05:30",
      end: "2026-12-11T15:00:00+05:30",
    },
    {
      id: "sangeet",
      name: "Sangeet",
      date: "11 December 2026",
      time: "8:00 PM onwards",
      venue: "The Grand Banquet and Lawn",
      description:
        "A lively pre-wedding celebration dedicated to music, dance & joy where both families come together to dance & celebrate the upcoming union.",
      highlights: ["Dance performances", "Live music", "Cocktails"],
      art: "sangeet",
      accent: "rose",
      start: "2026-12-11T20:00:00+05:30",
      end: "2026-12-11T23:00:00+05:30",
    },
    {
      id: "wedding",
      name: "Wedding",
      date: "12 December 2026",
      time: "12:00 PM onwards",
      venue: "The Grand Banquet and Lawn",
      description:
        "Our traditional Hindu wedding ceremony, centered around ‘Pheras’ where the couple takes vows around a holy fire to symbolize their lifelong marital union.",
      highlights: ["Traditional rituals", "Wedding vows", "Lunch"],
      art: "wedding",
      accent: "maroon",
      start: "2026-12-12T12:00:00+05:30",
      end: "2026-12-12T15:00:00+05:30",
    },
    {
      id: "reception",
      name: "Reception",
      date: "12 December 2026",
      time: "8:00 PM onwards",
      venue: "The Grand Banquet and Lawn",
      description:
        "A grand post-wedding celebration to formally introduce the newlywed couple to a wider circle of extended family, friends, & associates over a festive feast.",
      highlights: ["Dinner", "Music", "Celebration"],
      art: "reception",
      accent: "sage",
      start: "2026-12-12T20:00:00+05:30",
      end: "2026-12-12T23:00:00+05:30",
    },
  ],
};

/* ————————————————————————————————— RSVP ————————————————————————————————— */

export interface RsvpContent {
  eyebrow: string;
  title: string;
  intro: string;
  /** Fine-print reassurance shown beneath the form. */
  note: string;
  /** Confirmation shown after a response is saved. */
  thanks: string;
}

export const rsvp: RsvpContent = {
  eyebrow: "RSVP",
  title: "Kindly Respond",
  intro: "We would be so honoured to have you with us. Please let us know below.",
  note: "A little note helps us plan — thank you.",
  thanks: "Your response has been received. We can't wait to celebrate with you.",
};
