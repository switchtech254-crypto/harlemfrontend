import type { HomepageData } from "@/app/lib/homepage";
import { SITE_URL } from "@/app/lib/site";

/** schema.org structured data: the store, site search, and the bestseller list. */
export function HomeJsonLd({ data }: { data: HomepageData }) {
  const s = data.settings;
  const sameAs = [s.facebook_url, s.instagram_url, s.tiktok_url].filter(Boolean);

  const graph = [
    {
      "@type": "OnlineStore",
      "@id": `${SITE_URL}/#organization`,
      name: s.store_name,
      url: SITE_URL,
      logo: `${SITE_URL}/images/harlem-logo.jpeg`,
      currenciesAccepted: "KES",
      areaServed: { "@type": "Country", name: "Kenya" },
      ...(s.contact_phone ? { telephone: s.contact_phone } : {}),
      ...(s.contact_email ? { email: s.contact_email } : {}),
      ...(s.address
        ? { address: { "@type": "PostalAddress", streetAddress: s.address, addressCountry: "KE" } }
        : {}),
      ...(sameAs.length ? { sameAs } : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: s.store_name,
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/shop?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "ItemList",
      name: "Latest bestsellers",
      itemListElement: data.bestsellers.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.name,
        url: `${SITE_URL}/product/${encodeURIComponent(p.id)}`,
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      // "<" is escaped so content from the admin can never close the script tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c"),
      }}
    />
  );
}