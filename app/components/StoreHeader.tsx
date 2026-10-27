"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Menu,
  MessageCircle,
  Search,
  ShoppingBag,
  Shirt,
  X,
} from "lucide-react";

// import logo from "@/assets/harlem-logo.jpg.asset.json";
//this is the link to the company logo=> public/images/harlem-logo.jpeg
import { Button } from "@/app/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { StoreImage } from "@/app/components/StoreImage";
import { useCart } from "@/app/lib/cart";
import { useCartSubtotal, useProductSearch } from "@/app/lib/hooks";
import { formatPrice, type CategoryInfo } from "@/app/lib/products";

function ProductSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const term = query.trim();

  // Search runs on the server now (debounced); the dropdown shows the top 5.
  const { results, count, loading } = useProductSearch(term);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOpen(false);

    const href = term ? `/shop?q=${encodeURIComponent(term)}` : "/shop";

    router.push(href);
  }

  return (
    <div
      className="relative w-full"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
        }
      }}
    >
      <form
        role="search"
        onSubmit={submit}
        className="flex h-11 items-center border border-input bg-card focus-within:ring-1 focus-within:ring-ring"
      >
        <Search
          className="ml-3 h-4 w-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />

        <input
          aria-label="Search products"
          aria-expanded={open && Boolean(term)}
          aria-controls="header-search-results"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search jerseys, sneakers, jeans…"
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
        />

        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
          >
            <X />
          </Button>
        )}

        <Button type="submit" variant="ghost" size="icon" aria-label="Submit search">
          <ArrowRight />
        </Button>
      </form>

      {open && term && (
        <div
          id="header-search-results"
          className="absolute inset-x-0 top-full z-50 mt-2 max-h-[60vh] overflow-y-auto border bg-popover text-popover-foreground shadow-lg"
        >
          <p
            className="border-b px-4 py-3 text-xs font-semibold uppercase"
            aria-live="polite"
          >
            {loading
              ? "Searching…"
              : count
                ? `${count} matching products`
                : "No products found"}
          </p>

          {results.map((product) => (
            <Link
              key={product.id}
              href={`/product/${encodeURIComponent(product.id)}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
            >
              <StoreImage
                src={product.image}
                alt=""
                width={48}
                height={48}
                sizes="48px"
                className="h-12 w-12 shrink-0 object-cover"
              />

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">
                  {product.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatPrice(product.price)}
                </span>
              </span>

              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          ))}

          {!loading && !count && (
            <p className="px-4 py-4 text-sm text-muted-foreground">
              Try another product or category.
            </p>
          )}

          <Button
            asChild
            variant="ghost"
            className="h-11 w-full justify-between rounded-none border-t px-4"
          >
            <Link
              href={term ? `/shop?q=${encodeURIComponent(term)}` : "/shop"}
              onClick={() => setOpen(false)}
            >
              {count ? "View all results" : "Browse the collection"}
              <ArrowRight />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop all" },
  { href: "/about", label: "Our story" },
  { href: "/contact", label: "Contact" },
];

const navClass =
  "text-sm font-medium transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring";

function isActive(pathname: string | null, href: string) {
  if (pathname === null) {
    return false;
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

// usePathname() depends on the request URL, so it lives in small components wrapped in
// <Suspense>. The fallback renders the same links without the "active" styling, so the links
// are always present in the server-rendered HTML (good for SEO) on every route.
function DesktopNavLinks({ pathname }: { pathname: string | null }) {
  return (
    <div className="flex items-center gap-5">
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(pathname, item.href) ? "page" : undefined}
          className={`${navClass} ${
            isActive(pathname, item.href)
              ? "underline underline-offset-8 decoration-2"
              : ""
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

function MobileNavLinks({ pathname }: { pathname: string | null }) {
  return (
    <div className="grid gap-1 border-b pb-5">
      {navigationItems.map((item) => (
        <SheetClose asChild key={item.href}>
          <Button
            asChild
            variant="ghost"
            className={`h-11 justify-between ${
              isActive(pathname, item.href) ? "bg-secondary" : ""
            }`}
          >
            <Link
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
              <ArrowRight />
            </Link>
          </Button>
        </SheetClose>
      ))}
    </div>
  );
}

function ActiveDesktopNav() {
  return <DesktopNavLinks pathname={usePathname()} />;
}

function ActiveMobileNav() {
  return <MobileNavLinks pathname={usePathname()} />;
}

export function StoreHeader({ categories }: { categories: CategoryInfo[] }) {
  const { count, items } = useCart();

  // Priced by the server so the bag total always matches the real prices.
  const subtotal = useCartSubtotal(items);

  return (
    <header className="store-header sticky top-0 z-40 border-b bg-background">
      <div className="border-b bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-2 text-xs md:px-6">
          <span className="flex items-center gap-2">
            <Shirt className="h-3.5 w-3.5 shrink-0" />
            Sportswear. Streetwear. Your style.
          </span>

          <Link
            href="/contact"
            className="flex shrink-0 items-center gap-2 hover:underline"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              Order enquiries &amp; support
            </span>
            <span className="sm:hidden">Support</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] items-center gap-x-8 gap-y-3 px-4 py-3 md:px-6 lg:grid-cols-[minmax(230px,1fr)_minmax(280px,520px)_1fr] lg:py-4">
        <Link
          href="/"
          aria-label="Harlem Store home"
          className="flex w-fit min-w-0 items-center gap-3"
        >
          <img
            src="/images/harlem-logo.jpeg"
            alt=""
            width={64}
            height={64}
            className="h-12 w-12 shrink-0 object-cover mix-blend-multiply lg:h-16 lg:w-16"
          />

          <span>
            <span className="block font-display text-xl font-bold uppercase leading-tight lg:text-2xl">
              Harlem Store
            </span>
            <span className="text-[10px] font-medium uppercase text-muted-foreground">
              Sports &amp; Fashion
            </span>
          </span>
        </Link>

        <div className="col-span-2 row-start-2 lg:col-span-1 lg:col-start-2 lg:row-start-1">
          <ProductSearch />
        </div>

        <div className="flex items-center justify-end gap-2 lg:col-start-3">
          <Button asChild variant="ghost" className="hidden h-11 lg:inline-flex">
            <Link href="/contact">
              <MessageCircle />
              <span>Need help?</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="relative h-11 px-2 lg:px-3"
          >
            <Link
              href="/cart"
              aria-label={`Shopping bag, ${count} items`}
            >
              <span className="relative">
                <ShoppingBag className="!h-5 !w-5" />
                {count > 0 && (
                  <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-announcement px-1 text-[10px] font-bold text-announcement-foreground">
                    {count}
                  </span>
                )}
              </span>

              <span className="ml-1 hidden text-left xl:block">
                <span className="block text-xs text-muted-foreground">
                  Shopping bag
                </span>
                <span className="block text-sm font-semibold">
                  {formatPrice(subtotal)}
                </span>
              </span>
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="!h-6 !w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[min(90vw,380px)] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Harlem Store</SheetTitle>
                <SheetDescription>Sports &amp; Fashion</SheetDescription>
              </SheetHeader>

              <nav aria-label="Mobile navigation" className="mt-6">
                <Suspense fallback={<MobileNavLinks pathname={null} />}>
                  <ActiveMobileNav />
                </Suspense>

                <p className="mb-3 mt-5 text-xs font-semibold uppercase text-muted-foreground">
                  Shop by category
                </p>

                <div className="grid gap-1">
                  {categories.map((category) => (
                    <SheetClose asChild key={category.id}>
                      <Button
                        asChild
                        variant="ghost"
                        className="h-auto min-h-11 justify-between whitespace-normal py-3 text-left"
                      >
                        <Link
                          href={`/shop?category=${encodeURIComponent(category.id)}`}
                        >
                          {category.name}
                          <ArrowRight />
                        </Link>
                      </Button>
                    </SheetClose>
                  ))}
                </div>

                <SheetClose asChild>
                  <Button asChild className="mt-6 h-11 w-full">
                    <Link href="/contact">
                      Team orders &amp; custom branding
                      <ArrowRight />
                    </Link>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="hidden border-t lg:block">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-6 py-3"
        >
          <Suspense fallback={<DesktopNavLinks pathname={null} />}>
            <ActiveDesktopNav />
          </Suspense>

          <Link
            href="/contact"
            className={`${navClass} flex items-center gap-2`}
          >
            <Shirt className="h-4 w-4" />
            Team kits &amp; branding
            <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>

                <nav
          aria-label="Shopping categories"
          className="min-h-11 border-t bg-secondary/50"
        >
          <div
            className="mx-auto grid max-w-[1440px] px-6"
            style={{
              gridTemplateColumns: `repeat(${Math.max(categories.length, 1)}, minmax(0, 1fr))`,
            }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${encodeURIComponent(category.id)}`}
                className="flex min-h-11 items-center justify-center px-2 py-2 text-center text-xs font-semibold transition-colors hover:bg-secondary focus-visible:bg-secondary"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}