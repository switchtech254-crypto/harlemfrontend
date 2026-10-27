import Image, { type ImageProps } from "next/image";

import { imgSrc } from "@/app/lib/api";

type StoreImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string | null | undefined;
  alt: string;
};

/**
 * next/image for images that come from the Django API.
 *  - Resizes + converts to AVIF/WebP and serves a responsive srcset (pass `sizes`).
 *  - Lazy-loads by default; pass `preload` only for the one big image above the fold.
 *  - Products without a photo get the neutral placeholder (nothing to optimise).
 *  - Pass width + height (or `fill`). If a caller forgets, a safe default is used, because
 *    next/image throws in development when dimensions are missing.
 */
export function StoreImage({ src, alt, ...rest }: StoreImageProps) {
  const hasSize = rest.fill || (rest.width !== undefined && rest.height !== undefined);
  const size = hasSize ? {} : { width: 800, height: 800 };

  return <Image src={imgSrc(src)} alt={alt} unoptimized={!src} {...size} {...rest} />;
}