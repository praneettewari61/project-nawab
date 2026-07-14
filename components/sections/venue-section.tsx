"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import { OrnamentalDivider } from "@/components/opening/ornamental-divider";
import { Container, Section } from "@/components/ui";
import { SOFT_EASE, revealBlur, revealItem, staggerContainer } from "@/lib/animation/motion";
import { venue } from "@/lib/config/celebration";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";

/**
 * "The Celebration Venue" — a framed, matted photograph of the venue with a
 * soft scale-in reveal, followed by the venue name and address. Config-driven.
 */
export function VenueSection() {
  const reduce = useSafeReducedMotion();

  return (
    <Section aria-labelledby="venue-heading" className="py-16 md:py-24" tone="warmWhite">
      <Container>
        <motion.div
          className="mx-auto flex max-w-3xl flex-col items-center gap-7 text-center"
          initial={reduce ? false : "hidden"}
          variants={staggerContainer}
          viewport={{ once: true, amount: 0.3 }}
          whileInView="visible"
        >
          <motion.p
            className="font-sans text-caption font-semibold uppercase tracking-[0.36em] text-antique-gold"
            variants={revealItem}
          >
            {venue.eyebrow}
          </motion.p>

          {/* Matted, framed photograph. */}
          <motion.div className="w-full" variants={revealItem}>
            <div className="rounded-large border border-antique-gold/25 bg-ivory p-2.5 shadow-card sm:p-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.15rem] sm:aspect-[3/2]">
                <motion.div
                  className="absolute inset-0"
                  initial={reduce ? false : { scale: 1.08 }}
                  transition={{ duration: 1.5, ease: SOFT_EASE }}
                  viewport={{ once: true, amount: 0.3 }}
                  whileInView={{ scale: 1 }}
                >
                  <Image
                    alt={venue.image.alt}
                    className="object-cover"
                    fill
                    quality={90}
                    sizes="(min-width: 768px) 768px, 100vw"
                    src={venue.image.src}
                    style={{ objectPosition: venue.image.focalPoint }}
                  />
                </motion.div>
                {/* Gentle warm vignette to seat the photo in the theme. */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_20%,transparent_55%,rgb(45_45_45/12%))]" />
              </div>
            </div>
          </motion.div>

          <motion.h2
            className="font-display text-[2.25rem] font-medium leading-[1.05] tracking-[-0.01em] text-deep-maroon sm:text-h1 md:text-[3.5rem]"
            id="venue-heading"
            variants={revealBlur}
          >
            {venue.name}
          </motion.h2>

          <motion.div variants={revealItem}>
            <OrnamentalDivider width={104} />
          </motion.div>

          <motion.p
            className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 font-sans text-small font-medium uppercase tracking-[0.24em] text-charcoal/55"
            variants={revealItem}
          >
            <MapPin aria-hidden="true" className="text-antique-gold" size={15} strokeWidth={1.6} />
            {venue.addressLines.map((line, index) => (
              <span className="inline-flex items-center gap-2.5" key={line}>
                {index > 0 ? <span aria-hidden="true" className="text-antique-gold">&middot;</span> : null}
                {line}
              </span>
            ))}
          </motion.p>

          <motion.a
            className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-antique-gold/70 bg-transparent px-5 py-2 font-sans text-sm font-medium text-antique-gold transition-[background-color,color,box-shadow] duration-300 hover:bg-antique-gold hover:text-warm-white hover:shadow-gold-glow motion-reduce:transition-none"
            href={venue.mapUrl}
            rel="noopener noreferrer"
            target="_blank"
            variants={revealItem}
          >
            <MapPin aria-hidden="true" size={16} strokeWidth={1.8} />
            View Venue
            <ArrowUpRight
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
              size={16}
              strokeWidth={1.8}
            />
            <span className="sr-only"> on Google Maps (opens in a new tab)</span>
          </motion.a>
        </motion.div>
      </Container>
    </Section>
  );
}
