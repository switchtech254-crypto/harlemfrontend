
"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/app/components/ui/button";
import { formatPrice } from "@/app/lib/products";

const statuses = [
  { id: "new", label: "New" },
  { id: "in_progress", label: "In progress" },
  { id: "done", label: "Done" },
] as const;

type Status = (typeof statuses)[number]["id"] | "all";

type EnquiryItem = {
  name: string;
  size?: string;
  qty: number;
  price: number;
};

type Enquiry = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  message: string;
  status: (typeof statuses)[number]["id"];
  created_at: string;
  items: EnquiryItem[];
};

const tabs: { id: Status; label: string }[] = [
  ...statuses,
  { id: "all", label: "All" },
];

export default function EnquiriesAdminPage() {
  const [tab, setTab] = useState<Status>("new");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  function setStatus(id: string, status: Enquiry["status"]) {
    setEnquiries((current) =>
      current.map((enquiry) =>
        enquiry.id === id ? { ...enquiry, status } : enquiry,
      ),
    );

    toast.info("Status updated locally. Backend saving is not connected.");
  }

  const list = enquiries.filter(
    (enquiry) => tab === "all" || enquiry.status === tab,
  );

  function countFor(status: Status) {
    return enquiries.filter(
      (enquiry) => status === "all" || enquiry.status === status,
    ).length;
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase">
        Customer enquiries
      </h1>

      <p className="mt-1 text-sm text-muted-foreground">
        Review customer messages and track enquiry progress.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
       {tabs.map((status) => (
            <Button
                key={status.id}
                type="button"
                size="sm"
                variant={tab === status.id ? "default" : "outline"}
                onClick={() => setTab(status.id)}
            >
                {status.label} ({countFor(status.id)})
            </Button>
            ))}
      </div>

      <ul className="mt-5 space-y-4">
        {list.length === 0 && (
          <li className="border bg-card p-6 text-sm text-muted-foreground">
            {tab === "all"
              ? "No customer enquiries yet."
              : `No ${statuses.find((status) => status.id === tab)?.label.toLowerCase() ?? ""} enquiries.`}
            {" "}Enquiries will appear here when the backend is connected.
          </li>
        )}

        {list.map((enquiry) => {
          const total = enquiry.items.reduce(
            (sum, item) => sum + item.price * item.qty,
            0,
          );

          return (
            <li key={enquiry.id} className="border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{enquiry.name}</p>

                  <p className="text-sm text-muted-foreground">
                    {enquiry.phone && (
                      <a className="underline" href={`tel:${enquiry.phone}`}>
                        {enquiry.phone}
                      </a>
                    )}

                    {enquiry.phone && enquiry.email && " · "}

                    {enquiry.email && (
                      <a
                        className="underline"
                        href={`mailto:${enquiry.email}`}
                      >
                        {enquiry.email}
                      </a>
                    )}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {new Date(enquiry.created_at).toLocaleString("en-KE")}
                  </p>

                  <select
                    aria-label={`Status for ${enquiry.name}`}
                    className="mt-1 border bg-background px-2 py-1 text-sm"
                    value={enquiry.status}
                    onChange={(event) =>
                      setStatus(
                        enquiry.id,
                        event.target.value as Enquiry["status"],
                      )
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm">
                {enquiry.message}
              </p>

              {enquiry.items.length > 0 && (
                <div className="mt-3 bg-secondary p-3 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider">
                    Items in their bag
                  </p>

                  <ul className="mt-1">
                    {enquiry.items.map((item, index) => (
                      <li key={`${item.name}-${index}`}>
                        {item.qty} × {item.name}
                        {item.size ? ` (size ${item.size})` : ""}
                        {" — "}
                        {formatPrice(item.price * item.qty)}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-1 font-semibold">
                    Total {formatPrice(total)}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
