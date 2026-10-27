"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronRight,
  Headset,
  Minus,
  Plus,
  Ruler,
  ShoppingBag,
  Truck,
  ShieldCheck,
} from "lucide-react";

import { Page, ProductCard } from "@/app/components/Layout";
import { ProductGallery } from "@/app/components/ProductGallery";
import { Button } from "@/app/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { useCart } from "@/app/lib/cart";
import {
  formatPrice,
  type Product,
  type ProductDetail,
} from "@/app/lib/products";

export function ProductDetails({
  p,
  related,
}: {
  p: ProductDetail;
  related: Product[];
}) {
  const { add } = useCart();
  const router = useRouter();

  // Stock now comes from the API (per size). Exact quantities are never exposed.
  const sizeInStock = (s: string) =>
    p.variants.find((v) => v.size === s)?.in_stock ?? true;

  const [size, setSize] = useState<string | undefined>(
    p.sizes?.find(sizeInStock) ?? p.sizes?.[0],
  );
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  // Category name is provided by the API, so the old static lookup is gone.
  const category = { name: p.category_name };

  const lowStock = p.variants.find((v) => v.size === size)?.low_stock ?? false;
  const canBuy = p.in_stock && (!p.sizes || sizeInStock(size ?? ""));

  function addSelection() {
    if (!canBuy) return;

    for (let i = 0; i < qty; i++) {
      add(p.id, size);
    }

    setAdded(true);
  }

  const sizingText =
    p.category === "jeans"
      ? "Choose your usual waist size from the available options. For measurements and fit advice, contact us before ordering."
      : p.category === "sports-shoes" || p.category === "sneakers"
        ? "Choose your usual shoe size. Between sizes? Contact us to confirm measurements and fit before ordering."
        : "Choose your usual size from the options above. Contact us for measurements, team sizing and fit advice.";

  const categoryHref = `/shop?category=${encodeURIComponent(p.category)}`;

  return (
    <Page>
      <div className="product-detail mx-auto max-w-7xl px-5 pt-7">
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"
        >
          <Link href="/">Home</Link>
          <ChevronRight className="size-3" />

          <Link href="/shop">Shop</Link>
          <ChevronRight className="size-3" />

          <Link href={categoryHref}>{category.name}</Link>
          <ChevronRight className="size-3" />

          <span aria-current="page" className="text-foreground">
            {p.name}
          </span>
        </nav>

        <section className="grid items-start gap-9 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
          <ProductGallery image={p.image} images={p.images} name={p.name} />

          <div className="min-w-0">
            <Link
              href={categoryHref}
              className="text-xs font-medium uppercase text-muted-foreground"
            >
              {category.name}
            </Link>

            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              {p.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="text-2xl font-semibold">{formatPrice(p.price)}</p>

              {p.original_price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(p.original_price)}
                </span>
              )}

              <span className="border-l pl-3 text-xs text-muted-foreground">
                Price per item
              </span>
            </div>

            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              {p.description}
            </p>

            <div className="my-6 border-t" />

            {p.sizes && (
              <fieldset>
                <legend className="text-sm font-semibold">
                  Select size{" "}
                  <span className="ml-2 font-normal text-muted-foreground">
                    {size}
                  </span>
                </legend>

                <div className="mt-3 flex flex-wrap gap-2">
                  {p.sizes.map((s) => (
                    <Button
                      key={s}
                      variant={size === s ? "default" : "outline"}
                      aria-pressed={size === s}
                      disabled={!sizeInStock(s)}
                      onClick={() => {
                        setSize(s);
                        setAdded(false);
                      }}
                      className="h-11 min-w-11 rounded-none px-3 disabled:line-through disabled:opacity-40"
                    >
                      {s}
                    </Button>
                  ))}
                </div>

                <Button
                  asChild
                  variant="link"
                  className="mt-2 h-auto px-0 text-xs"
                >
                  <a href="#product-information">
                    <Ruler />
                    Sizing &amp; fit advice
                  </a>
                </Button>
              </fieldset>
            )}

            <div className="mt-6 flex items-center justify-between gap-4 text-sm">
              <label htmlFor="product-quantity" className="font-semibold">
                Quantity
              </label>

              <span className="text-muted-foreground">
                Subtotal{" "}
                <strong className="text-foreground">
                  {formatPrice(p.price * qty)}
                </strong>
              </span>
            </div>

            <div className="mt-3 flex gap-3">
              <div className="flex h-12 shrink-0 items-center border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-10 rounded-none"
                  aria-label="Decrease quantity"
                  disabled={qty <= 1}
                  onClick={() => {
                    setQty(qty - 1);
                    setAdded(false);
                  }}
                >
                  <Minus />
                </Button>

                <input
                  id="product-quantity"
                  type="number"
                  min={1}
                  max={99}
                  value={qty}
                  aria-label="Quantity"
                  onChange={(event) => {
                    setQty(
                      Math.min(
                        99,
                        Math.max(
                          1,
                          Math.floor(Number(event.target.value) || 1),
                        ),
                      ),
                    );
                    setAdded(false);
                  }}
                  className="product-quantity h-11 w-10 bg-transparent text-center text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-10 rounded-none"
                  aria-label="Increase quantity"
                  disabled={qty >= 99}
                  onClick={() => {
                    setQty(qty + 1);
                    setAdded(false);
                  }}
                >
                  <Plus />
                </Button>
              </div>

              <Button
                className="h-12 min-w-0 flex-1 rounded-none"
                disabled={!canBuy}
                onClick={addSelection}
              >
                <ShoppingBag />
                {p.in_stock ? "Add to cart" : "Sold out"}
              </Button>
            </div>

            <Button
              variant="secondary"
              className="mt-3 h-12 w-full rounded-none border border-primary"
              disabled={!canBuy}
              onClick={() => {
                addSelection();
                router.push("/cart");
              }}
            >
              Review &amp; order
              <ChevronRight />
            </Button>

            <div aria-live="polite" className="mt-3 min-h-6 text-sm">
              {!p.in_stock && (
                <p className="text-red-600">
                  This item is currently out of stock.{" "}
                  <Link href="/contact" className="underline underline-offset-4">
                    Ask when it&apos;s back
                  </Link>
                </p>
              )}

              {p.in_stock && lowStock && !added && (
                <p className="text-amber-700">
                  Only a few left in this size.
                </p>
              )}

              {added && (
                <p className="flex flex-wrap items-center gap-2">
                  <Check className="size-4" />
                  Added to your cart.
                  <Link
                    href="/cart"
                    className="underline underline-offset-4"
                  >
                    View cart
                  </Link>
                </p>
              )}
            </div>

            <div className="mt-3 divide-y border-y">
              <div className="flex gap-3 py-4">
                <Truck className="mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">
                    Delivery &amp; collection
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Confirm availability, delivery cost and timing with us
                    before ordering.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 py-4">
                <ShieldCheck className="mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">
                    Clear prices. Personal service.
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Orders are arranged through our team. Online payment is
                    not available yet.
                  </p>
                </div>
              </div>
            </div>

            <Button asChild variant="link" className="mt-3 px-0">
              <Link href="/contact">
                <Headset />
                Ask about this item
                <ChevronRight />
              </Link>
            </Button>

            <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <div>
                <dt className="inline font-semibold text-foreground">
                  Category:{" "}
                </dt>
                <dd className="inline">{category.name}</dd>
              </div>

              <div>
                <dt className="inline font-semibold text-foreground">
                  Product ID:{" "}
                </dt>
                <dd className="inline">{p.id}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          id="product-information"
          className="mt-12 scroll-mt-8 border-y py-7"
        >
          <Tabs defaultValue="details">
            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none bg-transparent p-0">
              <TabsTrigger value="details" className="rounded-none px-3 py-3">
                Product details
              </TabsTrigger>
              <TabsTrigger value="sizing" className="rounded-none px-3 py-3">
                Sizing &amp; fit
              </TabsTrigger>
              <TabsTrigger value="delivery" className="rounded-none px-3 py-3">
                Delivery &amp; orders
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="details"
              className="max-w-3xl pt-5 text-sm leading-7 text-muted-foreground"
            >
              <p>{p.description}</p>
              <p className="mt-2">
                Part of the Harlem Store {category.name.toLowerCase()}{" "}
                collection. For product specifications, custom branding or
                team quantities,{" "}
                <Link href="/contact" className="text-foreground underline">
                  speak to our team
                </Link>
                .
              </p>
            </TabsContent>

            <TabsContent
              value="sizing"
              className="max-w-3xl pt-5 text-sm leading-7 text-muted-foreground"
            >
              <p>
                {p.sizes
                  ? sizingText
                  : "This item has no size selection. Contact us to confirm dimensions and specifications before ordering."}
              </p>

              {p.sizes && (
                <p className="mt-2">
                  Available size options: {p.sizes.join(", ")}.
                </p>
              )}

              <Link
                href="/contact"
                className="mt-3 inline-block text-foreground underline"
              >
                Get sizing advice
              </Link>
            </TabsContent>

            <TabsContent
              value="delivery"
              className="max-w-3xl pt-5 text-sm leading-7 text-muted-foreground"
            >
              <p>
                Add your chosen items to the cart, then contact Harlem Store to
                arrange your order. Please confirm stock, delivery or
                collection arrangements, payment options and any return
                questions with our team.
              </p>

              <Link
                href="/contact"
                className="mt-3 inline-block text-foreground underline"
              >
                Contact us about your order
              </Link>
            </TabsContent>
          </Tabs>
        </section>

        <section className="py-10">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">
              Complete your collection
            </h2>

            <Button asChild variant="link" className="shrink-0 px-0">
              <Link href="/shop">
                Shop all
                <ChevronRight />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} p={item} />
            ))}
          </div>
        </section>
      </div>
    </Page>
  );
}