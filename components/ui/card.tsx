import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export type CardProps = ComponentPropsWithoutRef<"div">;

/** A warm, softly elevated surface inspired by handcrafted invitation paper. */
export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-sand bg-warm-white p-6 shadow-soft md:p-8",
        className,
      )}
      {...props}
    />
  );
}
