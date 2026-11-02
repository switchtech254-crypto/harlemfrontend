"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, MessageCircle, Phone, RefreshCw } from "lucide-react";

import { api, errorMessages } from "@/app/lib/api";
import type { SiteSettings } from "@/app/lib/homepage";
import { formatPrice } from "@/app/lib/products";
import { trackOrder, type OrderStatus, type TrackedOrder } from "@/app/lib/tracking";
import { whatsappUrl } from "@/app/lib/social";

const POLL_MS = 15_000; // refresh while the order is still moving
const POLL_DONE_MS = 60_000; // slow down once it is completed / cancelled

const STEPS: { status: OrderStatus; label: (o: TrackedOrder) => string }[] = [
  { status: "pending", label: () => "Order placed" },
  { status: "confirmed", label: () => "Confirmed" },
  { status: "processing", label: () => "Being prepared" },
  { status: "ready", label: (o) => (o.delivery_method === "collection" ? "Ready for collection" : "Ready for delivery") },
  { status: "completed", label: (o) => (o.delivery_method === "collection" ? "Collected" : "Delivered") },
];

const HEADLINE: Record<OrderStatus, (o: TrackedOrder) => string> = {
  pending: () => "We've received your order and will confirm it shortly.",
  confirmed: () => "Your order is confirmed. We'll start preparing it.",
  processing: () => "We're preparing your order.",
  ready: (o) =>
    o.delivery_method === "collection"
      ? "Your order is ready. Come and collect it."
      : "Your order is ready for delivery. We'll be in touch about the delivery time.",
  completed: (o) => `${o.delivery_method === "collection" ? "Collected" : "Delivered"}. Thank you for shopping with Harlem Store!`,
  cancelled: () => "This order was cancelled. If that's unexpected, please contact us.",
};

const BADGE: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-900",
  confirmed: "bg-blue-100 text-blue-900",
  processing: "bg-violet-100 text-violet-900",
  ready: "bg-teal-100 text-teal-900",
  completed: "bg-green-100 text-green-900",
  cancelled: "bg-red-100 text-red-900",
};

