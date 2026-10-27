import Link from "next/link";
import type { ReactNode } from "react";

import { StoreImage } from "@/app/components/StoreImage";
import { formatPrice, type Product } from "@/app/lib/products";

// Header, <main> and footer now live once in the root layout (see SiteShell), so `Page`
// is a pass-through. Existing pages that wrap their content in <Page> keep working unchanged.
export function Page({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function ProductCard({ p }: { p: Product }) {
  return (
    <Link
      href={`/product/${encodeURIComponent(p.id)}`}
      className="group block"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <StoreImage
          src={p.image}
          alt={p.name}
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />

        {!p.in_stock && (
          <span className="absolute left-2 top-2 bg-primary px-2 py-1 text-[10px] font-bold uppercase text-primary-foreground">
            Sold out
          </span>
        )}
      </div>

      <h3 className="mt-3 text-base font-semibold">{p.name}</h3>

      <p className="text-muted-foreground">
        {formatPrice(p.price)}
        {p.original_price && (
          <span className="ml-2 text-sm line-through opacity-60">
            {formatPrice(p.original_price)}
          </span>
        )}
      </p>
    </Link>
  );
}
