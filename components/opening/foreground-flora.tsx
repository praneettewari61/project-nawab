import { cn } from "@/lib/utils";

/** A single soft blossom used to build out-of-focus foreground clusters. */
function Blossom({ x, y, r, className }: { x: number; y: number; r: number; className?: string }) {
  const petals = Array.from({ length: 5 });
  return (
    <g className={className} transform={`translate(${x} ${y})`}>
      {petals.map((_, i) => {
        const angle = (i * 360) / 5;
        return (
          <ellipse
            cx="0"
            cy={-r * 0.62}
            fill="currentColor"
            key={angle}
            rx={r * 0.42}
            ry={r * 0.62}
            transform={`rotate(${angle})`}
          />
        );
      })}
      <circle cx="0" cy="0" fill="currentColor" r={r * 0.34} />
    </g>
  );
}

/**
 * A blurred cluster of blossoms anchored to a bottom corner. Heavy blur makes
 * it read as depth-of-field foreground that frames — never covers — the couple.
 * Colours come only from the design-system palette.
 */
export function ForegroundFlora({ side }: { side: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute bottom-0 h-[40%] w-[58%] blur-[5px]",
        side === "left" ? "left-0 -scale-x-100" : "right-0",
      )}
      fill="none"
      preserveAspectRatio="xMidYMax meet"
      viewBox="0 0 200 160"
    >
      {/* stems / leaves */}
      <g className="text-muted-sage/55" stroke="currentColor" strokeWidth="3">
        <path d="M40 160C48 120 44 96 70 78" fill="none" strokeLinecap="round" />
        <path d="M96 160C92 128 104 104 120 92" fill="none" strokeLinecap="round" />
        <path d="M150 160C154 130 150 110 138 96" fill="none" strokeLinecap="round" />
        <path d="M182 160C186 132 178 116 168 104" fill="none" strokeLinecap="round" />
      </g>
      {/* blossom clusters — brought toward the centre so the florals read
          across the base of the frame, not only in the corners */}
      <g className="text-soft-rose/70">
        <Blossom r={22} x={64} y={68} />
        <Blossom r={15} x={112} y={92} />
      </g>
      <g className="text-antique-gold/55">
        <Blossom r={17} x={138} y={78} />
        <Blossom r={12} x={90} y={118} />
        <Blossom r={13} x={182} y={116} />
      </g>
      <g className="text-soft-rose/55">
        <Blossom r={13} x={40} y={104} />
        <Blossom r={10} x={162} y={108} />
        <Blossom r={11} x={150} y={134} />
      </g>
    </svg>
  );
}
