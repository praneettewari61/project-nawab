/**
 * Turn a URL segment into a friendly display name for personalized invites.
 *   "daniel"     → "Daniel"
 *   "john-doe"   → "John Doe"
 *   "maria_jose" → "Maria Jose"
 */
export function formatGuestName(raw: string | undefined): string {
  if (!raw) return "";
  let value: string;
  try {
    value = decodeURIComponent(raw);
  } catch {
    value = raw;
  }
  value = value.replace(/[-_+]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 48);
  if (!value) return "";
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
