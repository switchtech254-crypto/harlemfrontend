
import type { Metadata } from "next";

import { Page } from "@/app/components/Layout";
import { CartClient } from "./CartClient";

export const metadata: Metadata = {
  title: "Your cart — Harlem Store",
  description: "Review the items in your Harlem Store cart.",
  openGraph: {
    title: "Your cart — Harlem Store",
    description: "Review your Harlem Store cart.",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
  robots: {
    index: false,
  },
};

export default function CartPage() {
  return (
    <Page>
      <CartClient />
    </Page>
  );
}
