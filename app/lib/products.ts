// Categories are now managed in the admin, so the id is just the slug string.
export type Category = string;

export type CategoryInfo = {
  id: Category;
  name: string;
  image: string | null;
  blurb: string;
  product_count: number | null;
};

export type Product = {
  id: string; // slug
  name: string;
  price: number; // current price in KSh (sale price when on sale)
  original_price: number | null; // regular price when on sale
  category: Category;
  category_name: string;
  image: string | null;
  description: string;
  sizes: string[] | null; // null for unsized items
  badge: string;
  in_stock: boolean;
  rating: number | null;
  review_count: number;
};

export type ProductDetail = Product & {
  images: { url: string | null; alt: string }[];
  variants: { size: string; in_stock: boolean; low_stock: boolean }[];
};

export type Paginated<T> = { count: number; next: string | null; previous: string | null; results: T[] };

export const formatPrice = (amount: number) => `KSh ${amount.toLocaleString("en-KE")}`;

export type ProductQuery = {
  category?: string | undefined;
  q?: string | undefined;
  ordering?: "price" | "-price" | "name" | "newest" | "featured" | undefined;
  page?: number | undefined;
  page_size?: number | undefined;
  in_stock?: boolean | undefined;
  on_sale?: boolean | undefined;
};