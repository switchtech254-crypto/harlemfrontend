
import type { Metadata } from "next";
import { LegalPage } from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — Harlem Store",
  description:
    "The terms that apply when you browse Harlem Store and place an order with us.",
  openGraph: {
    title: "Terms of Service — Harlem Store",
    description:
      "The terms that apply when you browse Harlem Store and place an order with us.",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
};

export default function TermsOfServicePage() {
  return (
    <LegalPage
      kicker="The fine print"
      title="Terms of Service"
      intro="These terms apply when you browse this website and place an order with Harlem Store. By contacting us to order, you accept them."
      sections={[
        {
          heading: "Our products and prices",
          body: (
            <>
              <p>
                Prices on this website are shown in Kenyan shillings (KSh).
                Prices and availability can change, and while we work to keep
                the catalogue accurate, the details we confirm with you
                directly when you order are the ones that count.
              </p>
              <p>
                Product photos are for illustration; colours and finishes can
                vary slightly between screens and the actual item.
              </p>
            </>
          ),
        },
        {
          heading: "How to order",
          body: (
            <p>
              Add the items you are interested in to your shopping bag, then
              contact us by phone, WhatsApp or through the contact page with
              your bag contents and delivery location. Your order is only
              confirmed once we confirm availability, the final price and
              delivery arrangements with you directly.
            </p>
          ),
        },
        {
          heading: "Payment",
          body: (
            <p>
              We do not take payments on this website yet. Payment is arranged
              directly with us when we confirm your order. Please never send
              card details through this website or to anyone claiming to be us
              through unverified channels — we will always confirm payment
              details with you personally when the order is confirmed.
            </p>
          ),
        },
        {
          heading: "Delivery",
          body: (
            <p>
              Delivery options and charges are confirmed with you before you
              pay, based on your location and order size. We will agree the
              timing and cost with you up front so there are no surprises.
            </p>
          ),
        },
        {
          heading: "Team and custom branding orders",
          body: (
            <p>
              For club, school and team orders, we confirm sizes, names,
              numbers, colours and badge or logo details with you before
              production begins. Please check those details carefully — once
              production has started, changes may not be possible or may carry
              an extra cost, which we will confirm with you first.
            </p>
          ),
        },
        {
          heading: "Returns and exchanges",
          body: (
            <p>
              If something isn’t right with your order, contact us as soon as
              possible through the contact page. We treat every case personally
              and will confirm with you what we can do — an exchange, a repair
              or another remedy — based on the item and the situation.
            </p>
          ),
        },
        {
          heading: "Using this website",
          body: (
            <p>
              The content, images and branding on this website belong to
              Harlem Store. You are welcome to browse, share links and order
              from it; please don’t copy the catalogue or branding for your own
              commercial use without our permission.
            </p>
          ),
        },
        {
          heading: "Changes to these terms",
          body: (
            <p>
              We may update these terms as our services change — for example,
              when online checkout launches. The date at the top of this page
              shows when they were last revised, and the terms confirmed with
              you at the time of your order apply to that order.
            </p>
          ),
        },
      ]}
    />
  );
}
