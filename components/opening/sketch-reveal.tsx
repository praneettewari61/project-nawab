"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMusic } from "@/components/providers/music-provider";
import { SOFT_EASE } from "@/lib/animation/motion";
import { useSafeReducedMotion } from "@/lib/hooks/use-safe-reduced-motion";

/*
 * Each device gets its own artwork:
 *  - Mobile: portrait sketch/photo shown full-bleed (cover) across the viewport.
 *  - Desktop (>=1024px): dedicated 16:9 sketch/photo shown whole (contain) as a
 *    framed illustration centred on the page — never stretched or cropped.
 * In both cases the sketch sits on top of the matching colour photo, and drawing
 * washes the colour back in; when enough is revealed it completes on its own.
 */
const MOBILE_SKETCH = "/images/splashScreen/opt/sketch-hero.webp";
const MOBILE_PHOTO = "/images/splashScreen/opt/actual.webp";
const DESKTOP_SKETCH = "/images/splashScreen/opt/desktop-sketch.webp";
const DESKTOP_PHOTO = "/images/splashScreen/opt/desktop-photo.webp";
const CREST_SRC = "/images/rsvp/crest.png";

/**
 * "Desktop" = a real laptop/computer: wide viewport AND a fine, hovering pointer
 * (mouse/trackpad). This deliberately excludes tablets like iPad Pro (touch,
 * coarse pointer), which keep the mobile artwork.
 */
export const DESKTOP_MQ = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

/** Minimum touched fraction that counts as "the guest drew" when they lift off. */
const LIFT_THRESHOLD = 0.14;

interface SketchRevealProps {
  guestName?: string;
  /** Called once the colour photograph is fully revealed (after a short pause). */
  onComplete: () => void;
}

