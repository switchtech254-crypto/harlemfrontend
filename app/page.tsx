import type { Metadata } from "next";

import HomeContent from "@/app/components/home/HomeContent";
import { HomeJsonLd } from "@/app/components/home/HomeJsonLd";
import { getHomepage } from "@/app/lib/data";

const TITLE = "Harlem Store — Sports & Fashion";
const DESCRIPTION =
  "Shop jerseys, team uniforms, footballs, sports shoes, men's jeans, and sneakers at Harlem Store.";

export async function generateMetadata(): Promise<Metadata> {
  // The first hero image doubles as the social-share (Open Graph / Twitter) image.
  const data = await getHomepage().catch(() => null);
  const hero = data?.hero_slides[0];
  const images = hero?.image ? [{ url: hero.image, alt: hero.image_alt || TITLE }] : undefined;

  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/" },
    openGraph: {
      title: TITLE,
      description: "Discover jerseys, team kits, footballs, sports shoes, jeans, and sneakers at Harlem Store.",
      type: "website",
      siteName: "Harlem Store",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: "Discover sportswear, sneakers, jerseys, and everyday fashion at Harlem Store.",
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
    robots: { index: true, follow: true },
  };
}

export default async function HomePage() {
  const data = await getHomepage();

  return (
    <>
      <HomeJsonLd data={data} />
      <HomeContent data={data} />
    </>
  );
}