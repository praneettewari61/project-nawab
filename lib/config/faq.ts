/**
 * FAQ section shown directly beneath the "Everything for the Day" hub.
 * Config-driven, like the rest of the site's content — swap questions/answers
 * here with no component changes.
 */

import { invitationDetails } from "./invitation";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  heading: string;
  helpText: string;
  contactLabel: string;
  items: FaqItem[];
}

export const faq: FaqContent = {
  heading: "Questions & Answers",
  helpText: "Can't find the answer here?",
  contactLabel: `Reach out to ${invitationDetails.firstName} & ${invitationDetails.partnerName}`,
  items: [
    {
      question: "When should I RSVP by?",
      answer: "We'd love to know by September 3rd, 2026, so we can finalise numbers with our venue and caterers.",
    },
    {
      question: "Is there a dress code?",
      answer:
        "We're still finalising the exact dress code and will share details closer to the date. As a general guide: Haldi calls for bright, comfortable, casual Indian wear — nothing you'll mind a little turmeric on. Sangeet is festive and dance-friendly, so feel free to go bold with colour and sparkle. The Wedding is traditional formal Indian attire — think rich fabrics like silk and velvet. And the Reception is elegant eveningwear, Indian or western, on the more polished side.",
    },
    {
      question: "What will the weather be like? What happens if it rains?",
      answer:
        "December in Lucknow is generally cold and dry, with crisp mornings and evenings, so do pack a jacket or shawl for the outdoor functions. Rain is unlikely at this time of year, and the venue has indoor spaces on hand as a backup just in case.",
    },
    {
      question: "Can I bring a plus one or my kids?",
      answer:
        "Yes, plus ones are more than welcome! If you're planning on bringing your kids along, just let us know when you RSVP so we can plan accordingly.",
    },
    {
      question: "What time should I arrive at the ceremony?",
      answer:
        "Please arrive at the time mentioned for each event, or up to 15 minutes after — Indian weddings do tend to run a little behind schedule, so there's no need to rush.",
    },
    {
      question: "Help! I have other questions!",
      answer: "No worries at all — feel free to reach out to us, we're happy to help.",
    },
  ],
};
