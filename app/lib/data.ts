// Server-side data fetchers. Import these ONLY from server components / pages
// (client components import types from lib/products and lib/homepage instead).
//
// Next.js 16 with `cacheComponents` no longer supports `export const revalidate`.
// Each fetcher opts in to caching with "use cache"; cacheLife("minutes") means
// "serve cached for ~5 min, refresh in the background after 1 min".
import { cacheLife } from "next/cache";

import { api, ApiError } from "./api";
import type { HomepageData, SiteSettings } from "./homepage";
import type { CategoryInfo, Paginated, Product, ProductDetail, ProductQuery } from "./products";

export async function getHomepage() {
  "use cache";
  cacheLife("minutes");
  return api<HomepageData>("/homepage/");
}

export async function getSettings() {
  "use cache";
  cacheLife("minutes");
  return api<SiteSettings>("/settings/");
}

export async function getCategories() {
  "use cache";
  cacheLife("minutes");
  return api<CategoryInfo[]>("/categories/");
}

export async function getProducts(params: ProductQuery = {}) {
  "use cache";
  cacheLife("minutes");
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") qs.set(k, String(v));
  }
  return api<Paginated<Product>>(`/products/?${qs}`);
}

export async function getProduct(id: string): Promise<ProductDetail | null> {
  "use cache";
  cacheLife("minutes");
  try {
    return await api<ProductDetail>(`/products/${encodeURIComponent(id)}/`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function getRelated(id: string) {
  "use cache";
  cacheLife("minutes");
  return api<Product[]>(`/products/${encodeURIComponent(id)}/related/`);
}