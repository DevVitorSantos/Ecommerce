"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useFavorites } from "@/store/favorites";
import ProductCard from "@/components/ProductCard";

export default function FavoritesView({ products }) {
  const skus = useFavorites((s) => s.skus);
  const clear = useFavorites((s) => s.clear);

  const favorites = skus
    .map((sku) => products.find((p) => p.sku === sku))
    .filter(Boolean);

  if (favorites.length === 0) {
    return (
      <div className="nx-card mt-8 p-10 text-center">
        <div className="text-5xl">🤍</div>
        <p className="mt-3 font-semibold text-slate-700">Você ainda não favoritou nada.</p>
        <p className="text-sm text-slate-400">
          Toque no coração de um produto para guardar de mentirinha.
        </p>
        <Link href="/" className="nx-btn-primary mt-4 inline-block px-5 py-2.5 text-sm">
          Ver produtos
        </Link>
      </div>
    );
  }

  const count = favorites.length;

  return (
    <>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {count} {count === 1 ? "produto salvo" : "produtos salvos"}
        </p>
        <button type="button" className="text-xs text-slate-400 hover:text-slate-600" onClick={clear}>
          limpar favoritos
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {favorites.map((p) => (
          <ProductCard key={p.sku} product={p} />
        ))}
      </div>
    </>
  );
}
