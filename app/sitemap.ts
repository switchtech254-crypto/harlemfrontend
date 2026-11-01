import type { MetadataRoute } from "next";

import { getAllProducts, getCategories } from "@/app/lib/data";
import { SITE_URL } from "@/app/lib/site";

// Static pages. Remove any line whose page does not exist in your app, otherwise the sitemap lists a 404.
const STATIC_PAGES: { path: string; priority: number; changeFrequency: "monthly" | "yearly" }[] = [
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/returns-exchanges", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms-of-service", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookie-policy", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // If the API is unreachable the sitemap still lists the static pages instead of failing the build.
  const [products, categories] = await Promise.all([
    getAllProducts().catch(() => []),
    getCategories().catch(() => []),
  ]);

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    ...categories.map((c) => ({
      url: `${SITE_URL}/shop?category=${encodeURIComponent(c.id)}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${SITE_URL}/product/${encodeURIComponent(p.id)}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      // Image sitemap entry: helps products appear in Google Images.
      ...(p.image ? { images: [p.image] } : {}),
    })),
    ...STATIC_PAGES.map(({ path, priority, changeFrequency }) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency,
      priority,
    })),
  ];
}
