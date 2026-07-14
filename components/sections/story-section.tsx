import { Container, Section } from "@/components/ui";
import { storyContent } from "@/lib/config/story";
import { StoryHeader } from "./story-header";
import { StoryTimeline } from "./story-timeline";

/**
 * "Our Journey" — the relationship timeline. Content and milestones come
 * entirely from config; this component only arranges them.
 */
export function StorySection() {
  return (
    <Section aria-labelledby="story-heading" tone="warmWhite">
      <Container>
        <StoryHeader
          eyebrow={storyContent.eyebrow}
          headingId="story-heading"
          intro={storyContent.intro}
          title={storyContent.title}
        />
        <StoryTimeline milestones={storyContent.milestones} />
      </Container>
    </Section>
  );
}
