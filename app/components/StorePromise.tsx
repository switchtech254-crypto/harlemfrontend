
import Link from "next/link";
import {
  Headset,
  BadgeCheck,
  BellRing,
  Ruler,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/app/components/ui/button";

const promises = [
  {
    icon: Headset,
    title: "24-hour fast customer service",
    text: "Get support without waiting. Shop faster with personal help for your order.",
  },
  {
    icon: BadgeCheck,
    title: "Best market price guarantee",
    text: "No misleading offers. Just clear prices and transparent trade.",
    link: "Ask about our prices",
  },
  {
    icon: BellRing,
    title: "Try price change alerts",
    text: "Make the most of discounts. Ask us about price changes on your favourites.",
    link: "Enquire about offers",
  },
  {
    icon: Ruler,
    title: "Find your perfect fit",
    text: "From everyday sneakers to club kits, get help choosing your size and branding.",
  },
];

export function StorePromise() {
  return (
    <section
      className="store-promise relative mt-14 overflow-hidden text-primary-foreground"
      style={{
        backgroundImage: 'url("/images/homepage/service-parallax.jpg")',
      }}
      aria-labelledby="store-promise-title"
    >
      <div className="relative z-10 px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            The Harlem Store promise
          </p>

          <h2
            id="store-promise-title"
            className="mt-4 text-3xl font-bold leading-tight md:text-4xl"
          >
            Great style. Better peace of mind.
          </h2>

          <p className="mt-4 text-sm leading-6 text-primary-foreground/85">
            Personal support, honest value and the right fit — every time you
            shop with us.
          </p>
        </div>

        <div className="store-promise-grid mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map(({ icon: Icon, title, text, link }) => (
            <div key={title} className="text-center">
              <Icon
                className="mx-auto h-9 w-9 text-accent"
                strokeWidth={1.4}
                aria-hidden="true"
              />

              <h3 className="mx-auto mt-5 max-w-56 text-base font-semibold leading-6">
                {title}
              </h3>

              <p className="mx-auto mt-3 max-w-64 text-sm leading-6 text-primary-foreground/85">
                {text}
              </p>

              {link && (
                <Button
                  asChild
                  variant="link"
                  className="mt-3 h-auto whitespace-normal text-primary-foreground underline underline-offset-4"
                >
                  <Link href="/contact">
                    {link} <ArrowRight className="shrink-0" />
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button
            asChild
            className="rounded-none bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href="/contact">
              Talk to Harlem Store <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
