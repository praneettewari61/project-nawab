/**
 * Travel Information — a short, config-driven section to help international
 * guests reach the wedding. Swap any value below and the UI updates with no
 * code changes. This file is intentionally pure data (no components).
 *
 * ⚠️ PLACEHOLDER to confirm before launch:
 *   - EVISA_URL — the exact official Indian e-Visa URL the couple provides.
 *                 Defaulted to the Government of India portal as a sensible,
 *                 working placeholder; confirm/replace before going live.
 *
 * No legal or immigration advice is given here — the copy defers to the
 * official portal for current requirements.
 */

/** Icon keys resolved to line-art marks in the card component (keeps this a data file). */
export type TravelCardIcon = "visa" | "flight" | "explore";
/** Illustration keys resolved to bespoke SVGs in `travel-art.tsx`. */
export type DestinationArt = "taj" | "temple";

export interface TravelLink {
  label: string;
  href: string;
  /** External links open in a new tab with rel="noopener noreferrer". */
  external?: boolean;
}

/** A single airport in a route (e.g. Delhi · DEL). */
export interface RouteStop {
  city: string;
  code: string;
}

/** One way to reach Lucknow — a direct hop (one stop) or a connection (two). */
export interface RouteOption {
  id: string;
  heading: string;
  caption: string;
  stops: RouteStop[];
}

/** A nearby place worth a detour, shown with a line illustration. */
export interface Destination {
  id: string;
  name: string;
  blurb: string;
  art: DestinationArt;
}

interface BaseCard {
  id: string;
  icon: TravelCardIcon;
  title: string;
}

/** A plain card: a short line of copy and an optional action. */
export interface InfoCard extends BaseCard {
  kind: "info";
  body: string;
  action?: TravelLink;
}

/** "Getting to Lucknow" — two visual travel options. */
export interface RoutesCard extends BaseCard {
  kind: "routes";
  options: RouteOption[];
}

/** "Extend Your Journey" — two illustrated destination tiles. */
export interface DestinationsCard extends BaseCard {
  kind: "destinations";
  destinations: Destination[];
}

export type TravelCard = InfoCard | RoutesCard | DestinationsCard;

export interface TravelContent {
  eyebrow: string;
  title: string;
  intro: string;
  cards: TravelCard[];
}

// PLACEHOLDER — replace with the exact official Indian e-Visa URL the couple provides.
const EVISA_URL = "https://indianvisaonline.gov.in/evisa/";

export const travelContent: TravelContent = {
  eyebrow: "Travel Information",
  title: "Planning Your Journey",
  intro: "A few gentle notes to bring you to Lucknow.",
  cards: [
    {
      kind: "info",
      id: "evisa",
      icon: "visa",
      title: "Indian e-Visa",
      body: "Most international guests will need one. Apply online, well ahead of your trip.",
      action: { label: "Official e-Visa portal", href: EVISA_URL, external: true },
    },
    {
      kind: "routes",
      id: "getting-there",
      icon: "flight",
      title: "Getting to Lucknow",
      options: [
        {
          id: "direct",
          heading: "Fly direct",
          caption: "Straight to Lucknow.",
          stops: [{ city: "Lucknow", code: "LKO" }],
        },
        {
          id: "via-delhi",
          heading: "Via Delhi",
          caption: "Connect onward.",
          stops: [
            { city: "Delhi", code: "DEL" },
            { city: "Lucknow", code: "LKO" },
          ],
        },
      ],
    },
    {
      kind: "destinations",
      id: "extend",
      icon: "explore",
      title: "Extend Your Journey",
      destinations: [
        {
          id: "agra",
          name: "Agra",
          blurb: "Visit the iconic Taj Mahal before the wedding.",
          art: "taj",
        },
        {
          id: "ayodhya",
          name: "Ayodhya",
          blurb: "Explore Ayodhya after the celebrations.",
          art: "temple",
        },
      ],
    },
  ],
};
