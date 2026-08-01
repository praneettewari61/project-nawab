"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useChapters } from "@/components/chapters/chapters-context";
import { Container, Section } from "@/components/ui";
import { SOFT_EASE } from "@/lib/animation/motion";
import { faq } from "@/lib/config/faq";
import { cn } from "@/lib/utils";

/**
 * FAQ accordion beneath the "Everything for the Day" hub. Each row toggles
 * independently — no accordion-wide exclusivity, so guests can compare
 * answers side by side.
 */
export function FaqSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const { open: openChapter } = useChapters();

  const toggle = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <Section tone="ivory">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div className="flex flex-col items-start gap-3 text-left">
            <h2 className="font-display text-[2.25rem] font-bold leading-[1.05] tracking-[-0.01em] text-charcoal sm:text-[2.75rem]">
              {faq.heading}
            </h2>
            <p className="font-sans text-body text-charcoal/70">{faq.helpText}</p>
            <button
              className="font-sans text-body font-medium text-deep-maroon underline underline-offset-4 transition-colors duration-300 hover:text-antique-gold"
              onClick={(event) => openChapter("rsvp", event.currentTarget)}
              type="button"
            >
              {faq.contactLabel}
            </button>
          </div>

          <ul>
            {faq.items.map((item, index) => {
              const isOpen = openItems.has(index);
              return (
                <li className="border-b border-charcoal/10 last:border-b-0" key={item.question}>
                  <button
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    onClick={() => toggle(index)}
                    type="button"
                  >
                    <span className="font-sans text-body font-medium text-deep-maroon">{item.question}</span>
                    <span
                      aria-hidden="true"
                      className="grid size-8 shrink-0 place-items-center rounded-md bg-charcoal/5 text-charcoal/50"
                    >
                      <ChevronDown
                        className={cn("transition-transform duration-300", isOpen && "rotate-180")}
                        size={16}
                        strokeWidth={1.8}
                      />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        animate={{ height: "auto", opacity: 1 }}
                        className="overflow-hidden"
                        exit={{ height: 0, opacity: 0 }}
                        initial={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: SOFT_EASE }}
                      >
                        <p className="pb-5 pr-12 font-sans text-body leading-7 text-charcoal/70">{item.answer}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
