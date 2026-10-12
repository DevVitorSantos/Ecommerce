"use client";

import Link from "next/link";
import { useFavorites, favCount } from "@/store/favorites";

export default function FavoritesButton() {
  const skus = useFavorites((s) => s.skus);
  const count = favCount(skus);

  return (
    <Link
      href="/favoritos"
      aria-label="Ver favoritos"
      className="relative flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:border-indigo-600"
      data-testid="favorites-button"
    >
      <span className="text-lg">❤️</span>
      <span className="hidden sm:inline">Favoritos</span>
      {count > 0 && (
        <span
          className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white"
          data-testid="favorites-count"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
