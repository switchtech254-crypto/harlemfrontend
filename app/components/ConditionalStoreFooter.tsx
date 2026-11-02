"use client";

import { usePathname } from "next/navigation";

import { StoreFooter } from "@/app/components/StoreFooter";
import type { CategoryInfo } from "@/app/lib/products";
import type { SocialLink } from "@/app/lib/social";

export function ConditionalStoreFooter({
  categories,
  social,
}: {
  categories: CategoryInfo[];
  social: SocialLink[];
}) {
  const pathname = usePathname();

  // Pages where the footer should not appear.
  const hiddenFooterPaths = ["/cart"];

  if (hiddenFooterPaths.includes(pathname)) {
    return null;
  }

  return <StoreFooter categories={categories} social={social} />;
}