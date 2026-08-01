"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";
import { useId, useState } from "react";
import { OrnamentalDivider } from "@/components/opening/ornamental-divider";
import { EnvelopeMark } from "@/components/sections/chapter-art";
import { Container } from "@/components/ui";
import { revealBlur, revealItem, staggerContainer } from "@/lib/animation/motion";
import { rsvp } from "@/lib/config/chapters";
import { invitationDetails } from "@/lib/config/invitation";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";
import { cn } from "@/lib/utils";

const FIELD =
  "w-full rounded-medium border border-sand bg-warm-white px-4 py-3 font-sans text-body text-charcoal placeholder:text-charcoal/35";

type Status = "idle" | "submitting" | "success" | "error";

/** Attendance choices — wording mirrors the couple's printed invitation. */
const ATTENDANCE = [
  { value: "yes", title: "Joyfully joining", desc: "We can't wait to celebrate!" },
  { value: "no", title: "Sending love from afar", desc: "We'll be celebrating with you in spirit." },
] as const;

/**
 * Corner florals cut from the couple's invitation artwork (not drawn in CSS).
 * Feathered on the inner edges so they melt into the ivory page. Purely
 * decorative and non-interactive.
 */
const FLORALS = [
  { src: "/images/rsvp/floral-tr.webp", w: 205, h: 250, className: "right-0 top-0 w-28 sm:w-44" },
  { src: "/images/rsvp/floral-left.webp", w: 160, h: 400, className: "left-0 top-28 w-16 sm:top-36 sm:w-28" },
  { src: "/images/rsvp/floral-br.webp", w: 185, h: 396, className: "bottom-0 right-0 w-28 sm:w-44" },
  { src: "/images/rsvp/floral-bl.webp", w: 175, h: 124, className: "bottom-2 left-0 w-20 sm:w-28" },
] as const;

/** A small four-petal floret accent (a UI glyph, matching the invitation). */
function Floret({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 4c1.2 2.3 1.2 3.9 0 6.2 2.3-1.2 3.9-1.2 6.2 0-2.3 1.2-3.9 1.2-6.2 0 1.2 2.3 1.2 3.9 0 6.2-1.2-2.3-1.2-3.9 0-6.2-2.3 1.2-3.9 1.2-6.2 0 2.3-1.2 3.9-1.2 6.2 0-1.2-2.3-1.2-3.9 0-6.2Z" />
      <circle cx="12" cy="12" r="1.4" />
    </svg>
  );
}

