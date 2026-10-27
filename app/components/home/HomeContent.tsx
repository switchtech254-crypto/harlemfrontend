// Server component: the whole homepage renders on the server and ships NO JavaScript of its own.
// Only <HeroCarousel> and <Countdown> are client components (they need browser state/timers).
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight, BadgeCheck, CreditCard, Headset, MessageCircle, Package, Shirt, ShieldCheck,
  Star, Tags, Timer, Truck, type LucideIcon,
} from "lucide-react";

import { StorePromise } from "@/app/components/StorePromise";
import { StoreImage } from "@/app/components/StoreImage";
import { Button } from "@/app/components/ui/button";
import type { Banner, HomepageData } from "@/app/lib/homepage";
import { formatPrice, type Product } from "@/app/lib/products";

import { Countdown } from "./Countdown";
import { HeroCarousel } from "./HeroCarousel";

// The admin picks an icon name per service; map the names to lucide components.
const ICONS: Record<string, LucideIcon> = {
  tags: Tags, truck: Truck, shirt: Shirt, "message-circle": MessageCircle, "badge-check": BadgeCheck,
  "shield-check": ShieldCheck, headset: Headset, star: Star, timer: Timer, package: Package,
  "credit-card": CreditCard,
};

const categoryBadge = (p: Product) =>
  p.badge ||
  (p.category === "sneakers" ? "Streetwear" : p.category === "uniforms" || p.category === "jerseys" ? "Teamwear" : "Collection");

const productHref = (p: Product) => `/product/${encodeURIComponent(p.id)}`;

export default function HomeContent({ data }: { data: HomepageData }) {
  const { hero_slides: slides, banners, services, settings } = data;
  const side = banners.side_panel;
  const collection = banners.collection_panel;

  return (
    <div className="storefront mx-auto max-w-[1440px] px-4 pt-5 md:px-6">
      <section className="campaign-grid" aria-label={`${settings.store_name} collections`}>
        <HeroCarousel slides={slides} storeName={settings.store_name} tagline={settings.tagline} />

        {side && (
          <Link href={side.link_url} className="campaign-side relative block overflow-hidden text-promo-foreground">
            <StoreImage src={side.image} alt={side.image_alt} width={768} height={1344}
              sizes="(max-width: 1024px) 100vw, 33vw" className="absolute inset-0 h-full w-full object-cover" />
            <div className="relative z-10 px-4 pt-8 text-center md:pt-10">
              <h2 className="outline-heading text-3xl font-bold uppercase">{side.heading}</h2>
              <p className="mt-3 text-xs font-medium uppercase">{side.subheading}</p>
              <span className="mt-4 inline-block text-sm underline underline-offset-4">{side.link_label}</span>
            </div>
          </Link>
        )}
      </section>

      {settings.announcement_enabled && settings.announcement_text && (
        <Link href="/shop"
          className="mt-2 flex h-14 items-center overflow-hidden bg-announcement text-announcement-foreground md:h-16"
          aria-label={`Explore the ${settings.store_name} collection`}>
          <div className="announcement-track flex shrink-0 items-center gap-10 whitespace-nowrap text-lg font-semibold uppercase">
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} aria-hidden={i > 0 || undefined}>
                {settings.announcement_text}
                <span className="ml-8" aria-hidden="true">✦</span>
              </span>
            ))}
          </div>
        </Link>
      )}

      {services.length > 0 && (
        <section className="mt-2 grid grid-cols-2 border bg-card px-3 py-7 md:grid-cols-5 md:py-9" aria-labelledby="services-heading">
          <h2 id="services-heading" className="sr-only">Why shop with {settings.store_name}</h2>
          {services.map(({ icon, title, text }, index) => {
            const Icon = ICONS[icon] ?? Tags;
            return (
              <div key={title}
                className={`px-2 py-4 text-center md:py-0 ${
                  index === services.length - 1 && services.length % 2 === 1 ? "col-span-2 md:col-span-1" : ""
                }`}>
                <Icon className="mx-auto mb-4 h-9 w-9" strokeWidth={1.25} aria-hidden="true" />
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>
              </div>
            );
          })}
        </section>
      )}

      <section className="new-products-layout mt-5" aria-label="Featured products">
        {collection && (
          <Link href={collection.link_url}
            className="new-products-panel relative block overflow-hidden bg-primary text-primary-foreground">
            <StoreImage src={collection.image} alt={collection.image_alt} width={1024} height={1024}
              sizes="(max-width: 1024px) 100vw, 20vw" className="absolute bottom-0 h-[75%] w-full object-cover" />
            <div className="relative z-10 px-4 pt-8 text-center">
              <h2 className="outline-heading text-2xl font-bold uppercase">{collection.heading}</h2>
              <p className="mt-3 text-xs uppercase">{collection.subheading}</p>
              <span className="mt-4 inline-block text-sm underline underline-offset-4">{collection.link_label}</span>
            </div>
          </Link>
        )}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4">
          {data.featured_products.map((p) => (
            <ProductTile key={p.id} product={p} badge={categoryBadge(p)} />
          ))}
        </div>
      </section>

      <section className="pt-14" aria-labelledby="categories-heading">
        <div className="flex items-center justify-between">
          <h2 id="categories-heading" className="text-2xl font-bold">Shop by category</h2>
          <Button asChild variant="link">
            <Link href="/shop">Shop all <ArrowRight /></Link>
          </Button>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {data.categories.map((category) => (
            <Link key={category.id} href={`/shop?category=${encodeURIComponent(category.id)}`} className="group">
              <div className="aspect-square overflow-hidden bg-muted">
                <StoreImage src={category.image} alt={category.name} width={512} height={512}
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <h3 className="mt-3 text-sm font-semibold">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <BestsellersAndDeals data={data} />
      <DealsOfTheWeek data={data} />
      <StorePromise />

      <section className="mt-14 border-y py-10 text-center" aria-labelledby="teams-heading">
        <p className="text-xs uppercase text-muted-foreground">Made for your team</p>
        <h2 id="teams-heading" className="mt-3 text-3xl font-bold">Kit out your whole club</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
          Branded jerseys, shorts and socks for clubs, schools and companies.
        </p>
        <Button asChild variant="outline" className="mt-5 rounded-none">
          <Link href="/contact">Get in touch <ArrowRight /></Link>
        </Button>
      </section>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <span className="flex shrink-0" role="img" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} aria-hidden="true"
          className={`h-3 w-3 ${i < filled ? "fill-primary text-primary" : "text-muted-foreground/40"}`} />
      ))}
    </span>
  );
}

