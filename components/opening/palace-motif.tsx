import { cn } from "@/lib/utils";

/** A restrained line-art Nawabi skyline (domes + arches) for the city block. */
export function PalaceMotif({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("text-antique-gold", className)}
      fill="none"
      viewBox="0 0 120 44"
    >
      <g stroke="currentColor" strokeLinejoin="round" strokeWidth="1.1">
        {/* central dome + finial */}
        <path d="M60 6v4" strokeLinecap="round" />
        <path d="M52 22c0-6 3.6-10 8-10s8 4 8 10" />
        <path d="M49 22h22v14H49z" />
        {/* central arch */}
        <path d="M56 36v-6c0-2.2 1.8-4 4-4s4 1.8 4 4v6" />
        {/* left minaret */}
        <path d="M40 20c0-4 2.4-6 4.4-6s4.4 2 4.4 6" />
        <path d="M40 20h8.8v16H40z" />
        {/* right minaret */}
        <path d="M71 20c0-4 2.4-6 4.4-6s4.4 2 4.4 6" />
        <path d="M71 20h8.8v16H71z" />
        {/* outer wings */}
        <path d="M26 30c0-3 2-5 4-5s4 2 4 5v6H26z" />
        <path d="M86 30c0-3 2-5 4-5s4 2 4 5v6H86z" />
        {/* ground line */}
        <path d="M18 36h84" strokeLinecap="round" />
      </g>
    </svg>
  );
}
