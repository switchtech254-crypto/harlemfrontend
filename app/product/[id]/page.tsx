import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProduct, getRelated } from "@/app/lib/data";
import { ProductJsonLd } from "@/app/components/ProductJsonLd";
import { ProductDetails } from "./ProductDetails";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Product not found — Harlem Store", robots: { index: false, follow: false } };
  }
  return {
    title: `${product.name} — Harlem Store`,
    description: product.description,
    alternates: { canonical: `/product/${encodeURIComponent(product.id)}` },
    openGraph: {
      title: `${product.name} — Harlem Store`,
      description: product.description,
      type: "website",
      siteName: "Harlem Store",
      locale: "en_KE",
      ...(product.image ? { images: [product.image] } : {}),
    },
    twitter: { card: "summary_large_image" },
  };
}

// `params` is request-time data, so it is read inside <Suspense> (required by cacheComponents).
export default function ProductPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

function ProductSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl gap-9 px-5 pt-7 lg:grid-cols-2" aria-busy="true">
      <div className="aspect-square animate-pulse bg-muted" />
      <div className="space-y-4">
        <div className="h-10 w-3/4 animate-pulse bg-muted" />
        <div className="h-6 w-32 animate-pulse bg-muted" />
        <div className="h-24 animate-pulse bg-muted" />
      </div>
    </div>
  );
}

async function ProductContent({ params }: { params: Params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound(); // checked first so unknown ids never hit the "related" endpoint
  const related = await getRelated(id).catch(() => []);
  return (
    <>
      <ProductJsonLd product={product} />
      <ProductDetails p={product} related={related} />
    </>
  );
}
