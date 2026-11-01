import type { SiteSettings } from "./homepage";

export type SocialId = "tiktok" | "instagram" | "whatsapp";
export type SocialLink = { id: SocialId; label: string; href: string };

export const WHATSAPP_GREETING = "Hello Harlem Store, I'd like to ask about your products.";

/** "+254 712 345 678" -> https://wa.me/254712345678?text=...  (null if the number looks invalid). */
export function whatsappUrl(number: string | null | undefined, text?: string): string | null {
  const digits = (number ?? "").replace(/\D/g, "");
  if (digits.length < 9) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/** Only platforms that have been filled in (Admin -> Site settings) are returned, so there are no dead links. */
export function socialLinks(s: Pick<SiteSettings, "tiktok_url" | "instagram_url" | "whatsapp_number"> | null): SocialLink[] {
  if (!s) return [];
  const out: SocialLink[] = [];
  if (s.tiktok_url) out.push({ id: "tiktok", label: "Harlem Store on TikTok", href: s.tiktok_url });
  if (s.instagram_url) out.push({ id: "instagram", label: "Harlem Store on Instagram", href: s.instagram_url });
  const wa = whatsappUrl(s.whatsapp_number, WHATSAPP_GREETING);
  if (wa) out.push({ id: "whatsapp", label: "Chat with Harlem Store on WhatsApp", href: wa });
  return out;
}
