import type { Metadata, Viewport } from "next";

import "./globals.css";
import { SiteShell } from "@/app/components/SiteShell";
import { SITE_URL } from "@/app/lib/site";
import { Providers } from "./providers";

export const metadata: Metadata = {
  // Base for canonical / Open Graph URLs. Set NEXT_PUBLIC_SITE_URL in production.
  metadataBase: new URL(SITE_URL),
  title: "Harlem Store — Sports & Fashion",
  description:
    "Jerseys, team uniforms, balls, sports shoes, jeans and sneakers.",
  applicationName: "Harlem Store",
  openGraph: {
    siteName: "Harlem Store",
    title: "Harlem Store — Sports & Fashion",
    description:
      "Jerseys, team uniforms, balls, sports shoes, jeans and sneakers.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Great+Vibes&family=Josefin+Sans:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>
        <Providers>
          {/* Header + <main> + footer, rendered once on the server for every page. */}
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
