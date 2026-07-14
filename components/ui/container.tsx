import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export type ContainerProps = ComponentPropsWithoutRef<"div">;

/** Implements the design-system content widths: 100% mobile, 90% tablet, 80% desktop. */
export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-4 md:w-[90%] md:px-0 lg:w-[80%]", className)}
      {...props}
    />
  );
}
