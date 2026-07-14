import Image from "next/image";
import { cn } from "@/lib/utils";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface FloralCornerProps {
  corner: Corner;
  className?: string;
}

/*
 * The corner florals are cut out (transparent) from the reference artwork. Only
 * the two left-hand sprays are stored; the right-hand corners reuse them
 * mirrored, which keeps the card symmetric and avoids the reference's baked-in
 * music icon / wax seal that sit near the right and bottom edges.
 */
const TOP = "/images/floral-corner-top.png";
const BOTTOM = "/images/floral-corner-bottom.png";

const cornerSpec: Record<
  Corner,
  { src: string; width: number; height: number; position: string; flip: boolean }
> = {
  "top-left": { src: TOP, width: 118, height: 210, position: "left-1 top-1", flip: false },
  "top-right": { src: TOP, width: 118, height: 210, position: "right-1 top-1", flip: true },
  "bottom-left": { src: BOTTOM, width: 112, height: 272, position: "bottom-1 left-1", flip: false },
  "bottom-right": { src: BOTTOM, width: 112, height: 272, position: "bottom-1 right-1", flip: true },
};

/** Renders the reference floral artwork in a card corner (mirrored on the right). */
export function FloralCorner({ corner, className }: FloralCornerProps) {
  const spec = cornerSpec[corner];
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute select-none",
        spec.position,
        spec.flip && "-scale-x-100",
        className,
      )}
      height={spec.height}
      src={spec.src}
      unoptimized
      width={spec.width}
    />
  );
}
