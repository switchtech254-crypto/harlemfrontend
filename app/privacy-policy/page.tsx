
import type { Metadata } from "next";

import { LegalPage } from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Harlem Store",
  description:
    "How Harlem Store handles your personal details, enquiries and shopping bag information.",
  openGraph: {
    title: "Privacy Policy — Harlem Store",
    description:
      "How Harlem Store handles your personal details and enquiry information.",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      kicker="Your privacy"
      title="Privacy Policy"
      intro="This policy explains what information Harlem Store collects, how we use it, and the choices you have. It covers this website and the enquiries you make with us."
      sections={[
        {
          heading: "Who we are",
          body: (
            <p>
              Harlem Store is an independent sportswear and fashion store based
              in Nairobi, Kenya, selling jerseys and branding, team and club
              uniforms, socks, balls, sports shoes, men&apos;s jeans and
              sneakers. For any privacy question or request, use the contact
              details on our contact page.
            </p>
          ),
        },
        {
          heading: "Information we collect",
          body: (
            <>
              <p>
                <strong className="text-foreground">
                  Details you give us.
                </strong>{" "}
                When you contact us about an order, a team kit or custom
                branding, we receive whatever you choose to share — typically
                your name, phone number, email address, delivery location, and
                your team&apos;s sizes, colours or branding requirements.
              </p>
              <p>
                <strong className="text-foreground">Shopping bag.</strong> The
                items you add to your shopping bag are stored in your own
                browser on your device. This information stays on your device
                and is not sent to us until you contact us about an order.
              </p>
              <p>
                <strong className="text-foreground">
                  What we don&apos;t collect.
                </strong>{" "}
                We do not sell on this website yet, so we never ask for card or
                mobile-money details through the site. We do not run
                advertising or tracking tools on this website.
              </p>
            </>
          ),
        },
        {
          heading: "How we use your information",
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>
                To answer your enquiries and advise on products, sizes and fit.
              </li>
              <li>
                To prepare quotes and confirm orders, including team and custom
                branding orders.
              </li>
              <li>To arrange delivery and keep you updated on your order.</li>
              <li>
                To keep a record of your order so we can support you afterwards.
              </li>
            </ul>
          ),
        },
        {
          heading: "Sharing your information",
          body: (
            <p>
              We do not sell or rent your information. We only share what is
              necessary to deliver your order — for example, a delivery address
              with our delivery provider — and we keep that sharing to the
              minimum needed.
            </p>
          ),
        },
        {
          heading: "How long we keep information",
          body: (
            <p>
              We keep enquiry and order details for as long as needed to handle
              your order and for a reasonable period afterwards so we can
              support you if you come back. Your shopping bag stays in your
              browser until you clear it or your browser removes it.
            </p>
          ),
        },
        {
          heading: "Your choices",
          body: (
            <p>
              You can ask us at any time to confirm what details we hold about
              you, correct them, or delete them, by contacting us through the
              contact page. You can also clear your shopping bag yourself
              through your browser settings, or simply by removing the items in
              the bag.
            </p>
          ),
        },
        {
          heading: "Changes to this policy",
          body: (
            <p>
              If we add online payments, delivery tracking, analytics or any
              new service that collects new information, we will update this
              policy before that happens. The date at the top of this page
              shows when it was last revised.
            </p>
          ),
        },
      ]}
    />
  );
}
