import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeadingTag = "h1" | "h2" | "h3";

export interface SectionTitleProps {
  title: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  as?: HeadingTag;
  align?: "start" | "center";
  headingId?: string;
  className?: string;
  headingClassName?: string;
}

/** Editorial heading with an optional gold eyebrow and concise supporting copy. */
export function SectionTitle({
  title,
  eyebrow,
  description,
  as: Heading = "h2",
  align = "start",
  headingId,
  className,
  headingClassName,
}: SectionTitleProps) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={cn("flex max-w-2xl flex-col gap-3", alignment, className)}>
      {eyebrow ? (
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-antique-gold">
          {eyebrow}
        </p>
      ) : null}
      <Heading
        className={cn(
          "font-display text-h2 font-medium leading-[1.05] tracking-[-0.02em] text-current md:text-h1",
          headingClassName,
        )}
        id={headingId}
      >
        {title}
      </Heading>
      {description ? (
        <p className="max-w-prose font-sans text-base leading-7 text-current/80 md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
