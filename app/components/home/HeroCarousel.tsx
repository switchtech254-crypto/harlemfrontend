"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { StoreImage } from "@/app/components/StoreImage";
import { Button } from "@/app/components/ui/button";
import type { HeroSlide } from "@/app/lib/homepage";

/**
 * The only interactive part of the hero. The first slide (including its <h1>, text and
 * button) is rendered on the server, so it is in the HTML crawlers receive.
 */
export function HeroCarousel({
  slides,
  storeName,
  tagline,
}: {
  slides: HeroSlide[];
  storeName: string;
  tagline: string;
}) {
  const [slide, setSlide] = useState(0);
  const index = slides[slide] ? slide : 0;
  const campaign = slides[index];

  if (!campaign) {
    return null;
  }

  // One <h1> per page: the first slide owns it, other slides use <h2>.
  const Heading = index === 0 ? "h1" : "h2";

  return (
    <div
      className={`campaign-main relative overflow-hidden ${
        campaign.category === "jerseys" ? "campaign-team" : ""
      }`}
    >
      <StoreImage
        key={campaign.id}
        preload={index === 0}
        src={campaign.image}
        alt={campaign.image_alt || campaign.title}
        width={1536}
        height={1024}
        sizes="(max-width: 1024px) 100vw, 66vw"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="campaign-copy relative z-10 flex h-full flex-col justify-center text-campaign-foreground">
        <p className="mb-3 text-xs font-semibold uppercase">
          {storeName} / {tagline}
        </p>
        <Heading className="text-4xl font-bold leading-[1.15] md:text-5xl">{campaign.title}</Heading>
        <p className="mt-6 max-w-[280px] text-sm leading-7">{campaign.text}</p>
        <Button asChild className="mt-6 h-11 w-fit rounded-none px-8">
          <Link href={campaign.href}>
            {campaign.button_label} <ArrowRight />
          </Link>
        </Button>
      </div>

      {slides.length > 1 && (
        <>
          <div className="pointer-events-none absolute inset-x-3 top-1/2 z-20 flex justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="campaign-arrow pointer-events-auto"
              aria-label="Previous collection"
              onClick={() => setSlide((c) => (c - 1 + slides.length) % slides.length)}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="campaign-arrow pointer-events-auto"
              aria-label="Next collection"
              onClick={() => setSlide((c) => (c + 1) % slides.length)}
            >
              <ChevronRight />
            </Button>
          </div>

          <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2">
            {slides.map((item, i) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`campaign-dot ${index === i ? "is-active" : ""}`}
                aria-label={`Show ${item.title}`}
                aria-pressed={index === i}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}