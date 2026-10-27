
import Link from "next/link";
import type { ReactNode } from "react";
import { Page } from "@/app/components/Layout";

type LegalPageProps = {
  kicker: string;
  title: string;
  intro: string;
  sections: {
    heading: string;
    body: ReactNode;
  }[];
};

export function LegalPage({
  kicker,
  title,
  intro,
  sections,
}: LegalPageProps) {
  return (
    <Page>
      <article className="mx-auto max-w-3xl px-5 pt-14">
        <p className="font-script text-5xl">{kicker}</p>

        <h1 className="mt-2 text-4xl font-bold uppercase">{title}</h1>

        <div className="rule-line my-6 w-16" />

        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Last updated: 18 October 2026
        </p>

        <p className="mt-5 text-muted-foreground">{intro}</p>

        {sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide">
              {section.heading}
            </h2>

            <div className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground">
              {section.body}
            </div>
          </section>
        ))}

        <p className="mt-12 border-t pt-6 text-sm text-muted-foreground">
          Questions about this page? Reach us through the{" "}
          <Link
            href="/contact"
            className="font-semibold text-foreground underline underline-offset-4"
          >
            contact page
          </Link>
          .
        </p>
      </article>
    </Page>
  );
}
