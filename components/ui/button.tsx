import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center rounded-full border font-sans text-sm font-medium leading-6 transition-colors duration-300 motion-reduce:transition-none focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border-antique-gold bg-ivory px-6 py-2 text-antique-gold hover:bg-antique-gold hover:text-warm-white",
        secondary:
          "border-antique-gold bg-transparent px-6 py-2 text-antique-gold hover:bg-antique-gold hover:text-warm-white",
        text: "border-transparent bg-transparent px-0 py-2 text-antique-gold underline decoration-antique-gold/70 underline-offset-4 hover:text-deep-maroon",
      },
      size: {
        default: "",
        large: "min-h-14 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

/** A minimum-44px touch-target button with the Project Nawab visual language. */
export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      type={type}
      {...props}
    />
  );
}
