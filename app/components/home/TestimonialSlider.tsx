"use client";

import { useEffect, useState } from "react";

import type { HomepageData } from "@/app/lib/homepage";
import { useSlideLoop } from "@/app/lib/useSlideLoop";

type Testimonial = HomepageData["testimonials"][number];

const DURATION = 500;
const INTERVAL = 6000;
const EASING = "cubic-bezier(0.65, 0, 0.35, 1)";

export function TestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const n = testimonials.length;
  const [paused, setPaused] = useState(false);
  const { pos, animate, active, next, goTo } = useSlideLoop(n, DURATION);

  useEffect(() => {
    if (n < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(next, INTERVAL);
    return () => clearTimeout(t);
  }, [n, paused, next]);

  const first = testimonials[0];
  if (!first) return null;

  // Track runs left to right as [clone of first, last … second, first], so moving
  // the track to the right brings the next testimonial in from the left.
  const track = n > 1 ? [first, ...[...testimonials].reverse()] : testimonials;

  return (
    <figure
      className="overflow-hidden bg-primary text-primary-foreground"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <figcaption className="px-6 pt-6 text-[10px] font-semibold uppercase tracking-wide">
        Testimonials
      </figcaption>

      <div
        className="slide-track flex will-change-transform"
        style={{
          transform: `translate3d(${(pos - n) * 100}%, 0, 0)`,
          transition: animate ? `transform ${DURATION}ms ${EASING}` : "none",
        }}
      >
        {track.map((t, k) => {
          const isClone = n > 1 && k === 0;
          const index = isClone ? 0 : n > 1 ? n - k : 0;
          const hidden = isClone || index !== active;

          return (
            <div
              key={isClone ? "clone" : `${t.author}-${index}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${n}`}
              aria-hidden={hidden || undefined}
              inert={hidden}
              className="w-full shrink-0 px-6"
            >
              <blockquote className="mt-3 text-sm leading-6">“{t.quote}”</blockquote>
              <p className="mt-4 text-xs font-semibold">{t.author}</p>
              {t.role && <p className="text-[11px] opacity-80">{t.role}</p>}
            </div>
          );
        })}
      </div>

      {n > 1 ? (
        <div className="flex gap-2 px-6 pb-6 pt-5">
          {testimonials.map((t, i) => (
            <button
              key={`${t.author}-${i}`}
              type="button"
              aria-label={`Show testimonial from ${t.author}`}
              aria-pressed={active === i}
              onClick={() => goTo(i)}
              className={`h-1.5 w-6 rounded-full transition-colors ${
                active === i ? "bg-primary-foreground" : "bg-primary-foreground/30"
              }`}
            />
          ))}
        </div>
      ) : (
        <div className="pb-6" />
      )}
    </figure>
  );
}