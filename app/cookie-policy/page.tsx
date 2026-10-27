
import type { Metadata } from "next";

import { LegalPage } from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy — Harlem Store",
  description:
    "Which cookies and browser storage Harlem Store uses — and the tracking cookies we don't use.",
  openGraph: {
    title: "Cookie Policy — Harlem Store",
    description:
      "Which cookies and browser storage Harlem Store uses, and what we don't use.",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      kicker="Cookies, explained"
      title="Cookie Policy"
      intro="This policy explains what cookies and browser storage are, exactly what this website stores on your device, and how you can control it."
      sections={[
        {
          heading: "What cookies and browser storage are",
          body: (
            <p>
              Cookies and similar browser storage are small pieces of data a
              website saves in your browser. They let a site remember things
              between visits — for example, what is in your shopping bag —
              instead of you starting over every time.
            </p>
          ),
        },
        {
          heading: "What this website stores",
          body: (
            <>
              <p>
                This website uses only one thing, and it is essential for
                shopping:{" "}
                <strong className="text-foreground">
                  your shopping bag
                </strong>
                . The items you add are saved in your browser&apos;s local
                storage so your bag is still there when you come back or move
                between pages. This data stays on your device — it is not sent
                to us until you contact us about an order.
              </p>
              <p>
                That is the full list today. This website does not use
                advertising cookies, social-media trackers, or analytics
                cookies.
              </p>
            </>
          ),
        },
        {
          heading: "Third parties",
          body: (
            <p>
              We don&apos;t place any third-party cookies or trackers on this
              website. If that ever changes — for example, if we add analytics
              to improve the store — we will update this policy first.
            </p>
          ),
        },
        {
          heading: "Managing or removing stored data",
          body: (
            <p>
              You can clear your shopping bag at any time by removing the items
              in the bag, or by clearing site data for this website in your
              browser&apos;s settings. Because we only store your bag, clearing
              site data simply empties your bag — nothing else about your visit
              changes.
            </p>
          ),
        },
        {
          heading: "Questions",
          body: (
            <p>
              If you have a question about anything stored on your device by
              this website, get in touch through the contact page and we&apos;ll
              walk you through it.
            </p>
          ),
        },
      ]}
    />
  );
}
