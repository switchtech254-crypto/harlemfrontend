"use client";

import { useEffect, useState } from "react";

import { errorMessages } from "@/app/lib/api";
import { getMpesaStatus, startMpesaPayment, type MpesaPaymentState } from "@/app/lib/payments";
import { formatPrice } from "@/app/lib/products";

type Phase = "idle" | "sending" | "waiting" | "stalled" | "done";

const POLL_EVERY_MS = 3000;
const STOP_AFTER_MS = 120_000;

/**
 * "Pay with M-Pesa" for an order that was just placed.
 *   idle -> (customer taps Pay) -> sending -> waiting for the PIN on their phone -> done
 * While waiting, it polls our API every 3s; the API learns the result from Safaricom's callback
 * (or by asking Safaricom itself if the callback is late).
 */
export function MpesaPayment({
  reference,
  orderPhone,
  amount,
  onPaid,
}: {
  reference: string;
  orderPhone: string;
  amount: number;
  onPaid?: (state: MpesaPaymentState) => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [payPhone, setPayPhone] = useState(orderPhone);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [state, setState] = useState<MpesaPaymentState | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  async function pay() {
    setPhase("sending");
    setErrors([]);
    try {
      const started = await startMpesaPayment({
        reference,
        phone: orderPhone,
        ...(payPhone.trim() && payPhone.trim() !== orderPhone ? { pay_phone: payPhone.trim() } : {}),
      });
      setState(started);
      setCheckoutId(started.checkout_request_id);
      setPhase(started.status === "pending" ? "waiting" : "done");
    } catch (err) {
      setErrors(errorMessages(err));
      setPhase("idle");
    }
  }

  // Poll while waiting.
  useEffect(() => {
    if (phase !== "waiting" || !checkoutId) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    const startedAt = Date.now();

    const tick = async () => {
      try {
        const next = await getMpesaStatus(checkoutId);
        if (stopped) return;
        setState(next);
        if (next.status !== "pending") {
          setPhase("done");
          if (next.status === "success") onPaid?.(next);
          return;
        }
      } catch {
        /* a failed poll is not a failed payment: keep trying */
      }
      if (Date.now() - startedAt > STOP_AFTER_MS) {
        if (!stopped) setPhase("stalled");
        return;
      }
      timer = setTimeout(tick, POLL_EVERY_MS);
    };

    timer = setTimeout(tick, 2500);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, checkoutId]);

  const field = "mt-1 h-11 w-full border bg-transparent px-3 text-sm";

  if (phase === "done" && state?.status === "success") {
    return (
      <div role="status" className="mt-8 border border-green-600/40 bg-green-50 p-5 text-green-900">
        <p className="text-lg font-semibold">Payment received</p>
        <p className="mt-1 text-sm">
          {formatPrice(state.amount)} paid by M-Pesa
          {state.receipt ? (
            <>
              . Receipt <strong>{state.receipt}</strong>
            </>
          ) : null}
          . Your order is confirmed.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-8 border p-5" aria-labelledby="mpesa-heading">
      <h2 id="mpesa-heading" className="text-xl font-bold">Pay with M-Pesa</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        We&apos;ll send a payment request for <strong className="text-foreground">{formatPrice(amount)}</strong> to your phone.
        You&apos;ll enter your M-Pesa PIN there.
      </p>

      {(phase === "idle" || phase === "sending") && (
        <div className="mt-4 space-y-3">
          <label className="block text-sm">M-Pesa phone number
            <input
              value={payPhone}
              onChange={(e) => setPayPhone(e.target.value)}
              inputMode="tel"
              autoComplete="tel"
              placeholder="0712 345 678"
              className={field}
            />
          </label>

          {state && state.status !== "pending" && (
            <p role="alert" className="text-sm text-red-600">{state.message}</p>
          )}
          {errors.length > 0 && (
            <ul role="alert" className="space-y-1 text-sm text-red-600">
              {errors.map((m) => <li key={m}>{m}</li>)}
            </ul>
          )}

          <button
            type="button"
            onClick={pay}
            disabled={phase === "sending" || !payPhone.trim()}
            className="h-12 w-full bg-primary px-6 font-display uppercase tracking-widest text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            {phase === "sending"
              ? "Sending request…"
              : state && state.status !== "pending"
                ? `Try again · ${formatPrice(amount)}`
                : `Pay ${formatPrice(amount)} with M-Pesa`}
          </button>
        </div>
      )}

      {phase === "waiting" && (
        <div role="status" aria-live="polite" className="mt-4 bg-secondary p-4 text-sm">
          <p className="font-semibold">Check your phone</p>
          <p className="mt-1">
            Enter your M-Pesa PIN to pay {formatPrice(amount)}. We&apos;ll confirm here as soon as it goes through.
          </p>
          <p className="mt-2 animate-pulse text-xs text-muted-foreground">Waiting for confirmation…</p>
        </div>
      )}

      {phase === "stalled" && (
        <div role="status" className="mt-4 bg-secondary p-4 text-sm">
          <p className="font-semibold">We haven&apos;t received confirmation yet</p>
          <p className="mt-1">
            If you already entered your PIN, please <strong>don&apos;t pay again</strong>. We&apos;ll confirm your order
            shortly. You can also check again now.
          </p>
          <button type="button" onClick={() => setPhase("waiting")} className="mt-3 h-10 border px-4 text-sm uppercase">
            Check again
          </button>
        </div>
      )}

      {phase === "done" && state && state.status !== "success" && (
        <div className="mt-4 space-y-3">
          <p role="alert" className="text-sm text-red-600">{state.message}</p>
          <button
            type="button"
            onClick={() => { setPhase("idle"); setErrors([]); }}
            className="h-11 border px-5 text-sm uppercase"
          >
            Try again
          </button>
        </div>
      )}
    </section>
  );
}
