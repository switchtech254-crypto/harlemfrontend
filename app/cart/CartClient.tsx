"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";

import { api, errorMessages } from "@/app/lib/api";
import { MpesaPayment } from "@/app/components/MpesaPayment";
import { StoreImage } from "@/app/components/StoreImage";
import { useCart, type CartItem } from "@/app/lib/cart";
import { formatPrice } from "@/app/lib/products";

type Quote = {
  lines: { id: string; name: string; size: string | null; qty: number; unit_price: number; line_total: number; image: string | null }[];
  subtotal: number;
  discount: number;
  total: number;
  promo_code: string | null;
  errors: { item: string; message: string }[];
  valid: boolean;
};

type PlacedOrder = { reference: string; total: number; status_display: string; payment_status: string };

const sameLine = (l: { id: string; size: string | null }, i: CartItem) => l.id === i.id && (l.size ?? "") === (i.size ?? "");

export function CartClient() {
  const { items, setQty, clear } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderingOpen, setOrderingOpen] = useState(false);
  const [mpesaOn, setMpesaOn] = useState(false);
  const [paid, setPaid] = useState(false);
  // `phone` is what the customer typed at checkout; M-Pesa needs it to prove the order is theirs.
  const [placed, setPlaced] = useState<{ order: PlacedOrder; phone: string } | null>(null);

  useEffect(() => {
    api<{ online_ordering_enabled: boolean; mpesa_enabled?: boolean }>("/settings/")
      .then((s) => {
        setOrderingOpen(s.online_ordering_enabled);
        setMpesaOn(Boolean(s.mpesa_enabled));
      })
      .catch(() => setOrderingOpen(false));
  }, []);

  // Server prices the cart: validates sizes + stock and applies the promo code.
  const itemsKey = JSON.stringify(items);
  useEffect(() => {
    if (items.length === 0) {
      setQuote(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api<Quote>("/cart/quote/", { method: "POST", body: JSON.stringify({ items, promo_code: promo }) })
      .then((q) => !cancelled && setQuote(q))
      .catch(() => !cancelled && setQuote(null))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsKey, promo]);

  if (placed) {
    return (
      <section className="mx-auto max-w-4xl px-5 pt-14">
        <h1 className="text-4xl font-bold uppercase">Order received</h1>
        <div className="rule-line mt-3 w-16" />
        <p className="mt-8 text-lg">
          Thank you! Your order reference is <strong>{placed.order.reference}</strong> ({formatPrice(placed.order.total)}).
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {paid
            ? "Your payment is confirmed. Our team will contact you about delivery or collection."
            : mpesaOn
              ? "Pay now with M-Pesa below, or skip it and our team will contact you to arrange payment and delivery."
              : "Our team will contact you to confirm availability, delivery and payment."}{" "}
          Keep your reference and phone number handy.
        </p>
        {mpesaOn && placed.order.payment_status !== "paid" && (
          <MpesaPayment reference={placed.order.reference} orderPhone={placed.phone} amount={placed.order.total} onPaid={() => setPaid(true)} />
        )}
        <Link href="/shop" className="mt-6 inline-block underline">Continue shopping</Link>
      </section>
    );
  }

  const promoError = quote?.errors.find((e) => e.item === "promo_code")?.message;

  return (
    <section className="mx-auto max-w-4xl px-5 pt-14">
      <h1 className="text-4xl font-bold uppercase">Your cart</h1>
      <div className="rule-line mt-3 w-16" />

      {items.length === 0 ? (
        <p className="mt-10 text-muted-foreground">
          Your cart is empty. <Link href="/shop" className="underline">Start shopping</Link>
        </p>
      ) : (
        <>
          <ul className="mt-10 divide-y border-y">
            {items.map((item) => {
              const line = quote?.lines.find((l) => sameLine(l, item));
              const problems = quote?.errors.filter((e) => e.item === item.id) ?? [];
              return (
                <li key={`${item.id}-${item.size ?? "default"}`} className="py-4">
                  <div className="flex items-center gap-4">
                    <StoreImage src={line?.image} alt={line?.name ?? item.id} width={80} height={80}
                      className="h-20 w-20 shrink-0 object-cover" sizes="80px" />

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{line?.name ?? item.id}</p>
                      {item.size && <p className="text-sm text-muted-foreground">Size {item.size}</p>}
                      <p className="text-sm">{line ? formatPrice(line.unit_price) : loading ? "Updating…" : "—"}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 border px-2 py-1" aria-label={`Quantity for ${line?.name ?? item.id}`}>
                      <button type="button" aria-label="Decrease quantity" className="p-1"
                        onClick={() => setQty(item.id, item.size, item.qty - 1)}>
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center" aria-live="polite">{item.qty}</span>
                      <button type="button" aria-label="Increase quantity" className="p-1"
                        onClick={() => setQty(item.id, item.size, item.qty + 1)}>
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {problems.map((p) => (
                    <p key={p.message} role="alert" className="mt-2 text-sm text-red-600">{p.message}</p>
                  ))}
                </li>
              );
            })}
          </ul>

          <form
            className="mt-6 flex flex-wrap items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setPromo(promoInput.trim());
            }}
          >
            <input value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="Promo code"
              aria-label="Promo code" className="h-10 border bg-transparent px-3 text-sm uppercase" />
            <button type="submit" className="h-10 border px-4 text-sm uppercase">Apply</button>
            {promo && (
              <button type="button" className="text-sm underline"
                onClick={() => { setPromo(""); setPromoInput(""); }}>
                Remove code
              </button>
            )}
            {promoError && <p role="alert" className="w-full text-sm text-red-600">{promoError}</p>}
          </form>

          <div className="mt-8 space-y-1 text-sm">
            {quote && quote.discount > 0 && (
              <>
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(quote.subtotal)}</span></div>
                <div className="flex justify-between text-green-700">
                  <span>Discount ({quote.promo_code})</span><span>− {formatPrice(quote.discount)}</span>
                </div>
              </>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between text-xl">
            <span className="font-display uppercase">Total</span>
            <span className="font-bold">{quote ? formatPrice(quote.total) : "—"}</span>
          </div>

          {orderingOpen ? (
            <Checkout items={items} promo={quote?.promo_code ?? ""} disabled={!quote?.valid || loading}
              onPlaced={(o, phone) => { clear(); setPlaced({ order: o, phone }); }} />
          ) : (
            <>
              <p className="mt-6 bg-secondary p-4 text-sm text-muted-foreground">
                Online checkout is coming soon. To place this order now, please reach us through the Contact page.
              </p>
              <Link href="/contact"
                className="mt-4 block w-full bg-primary py-4 text-center font-display uppercase tracking-widest text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                Contact us to order
              </Link>
            </>
          )}
        </>
      )}
    </section>
  );
}

