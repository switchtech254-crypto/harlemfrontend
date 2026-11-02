
"use client";

import { Suspense } from "react";
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
  return (
    <Suspense fallback={null}>
      <FooterContent categories={categories} social={social} />
    </Suspense>
  );
}

function FooterContent({
  categories,
  social,
}: {
  categories: CategoryInfo[];
  social: SocialLink[];
}) {
  const pathname = usePathname();

  if (pathname === "/cart") {
    return null;
  }

  return <StoreFooter categories={categories} social={social} />;
}