function Price({ product, className = "" }: { product: Product; className?: string }) {
  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 ${className}`}>
      <span>{formatPrice(product.price)}</span>
      {product.original_price && (
        <span className="text-xs font-normal line-through opacity-60">{formatPrice(product.original_price)}</span>
      )}
    </p>
  );
}

function ProductTile({ product, badge, showRating = false }: { product: Product; badge: string; showRating?: boolean }) {
  return (
    <Link href={productHref(product)} className="group min-w-0">
      <div className="relative aspect-[5/4] overflow-hidden bg-muted">
        <StoreImage src={product.image} alt={product.name} width={1024} height={1024}
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <span className="absolute left-2 top-2 bg-primary px-2 py-1 text-[9px] font-bold uppercase text-primary-foreground">
          {product.in_stock ? badge : "Sold out"}
        </span>
      </div>

      {product.sizes && (
        <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>Sizes</span>
          <span className="border px-1.5 py-0.5 text-foreground">
            {product.sizes[0]}–{product.sizes[product.sizes.length - 1]}
          </span>
        </div>
      )}

      <h3 className="mt-2 text-xs font-semibold leading-5 md:text-sm">{product.name}</h3>

      <div className="mt-1 flex items-center justify-between gap-2">
        <Price product={product} className="text-xs text-muted-foreground" />
        {showRating && product.rating !== null && <Stars rating={product.rating} />}
      </div>
    </Link>
  );
}

function BannerLink({ banner, children, className }: { banner: Banner; children: ReactNode; className: string }) {
  return (
    <Link href={banner.link_url} className={className}>
      <StoreImage src={banner.image} alt={banner.image_alt} width={1600} height={640}
        sizes="(max-width: 1024px) 100vw, 75vw" className="absolute inset-0 h-full w-full object-cover object-right" />
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Latest bestsellers + FEATURED DEALS                                 */
/* Mobile: deals are a compact swipeable row (cards peek in from the   */
/* right) instead of a tall stack. Desktop: the vertical sidebar.      */
/* ------------------------------------------------------------------ */
function BestsellersAndDeals({ data }: { data: HomepageData }) {
  const banner = data.banners.bestsellers_banner;
  const testimonial = data.testimonials[0];

  return (
    <section
      className="mt-14 grid gap-8 lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)]"
      aria-label="Latest bestsellers and featured deals"
    >
      <aside className="flex min-w-0 flex-col gap-8">
        {data.featured_deals.length > 0 && (
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Featured deals</h2>
              <Button asChild variant="link" className="text-[11px] uppercase tracking-wide">
                <Link href="/shop">View all <ArrowRight /></Link>
              </Button>
            </div>

            <ul
              aria-label="Featured deals"
              tabIndex={0}
              className="-mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-3 [scrollbar-width:none] md:-mx-6 md:scroll-px-6 md:px-6 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
            >
              {data.featured_deals.map(({ id, product, ends_at }) => (
                <li key={id}
                  className="w-[17.5rem] shrink-0 snap-start border bg-card p-3 sm:w-80 lg:w-auto lg:shrink">
                  <div className="flex gap-3">
                    <Link href={productHref(product)} aria-hidden="true" tabIndex={-1}
                      className="h-20 w-20 shrink-0 overflow-hidden bg-muted">
                      <StoreImage src={product.image} alt="" width={160} height={160} sizes="80px"
                        className="h-full w-full object-cover" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-semibold leading-5">
                        <Link href={productHref(product)} className="hover:underline">{product.name}</Link>
                      </h3>
                      <Price product={product} className="mt-1 text-sm text-muted-foreground" />
                      <Link href={productHref(product)} className="mt-1 inline-block text-xs underline underline-offset-4">
                        Order now
                      </Link>
                    </div>
                  </div>
                  <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                    <Timer className="h-3.5 w-3.5" aria-hidden="true" />
                    Ends in
                    <span className="border px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                      <Countdown endsAt={ends_at} serverTime={data.server_time} />
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {testimonial && (
          <figure className="bg-primary p-6 text-primary-foreground">
            <figcaption className="text-[10px] font-semibold uppercase tracking-wide">Testimonials</figcaption>
            <blockquote className="mt-3 text-sm leading-6">“{testimonial.quote}”</blockquote>
            <p className="mt-4 text-xs font-semibold">{testimonial.author}</p>
            {testimonial.role && <p className="text-[11px] opacity-80">{testimonial.role}</p>}
          </figure>
        )}
      </aside>

      <div className="min-w-0">
        {banner && (
          <BannerLink banner={banner} className="bestsellers-banner relative block overflow-hidden bg-primary text-primary-foreground">
            <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-8">
              <h2 className="outline-heading bestsellers-heading text-3xl font-bold uppercase md:text-4xl">{banner.heading}</h2>
              <span className="mt-2 w-fit text-sm underline underline-offset-4">{banner.link_label}</span>
            </div>
          </BannerLink>
        )}
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
          {data.bestsellers.map((p) => (
            <ProductTile key={p.id} product={p} badge={p.badge || "Bestseller"} showRating />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Deals of the week                                                   */
/* ------------------------------------------------------------------ */
function DealsOfTheWeek({ data }: { data: HomepageData }) {
  const { deals, settings, banners, server_time } = data;
  const banner = banners.deals_banner;
  if (deals.length === 0 && !banner) return null;

  // The banner countdown follows the deal that ends first.
  const soonest = deals.map((d) => d.ends_at).sort()[0];

  return (
    <section className="mt-14" aria-labelledby="deals-heading">
      {settings.promo_code && (
        <div className="deals-strip flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 md:px-6">
          <span className="shrink-0 bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground md:text-sm">
            Sale
          </span>
          <p className="min-w-0 flex-1 basis-44 text-sm font-semibold leading-5 md:text-base">
            {settings.promo_description || "Super discount for your first purchase"}
            <span className="block text-xs font-normal opacity-80 md:ml-2 md:inline">Use code at checkout.</span>
          </p>
          <span className="deals-ribbon w-full bg-accent px-5 py-2 text-center text-xs font-bold uppercase tracking-wider text-accent-foreground sm:w-auto md:ml-auto">
            {settings.promo_code}
          </span>
        </div>
      )}

      {deals.length > 0 && (
        <>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
            <div className="min-w-0">
              <h2 id="deals-heading" className="text-xl font-bold sm:text-2xl">Deals of the week</h2>
              <p className="mt-1 text-sm text-muted-foreground">Don&apos;t miss out on this week&apos;s deals</p>
            </div>
            <Button asChild variant="link" className="shrink-0">
              <Link href="/shop">View all <ArrowRight /></Link>
            </Button>
          </div>

          <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {deals.map(({ id, badge, sold, available, percent_sold, product }) => (
              <li key={id} className="group flex min-w-0 flex-col border bg-card p-2.5 sm:p-3">
                <Link href={productHref(product)} aria-hidden="true" tabIndex={-1}
                  className="relative block aspect-[4/3] overflow-hidden bg-muted">
                  <StoreImage src={product.image} alt="" width={1024} height={1024}
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <span className="absolute left-2 top-2 bg-primary px-2 py-1 text-[9px] font-bold uppercase text-primary-foreground">
                    {badge}
                  </span>
                </Link>

                <h3 className="mt-3 line-clamp-2 min-h-10 text-sm font-semibold leading-5">
                  <Link href={productHref(product)} className="hover:underline">{product.name}</Link>
                </h3>

                {product.rating !== null && <div className="mt-1.5"><Stars rating={product.rating} /></div>}

                <Price product={product} className="mt-1.5 text-sm font-semibold" />

                {/* mt-auto pins the progress block to the bottom so all cards line up */}
                <div className="mt-auto pt-3">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                    role="progressbar" aria-valuenow={percent_sold} aria-valuemin={0} aria-valuemax={100}
                    aria-label={`${percent_sold}% sold`}>
                    <div className="h-full bg-announcement" style={{ width: `${percent_sold}%` }} />
                  </div>
                  <p className="mt-2 flex flex-wrap items-center justify-between gap-x-2 text-[11px] text-muted-foreground">
                    <span>Sold: <strong className="font-semibold text-foreground">{sold}</strong></span>
                    <span>Left: <strong className="font-semibold text-foreground">{available}</strong></span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {banner && (
        <Link href={banner.link_url}
          className="group relative mt-6 flex min-h-[22rem] items-end overflow-hidden bg-primary text-primary-foreground md:min-h-[20rem] md:items-center">
          <StoreImage src={banner.image} alt="" fill sizes="(max-width: 1440px) 100vw, 1440px"
            className="object-cover object-right transition-transform duration-500 group-hover:scale-[1.03]" />
          {/* Legibility scrim: bottom-up on phones (text sits low), left-to-right on desktop */}
          <div aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/55 to-transparent md:bg-gradient-to-r md:from-primary/80 md:via-primary/35" />

          <div className="relative z-10 flex max-w-[26rem] flex-col items-start gap-3 p-6 md:gap-4 md:px-10 md:py-8">
            {banner.eyebrow && (
              <span className="w-fit bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-foreground">
                {banner.eyebrow}
              </span>
            )}
            <h2 className="text-2xl font-bold leading-tight md:text-3xl">{banner.heading}</h2>
            {banner.body && <p className="text-sm leading-6 opacity-90">{banner.body}</p>}
            {soonest && (
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-wide">
                <Timer className="h-3.5 w-3.5" aria-hidden="true" />
                Ends in
                <span className="deals-countdown border border-dashed px-2.5 py-1.5 font-mono text-xs normal-case">
                  <Countdown endsAt={soonest} serverTime={server_time} />
                </span>
              </p>
            )}
            {/* A styled span, not a <Button>: interactive elements must not be nested inside a link. */}
            <span className="mt-1 inline-flex h-11 items-center gap-2 bg-background px-6 text-sm font-medium text-foreground transition-colors group-hover:bg-background/90">
              {banner.link_label || "Shop now"} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </Link>
      )}
    </section>
  );
}