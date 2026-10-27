
import type { Metadata } from "next";
import Image from "next/image";

import { Page } from "@/app/components/Layout";

export const metadata: Metadata = {
  title: "About — Harlem Store",
  description:
    "Harlem Store brings sportswear and street fashion together.",
  openGraph: {
    title: "About — Harlem Store",
    description: "Sportswear and street fashion under one roof.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function AboutPage() {
  return (
    <Page>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-14 md:grid-cols-2">
        <div>
          <p className="font-script text-5xl">Our story</p>

          <h1 className="mt-2 text-4xl font-bold uppercase">
            Where the pitch meets the street
          </h1>

          <div className="rule-line my-6 w-16" />

          <p className="text-muted-foreground">
            Harlem Store brings together everything you need to play and to
            look good doing it — from branded jerseys and full team kits to
            match balls, boots, men&apos;s jeans and sneakers.
          </p>

          <p className="mt-4 text-muted-foreground">
            We work with players, clubs, schools and companies to deliver
            quality gear with a personal touch.
          </p>
        </div>

        <Image
          src="/images/homepage/sneakers.png"
          alt="Harlem Store sneakers"
          width={800}
          height={800}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="aspect-square h-auto w-full object-cover"
        />
      </section>
    </Page>
  );
}
