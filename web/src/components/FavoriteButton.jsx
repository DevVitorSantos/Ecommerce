"use client";

import { useFavorites } from "@/store/favorites";
import { trackAddToWishlist, trackRemoveFromWishlist, toGaItem } from "@/lib/events";

export default function FavoriteButton({ product, variant = "icon", className = "" }) {
  const skus = useFavorites((s) => s.skus);
  const toggle = useFavorites((s) => s.toggle);
  const active = skus.includes(product.sku);

  function onClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const item = toGaItem({ ...product, qty: 1 });
    if (active) {
      toggle(product.sku);
      trackRemoveFromWishlist(item);
    } else {
      toggle(product.sku);
      trackAddToWishlist(item);
    }
  }

  const label = active ? "Remover dos favoritos" : "Adicionar aos favoritos";

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        aria-label={label}
        title={label}
        data-testid={`fav-${product.slug}`}
        className={`nx-btn-ghost flex items-center justify-center gap-2 px-4 py-3 text-sm ${
          active ? "border-rose-300 text-rose-600" : "text-slate-700"
        } ${className}`}
      >
        <span className="text-lg leading-none">{active ? "❤️" : "🤍"}</span>
        <span>{active ? "Nos favoritos" : "Favoritar"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      data-testid={`fav-${product.slug}`}
      className={`flex h-9 w-9 items-center justify-center rounded-full border bg-white/90 text-base shadow-sm backdrop-blur transition hover:scale-105 ${
        active ? "border-rose-300" : "border-slate-200"
      } ${className}`}
    >
      {active ? "❤️" : "🤍"}
    </button>
  );
}
