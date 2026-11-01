import type { MetadataRoute } from "next";

import { SITE_URL } from "@/app/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Safety net: anything that is not a real https site (localhost, staging previews) tells
  // crawlers to stay away, so a test deployment can never get indexed by accident.
  if (!SITE_URL.startsWith("https://")) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private/utility pages and internal-search result pages (thin, near-duplicate content).
        disallow: ["/cart", "/*?q=", "/*&q="],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
