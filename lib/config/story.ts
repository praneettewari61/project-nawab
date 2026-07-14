/**
 * PLACEHOLDER content for the "Our Journey" timeline. Everything here is
 * scaffolding — no real wedding details. Replace the copy, dates and locations,
 * and swap the files in /public/images/story with the couple's real media
 * (keep the same filenames and no code changes are needed). The timeline
 * renders any number of milestones.
 */

export interface StoryMilestoneImage {
  src: string;
  alt: string;
}

export interface StoryMilestoneVideo {
  src: string;
  /** Optional poster frame; falls back to the milestone image. */
  poster?: string;
}

export interface StoryMilestone {
  id: string;
  date: string;
  title: string;
  description: string;
  location: string;
  image: StoryMilestoneImage;
  /** Optional — when present the card renders a playable video instead. */
  video?: StoryMilestoneVideo;
}

export interface StoryContent {
  eyebrow: string;
  title: string;
  intro: string;
  milestones: StoryMilestone[];
}

export const storyContent: StoryContent = {
  eyebrow: "Our Journey",
  title: "The Story So Far",
  intro:
    "Placeholder introduction — a short, warm line about the couple's journey will live here.",
  milestones: [
    {
      id: "met",
      date: "Month Year",
      title: "How We Met",
      description:
        "Placeholder — the story of how they first met goes here. Replace with your own words.",
      location: "City, Country",
      image: { src: "/images/story/story-1.jpg", alt: "Placeholder photo — replace with a real moment." },
    },
    {
      id: "first-journey",
      date: "Month Year",
      title: "Our First Journey Together",
      description:
        "Placeholder — a memory from an early trip or milestone. Replace with your own words.",
      location: "City, Country",
      image: { src: "/images/story/story-2.jpg", alt: "Placeholder photo — replace with a real moment." },
    },
    {
      id: "proposal",
      date: "Month Year",
      title: "The Proposal",
      description:
        "Placeholder — the proposal story goes here. Replace with your own words.",
      location: "City, Country",
      image: { src: "/images/story/story-3.jpg", alt: "Placeholder photo — replace with a real moment." },
    },
    {
      id: "engagement",
      date: "Month Year",
      title: "The Engagement",
      description:
        "Placeholder — the engagement celebration goes here. Replace with your own words.",
      location: "City, Country",
      image: { src: "/images/story/story-4.jpg", alt: "Placeholder photo — replace with a real moment." },
    },
    {
      id: "forever",
      date: "Month Year",
      title: "Forever Begins",
      description:
        "Placeholder — a closing line leading into the wedding. Replace with your own words.",
      location: "City, Country",
      image: { src: "/images/story/story-5.jpg", alt: "Placeholder photo — replace with a real moment." },
    },
  ],
};
