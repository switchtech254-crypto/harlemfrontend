
"use client";

import { useEffect, useState } from "react";

import { errorMessages } from "@/app/lib/api";
import {
  getMpesaStatus,
  startMpesaPayment,
  type MpesaPaymentState,
} from "@/app/lib/payments";
import { formatPrice } from "@/app/lib/products";

type Phase = "idle" | "sending" | "waiting" | "stalled" | "done";

const POLL_EVERY_MS = 3000;
const STOP_AFTER_MS = 120_000;

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
        ...(payPhone.trim() && payPhone.trim() !== orderPhone
          ? { pay_phone: payPhone.trim() }
          : {}),
      });

      setState(started);
      setCheckoutId(started.checkout_request_id);
      setPhase(started.status === "pending" ? "waiting" : "done");
    } catch (err) {
      setErrors(errorMessages(err));
      setPhase("idle");
    }
  }

  // Poll while waiting for Safaricom confirmation.
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

          if (next.status === "success") {
            onPaid?.(next);
          }

          return;
        }
      } catch {
        // A failed poll does not mean the payment failed.
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

  const field =
    "mt-2 h-12 w-full border border-green-200 bg-white px-4 text-sm text-gray-900 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/15";

  // Successful payment.
  if (phase === "done" && state?.status === "success") {
    return (
      <div
        role="status"
        className="mt-8 overflow-hidden rounded-xl border border-green-200 bg-green-50"
      >
        <div className="bg-green-800 px-5 py-4 text-white">
          <p className="text-lg font-bold">Payment received!</p>
          <p className="mt-1 text-sm text-green-100">
            Your M-Pesa payment was successful.
          </p>
        </div>

        <div className="p-5 text-green-950">
          <p className="text-2xl font-bold">
            {formatPrice(state.amount)}
          </p>

          {state.receipt && (
            <p className="mt-2 text-sm">
              M-Pesa receipt: <strong>{state.receipt}</strong>
            </p>
          )}

          <p className="mt-3 text-sm">
            Your order is confirmed. Thank you for shopping with Harlem Store!
          </p>
        </div>
      </div>
    );
  }

  return (
    <section
      className="mt-8 overflow-hidden rounded-xl border border-green-200 bg-white shadow-sm"
      aria-labelledby="mpesa-heading"
    >
      {/* Green payment header */}
      <div className="bg-green-800 px-5 py-5 text-white sm:px-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-200">
              Secure payment
            </p>

            <h2
              id="mpesa-heading"
              className="mt-2 text-2xl font-bold uppercase tracking-wide"
            >
              Pay with M-Pesa
            </h2>

            <p className="mt-1 text-sm text-green-100">
              Fast, convenient mobile money payment.
            </p>
          </div>

          {/* M-Pesa logo placeholder */}
          <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-white/25 bg-white p-2">
            
              
              <img
                src="/images/M-PESA_LOGO-01.svg (1).webp"
                alt="M-Pesa"
                className="max-h-full max-w-full object-contain"
              />
           

            {/* <span className="text-center text-xs font-bold text-green-800">
              M-PESA
              <span className="mt-1 block text-[9px] font-normal text-gray-500">
                LOGO
              </span>
            </span> */}
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-7">
        {/* Amount panel */}
        <div className="rounded-lg border border-green-100 bg-green-50 p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-800">
            Amount to pay
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-green-950 sm:text-4xl">
            {formatPrice(amount)}
          </p>

          <p className="mt-2 text-xs text-green-800/70">
            Order reference: {reference}
          </p>
        </div>

        <p className="text-sm leading-6 text-gray-600">
          Enter the phone number registered with M-Pesa. We&apos;ll send a
          payment request directly to your phone. Enter your M-Pesa PIN
          to complete the transaction.
        </p>

        {(phase === "idle" || phase === "sending") && (
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-800">
              M-Pesa phone number

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
              <p role="alert" className="text-sm text-red-600">
                {state.message}
              </p>
            )}

            {errors.length > 0 && (
              <ul role="alert" className="space-y-1 text-sm text-red-600">
                {errors.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            )}

            <button
              type="button"
              onClick={pay}
              disabled={phase === "sending" || !payPhone.trim()}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-green-700 px-6 text-base font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-green-800 hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:h-16 sm:text-lg"
            >
              {phase === "sending" ? (
                <>
                  <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Sending request...
                </>
              ) : (
                <>
                  Pay {formatPrice(amount)}
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-500">
              You will receive an M-Pesa payment prompt on your phone.
            </p>
          </div>
        )}

        {/* Waiting for payment */}
        {phase === "waiting" && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-lg border border-green-200 bg-green-50 p-5"
          >
            <div className="flex items-center gap-3">
              <span className="size-3 animate-pulse rounded-full bg-green-600" />

              <p className="font-bold text-green-900">
                Check your phone
              </p>
            </div>

            <p className="mt-3 text-sm leading-6 text-green-900">
              Enter your M-Pesa PIN to pay {formatPrice(amount)}.
              We&apos;re waiting for Safaricom to confirm your payment.
            </p>

            <p className="mt-4 text-center text-xs font-semibold uppercase tracking-widest text-green-700">
              Waiting for confirmation...
            </p>
          </div>
        )}

        {/* Payment confirmation delayed */}
        {phase === "stalled" && (
          <div
            role="status"
            className="rounded-lg border border-amber-200 bg-amber-50 p-5"
          >
            <p className="font-bold text-amber-900">
              Confirmation is taking longer than expected
            </p>

            <p className="mt-2 text-sm leading-6 text-amber-900">
              If you already entered your PIN, please{" "}
              <strong>do not pay again</strong>. Your transaction may still
              be processing.
            </p>

            <button
              type="button"
              onClick={() => setPhase("waiting")}
              className="mt-4 h-11 rounded-lg border border-green-700 px-5 text-sm font-semibold text-green-800 transition-colors hover:bg-green-100"
            >
              Check again
            </button>
          </div>
        )}

        {/* Failed or cancelled payment */}
        {phase === "done" && state && state.status !== "success" && (
          <div className="space-y-3">
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            >
              {state.message}
            </div>

            <button
              type="button"
              onClick={() => {
                setPhase("idle");
                setErrors([]);
              }}
              className="h-12 w-full rounded-lg border border-green-700 font-semibold text-green-800 transition-colors hover:bg-green-50"
            >
              Try again
            </button>
          </div>
        )}

        {/* Payment reassurance */}
        <div className="flex items-start gap-3 border-t border-green-100 pt-5">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-green-100 text-green-800">
            <span className="text-lg font-bold">✓</span>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800">
              Simple and convenient payment
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Your payment is verified through Safaricom before your order
              is marked as paid. Never share your M-Pesa PIN with anyone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
