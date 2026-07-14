import { cn } from "@/lib/utils";

interface OrnamentalDividerProps {
  /** Line + ornament color. Defaults to antique gold via currentColor. */
  className?: string;
  /** Overall width of the divider. */
  width?: number;
}

/**
 * The design system asks for gold lines with a small motif instead of plain
 * rules. This renders two tapering strokes flanking a lotus-bud diamond.
 */
export function OrnamentalDivider({ className, width = 96 }: OrnamentalDividerProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("text-antique-gold", className)}
      fill="none"
      height={(width / 96) * 12}
      viewBox="0 0 96 12"
      width={width}
    >
      <path d="M2 6h30" stroke="currentColor" strokeLinecap="round" strokeWidth="1" />
      <path d="M64 6h30" stroke="currentColor" strokeLinecap="round" strokeWidth="1" />
      <path d="M48 1c3 2 5 3.5 7 5-2 1.5-4 3-7 5-3-2-5-3.5-7-5 2-1.5 4-3 7-5Z" stroke="currentColor" strokeWidth="1" />
      <circle cx="36" cy="6" r="1.1" fill="currentColor" />
      <circle cx="60" cy="6" r="1.1" fill="currentColor" />
    </svg>
  );
}
