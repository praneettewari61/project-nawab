import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const sectionVariants = cva("py-16 md:py-24 xl:py-32", {
  variants: {
    tone: {
      ivory: "bg-ivory text-charcoal",
      warmWhite: "bg-warm-white text-charcoal",
      charcoal: "bg-charcoal text-warm-white",
    },
  },
  defaultVariants: {
    tone: "ivory",
  },
});

export interface SectionProps
  extends ComponentPropsWithoutRef<"section">,
    VariantProps<typeof sectionVariants> {}

/** A full-width, mobile-first chapter wrapper with approved background tones. */
export function Section({ className, tone, ...props }: SectionProps) {
  return <section className={cn(sectionVariants({ tone }), className)} {...props} />;
}
