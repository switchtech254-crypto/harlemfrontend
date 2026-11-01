"use client";

import Link from "next/link";
import { ArrowRight, ArrowUp, Headset, Shirt, Tags, MessageCircle } from "lucide-react";

import { useEffect, useState } from "react";

import { Button } from "@/app/components/ui/button";
// import logo from "@/assets/harlem-logo.jpg.asset.json";
import type { CategoryInfo } from "@/app/lib/products";
import type { SocialId, SocialLink } from "@/app/lib/social";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/app/components/icons/BrandIcons";

const supportLinks = [
  { label: "Delivery enquiries", href: "/contact" },
  { label: "Sizing & fit advice", href: "/contact" },
  { label: "Returns & exchanges enquiries", href: "/returns-exchanges" },
  { label: "Product availability", href: "/contact" },
  { label: "Order assistance", href: "/contact" },
];

const teamLinks = [
  "Club & school uniforms",
  "Jersey names & numbers",
  "Club badges & logos",
  "Team socks",
  "Bulk order enquiries",
];

const footerFeatures = [
  {
    icon: Headset,
    title: "Personal customer support",
    text: "Help with products, sizes and your order.",
  },
  {
    icon: Tags,
    title: "Clear prices. Honest value.",
    text: "Browse our collection with prices in KSh.",
  },
  {
    icon: Shirt,
    title: "Your team. Your identity.",
    text: "Matching kits with personalised branding.",
  },
];

const SOCIAL_ICONS: Record<SocialId, (props: { className?: string }) => React.JSX.Element> = {
  tiktok: TikTokIcon,
  instagram: InstagramIcon,
  whatsapp: WhatsAppIcon,
};

export function StoreFooter({
  categories,
  social = [],
}: {
  categories: CategoryInfo[];
  social?: SocialLink[];
}) {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  function scrollToTop() {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "instant" : "smooth",
    });
  }

  return (
    <footer className="store-footer mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-7 border-b border-primary-foreground/20 py-9 md:grid-cols-3 md:gap-10">
          {footerFeatures.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4">
              <Icon
                className="mt-1 h-7 w-7 shrink-0 text-accent"
                strokeWidth={1.5}
                aria-hidden="true"
              />

              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1.5 text-xs leading-5 text-primary-foreground/70">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-x-10 gap-y-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:py-16">
          <div>
            <Link
              href="/"
              aria-label="Harlem Store home"
              className="inline-flex items-center gap-4"
            >
              <img
                src="/images/harlem-logo.jpeg"
                alt=""
                width={80}
                height={80}
                loading="lazy"
                className="h-20 w-20 object-cover"
              />

              <div>
                <p className="font-display text-2xl uppercase">
                  Harlem Store
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-accent">
                  Sports &amp; Fashion
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-primary-foreground/75">
              From match day to everyday. Discover sportswear, denim and
              sneakers, with custom branding for your whole team.
            </p>

            <Button
              asChild
              variant="link"
              className="mt-4 h-auto p-0 text-accent"
            >
              <Link href="/about">
                Our story
                <ArrowRight />
              </Link>
            </Button>

            <div className="mt-7 border-l-2 border-accent pl-4">
              <p className="text-sm font-semibold">
                Let’s talk about your order
              </p>

              <p className="mt-2 text-xs leading-5 text-primary-foreground/70">
                Product questions, delivery options or a kit for your club —
                get in touch.
              </p>

              <Button
                asChild
                className="mt-4 rounded-none bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/contact">
                  <MessageCircle />
                  Contact Harlem Store
                </Link>
              </Button>
            </div>

            {social.length > 0 && (
              <div className="mt-7">
                <p className="text-sm font-semibold">Follow us</p>

                <ul className="mt-3 flex items-center gap-3">
                  {social.map(({ id, label, href }) => {
                    const Icon = SOCIAL_ICONS[id];

                    return (
                      <li key={id}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${label} (opens in a new tab)`}
                          title={label}
                          className="grid h-10 w-10 place-items-center border border-primary-foreground/25 text-primary-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                          <Icon className="h-5 w-5" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <nav aria-label="Footer shopping categories">
            <h2 className="text-base font-semibold">Shop the collection</h2>

            <ul className="mt-5 space-y-3 text-sm text-primary-foreground/75">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/shop?category=${encodeURIComponent(category.id)}`}
                    className="footer-link"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}

              <li className="pt-2">
                <Link
                  href="/shop"
                  className="footer-link inline-flex items-center gap-2 font-semibold text-accent"
                >
                  View all products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Footer customer care">
            <h2 className="text-base font-semibold">Customer care</h2>

            <ul className="mt-5 space-y-3 text-sm text-primary-foreground/75">
              {supportLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="footer-link">
                    {label}
                  </Link>
                </li>
              ))}

              <li>
                <Link href="/cart" className="footer-link">
                  View your shopping bag
                </Link>
              </li>

              <li className="pt-2">
                <Link href="/privacy-policy" className="footer-link">
                  Privacy policy
                </Link>
              </li>

              <li>
                <Link href="/terms-of-service" className="footer-link">
                  Terms of service
                </Link>
              </li>

              <li>
                <Link href="/cookie-policy" className="footer-link">
                  Cookie policy
                </Link>
              </li>
            </ul>

            <p className="mt-6 text-xs leading-6 text-primary-foreground/60">
              Contact us to confirm delivery arrangements and order details
              before purchasing.
            </p>
          </nav>

          <nav aria-label="Footer team and club orders">
            <h2 className="text-base font-semibold">
              Teams &amp; custom branding
            </h2>

            <ul className="mt-5 space-y-3 text-sm text-primary-foreground/75">
              {teamLinks.map((label) => (
                <li key={label}>
                  <Link
                    href="/contact"
                    className="footer-link"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-xs leading-6 text-primary-foreground/60">
              Tell us your team size, preferred colours and branding
              requirements.
            </p>

            <Button
              asChild
              variant="link"
              className="mt-3 h-auto p-0 text-accent"
            >
              <Link href="/contact">
                Discuss your team order
                <ArrowRight />
              </Link>
            </Button>
          </nav>
        </div>

        <div className="flex flex-col gap-5 border-t border-primary-foreground/20 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-primary-foreground/75">
              © {year ?? "2026"} Harlem Store. All rights reserved.
            </p>

            <p className="mt-2 text-primary-foreground/55">
              Sportswear · Streetwear · Teamwear
              <span className="mx-2" aria-hidden="true">
                /
              </span>
              Prices in Kenyan shillings (KSh)
            </p>

            <p className="mt-2 text-primary-foreground/55">
              Website by{" "}
              <a
                href="https://switchtechnologies.africa"
                target="_blank"
                rel="noopener"
                className="footer-link font-medium text-primary-foreground/80"
              >
                Switch Technologies Africa
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/about" className="footer-link">
              About us
            </Link>

            <Link href="/contact" className="footer-link">
              Contact
            </Link>

            <Link href="/privacy-policy" className="footer-link">
              Privacy
            </Link>

            <Link href="/terms-of-service" className="footer-link">
              Terms
            </Link>

            <Link href="/cookie-policy" className="footer-link">
              Cookies
            </Link>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Back to top"
              title="Back to top"
              className="h-9 w-9 border border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={scrollToTop}
            >
              <ArrowUp />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
