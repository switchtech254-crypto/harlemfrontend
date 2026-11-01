
import type { Metadata } from "next";

import { Page } from "@/app/components/Layout";

export const metadata: Metadata = {
  title: "Contact — Harlem Store",
  description: "Get in touch with Harlem Store for orders and team kits.",
  openGraph: {
    title: "Contact — Harlem Store",
    description: "Orders, team kits and branding enquiries.",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
};

const contactDetails = [
  {
    label: "Phone / WhatsApp",
    value: "+254 728 766141",
  },
  {
    label: "Email",
    value: "hello@harlemstore.co.ke",
  },
  {
    label: "Visit",
    value: "Nairobi, Kenya",
  },
];

export default function ContactPage() {
  return (
    <Page>
      <section className="mx-auto max-w-3xl px-5 pt-14 text-center">
        <p className="font-script text-5xl">Say hello</p>

        <h1 className="mt-2 text-4xl font-bold uppercase">
          Contact Harlem Store
        </h1>

        <div className="rule-line mx-auto my-6 w-16" />

        <p className="text-muted-foreground">
          For orders, team kits and custom branding, reach us below.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {contactDetails.map(({ label, value }) => (
            <div key={label} className="border p-6">
              <p className="font-display text-sm uppercase tracking-widest text-muted-foreground">
                {label}
              </p>

              <p className="mt-2 break-words font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </Page>
  );
}
