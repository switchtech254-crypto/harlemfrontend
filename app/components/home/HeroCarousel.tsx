"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { StoreImage } from "@/app/components/StoreImage";
import { Button } from "@/app/components/ui/button";
import type { HeroSlide } from "@/app/lib/homepage";
import { useSlideLoop } from "@/app/lib/useSlideLoop";

const DURATION = 500; // ms per slide change. Lower = faster.
const EASING = "cubic-bezier(0.65, 0, 0.35, 1)";
const SWIPE_SLOP = 8; // px of horizontal movement before a drag starts

export function HeroCarousel({
  slides,
  storeName,
  tagline,
  autoplayMs = 6000, // set to 0 to turn autoplay off
}: {
  slides: HeroSlide[];
  storeName: string;
  tagline: string;
  autoplayMs?: number;
}) {
  const n = slides.length;
  const { pos, animate, active, next, prev, goTo } = useSlideLoop(n, DURATION);

  const containerRef = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);

  // Don't rotate slides in a background tab.
  useEffect(() => {
    const onChange = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  // Autoplay: re-armed after every slide change, so manual navigation restarts the timer.
  useEffect(() => {
    if (n < 2 || !autoplayMs || paused || dragging || tabHidden) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(next, autoplayMs);
    return () => clearTimeout(t);
  }, [n, autoplayMs, paused, dragging, tabHidden, next]);

  const first = slides[0];
  if (!first) return null;

  // Real slides, plus a clone of the first one at the end for the seamless loop.
  const track = n > 1 ? [...slides, first] : slides;

  /* ---------------- touch / pen swipe (mouse is ignored) ---------------- */

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" || n < 2 || !animate) return;
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const s = start.current;
    if (!s || e.pointerId !== s.id) return;

    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;

    if (!dragging) {
      // Wait until the gesture is clearly horizontal so vertical page scrolling still works.
      if (Math.abs(dx) < SWIPE_SLOP || Math.abs(dx) < Math.abs(dy)) return;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    // Rubber-band when pulling right on the first slide.
    setDragX(pos === 0 && dx > 0 ? dx * 0.25 : dx);
  }

  function finishDrag(e: PointerEvent<HTMLDivElement>, cancelled: boolean) {
    const s = start.current;
    if (!s || e.pointerId !== s.id) return;
    start.current = null;
    if (!dragging) return;

    const width = containerRef.current?.offsetWidth ?? 1;
    const dx = e.clientX - s.x;
    const threshold = Math.min(80, width * 0.15);

    setDragging(false);
    setDragX(0);

    if (!cancelled && Math.abs(dx) > threshold) {
      if (dx < 0) next();
      else prev();
    }
  }

  return (
    <div
      ref={containerRef}
      className="campaign-main relative touch-pan-y overflow-hidden"
      aria-roledescription="carousel"
      aria-label={`${storeName} collections`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(e) => finishDrag(e, false)}
      onPointerCancel={(e) => finishDrag(e, true)}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setPaused(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setPaused(false);
      }}
      onFocus={(e) => {
        // Only keyboard focus pauses; tapping an arrow on a phone shouldn't freeze autoplay.
        if (e.target.matches(":focus-visible")) setPaused(true);
      }}
      onBlur={() => setPaused(false)}
    >
      <div
        className="slide-track flex h-full will-change-transform"
        style={{
          transform: `translate3d(calc(${-pos * 100}% + ${dragX}px), 0, 0)`,
          transition:
            animate && !dragging ? `transform ${DURATION}ms ${EASING}` : "none",
        }}
      >
        {track.map((slide, i) => {
          const isClone = i === n;
          const hidden = isClone || i !== active;
          // One <h1> per page (first slide). The clone isn't a heading at all.
          const Heading = i === 0 ? "h1" : isClone ? "p" : "h2";

          return (
            <div
              key={isClone ? "clone" : slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${Math.min(i + 1, n)} of ${n}`}
              aria-hidden={hidden || undefined}
              inert={hidden}
              className={`campaign-slide relative h-full w-full shrink-0 overflow-hidden ${
                slide.category === "jerseys" ? "campaign-team" : ""
              }`}
            >
              <StoreImage
                preload={i === 0}
                src={slide.image}
                alt={slide.image_alt || slide.title}
                width={1536}
                height={1024}
                sizes="(max-width: 1024px) 100vw, 66vw"
                draggable={false}
                className="absolute inset-0 h-full w-full select-none object-cover"
              />

              <div className="campaign-copy relative z-10 flex h-full flex-col justify-center text-campaign-foreground">
                <p className="mb-3 text-xs font-semibold uppercase">
                  {storeName} / {tagline}
                </p>
                <Heading className="text-4xl font-bold leading-[1.15] md:text-5xl">
                  {slide.title}
                </Heading>
                <p className="mt-6 max-w-[280px] text-sm leading-7">{slide.text}</p>
                <Button asChild className="mt-6 h-11 w-fit rounded-none px-8">
                  <Link href={slide.href}>
                    {slide.button_label} <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {n > 1 && (
        <>
          <div className="pointer-events-none absolute inset-x-3 top-1/2 z-20 flex justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="campaign-arrow pointer-events-auto"
              aria-label="Previous collection"
              onClick={prev}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="campaign-arrow pointer-events-auto"
              aria-label="Next collection"
              onClick={next}
            >
              <ChevronRight />
            </Button>
          </div>

          <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2">
            {slides.map((item, i) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`campaign-dot ${active === i ? "is-active" : ""}`}
                aria-label={`Show ${item.title}`}
                aria-pressed={active === i}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}