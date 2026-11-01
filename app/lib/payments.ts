import { api } from "./api";

export type MpesaStatus = "pending" | "success" | "failed" | "cancelled" | "timeout";

export type MpesaPaymentState = {
  checkout_request_id: string;
  status: MpesaStatus;
  /** Customer-friendly sentence for the current state. */
  message: string;
  receipt: string | null;
  amount: number;
  /** True when a prompt sent moments ago was reused instead of sending a second one. */
  resumed?: boolean;
  order: { reference: string; status: string; payment_status: string; balance_due: number };
};

/** Sends the M-Pesa prompt. `phone` is the order's phone (proves it's the customer's order). */
export const startMpesaPayment = (body: { reference: string; phone: string; pay_phone?: string }) =>
  api<MpesaPaymentState>("/payments/mpesa/stk-push/", { method: "POST", body: JSON.stringify(body) });

export const getMpesaStatus = (checkoutRequestId: string) =>
  api<MpesaPaymentState>(`/payments/mpesa/status/${encodeURIComponent(checkoutRequestId)}/`);
