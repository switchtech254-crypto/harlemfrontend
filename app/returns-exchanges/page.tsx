
import type { Metadata } from "next";
import Link from "next/link";
import {
  MessageCircle,
  PackageOpen,
  RefreshCcw,
  ClipboardCheck,
} from "lucide-react";

import { Page } from "@/app/components/Layout";
import { Button } from "@/app/components/ui/button";

export const metadata: Metadata = {
  title: "Returns & Exchanges — Harlem Store",
  description:
    "How to ask Harlem Store for a return or exchange: what to tell us, how we confirm the details, and how team kits are handled.",
  openGraph: {
    title: "Returns & Exchanges — Harlem Store",
    description:
      "Returns and exchange enquiries are arranged directly with us. Here is what to include and what happens next.",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
};

const steps = [
  {
    icon: MessageCircle,
    title: "1. Get in touch",
    text: "Reach us on phone or WhatsApp, by email, or through the contact page. Tell us which item you would like to return or exchange and why.",
  },
  {
    icon: ClipboardCheck,
    title: "2. We confirm the details",
    text: "We check your order details, agree with you on whether an exchange or a return is the right fix, and confirm how the item should come back to us.",
  },
  {
    icon: PackageOpen,
    title: "3. Send the item back",
    text: "Once we have confirmed everything, send the item back — unused, with any tags and packaging it came with. We do not ask you to return anything before we have spoken.",
  },
  {
    icon: RefreshCcw,
    title: "4. We sort it out",
    text: "For an exchange, we send your new size or item as soon as yours reaches us. For a return, we agree the refund with you directly and arrange it the same way you paid.",
  },
];

export default function ReturnsExchangesPage() {
  return (
    <Page>
      <article className="mx-auto max-w-3xl px-5 pt-14">
        <p className="font-script text-5xl">We'll make it right</p>

        <h1 className="mt-2 text-4xl font-bold uppercase">
          Returns &amp; Exchanges
        </h1>

        <div className="rule-line my-6 w-16" />

        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Last updated: 18 October 2026
        </p>

        <p className="mt-5 text-muted-foreground">
          Harlem Store takes orders by enquiry, and we handle returns and
          exchanges the same personal way. If something is not right — a size
          that doesn't fit, an item that isn't what you expected, or a fault —
          get in touch and we will sort it out with you directly.
        </p>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide">
            How an enquiry works
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {steps.map(({ icon: Icon, title, text }) => (
              <div key={title} className="border p-5">
                <Icon
                  className="h-6 w-6 text-primary"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />

                <p className="mt-3 font-display text-sm font-semibold uppercase tracking-wide">
                  {title}
                </p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide">
            What to include in your enquiry
          </h2>

          <div className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground">
            <p>
              The more you tell us up front, the faster we can fix it. Please
              include:
            </p>

            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Your name and the phone number or email we can reach you on.
              </li>
              <li>
                The item, its size, and roughly when you ordered or received it.
              </li>
              <li>
                What you would like instead — a different size, a different
                item, or your money back.
              </li>
              <li>
                If the item arrived damaged or faulty, a photo helps us see the
                problem straight away.
              </li>
            </ul>

            <p>
              For a damaged or faulty item, contact us as soon as you notice it
              and keep the item, tags and packaging until we have agreed what
              happens next.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide">
            Exchanges
          </h2>

          <div className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground">
            <p>
              The quickest fix is usually an exchange for a different size or
              another item from the collection. We check stock first and
              confirm with you before you send anything back, so you are never
              left without an answer.
            </p>

            <p>
              If the item you want costs more or less than the original, we
              settle the difference with you directly when we arrange the
              exchange.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide">
            Team kits &amp; custom branding
          </h2>

          <div className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground">
            <p>
              Kits with names, numbers, badges or club logos are made to your
              team's specifications, so we confirm every detail — sizes,
              colours, spelling and design — with you before production starts.
            </p>

            <p>
              If something in your team order is not right, or arrives damaged
              or faulty, contact us and we will put it right.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide">
            A note on how we take orders today
          </h2>

          <div className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground">
            <p>
              Online checkout is coming soon, but for now orders are arranged
              by enquiry and payment is settled directly with us. That means
              any return or exchange is arranged personally too — we agree the
              solution and the refund with you through the same channel you
              ordered through, so nothing gets lost between systems.
            </p>
          </div>
        </section>

        <div className="mt-12 border bg-primary p-8 text-center text-primary-foreground">
          <p className="font-display text-xl font-semibold uppercase tracking-wide">
            Start your returns enquiry
          </p>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-primary-foreground/75">
            Phone or WhatsApp{" "}
            <span className="font-semibold text-accent">
              +254 700 000 000
            </span>
            , email{" "}
            <span className="font-semibold text-accent">
              hello@harlemstore.co.ke
            </span>
            , or send us a message and we will get back to you.
          </p>

          <Button
            asChild
            className="mt-6 rounded-none bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href="/contact">
              <MessageCircle />
              Contact Harlem Store
            </Link>
          </Button>
        </div>

        <p className="mt-12 border-t pt-6 text-sm text-muted-foreground">
          Questions about this page? Reach us through the{" "}
          <Link
            href="/contact"
            className="font-semibold text-foreground underline underline-offset-4"
          >
            contact page
          </Link>
          .
        </p>
      </article>
    </Page>
  );
}
