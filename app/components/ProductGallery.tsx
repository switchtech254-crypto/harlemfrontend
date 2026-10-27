"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";

import { StoreImage } from "@/app/components/StoreImage";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/app/components/ui/dialog";

type GalleryImage = { url: string | null; alt: string };

type ProductGalleryProps = {
  /** Main image URL (used when the product has fewer than two photos). */
  image: string | null;
  /** All photos uploaded for the product, from the API. */
  images?: GalleryImage[];
  name: string;
};

type View = { label: string; src: string | null; alt: string; className: string };

export function ProductGallery({ image, images = [], name }: ProductGalleryProps) {
  const photos = images.filter((item) => item.url);

  // Two or more uploaded photos: show them as they are.
  // Otherwise keep the original behaviour: full image + a zoomed "detail crop" of the same photo.
  const views: View[] =
    photos.length > 1
      ? photos.map((item, index) => ({
          label: `Photo ${index + 1}`,
          src: item.url,
          alt: item.alt || name,
          className: "",
        }))
      : [
          { label: "Full image", src: image, alt: name, className: "product-image-full" },
          { label: "Detail crop", src: image, alt: name, className: "product-image-detail" },
        ];

  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const view = views[active] ?? views[0];

  if (!view) {
    return null;
  }

  const previousView = () => {
    setActive((current) => (current - 1 + views.length) % views.length);
  };

  const nextView = () => {
    setActive((current) => (current + 1) % views.length);
  };

  return (
    <div className="product-gallery">
      <div className="flex gap-3 lg:flex-col" aria-label="Product image views">
        {views.map((item, index) => (
          <Button
            key={`${item.label}-${index}`}
            variant="outline"
            aria-label={item.label}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
            className={`product-thumbnail overflow-hidden rounded-none p-0 ${
              active === index
                ? "border-primary ring-1 ring-primary"
                : "border-transparent"
            }`}
          >
            {/* Thumbnails are tiny: ask the optimiser for ~100px, not the full upload. */}
            <StoreImage
              src={item.src}
              alt=""
              width={160}
              height={160}
              sizes="100px"
              className={`h-full w-full object-cover ${item.className}`}
            />
          </Button>
        ))}
      </div>

      <div className="product-image-stage relative overflow-hidden bg-muted">
        {/* The main photo is the page's largest visible image: preload it. */}
        <StoreImage
          key={view.src ?? view.label}
          src={view.src}
          alt={`${view.alt} — ${view.label.toLowerCase()}`}
          width={1024}
          height={1024}
          sizes="(max-width: 1024px) 100vw, 55vw"
          preload={active === 0}
          className={`h-full w-full object-cover ${view.className}`}
        />

        <span className="absolute left-4 top-4 bg-background/95 px-3 py-1.5 text-xs font-medium">
          Harlem collection
        </span>

        <Button
          variant="outline"
          size="icon"
          title="Enlarge image"
          aria-label="Enlarge image"
          className="absolute right-4 top-4 rounded-full"
          onClick={() => setZoomOpen(true)}
        >
          <ZoomIn />
        </Button>

        <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
          <Button
            variant="outline"
            size="icon"
            title="Previous image view"
            aria-label="Previous image view"
            onClick={previousView}
            className="rounded-full"
          >
            <ChevronLeft />
          </Button>

          <Button
            variant="outline"
            size="icon"
            title="Next image view"
            aria-label="Next image view"
            onClick={nextView}
            className="rounded-full"
          >
            <ChevronRight />
          </Button>
        </div>

        <span className="absolute bottom-4 right-4 bg-background/95 px-3 py-1.5 text-xs">
          {active + 1} / {views.length} · {view.label}
        </span>
      </div>

      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-3xl">
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>{view.label}</DialogDescription>

          <div className="max-h-[70vh] overflow-auto">
            {/* Only mounted while the dialog is open, so the large version loads on demand. */}
            {zoomOpen && (
              <StoreImage
                src={view.src}
                alt={view.alt}
                width={1024}
                height={1024}
                sizes="(max-width: 768px) 100vw, 768px"
                className="h-auto w-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}