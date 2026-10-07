"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCart = create()(
  persist(
    (set) => ({
      items: [],
      coupon: null,
      setCoupon: (coupon) => set({ coupon }),
      add: (product, qty = 1) =>
        set((state) => {
          const found = state.items.find((i) => i.sku === product.sku);
          const items = found
            ? state.items.map((i) => (i.sku === product.sku ? { ...i, qty: i.qty + qty } : i))
            : [
                ...state.items,
                {
                  sku: product.sku,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  emoji: product.emoji,
                  category: product.category,
                  qty,
                },
              ];
          return { items };
        }),
      remove: (sku) => set((state) => ({ items: state.items.filter((i) => i.sku !== sku) })),
      setQty: (sku, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.sku !== sku)
              : state.items.map((i) => (i.sku === sku ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [], coupon: null }),
    }),
    { name: "dopamina-cart" },
  ),
);

export function cartTotal(items) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function cartCount(items) {
  return items.reduce((sum, i) => sum + i.qty, 0);
}
