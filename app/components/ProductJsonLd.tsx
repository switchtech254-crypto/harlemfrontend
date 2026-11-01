import type { ProductDetail } from "@/app/lib/products";
import { SITE_URL } from "@/app/lib/site";

/** schema.org Product + breadcrumbs, which can unlock price/availability/rating rich results in Google. */
export function ProductJsonLd({ product }: { product: ProductDetail }) {
  const url = `${SITE_URL}/product/${encodeURIComponent(product.id)}`;
  const images = product.images.map((i) => i.url).filter((u): u is string => Boolean(u));

  const graph = [
    {
      "@type": "Product",
      "@id": `${url}#product`,
      name: product.name,
      description: product.description || product.name,
      sku: product.id,
      url,
      category: product.category_name,
      ...(images.length ? { image: images } : product.image ? { image: [product.image] } : {}),
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "KES",
        price: String(product.price),
        itemCondition: "https://schema.org/NewCondition",
        availability: product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        seller: { "@type": "Organization", name: "Harlem Store", url: SITE_URL },
      },
      // Only real, approved reviews: Google penalises made-up ratings.
      ...(product.rating !== null && product.review_count > 0
        ? { aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.review_count } }
        : {}),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
        {
          "@type": "ListItem",
          position: 3,
          name: product.category_name,
          item: `${SITE_URL}/shop?category=${encodeURIComponent(product.category)}`,
        },
        { "@type": "ListItem", position: 4, name: product.name, item: url },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      // "<" is escaped so admin-entered text can never close the script tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c"),
      }}
    />
  );
}