function Checkout({ items, promo, disabled, onPlaced }: {
  items: CartItem[]; promo: string; disabled: boolean; onPlaced: (o: PlacedOrder, phone: string) => void;
}) {
  const [form, setForm] = useState({ customer_name: "", phone: "", email: "", delivery_method: "delivery", delivery_address: "", notes: "" });
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const field = "mt-1 h-11 w-full border bg-transparent px-3 text-sm";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrors([]);
    try {
      const order = await api<PlacedOrder>("/orders/", {
        method: "POST",
        body: JSON.stringify({ ...form, items, promo_code: promo }),
      });
      onPlaced(order, form.phone);
    } catch (err) {
      setErrors(errorMessages(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4 border-t pt-8">
      <h2 className="text-xl font-bold uppercase">Your details</h2>
      <label className="block text-sm">Full name
        <input required value={form.customer_name} onChange={set("customer_name")} autoComplete="name" className={field} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">Phone
          <input required value={form.phone} onChange={set("phone")} inputMode="tel" autoComplete="tel"
            placeholder="0712 345 678" className={field} />
        </label>
        <label className="block text-sm">Email (optional)
          <input type="email" value={form.email} onChange={set("email")} autoComplete="email" className={field} />
        </label>
      </div>
      <label className="block text-sm">Delivery or collection
        <select value={form.delivery_method} onChange={set("delivery_method")} className={field}>
          <option value="delivery">Delivery</option>
          <option value="collection">Collect from store</option>
        </select>
      </label>
      {form.delivery_method === "delivery" && (
        <label className="block text-sm">Delivery address
          <input required value={form.delivery_address} onChange={set("delivery_address")} className={field} />
        </label>
      )}
      <label className="block text-sm">Notes (names, numbers, badge…)
        <textarea value={form.notes} onChange={set("notes")} rows={3} className="mt-1 w-full border bg-transparent p-3 text-sm" />
      </label>

      {errors.length > 0 && (
        <ul role="alert" className="space-y-1 text-sm text-red-600">
          {errors.map((m) => <li key={m}>{m}</li>)}
        </ul>
      )}

      <button type="submit" disabled={disabled || busy}
        className="block w-full bg-primary py-4 text-center font-display uppercase tracking-widest text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50">
        {busy ? "Placing order…" : "Place order"}
      </button>
      <p className="text-xs text-muted-foreground">
        No payment is taken online. Our team will contact you to confirm and arrange payment.
      </p>
    </form>
  );
}
