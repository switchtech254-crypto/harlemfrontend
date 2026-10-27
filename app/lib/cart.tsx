import { useSyncExternalStore, type ReactNode } from "react";

export type CartItem = { id: string; size?: string | undefined; qty: number };

const KEY = "harlem-cart";
const EMPTY: CartItem[] = [];
let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { items = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { items = []; }
}
function save(next: CartItem[]) {
  items = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  load();
  listeners.add(l);
  l();
  return () => { listeners.delete(l); };
}

// Kept for compatibility; the cart no longer needs a provider.
export function CartProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useCart() {
  const current = useSyncExternalStore(subscribe, () => items, () => EMPTY);
  const add = (id: string, size?: string) => {
    const f = items.find((i) => i.id === id && i.size === size);
    save(f ? items.map((i) => (i === f ? { ...i, qty: i.qty + 1 } : i)) : [...items, { id, size, qty: 1 }]);
  };
  const setQty = (id: string, size: string | undefined, qty: number) =>
    save(qty <= 0
      ? items.filter((i) => !(i.id === id && i.size === size))
      : items.map((i) => (i.id === id && i.size === size ? { ...i, qty } : i)));
  const clear = () => save([]); // NEW: used after a successful order
  return { items: current, add, setQty, clear, count: current.reduce((s, i) => s + i.qty, 0) };
}
