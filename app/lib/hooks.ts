"use client";

// Browser-side data hooks used by the header and footer (which live in client components).
import { useEffect, useState } from "react";

import { api } from "./api";
import type { CartItem } from "./cart";
import type { Paginated, Product } from "./products";

/** Live search-as-you-type against the API (debounced, stale requests are cancelled). */
export function useProductSearch(term: string) {
  const [state, setState] = useState<{ results: Product[]; count: number; loading: boolean }>({
    results: [],
    count: 0,
    loading: false,
  });

  useEffect(() => {
    const q = term.trim().slice(0, 150);
    if (!q) {
      setState({ results: [], count: 0, loading: false });
      return;
    }

    setState((s) => ({ ...s, loading: true }));
    const controller = new AbortController();
    const timer = setTimeout(() => {
      const qs = new URLSearchParams({ q, page_size: "5" });
      api<Paginated<Product>>(`/products/?${qs}`, { signal: controller.signal })
        .then((r) => setState({ results: r.results, count: r.count, loading: false }))
        .catch(() => {
          if (!controller.signal.aborted) setState({ results: [], count: 0, loading: false });
        });
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term]);

  return state;
}

/** Cart subtotal priced by the server (never from client-side prices). */
export function useCartSubtotal(items: CartItem[]): number {
  const [subtotal, setSubtotal] = useState(0);
  const key = JSON.stringify(items);

  useEffect(() => {
    if (items.length === 0) {
      setSubtotal(0);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      api<{ subtotal: number }>("/cart/quote/", {
        method: "POST",
        body: JSON.stringify({ items }),
        signal: controller.signal,
      })
        .then((q) => setSubtotal(q.subtotal))
        .catch(() => {});
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return subtotal;
}