import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { Page, ProductCard } from "@/app/components/Layout";
import { getCategories, getProducts } from "@/app/lib/data";

type SearchParams = Promise<{ category?: string | string[]; q?: string | string[] }>;

export const metadata: Metadata = {
  title: "Shop — Harlem Store",
  description: "Browse jerseys, uniforms, balls, sports shoes, jeans and sneakers.",
  openGraph: { title: "Shop — Harlem Store", description: "Browse the full Harlem Store collection.", type: "website" },
  twitter: { card: "summary_large_image" },
};

function getShopHref(category?: string, q?: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (q) params.set("q", q);
  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
}

// searchParams is request-time data, so it is read inside <Suspense> (required by cacheComponents).
export default function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Page>
      <Suspense fallback={<ShopSkeleton />}>
        <ShopContent searchParams={searchParams} />
      </Suspense>
    </Page>
  );
}

function ShopSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-14" aria-busy="true">
      <div className="h-10 w-56 animate-pulse bg-muted" />
      <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="aspect-square animate-pulse bg-muted" />
        ))}
      </div>
    </section>
  );
}

async function ShopContent({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const categories = await getCategories();

  const rawCategory = typeof params.category === "string" ? params.category : undefined;
  const category = categories.find((c) => c.id === rawCategory)?.id;
  const rawQuery = typeof params.q === "string" ? params.q : undefined;
  const q = rawQuery?.trim().slice(0, 150) || undefined;

  // Filtering and search happen in Django. page_size=100 is the API maximum.
  const { results: list } = await getProducts({ category, q, page_size: 100 });
  const heading = categories.find((c) => c.id === category)?.name ?? "Shop all";

  const chip = (active: boolean) =>
    `border px-4 py-2 text-sm uppercase tracking-wider font-display ${
      active ? "bg-primary text-primary-foreground border-primary" : "hover:border-primary"
    }`;

  return (
    <section className="mx-auto max-w-7xl px-5 pt-14">
      <h1 className="text-4xl font-bold uppercase">{heading}</h1>
      <div className="rule-line mt-3 w-16" />

      {q && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {list.length} results for “{q}”
          </p>
          <Link href={getShopHref(category)} className="text-sm underline underline-offset-4">
            Clear search
          </Link>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        <Link href={getShopHref(undefined, q)} className={chip(!category)}>
          All
        </Link>
        {categories.map((item) => (
          <Link key={item.id} href={getShopHref(item.id, q)} className={chip(category === item.id)}>
            {item.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
        {list.map((product) => (
          <ProductCard key={product.id} p={product} />
        ))}
      </div>

      {list.length === 0 && (
        <div className="py-12">
          <p className="text-muted-foreground">No products match your search.</p>
          <Link href="/shop" className="mt-3 inline-block underline underline-offset-4">
            Browse all products
          </Link>
        </div>
      )}
    </section>
  );
}