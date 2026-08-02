import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { InvitationDetails } from "@/lib/config/invitation";
import { FloralCorner } from "./floral-corner";
import { Monogram } from "./monogram";
import { OrnamentalDivider } from "./ornamental-divider";
import { PalaceMotif } from "./palace-motif";

const SEAL_SIZE = 128;

interface InvitationFaceProps {
  details: InvitationDetails;
  /**
   * "panel" — the full painted card, used for the two gatefold halves.
   * "seal"  — everything hidden except the seal slot, used as a single aligned
   *           overlay so the interactive seal can animate as one element.
   */
  variant?: "panel" | "seal";
  /** Interactive seal + crack, rendered into the seal slot for the "seal" variant. */
  sealSlot?: ReactNode;
}

/** Small leafed flourish that crowns the monogram ring. */
function CrestFleuron({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" viewBox="0 0 28 12">
      <path d="M14 11V5" strokeLinecap="round" strokeWidth="0.9" />
      <path d="M14 6C11 6 8 4.5 5 1.5" strokeLinecap="round" strokeWidth="0.8" />
      <path d="M14 6C17 6 20 4.5 23 1.5" strokeLinecap="round" strokeWidth="0.8" />
      <path d="M14 7.5c-2 0-3.6-1-4.8-2.6M14 7.5c2 0 3.6-1 4.8-2.6" strokeWidth="0.7" />
      <circle cx="14" cy="3.6" fill="currentColor" r="1.3" stroke="none" />
    </svg>
  );
}

/**
 * The static visual of the luxury invitation. Rendered identically for both
 * gatefold halves so the closed card is seamless, and again (hidden) as the
 * seal overlay so the interactive seal aligns exactly with the reserved slot.
 */
export function InvitationFace({ details, variant = "panel", sealSlot }: InvitationFaceProps) {
  const isSeal = variant === "seal";

  return (
    <section
      className={cn(
        "flex min-h-dvh w-full items-center justify-center px-4 py-4",
        isSeal ? "pointer-events-none" : "bg-ivory",
      )}
    >
      <div className="relative mx-auto w-full max-w-md md:max-w-lg lg:max-w-xl">
        {/* When used as the seal overlay, the whole painted card is hidden
            (visibility only, so layout — and thus the seal position — is
            preserved); the seal slot re-shows itself. */}
        <div
          className={cn(
            "paper-texture relative overflow-hidden rounded-large border border-antique-gold/60 bg-[#f4eee6] shadow-soft",
            isSeal && "invisible",
          )}
        >
          <div className="pointer-events-none absolute inset-2.5 rounded-[1.6rem] border border-antique-gold/35" />

          <FloralCorner corner="top-left" />
          <FloralCorner corner="top-right" />
          <FloralCorner corner="bottom-left" />
          <FloralCorner corner="bottom-right" />

          <div className="relative flex min-h-[84dvh] flex-col items-center justify-between gap-[clamp(0.4rem,1.6dvh,1.4rem)] px-7 py-[clamp(1.1rem,3.2dvh,2.4rem)] text-center md:min-h-[82dvh] md:px-10 lg:px-12">
            {/* Monogram crest — logo image when provided, otherwise coded crest */}
            {details.monogramImageSrc ? (
              <Image
                alt={`${details.firstName} & ${details.partnerName} monogram`}
                className="h-auto w-[clamp(64px,12dvh,116px)]"
                height={801}
                src={details.monogramImageSrc}
                unoptimized
                width={1173}
              />
            ) : (
              <div className="flex flex-col items-center text-antique-gold">
                <CrestFleuron className="mb-[-7px] w-7 rotate-180" />
                <span className="grid size-[88px] place-items-center rounded-full border border-antique-gold/70">
                  <Monogram className="text-[1.5rem]" value={details.monogram} />
                </span>
                <CrestFleuron className="mt-[-7px] w-7" />
              </div>
            )}

            {/* Couple names */}
            <div className="flex flex-col items-center" aria-hidden="true">
              <span className="font-display text-[clamp(1.8rem,4.6dvh,3.25rem)] font-medium leading-[1.05] tracking-[0.03em] text-deep-maroon">
                {details.firstName}
              </span>
              <span className="my-1 flex items-center gap-3 font-display text-h3 italic text-antique-gold">
                <span className="h-px w-8 bg-antique-gold/50" />
                &amp;
                <span className="h-px w-8 bg-antique-gold/50" />
              </span>
              <span className="font-display text-[clamp(1.8rem,4.6dvh,3.25rem)] font-medium leading-[1.05] tracking-[0.03em] text-deep-maroon">
                {details.partnerName}
              </span>
            </div>

            {/* Invitation message */}
            <p className="max-w-xs font-sans text-caption font-medium uppercase leading-6 tracking-[0.16em] text-charcoal/70">
              {details.invitationLine}
            </p>

            <OrnamentalDivider width={104} />

            {/* City + dates */}
            <div className="flex flex-col items-center gap-2">
              <p className="font-display text-h3 font-medium uppercase tracking-[0.14em] text-antique-gold">
                {details.city}
              </p>
              <p className="font-sans text-small font-semibold uppercase tracking-[0.28em] text-charcoal/55">
                {details.cityTagline}
              </p>
              <PalaceMotif className="my-1 w-24 text-antique-gold/70" />
              <p className="font-sans text-caption font-medium uppercase tracking-[0.2em] text-charcoal/80">
                {details.weddingDates}
              </p>
            </div>

            {/* Seal slot — reserved space in panels, interactive seal in overlay */}
            <div className="flex flex-col items-center gap-3">
              <p className="animate-pulse font-sans text-caption font-semibold uppercase tracking-[0.24em] text-antique-gold motion-reduce:animate-none">
                Tap to open
              </p>
              <div
                className={cn("grid place-items-center", isSeal && "visible pointer-events-auto")}
                style={{ minHeight: SEAL_SIZE }}
              >
                {isSeal ? sealSlot : null}
              </div>
              <p className="font-display text-caption italic text-charcoal/55">
                {details.closingLine}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { SEAL_SIZE };
