"use client";

import { useEffect, useState } from "react";
import { brl, discount } from "@/lib/format";
import { trackAddToCart, trackViewItem, toGaItem } from "@/lib/events";
import { useCart } from "@/store/cart";

export default function ProductDetail({ product }) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const off = discount(product.price, product.price_list);

  useEffect(() => {
    trackViewItem(toGaItem({ ...product, qty: 1 }));
  }, [product]);

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-2">
      <div className="flex h-72 items-center justify-center rounded-3xl bg-gradient-to-br from-fuchsia-500/25 via-violet-500/10 to-cyan-400/10 text-9xl md:h-96">
        {product.emoji}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wide text-white/50">{product.category}</div>
        <h1 className="mt-1 text-3xl font-black">{product.name}</h1>
        <p className="mt-3 text-white/70">{product.description}</p>
        <div className="mt-4 text-sm text-white/50">
          ★ {product.rating.toFixed(1)} · {product.sold_fake.toLocaleString("pt-BR")} vendidos ·{" "}
          {product.tags.join(" · ")}
        </div>
        <div className="mt-6 flex items-end gap-3">
          <span className="text-4xl font-black">{brl(product.price)}</span>
          {off > 0 && (
            <>
              <span className="text-sm text-white/40 line-through">{brl(product.price_list)}</span>
              <span className="badge-flash rounded px-2 py-1 text-xs font-bold text-black">-{off}%</span>
            </>
          )}
        </div>
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/60">
          oferta relâmpago termina em <strong className="text-white">04:59</strong> (é teatro, calma)
        </div>
        <div className="mt-6 flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-white/15">
            <button type="button" className="px-3 py-2 text-lg" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              −
            </button>
            <span className="w-8 text-center text-sm">{qty}</span>
            <button type="button" className="px-3 py-2 text-lg" onClick={() => setQty((q) => q + 1)}>
              +
            </button>
          </div>
          <button
            type="button"
            className="flex-1 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 py-3 font-bold hover:opacity-90"
            onClick={() => {
              add(product, qty);
              trackAddToCart(toGaItem({ ...product, qty }));
              setAdded(true);
              setTimeout(() => setAdded(false), 2000);
            }}
            data-testid="add-to-cart"
          >
            {added ? "adicionado ✓" : "adicionar ao carrinho"}
          </button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-white/60">
          {["entrega em 5s", "frete de ilusão", "troca imaginária"].map((t) => (
            <div key={t} className="rounded-lg bg-white/5 py-2">
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
