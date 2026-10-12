"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFavorites = create()(
  persist(
    (set, get) => ({
      skus: [],
      toggle: (sku) =>
        set((state) => ({
          skus: state.skus.includes(sku)
            ? state.skus.filter((s) => s !== sku)
            : [...state.skus, sku],
        })),
      remove: (sku) => set((state) => ({ skus: state.skus.filter((s) => s !== sku) })),
      clear: () => set({ skus: [] }),
      isFavorite: (sku) => get().skus.includes(sku),
    }),
    { name: "dopamina-favorites" },
  ),
);

export function favCount(skus) {
  return skus.length;
}