export function SketchReveal({ guestName, onComplete }: SketchRevealProps) {
  const reduce = useSafeReducedMotion();
  const { enable: enableMusic } = useMusic();

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const drawing = useRef(false);
  const started = useRef(false);
  const doneRef = useRef(false);

  // Low-res coverage grid — a cheap estimate of how much has been coloured in.
  const grid = useRef<Uint8Array | null>(null);
  const gridDims = useRef({ cols: 0, rows: 0, cell: 0 });
  const touchedCells = useRef(0);

  const [ready, setReady] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [completing, setCompleting] = useState(false);

  const greeted = Boolean(guestName);
  // Desktop's 16:9 art fills fast, so complete after a lighter scratch (~22%).
  const autoThreshold = isDesktop ? 0.22 : 0.55;
  const photoSrc = isDesktop ? DESKTOP_PHOTO : MOBILE_PHOTO;

  const paintSketch = useCallback(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    if (!canvas || !frame) return;
    // Layout size (transform-independent) so the sketch always fills the stage.
    const cw = frame.clientWidth;
    const ch = frame.clientHeight;
    if (cw < 2 || ch < 2) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctxRef.current = ctx;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // cover — but the desktop stage matches the artwork's 16:9 ratio exactly,
      // so nothing is cropped there; on mobile the portrait art covers/crops.
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.globalCompositeOperation = "source-over";
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      setReady(true);
    };
    img.src = isDesktop ? DESKTOP_SKETCH : MOBILE_SKETCH;

    const cell = Math.max(14, Math.round(cw / 18));
    const cols = Math.ceil(cw / cell);
    const rows = Math.ceil(ch / cell);
    grid.current = new Uint8Array(cols * rows);
    gridDims.current = { cols, rows, cell };
    touchedCells.current = 0;
  }, [isDesktop]);

  useEffect(() => {
    if (!doneRef.current) paintSketch();
    const onResize = () => {
      if (!doneRef.current && !drawing.current) paintSketch();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [paintSketch]);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setCompleting(true);
    // Fade the remaining sketch (~700ms) → hold on the photo (~1s) → continue.
    window.setTimeout(onComplete, reduce ? 850 : 1750);
  }, [onComplete, reduce]);

  // Reduced motion: reveal calmly without requiring a drawing gesture.
  useEffect(() => {
    if (!reduce || !ready) return;
    const t = window.setTimeout(() => finish(), 1200);
    return () => window.clearTimeout(t);
  }, [reduce, ready, finish]);

  const markCoverage = useCallback((x: number, y: number, r: number) => {
    const g = grid.current;
    if (!g) return;
    const { cols, rows, cell } = gridDims.current;
    const c0 = Math.max(0, Math.floor((x - r) / cell));
    const c1 = Math.min(cols - 1, Math.floor((x + r) / cell));
    const r0 = Math.max(0, Math.floor((y - r) / cell));
    const r1 = Math.min(rows - 1, Math.floor((y + r) / cell));
    for (let ry = r0; ry <= r1; ry++) {
      for (let cx = c0; cx <= c1; cx++) {
        const idx = ry * cols + cx;
        if (!g[idx]) {
          g[idx] = 1;
          touchedCells.current += 1;
        }
      }
    }
  }, []);

  // A soft, low-flow brush: colour washes back in and builds up with each pass —
  // feathered all the way out, never a hard disc.
  const paintAt = useCallback(
    (x: number, y: number) => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;
      const r = Math.max(40, Math.min(canvas.clientWidth, canvas.clientHeight) * 0.18);
      ctx.globalCompositeOperation = "destination-out";
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, "rgba(0,0,0,0.5)");
      grad.addColorStop(0.45, "rgba(0,0,0,0.32)");
      grad.addColorStop(0.75, "rgba(0,0,0,0.1)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      markCoverage(x, y, r * 0.55);
    },
    [markCoverage],
  );

  const pointFromEvent = (event: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const sx = rect.width ? canvas.clientWidth / rect.width : 1;
    const sy = rect.height ? canvas.clientHeight / rect.height : 1;
    return { x: (event.clientX - rect.left) * sx, y: (event.clientY - rect.top) * sy };
  };

  const onPointerDown = (event: React.PointerEvent) => {
    if (doneRef.current) return;
    // Start the music on the very first touch (a valid user gesture), even if
    // the sketch is still finishing its first paint.
    if (!started.current) {
      started.current = true;
      setInteracted(true);
      enableMusic();
    }
    if (!ready) return;
    drawing.current = true;
    canvasRef.current?.setPointerCapture(event.pointerId);
    const p = pointFromEvent(event);
    lastPoint.current = p;
    paintAt(p.x, p.y);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!drawing.current || doneRef.current) return;
    const p = pointFromEvent(event);
    const last = lastPoint.current ?? p;
    const dx = p.x - last.x;
    const dy = p.y - last.y;
    const dist = Math.hypot(dx, dy);
    const r = Math.max(40, Math.min(canvasRef.current!.clientWidth, canvasRef.current!.clientHeight) * 0.18);
    const step = Math.max(4, r / 7);
    const steps = Math.max(1, Math.floor(dist / step));
    for (let i = 1; i <= steps; i++) {
      paintAt(last.x + (dx * i) / steps, last.y + (dy * i) / steps);
    }
    lastPoint.current = p;

    const g = grid.current;
    if (g && touchedCells.current / g.length >= autoThreshold) finish();
  };

  const endStroke = () => {
    if (!drawing.current || doneRef.current) return;
    drawing.current = false;
    lastPoint.current = null;
    const g = grid.current;
    if (g && touchedCells.current / g.length >= LIFT_THRESHOLD) finish();
  };

  const revealNow = () => {
    if (!started.current) {
      started.current = true;
      enableMusic();
    }
    finish();
  };

  // Shared pieces (only one branch mounts at a time, so refs attach correctly).
  const artwork = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" className="absolute inset-0 h-full w-full object-cover object-center" src={photoSrc} />
      <canvas
        aria-label="Draw to reveal the photograph"
        className="absolute inset-0 h-full w-full touch-none transition-opacity duration-700 ease-out"
        onPointerCancel={endStroke}
        onPointerDown={onPointerDown}
        onPointerLeave={endStroke}
        onPointerMove={onPointerMove}
        onPointerUp={endStroke}
        ref={canvasRef}
        style={{ opacity: completing ? 0 : 1, cursor: "crosshair" }}
      />
    </>
  );

  const header = (
    <>
      <Image alt="" className="mb-0.5 h-auto w-14 opacity-90 sm:w-16" height={134} src={CREST_SRC} width={158} />
      <p className="font-sans text-caption font-medium uppercase tracking-[0.3em] text-charcoal/60">
        Welcome{greeted ? "," : ""}
      </p>
      {greeted ? (
        <p className="font-display text-[1.9rem] font-medium leading-none text-deep-maroon sm:text-[2.5rem]">
          {guestName}
        </p>
      ) : null}
      <motion.p
        animate={{ opacity: interacted ? 0 : 1 }}
        className="mt-1 font-display text-body-large italic text-charcoal/60 [text-shadow:0_1px_10px_rgb(248_244_236/70%)]"
        initial={false}
        transition={{ duration: 0.6, ease: SOFT_EASE }}
      >
        Draw anywhere to reveal our first memory
      </motion.p>
    </>
  );

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="paper-texture absolute inset-0 overflow-hidden bg-ivory"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: SOFT_EASE }}
    >
      {/* The artwork fills the viewport as the background (mobile: portrait art;
          desktop laptop/computer: the 16:9 art). Welcome floats on top with a
          soft wash for legibility. */}
      <div className="absolute inset-0" ref={frameRef}>
        {artwork}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[38vh] bg-gradient-to-b from-ivory/85 via-ivory/35 to-transparent"
      />
      <div className="pointer-events-none absolute inset-x-0 top-[5vh] z-20 flex flex-col items-center gap-1.5 px-6 text-center sm:top-[6vh]">
        {header}
      </div>

      {/* Screen-reader / keyboard path — no visible chrome. */}
      <button className="sr-only" onClick={revealNow} type="button">
        Reveal our first memory
      </button>
    </motion.div>
  );
}
