"use client";

import Link from "next/link";
import { brl, discount } from "@/lib/format";
import { trackAddToCart, trackSelectItem, toGaItem } from "@/lib/events";
import { useCart } from "@/store/cart";

export default function ProductCard({ product }) {
  const add = useCart((s) => s.add);
  const off = discount(product.price, product.price_list);

  return (
    <div className="dopamine-card group flex flex-col rounded-2xl p-4 transition hover:-translate-y-1 hover:border-white/25">
      <Link href={`/produto/${product.slug}`} onClick={() => trackSelectItem(toGaItem({ ...product, qty: 1 }))}>
        <div className="mb-3 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/20 via-violet-500/10 to-cyan-400/10 text-6xl">
          {product.emoji}
        </div>
        <div className="text-xs uppercase tracking-wide text-white/50">{product.category}</div>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold">{product.name}</h3>
        <div className="mt-1 text-xs text-white/50">★ {product.rating.toFixed(1)} · {product.sold_fake.toLocaleString("pt-BR")} vendidos</div>
      </Link>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-lg font-black">{brl(product.price)}</span>
        {off > 0 && <span className="text-xs text-white/40 line-through">{brl(product.price_list)}</span>}
        {off > 0 && <span className="badge-flash ml-auto rounded px-1.5 py-0.5 text-[11px] font-bold text-black">-{off}%</span>}
      </div>
      <button
        type="button"
        className="mt-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 py-2 text-sm font-bold hover:opacity-90"
        onClick={() => {
          add(product);
          trackAddToCart(toGaItem({ ...product, qty: 1 }));
        }}
        data-testid={`add-${product.slug}`}
      >
        comprar agora
      </button>
    </div>
  );
}
