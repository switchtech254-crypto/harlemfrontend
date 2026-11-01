import type { CategoryInfo, Product } from "./products";

export type SiteSettings = {
  store_name: string;
  tagline: string;
  contact_phone: string;
  whatsapp_number: string;
  contact_email: string;
  address: string;
  opening_hours: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  delivery_info: string;
  announcement_text: string;
  announcement_enabled: boolean;
  promo_code: string | null;
  promo_description: string | null;
  online_ordering_enabled: boolean;
  mpesa_enabled: boolean;
};

export type HeroSlide = {
  id: number;
  title: string;
  text: string;
  image: string | null;
  image_alt: string;
  category: string | null;
  href: string;
  button_label: string;
};

export type Banner = {
  placement: "side_panel" | "collection_panel" | "bestsellers_banner" | "deals_banner";
  eyebrow: string;
  heading: string;
  subheading: string;
  body: string;
  link_label: string;
  link_url: string;
  image: string | null;
  image_alt: string;
};

export type Service = { title: string; text: string; icon: string };
export type Testimonial = { quote: string; author: string; role: string };

export type Deal = {
  id: number;
  badge: string;
  sold: number;
  available: number;
  percent_sold: number;
  ends_at: string;
  product: Product;
};

export type HomepageData = {
  server_time: string;
  settings: SiteSettings;
  hero_slides: HeroSlide[];
  banners: Partial<Record<Banner["placement"], Banner>>;
  services: Service[];
  featured_products: Product[];
  categories: CategoryInfo[];
  bestsellers: Product[];
  featured_deals: Deal[];
  deals: Deal[];
  testimonials: Testimonial[];
};
