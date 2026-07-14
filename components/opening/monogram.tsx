import { cn } from "@/lib/utils";

interface MonogramProps {
  value: string;
  className?: string;
}

/** A restrained, typographic mark used on the wax seal and closed invitation. */
export function Monogram({ value, className }: MonogramProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "whitespace-nowrap font-display text-h2 font-medium leading-none tracking-[0.08em] text-current",
        className,
      )}
    >
      {value}
    </span>
  );
}
