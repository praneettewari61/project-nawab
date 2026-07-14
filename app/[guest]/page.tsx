import { OpeningExperience } from "@/components/opening/opening-experience";
import { formatGuestName } from "@/lib/guest";

/**
 * Personalized invite link, e.g. `/daniel` → the welcome screen greets "Daniel".
 * Any single path segment is treated as a guest name. In Next 16 `params` is a
 * Promise and must be awaited.
 */
export default async function GuestPage({ params }: { params: Promise<{ guest: string }> }) {
  const { guest } = await params;
  return <OpeningExperience guestName={formatGuestName(guest)} />;
}
