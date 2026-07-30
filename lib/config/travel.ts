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
export type DestinationArt = "taj" | "imambara" | "ram" | "ghats";

export interface TravelLink {
  label: string;
  href: string;
  /** External links open in a new tab with rel="noopener noreferrer". */
  external?: boolean;
}

/** An airport on the journey (e.g. Delhi · DEL). */
export interface RouteEndpoint {
  city: string;
  code: string;
}

/** Chips beneath the journey — a flight time and a road time. */
export interface JourneyChip {
  icon: "flight" | "road";
  label: string;
}

/** The storytelling journey: international → Delhi → ✈ → Lucknow → celebration. */
export interface Journey {
  origin: string;
  hub: RouteEndpoint;
  destination: RouteEndpoint;
  arrivalTitle: string;
  arrivalSubtitle: string;
}

/** A nearby place worth a detour, shown with a line illustration. */
export interface Destination {
  id: string;
  name: string;
  blurb: string;
  art: DestinationArt;
}

/** A warm, handwritten-style closing note from the couple. */
export interface DestinationsNote {
  title: string;
  body: string;
  /** Optional sign-off, e.g. "Varnit & Akshita". */
  signature?: string;
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

/** "Getting to Lucknow" — a cinematic vertical journey timeline. */
export interface RoutesCard extends BaseCard {
  kind: "routes";
  subtitle: string;
  journey: Journey;
  note: string;
  chips: JourneyChip[];
}

/** "Discover Beyond Lucknow" — illustrated destination tiles + a closing note. */
export interface DestinationsCard extends BaseCard {
  kind: "destinations";
  subtitle: string;
  destinations: Destination[];
  note: DestinationsNote;
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
      subtitle: "Your journey to our celebration begins here.",
      journey: {
        origin: "International Flight",
        hub: { city: "Delhi", code: "DEL" },
        destination: { city: "Lucknow", code: "LKO" },
        arrivalTitle: "Your celebration begins here.",
        arrivalSubtitle: "Varnit & Akshita await you.",
      },
      note: "Most international guests arrive via Delhi before taking a short domestic flight to Lucknow. Depending on your departure city, direct international connections to Lucknow may also be available.",
      chips: [
        { icon: "flight", label: "Around 1 hour domestic flight from Delhi" },
        { icon: "road", label: "Around 6–7 hours by road from Delhi" },
      ],
    },
    {
      kind: "destinations",
      id: "extend",
      icon: "explore",
      title: "Discover Beyond Lucknow",
      subtitle:
        "If you have a little extra time during your visit, these nearby destinations are well worth exploring.",
      destinations: [
        {
          id: "lucknow",
          name: "Lucknow",
          blurb: "Discover the City of Nawabs through its architecture, cuisine and timeless culture.",
          art: "imambara",
        },
        {
          id: "agra",
          name: "Agra",
          blurb: "Home to the iconic Taj Mahal, Agra is one of India's most celebrated heritage cities.",
          art: "taj",
        },
        {
          id: "ayodhya",
          name: "Ayodhya",
          blurb: "The birthplace of Lord Rama, Ayodhya is a city of devotion, ancient temples and spiritual significance.",
          art: "ram",
        },
        {
          id: "varanasi",
          name: "Varanasi",
          blurb:
            "One of the world's oldest living cities, renowned for the sacred Ganga Aarti, spiritual heritage, ancient ghats and timeless culture.",
          art: "ghats",
        },
      ],
      note: {
        title: "A Little More to Discover",
        body: "If your schedule allows, we hope you'll take the opportunity to explore some of North India's most beautiful destinations and create memories beyond our wedding weekend.",
        signature: "Varnit & Akshita",
      },
    },
  ],
};
