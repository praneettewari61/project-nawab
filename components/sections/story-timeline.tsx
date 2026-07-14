import type { StoryMilestone } from "@/lib/config/story";
import { StoryMilestoneItem } from "./story-milestone";

interface StoryTimelineProps {
  milestones: StoryMilestone[];
}

/**
 * A vertical timeline rail that renders any number of milestones. The rail and
 * nodes give the sequence a sense of a journey; each item reveals on scroll.
 */
export function StoryTimeline({ milestones }: StoryTimelineProps) {
  if (milestones.length === 0) {
    return null;
  }

  return (
    <ol className="relative mx-auto mt-14 max-w-2xl md:mt-20 md:max-w-5xl">
      {/* The rail — left on mobile, centred on desktop. */}
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-4 top-2 w-px bg-gradient-to-b from-antique-gold/50 via-antique-gold/30 to-transparent sm:left-6 md:left-1/2 md:-translate-x-1/2"
      />
      {milestones.map((milestone, index) => (
        <StoryMilestoneItem index={index} key={milestone.id} milestone={milestone} />
      ))}
    </ol>
  );
}
