// Server component. Put it in app/layout.tsx around {children} (see README below).
// Categories are fetched on the server (cached), so header/footer category links are in the
// initial HTML that search engines and no-JS visitors receive.
import type { ReactNode } from "react";

import { StoreFooter } from "@/app/components/StoreFooter";
import { StoreHeader } from "@/app/components/StoreHeader";
import { getCategories, getSettings } from "@/app/lib/data";
import { socialLinks } from "@/app/lib/social";

export async function SiteShell({ children }: { children: ReactNode }) {
  // If the API is briefly unreachable the chrome still renders (without category/social links).
  const [categories, settings] = await Promise.all([
    getCategories().catch(() => []),
    getSettings().catch(() => null),
  ]);

  return (
    <>
      <StoreHeader categories={categories} />
      <main>{children}</main>
      <StoreFooter categories={categories} social={socialLinks(settings)} />
    </>
  );
}