const PAY_BADGE = { unpaid: "bg-red-100 text-red-900", partial: "bg-amber-100 text-amber-900", paid: "bg-green-100 text-green-900" };

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-KE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export function TrackClient() {
  const params = useSearchParams();
  const linkRef = params.get("ref") ?? "";
  const linkToken = params.get("t") ?? "";

  const [reference, setReference] = useState(linkRef);
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [token, setToken] = useState(linkToken);
  const [loading, setLoading] = useState(Boolean(linkRef && linkToken));
  const [errors, setErrors] = useState<string[]>([]);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);
  const [announce, setAnnounce] = useState("");
  const [store, setStore] = useState<SiteSettings | null>(null);
  const lastStatus = useRef<string | null>(null);

  const load = useCallback(async (body: { reference: string; phone?: string; token?: string }, quiet = false) => {
    if (!quiet) {
      setLoading(true);
      setErrors([]);
    }
    try {
      const next = await trackOrder(body);
      if (lastStatus.current && lastStatus.current !== next.status) {
        setAnnounce(`Order update: ${next.status_display}`);
      }
      lastStatus.current = next.status;
      setOrder(next);
      setToken(next.tracking_token);
      setCheckedAt(new Date());
    } catch (err) {
      if (!quiet) setErrors(errorMessages(err));
    } finally {
      if (!quiet) setLoading(false);
    }
  }, []);

  // Opened from the link in the email: no phone number needed.
  useEffect(() => {
    if (linkRef && linkToken) void load({ reference: linkRef, token: linkToken });
  }, [linkRef, linkToken, load]);

  useEffect(() => {
    api<SiteSettings>("/settings/").then(setStore).catch(() => setStore(null));
  }, []);

  // Keep the page up to date while it is open and visible.
  const status = order?.status;
  const ref = order?.reference;
  useEffect(() => {
    if (!ref || !token) return;
    const delay = status === "completed" || status === "cancelled" ? POLL_DONE_MS : POLL_MS;
    const refresh = () => {
      if (!document.hidden) void load({ reference: ref, token }, true);
    };
    const timer = setInterval(refresh, delay);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [ref, token, status, load]);

  function submit(e: FormEvent) {
    e.preventDefault();
    void load({ reference: reference.trim().toUpperCase(), phone: phone.trim() });
  }

  const field = "mt-1 h-11 w-full border bg-transparent px-3 text-sm";

  /* ------------------------------------------------------------------ lookup form */
  if (!order) {
    return (
      <section className="mx-auto max-w-3xl px-5 pt-14">
        <h1 className="text-4xl font-bold uppercase">Track your order</h1>
        <div className="rule-line mt-3 w-16" />

        {loading ? (
          <p role="status" className="mt-10 text-muted-foreground">Looking up your order…</p>
        ) : (
          <form onSubmit={submit} className="mt-10 max-w-md space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your order number (it's in your confirmation email) and the phone number you used at checkout.
            </p>
            <label className="block text-sm">Order number
              <input required value={reference} onChange={(e) => setReference(e.target.value)} placeholder="HS-261101-ABCDE"
                autoCapitalize="characters" autoComplete="off" className={`${field} uppercase`} />
            </label>
            <label className="block text-sm">Phone number
              <input required value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel"
                placeholder="0712 345 678" className={field} />
            </label>

            {errors.length > 0 && (
              <ul role="alert" className="space-y-1 text-sm text-red-600">
                {errors.map((m) => <li key={m}>{m}</li>)}
              </ul>
            )}

            <button type="submit" className="h-12 w-full bg-primary font-display uppercase tracking-widest text-primary-foreground hover:bg-accent hover:text-accent-foreground">
              Track order
            </button>
            <p className="text-xs text-muted-foreground">
              Can&apos;t find it? <Link href="/contact" className="underline">Contact us</Link> and we&apos;ll help.
            </p>
          </form>
        )}
      </section>
    );
  }

  /* ------------------------------------------------------------------ order view */
  const cancelled = order.status === "cancelled";
  const currentIndex = STEPS.findIndex((s) => s.status === order.status);
  const reached = (s: OrderStatus) => order.timeline.find((t) => t.status === s)?.at;
  const wa = whatsappUrl(store?.whatsapp_number, `Hello Harlem Store, about my order ${order.reference}`);

  return (
    <section className="mx-auto max-w-3xl px-5 pt-14">
      <h1 className="text-4xl font-bold uppercase">Track your order</h1>
      <div className="rule-line mt-3 w-16" />

      <div role="status" aria-live="polite" className="sr-only">{announce}</div>

      <div className="mt-8 border p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Order number</p>
            <p className="text-2xl font-bold tracking-wide">{order.reference}</p>
            <p className="text-xs text-muted-foreground">Placed {fmt(order.created_at)} · {order.delivery_method_display}</p>
          </div>
          <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${BADGE[order.status]}`}>
            {order.status_display}
          </span>
        </div>

        <p className={`mt-5 p-4 text-sm ${cancelled ? "bg-red-50 text-red-900" : "bg-secondary"}`}>{HEADLINE[order.status](order)}</p>

        {!cancelled && (
          <ol aria-label="Order progress" className="mt-6">
            {STEPS.map((step, i) => {
              const done = currentIndex >= 0 && i < currentIndex;
              const current = i === currentIndex;
              const at = reached(step.status);
              return (
                <li key={step.status} aria-current={current ? "step" : undefined} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < STEPS.length - 1 && (
                    <span aria-hidden="true" className={`absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 ${done ? "bg-primary" : "bg-border"}`} />
                  )}
                  <span
                    aria-hidden="true"
                    className={`z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 text-xs font-bold ${
                      done || (current && order.status === "completed")
                        ? "border-primary bg-primary text-primary-foreground"
                        : current
                          ? "border-primary bg-background text-primary ring-4 ring-primary/15"
                          : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {done || (current && order.status === "completed") ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <div className="pt-1">
                    <p className={`text-sm font-semibold ${!done && !current ? "text-muted-foreground" : ""}`}>
                      {step.label(order)}
                      <span className="sr-only">{done ? " (done)" : current ? " (current step)" : " (upcoming)"}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{at ? fmt(at) : done || current ? "" : "Pending"}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {cancelled && (
          <ul className="mt-5 space-y-1 text-sm text-muted-foreground">
            {order.timeline.map((t) => (
              <li key={t.status}>{fmt(t.at)}: {t.status === "cancelled" ? "Order cancelled" : t.status === "pending" ? "Order placed" : t.status}</li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-xs text-muted-foreground">
          <span>
            {checkedAt ? `Last checked ${checkedAt.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}` : ""} · updates automatically
          </span>
          <button
            type="button"
            onClick={() => void load({ reference: order.reference, token }, true)}
            className="inline-flex items-center gap-1.5 border px-3 py-1.5 uppercase tracking-wide hover:bg-muted"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Refresh
          </button>
        </div>
      </div>

      {/* payment */}
      <div className="mt-6 border p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Payment</h2>
          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wide ${PAY_BADGE[order.payment_status]}`}>{order.payment_status_display}</span>
        </div>
        <dl className="mt-4 space-y-1.5 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">Order total</dt><dd className="font-semibold">{formatPrice(order.total)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Paid</dt><dd>{formatPrice(order.amount_paid)}</dd></div>
          {order.balance_due > 0 && !cancelled && (
            <div className="flex justify-between"><dt className="text-red-700">Balance due</dt><dd className="font-semibold text-red-700">{formatPrice(order.balance_due)}</dd></div>
          )}
        </dl>
        {order.payments.length > 0 && (
          <ul className="mt-4 space-y-1 border-t pt-3 text-xs text-muted-foreground">
            {order.payments.map((p, i) => (
              <li key={`${p.reference}-${i}`}>
                {formatPrice(p.amount)} via {p.method}{p.reference ? ` · receipt ${p.reference}` : ""} · {fmt(p.paid_at)}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* items */}
      <div className="mt-6 border p-5 sm:p-6">
        <h2 className="text-lg font-bold">Items</h2>
        <ul className="mt-3 divide-y text-sm">
          {order.items.map((item, i) => (
            <li key={`${item.product_name}-${item.size}-${i}`} className="flex justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="font-semibold">{item.product_name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity} × {formatPrice(item.unit_price)}{item.size ? ` · size ${item.size}` : ""}
                  {Object.keys(item.customization ?? {}).length > 0
                    ? ` · ${Object.entries(item.customization).map(([k, v]) => `${k}: ${v}`).join(", ")}`
                    : ""}
                </p>
              </div>
              <p className="shrink-0">{formatPrice(item.line_total)}</p>
            </li>
          ))}
        </ul>
        {order.discount_total > 0 && (
          <p className="mt-2 flex justify-between border-t pt-3 text-sm text-green-700"><span>Discount</span><span>− {formatPrice(order.discount_total)}</span></p>
        )}
      </div>

      {/* help */}
      <div className="mt-6 bg-secondary p-5 text-sm sm:p-6">
        <h2 className="text-lg font-bold">Need help with this order?</h2>
        <p className="mt-1 text-muted-foreground">Quote order number <strong className="text-foreground">{order.reference}</strong> when you contact us.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {store?.contact_phone && (
            <a href={`tel:${store.contact_phone}`} className="inline-flex h-10 items-center gap-2 border bg-background px-4"><Phone className="h-4 w-4" aria-hidden="true" />Call {store.contact_phone}</a>
          )}
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 border bg-background px-4"><MessageCircle className="h-4 w-4" aria-hidden="true" />WhatsApp</a>
          )}
          <Link href="/contact" className="inline-flex h-10 items-center border bg-background px-4">Contact form</Link>
        </div>
      </div>

      <button
        type="button"
        onClick={() => { setOrder(null); setToken(""); setPhone(""); lastStatus.current = null; }}
        className="mt-8 text-sm underline"
      >
        Track another order
      </button>
    </section>
  );
}
