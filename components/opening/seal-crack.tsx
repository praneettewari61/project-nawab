import type { Ref } from "react";

/**
 * A jagged fracture drawn over the wax seal. Hidden by default (opacity 0) and
 * revealed by the opening sequence once the seal has been pressed.
 */
export function SealCrack({ ref }: { ref?: Ref<SVGSVGElement> }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 size-[150px] -translate-x-1/2 -translate-y-1/2 opacity-0"
      fill="none"
      ref={ref}
      viewBox="0 0 100 100"
    >
      {/* main vertical fracture */}
      <path
        d="M50 16 L46 33 L54 46 L45 61 L53 74 L49 86"
        stroke="rgba(38,24,8,0.6)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      {/* fine offshoots */}
      <path
        d="M46 33 L36 30 M54 46 L64 42 M45 61 L34 65 M53 74 L63 71"
        stroke="rgba(38,24,8,0.4)"
        strokeLinecap="round"
        strokeWidth="1"
      />
      {/* subtle inner highlight so the crack reads as depth, not a drawn line */}
      <path
        d="M50 16 L46 33 L54 46 L45 61 L53 74 L49 86"
        stroke="rgba(255,246,230,0.35)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="0.5"
        transform="translate(0.8 0)"
      />
    </svg>
  );
}
