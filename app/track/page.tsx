import { Suspense } from "react";
import type { Metadata } from "next";

import { Page } from "@/app/components/Layout";
import { TrackClient } from "./TrackClient";

export const metadata: Metadata = {
  title: "Track your order — Harlem Store",
  description: "See where your Harlem Store order is: confirmed, being prepared, ready, and completed.",
  // Private, per-customer page: keep it out of search results.
  robots: { index: false, follow: false },
  alternates: { canonical: "/track" },
};

// TrackClient reads ?ref= and ?t= from the URL, which is request-time data, so it sits in <Suspense>.
export default function TrackPage() {
  return (
    <Page>
      <Suspense
        fallback={
          <section className="mx-auto max-w-3xl px-5 pt-14" aria-busy="true">
            <div className="h-10 w-64 animate-pulse bg-muted" />
            <div className="mt-8 h-56 animate-pulse bg-muted" />
          </section>
        }
      >
        <TrackClient />
      </Suspense>
    </Page>
  );
}
