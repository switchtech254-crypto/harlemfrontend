import { api } from "./api";

export type OrderStatus = "pending" | "confirmed" | "processing" | "ready" | "completed" | "cancelled";

export type TrackedOrder = {
  reference: string;
  status: OrderStatus;
  status_display: string;
  payment_status: "unpaid" | "partial" | "paid";
  payment_status_display: string;
  delivery_method: "delivery" | "collection";
  delivery_method_display: string;
  subtotal: number;
  discount_total: number;
  total: number;
  amount_paid: number;
  balance_due: number;
  created_at: string;
  updated_at: string;
  /** Private token for this order: lets the page refresh itself without asking for the phone again. */
  tracking_token: string;
  items: {
    product_name: string;
    size: string;
    quantity: number;
    unit_price: number;
    line_total: number;
    customization: Record<string, string>;
  }[];
  /** When each status was reached. */
  timeline: { status: OrderStatus; at: string }[];
  payments: { method: string; amount: number; reference: string; paid_at: string }[];
};

/** Prove it's your order with the phone number used, OR with the private token from the email link. */
export const trackOrder = (body: { reference: string; phone?: string; token?: string }) =>
  api<TrackedOrder>("/orders/track/", { method: "POST", body: JSON.stringify(body) });
