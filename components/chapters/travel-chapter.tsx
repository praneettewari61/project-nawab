import { TravelCard } from "@/components/sections/travel-card";
import { TravelHero } from "@/components/sections/travel-hero";
import { Container } from "@/components/ui";
import { travelContent, type TravelCard as TravelCardData } from "@/lib/config/travel";

/** Editorial column spans — matches the section it replaced. */
const CARD_SPAN: Record<TravelCardData["kind"], string> = {
  info: "md:col-span-5",
  routes: "md:col-span-7",
  destinations: "md:col-span-12",
};

/** Travel Information as a chapter body (no section transition — it lives in the hub now). */
export function TravelChapter() {
  return (
    <Container className="py-14 md:py-20">
      <TravelHero
        eyebrow={travelContent.eyebrow}
        headingId="travel-chapter-heading"
        intro={travelContent.intro}
        title={travelContent.title}
      />

      <ul className="mx-auto mt-12 grid max-w-5xl items-start gap-5 sm:gap-6 md:mt-16 md:grid-cols-12">
        {travelContent.cards.map((card, index) => (
          <TravelCard card={card} className={CARD_SPAN[card.kind]} index={index} key={card.id} />
        ))}
      </ul>
    </Container>
  );
}