/** RSVP — an accessible form wired to /api/rsvp (stored in Postgres). */
export function RsvpChapter() {
  const reduce = useSafeReducedMotion();
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      attendance: String(data.get("attendance") ?? ""),
      guests: String(data.get("guests") ?? "1"),
      note: String(data.get("note") ?? ""),
      // Which invitation link the guest came from, e.g. "/daniel".
      source: typeof window !== "undefined" ? window.location.pathname : "",
    };

    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  const submitting = status === "submitting";

  return (
    <div className="relative overflow-hidden">
      {/* Corner florals — cut from the invitation art, feathered into the page. */}
      {FLORALS.map((f) => (
        <motion.div
          animate={{ opacity: 1 }}
          aria-hidden="true"
          className={cn("pointer-events-none absolute z-0 select-none", f.className)}
          initial={reduce ? false : { opacity: 0 }}
          key={f.src}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <Image alt="" className="h-auto w-full" height={f.h} src={f.src} width={f.w} />
        </motion.div>
      ))}

      <Container className="relative z-10 py-14 md:py-20">
        <motion.div
          className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center"
          initial={reduce ? false : "hidden"}
          variants={staggerContainer}
          viewport={{ once: true, amount: 0.4 }}
          whileInView="visible"
        >
          <motion.div className="text-antique-gold" variants={revealItem}>
            <EnvelopeMark className="h-8 w-auto" />
          </motion.div>
          <motion.p
            className="font-sans text-caption font-semibold uppercase tracking-[0.36em] text-antique-gold"
            variants={revealItem}
          >
            {rsvp.eyebrow}
          </motion.p>
          <motion.h2
            className="font-display text-[2.5rem] font-medium leading-[1.05] tracking-[-0.01em] text-deep-maroon sm:text-[3.25rem] md:text-h1"
            id="rsvp-chapter-heading"
            variants={revealBlur}
          >
            {rsvp.title}
          </motion.h2>
          <motion.div variants={revealItem}>
            <OrnamentalDivider width={120} />
          </motion.div>
          <motion.p
            className="max-w-md font-display text-body-large italic text-charcoal/60 sm:text-h3"
            variants={revealItem}
          >
            {rsvp.intro}
          </motion.p>
        </motion.div>

        <motion.div
          className="mx-auto mt-10 w-full max-w-lg md:mt-12"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {status === "success" ? (
            <div className="paper-texture flex flex-col items-center gap-3 rounded-card border border-antique-gold/25 bg-warm-white/90 p-8 text-center shadow-card backdrop-blur-sm">
              <span className="grid size-12 place-items-center rounded-full border border-antique-gold/40 bg-ivory text-antique-gold">
                <Check size={22} strokeWidth={1.8} />
              </span>
              <h3 className="font-display text-h3 font-medium text-deep-maroon">Thank you</h3>
              <p className="max-w-prose font-sans text-body leading-7 text-charcoal/70">{rsvp.thanks}</p>
            </div>
          ) : (
            <form className="flex flex-col gap-5 text-left" noValidate onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label className="font-sans text-caption font-medium text-charcoal/70" htmlFor={`${uid}-name`}>
                  Full name
                </label>
                <input className={FIELD} id={`${uid}-name`} name="name" placeholder="Your name" type="text" />
              </div>

              <fieldset className="flex flex-col gap-2">
                <legend className="font-sans text-caption font-medium text-charcoal/70">Will you attend?</legend>
                <div className="flex flex-col gap-3">
                  {ATTENDANCE.map((option) => (
                    <label
                      className="group flex cursor-pointer items-center gap-3 rounded-medium border border-sand bg-warm-white px-4 py-3 transition-colors has-[:checked]:border-antique-gold has-[:checked]:bg-ivory motion-reduce:transition-none"
                      key={option.value}
                    >
                      <input
                        className="size-4 shrink-0 accent-antique-gold"
                        defaultChecked={option.value === "yes"}
                        name="attendance"
                        type="radio"
                        value={option.value}
                      />
                      <span className="flex flex-col">
                        <span className="font-sans text-body font-medium text-charcoal">{option.title}</span>
                        <span className="font-sans text-caption text-charcoal/55">{option.desc}</span>
                      </span>
                      <Floret className="ml-auto h-5 w-5 shrink-0 text-antique-gold/30 transition-colors group-has-[:checked]:text-antique-gold/70 motion-reduce:transition-none" />
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="flex flex-col gap-2">
                <label className="font-sans text-caption font-medium text-charcoal/70" htmlFor={`${uid}-guests`}>
                  Number of guests
                </label>
                <select className={FIELD} defaultValue="1" id={`${uid}-guests`} name="guests">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-sans text-caption font-medium text-charcoal/70" htmlFor={`${uid}-note`}>
                  A note for us <span className="text-charcoal/40">(optional)</span>
                </label>
                <textarea
                  className={`${FIELD} min-h-24 resize-y`}
                  id={`${uid}-note`}
                  name="note"
                  placeholder="Anything you'd like us to know"
                  rows={3}
                />
              </div>

              {status === "error" ? (
                <p
                  aria-live="assertive"
                  className="rounded-medium border border-deep-maroon/25 bg-deep-maroon/5 px-4 py-3 text-center font-sans text-caption font-medium text-deep-maroon"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              {/* Ornamental "Send RSVP" plaque cut from the invitation artwork. */}
              <button
                aria-busy={submitting}
                aria-label={submitting ? "Sending your RSVP" : "Send RSVP"}
                className="group relative mx-auto mt-1 block w-full max-w-[20rem] rounded-medium outline-none transition-[transform,filter] duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:cursor-wait disabled:opacity-70 motion-reduce:transition-none [@media(hover:hover)]:group-hover:brightness-105"
                disabled={submitting}
                type="submit"
              >
                <Image
                  alt=""
                  className="h-auto w-full drop-shadow-[0_6px_14px_rgb(110_31_42/22%)] transition-[filter] duration-300 [@media(hover:hover)]:group-hover:brightness-[1.04]"
                  height={140}
                  priority
                  src="/images/rsvp/button.png"
                  width={490}
                />
              </button>

              <p aria-live="polite" className="text-center font-sans text-caption italic text-charcoal/45">
                {submitting ? "Sending your response…" : rsvp.note}
              </p>
            </form>
          )}
        </motion.div>

        {/* Closing sign-off — matches the foot of the printed invitation. */}
        <motion.div
          className="mx-auto mt-14 flex max-w-md flex-col items-center gap-4 text-center md:mt-16"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.5 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <OrnamentalDivider width={96} />
          <p className="font-display text-body-large italic text-charcoal/60 sm:text-h3">
            We look forward to welcoming you to {invitationDetails.city}.
          </p>
          <p className="font-display text-body italic text-antique-gold">With love,</p>
          <p className="font-display text-[1.75rem] font-medium leading-none text-deep-maroon sm:text-[2rem]">
            {invitationDetails.firstName} &amp; {invitationDetails.partnerName}
          </p>
          <Image
            alt="Akshita and Varnit monogram"
            className="mt-1 h-auto w-24 sm:w-28"
            height={134}
            src="/images/rsvp/crest.png"
            width={158}
          />
        </motion.div>
      </Container>
    </div>
  );
}
