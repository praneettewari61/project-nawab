"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useId, useState } from "react";
import { OrnamentalDivider } from "@/components/opening/ornamental-divider";
import { EnvelopeMark } from "@/components/sections/chapter-art";
import { Button, Container } from "@/components/ui";
import { revealBlur, revealItem, staggerContainer } from "@/lib/animation/motion";
import { rsvp } from "@/lib/config/chapters";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";

const FIELD =
  "w-full rounded-medium border border-sand bg-warm-white px-4 py-3 font-sans text-body text-charcoal placeholder:text-charcoal/35";

/** RSVP — a styled, accessible placeholder form (not yet wired to a backend). */
export function RsvpChapter() {
  const reduce = useSafeReducedMotion();
  const uid = useId();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Placeholder — a real submit handler / backend comes in a later phase.
    console.log("RSVP placeholder submit");
    setSubmitted(true);
  }

  return (
    <Container className="py-14 md:py-20">
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
        {submitted ? (
          <div className="paper-texture flex flex-col items-center gap-3 rounded-card border border-antique-gold/25 bg-warm-white p-8 text-center shadow-card">
            <span className="grid size-12 place-items-center rounded-full border border-antique-gold/40 bg-ivory text-antique-gold">
              <Check size={22} strokeWidth={1.8} />
            </span>
            <h3 className="font-display text-h3 font-medium text-deep-maroon">Thank you</h3>
            <p className="max-w-prose font-sans text-body leading-7 text-charcoal/70">
              Your response has been noted in this preview. {rsvp.note}
            </p>
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
              <div className="flex flex-col gap-3 sm:flex-row">
                {[
                  { value: "yes", label: "Joyfully accepts" },
                  { value: "no", label: "Regretfully declines" },
                ].map((option) => (
                  <label
                    className="flex flex-1 cursor-pointer items-center gap-3 rounded-medium border border-sand bg-warm-white px-4 py-3 font-sans text-body text-charcoal has-[:checked]:border-antique-gold has-[:checked]:bg-ivory"
                    key={option.value}
                  >
                    <input
                      className="size-4 accent-antique-gold"
                      defaultChecked={option.value === "yes"}
                      name="attendance"
                      type="radio"
                      value={option.value}
                    />
                    {option.label}
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

            <Button className="mt-1 w-full sm:w-auto sm:self-center" size="large" type="submit">
              Send RSVP
            </Button>

            <p className="text-center font-sans text-caption italic text-charcoal/45">{rsvp.note}</p>
          </form>
        )}
      </motion.div>
    </Container>
  );
}
