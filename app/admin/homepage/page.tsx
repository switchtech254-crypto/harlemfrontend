
"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { products } from "@/app/lib/products";

const lists = [
  {
    key: "featured_ids",
    label: "New products grid",
    hint: 'Shown beside the "The collection" panel (up to 8).',
  },
  {
    key: "deal_ids",
    label: "Featured deals (sidebar)",
    hint: "Shown with the daily countdown (up to 3).",
  },
  {
    key: "bestseller_ids",
    label: "Latest bestsellers",
    hint: "Grid under the bestsellers banner (up to 8).",
  },
  {
    key: "weekly_deal_ids",
    label: "Deals of the week",
    hint: "Deal cards above the promo banner (up to 4).",
  },
] as const;

type ListKey = (typeof lists)[number]["key"];

type HomepageForm = Record<ListKey, string[]> & {
  discount_code: string;
  testimonial_quote: string;
  testimonial_name: string;
  testimonial_role: string;
};

const initialForm: HomepageForm = {
  featured_ids: [],
  deal_ids: [],
  bestseller_ids: [],
  weekly_deal_ids: [],
  discount_code: "",
  testimonial_quote: "",
  testimonial_name: "",
  testimonial_role: "",
};

export default function HomepageAdminPage() {
  const [form, setForm] = useState<HomepageForm>(initialForm);

  function updateField<K extends keyof HomepageForm>(
    key: K,
    value: HomepageForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function toggleProduct(key: ListKey, id: string) {
    setForm((current) => {
      const selected = current[key];

      return {
        ...current,
        [key]: selected.includes(id)
          ? selected.filter((item) => item !== id)
          : [...selected, id],
      };
    });
  }

  function saveChanges() {
    // UI-only for now. Connect this action to your Python API later.
    toast.info(
      "Backend not connected. Your changes have not been saved.",
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold uppercase">
          Deals &amp; homepage
        </h1>

        <Button onClick={saveChanges}>Save changes</Button>
      </div>

      <section className="mt-6 border bg-card p-5">
        <h2 className="font-display font-bold uppercase">
          Discount code
        </h2>

        <p className="text-sm text-muted-foreground">
          Shown on the “Super discount for your first purchase” strip.
        </p>

        <Input
          className="mt-3 max-w-xs"
          maxLength={30}
          value={form.discount_code}
          onChange={(event) =>
            updateField("discount_code", event.target.value)
          }
        />
      </section>

      <section className="mt-4 border bg-card p-5">
        <h2 className="font-display font-bold uppercase">
          Customer review
        </h2>

        <div className="mt-3 space-y-3">
          <div>
            <Label htmlFor="t-q">Quote</Label>
            <Textarea
              id="t-q"
              maxLength={400}
              value={form.testimonial_quote}
              onChange={(event) =>
                updateField("testimonial_quote", event.target.value)
              }
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="t-n">Name</Label>
              <Input
                id="t-n"
                maxLength={60}
                value={form.testimonial_name}
                onChange={(event) =>
                  updateField("testimonial_name", event.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="t-r">Role / location</Label>
              <Input
                id="t-r"
                maxLength={80}
                value={form.testimonial_role}
                onChange={(event) =>
                  updateField("testimonial_role", event.target.value)
                }
              />
            </div>
          </div>
        </div>
      </section>

      {lists.map((list) => (
        <section
          key={list.key}
          className="mt-4 border bg-card p-5"
        >
          <h2 className="font-display font-bold uppercase">
            {list.label}{" "}
            <span className="text-sm font-normal normal-case text-muted-foreground">
              ({form[list.key].length} selected)
            </span>
          </h2>

          <p className="text-sm text-muted-foreground">
            {list.hint}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {products.map((product) => {
              const id = String(product.id);
              const selected = form[list.key].includes(id);

              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleProduct(list.key, id)}
                  className={`border px-3 py-1.5 text-xs ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "hover:border-primary"
                  }`}
                >
                  {product.name}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
