"use client";

import { useState } from "react";
import { api, errorMessages } from "@/app/lib/api";

const KINDS = [
  { value: "general", label: "General enquiry" },
  { value: "order", label: "Place / discuss an order" },
  { value: "team", label: "Team / club kit" },
  { value: "branding", label: "Custom branding" },
  { value: "product", label: "Product question" },
  { value: "delivery", label: "Delivery" },
];

/** Drop into app/contact/page.tsx. Optional `productId` links the enquiry to a product. */
export function ContactForm({ productId, defaultKind = "general" }: { productId?: string; defaultKind?: string }) {
  const [form, setForm] = useState({ kind: defaultKind, name: "", phone: "", email: "", organisation: "", message: "", website: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<string[]>([]);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const field = "mt-1 h-11 w-full border bg-transparent px-3 text-sm";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setErrors([]);
    try {
      await api("/contact/", { method: "POST", body: JSON.stringify({ ...form, ...(productId ? { product: productId } : {}) }) });
      setState("sent");
    } catch (err) {
      setErrors(errorMessages(err));
      setState("idle");
    }
  }

  if (state === "sent") {
    return <p role="status" className="bg-secondary p-4 text-sm">Thanks! Our team will get back to you shortly.</p>;
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm">What is this about?
        <select value={form.kind} onChange={set("kind")} className={field}>
          {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
        </select>
      </label>
      <label className="block text-sm">Name
        <input required value={form.name} onChange={set("name")} autoComplete="name" className={field} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">Phone
          <input value={form.phone} onChange={set("phone")} inputMode="tel" autoComplete="tel" className={field} />
        </label>
        <label className="block text-sm">Email
          <input type="email" value={form.email} onChange={set("email")} autoComplete="email" className={field} />
        </label>
      </div>
      <label className="block text-sm">Club / school / company (optional)
        <input value={form.organisation} onChange={set("organisation")} className={field} />
      </label>
      <label className="block text-sm">Message
        <textarea required rows={5} value={form.message} onChange={set("message")} className="mt-1 w-full border bg-transparent p-3 text-sm" />
      </label>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} /></label>
      </div>

      {errors.length > 0 && (
        <ul role="alert" className="space-y-1 text-sm text-red-600">{errors.map((m) => <li key={m}>{m}</li>)}</ul>
      )}
      <button type="submit" disabled={state === "sending"}
        className="h-12 bg-primary px-8 font-display uppercase tracking-widest text-primary-foreground disabled:opacity-50">
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
      <p className="text-xs text-muted-foreground">Please provide a phone number or an email so we can reply.</p>
    </form>
  );
}
