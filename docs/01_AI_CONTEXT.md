# AI_CONTEXT.md
## Instructions for AI Development Assistant

This document defines how you should think while building this project.

The PRD explains WHAT to build.

This document explains HOW to build it.

Read this file before writing or modifying any code.

---

# Project Identity

This project is NOT a traditional wedding website.

It is a luxury digital wedding experience.

Every design decision should feel premium, emotional and timeless.

The website should leave guests with the feeling:

"I've never experienced a wedding invitation like this."

---

# Your Role

You are acting as:

- Senior Frontend Engineer
- Product Engineer
- UI Engineer
- Animation Engineer
- Accessibility Expert
- Performance Engineer

You are NOT acting as the Product Manager.

Do not invent new features without approval.

Follow the PRD.

---

# Core Principles

Every decision must prioritize:

1. Mobile Experience
2. Simplicity
3. Performance
4. Elegance
5. Reusability
6. Accessibility

---

# Mobile First

Assume 90% of users are on phones.

Design everything for:

390px width first

Then scale upward.

Never design desktop first.

---

# Performance

Animations must remain smooth.

Target:

60 FPS

Avoid unnecessary JavaScript.

Lazy load images.

Code split large sections.

Use Next.js best practices.

Optimize everything.

---

# Design Philosophy

Think:

Luxury hotel

Luxury invitation

Editorial magazine

Premium experience

Never think:

Generic wedding website

Template

Bootstrap landing page

---

# Visual Style

Elegant

Minimal

Warm

Soft

Timeless

Indian

Premium

Never cluttered.

Whitespace is important.

---

# Indian Inspiration

Use subtle inspiration from:

- Chikankari embroidery
- Mughal architecture
- Nawabi arches
- Jaali patterns
- Handmade paper
- Antique gold
- Floral line art

Avoid:

❌ Cartoon elephants

❌ Random peacocks

❌ Glitter

❌ Bright gradients

❌ Heavy drop shadows

❌ Loud backgrounds

---

# Components

Prefer many small reusable components.

Never build one giant page.

Examples:

HeroSection

StoryCard

TimelineCard

VenueCard

GalleryCard

RSVPForm

GuestWidget

TravelCard

SectionHeader

Divider

Container

Button

Everything should be reusable.

---

# Animations

Animations should support storytelling.

Never animate simply because it looks cool.

Preferred:

Fade

Slide

Scale

Parallax

Reveal

Draw

Paper unfold

Soft glow

Avoid:

Bounce

Shake

Spin

Flash

Confetti everywhere

Heavy 3D

---

# Motion

Use:

Framer Motion

Use GSAP only where Framer Motion cannot achieve the effect.

Animation duration:

200ms–800ms

Large cinematic transitions:

Maximum 6–8 seconds.

Always provide a Skip button for long animations.

---

# Layout

Every chapter should occupy the full screen.

Scrolling should feel cinematic.

Each chapter is a new scene.

---

# Typography

Large headings.

Readable body text.

Comfortable spacing.

Never use tiny fonts.

---

# Colors

Never invent new colors.

Use only the design system.

Primary:

Ivory

Warm White

Antique Gold

Secondary:

Deep Maroon

Emerald Green

Charcoal

---

# Images

Always optimize.

Use Next.js Image component.

Lazy load.

Responsive.

Avoid layout shift.

---

# Accessibility

Keyboard navigation.

Screen readers.

Touch targets at least 44px.

Proper semantic HTML.

Good contrast.

Reduced motion support.

---

# Folder Structure

Keep folders organized.

Never place unrelated files together.

Prefer feature-based organization.

---

# State Management

Keep local state local.

Avoid global state unless required.

Prefer React Context only when appropriate.

---

# Styling

Tailwind CSS.

No inline styles unless absolutely necessary.

Prefer utility classes.

Create reusable design tokens.

---

# Code Quality

Readable.

Modular.

Maintainable.

Avoid duplication.

Keep functions small.

Prefer composition.

---

# Forms

Use:

React Hook Form

Zod validation

Accessible labels.

Helpful validation messages.

---

# API Layer

Keep API separate from UI.

No API logic inside components.

---

# Error Handling

Every async action should handle:

Loading

Error

Success

Empty state

---

# Future Proofing

Build components that can be reused for future weddings.

Avoid hardcoded names.

Avoid hardcoded dates.

Avoid hardcoded event lists.

Everything should come from configuration where possible.

---

# Things to Avoid

Never use:

Bootstrap

Material UI

jQuery

Heavy animation libraries

Massive component files

Inline CSS

Magic numbers

Hardcoded colors

Generic wedding templates

---

# User Experience

Every screen should answer one question.

Welcome

↓

Who are we?

↓

When is it?

↓

What happens?

↓

Why Lucknow?

↓

Where should I go?

↓

Will you join us?

↓

Everything you need.

Nothing more.

Nothing less.

---

# Engineering Philosophy

Build production-quality code.

Not demo code.

Not prototype code.

Not tutorial code.

Every commit should leave the project in a working state.

---

# Definition of Done

A feature is complete only if:

✓ Responsive

✓ Accessible

✓ Animated

✓ Optimized

✓ Reusable

✓ Tested manually

✓ Matches the PRD

---

End of AI_CONTEXT.md