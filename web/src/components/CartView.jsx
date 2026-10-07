"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart, cartTotal } from "@/store/cart";
import { brl } from "@/lib/format";
import { trackRemoveFromCart, trackViewCart, toGaItem } from "@/lib/events";

export default function CartView() {
  const { items, remove, setQty, clear } = useCart();
  const value = cartTotal(items);
  const tracked = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (items.length > 0 && !tracked.current) {
      tracked.current = true;
      trackViewCart(items.map(toGaItem), value);
    }
  }, [items, value]);

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
        <div className="text-5xl">🛒</div>
        <p className="mt-3 text-white/70">seu vazio está bem organizado.</p>
        <Link href="/" className="mt-4 inline-block rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-5 py-2.5 text-sm font-bold">
          ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {items.map((item) => (
        <div key={item.sku} className="dopamine-card flex items-center gap-4 rounded-2xl p-4">
          <div className="text-3xl">{item.emoji}</div>
          <div className="flex-1">
            <div className="text-sm font-semibold">{item.name}</div>
            <div className="text-xs text-white/50">{brl(item.price)} · {item.category}</div>
          </div>
          <div className="flex items-center rounded-lg border border-white/15 text-sm">
            <button type="button" className="px-2.5 py-1" onClick={() => setQty(item.sku, item.qty - 1)}>−</button>
            <span className="w-6 text-center">{item.qty}</span>
            <button type="button" className="px-2.5 py-1" onClick={() => setQty(item.sku, item.qty + 1)}>+</button>
          </div>
          <div className="w-24 text-right text-sm font-bold">{brl(item.price * item.qty)}</div>
          <button
            type="button"
            className="text-xs text-white/40 hover:text-red-400"
            onClick={() => {
              remove(item.sku);
              trackRemoveFromCart(toGaItem(item));
            }}
          >
            remover
          </button>
        </div>
      ))}

      <div className="dopamine-card rounded-2xl p-4">
        <div className="flex justify-between text-sm text-white/60">
          <span>subtotal</span>
          <span>{brl(value)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm text-white/60">
          <span>frete de ilusão</span>
          <span>grátis (é mentira)</span>
        </div>
        <div className="mt-2 flex justify-between text-lg font-black">
          <span>total simulado</span>
          <span>{brl(value)}</span>
        </div>
        <button
          type="button"
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 py-3 font-bold hover:opacity-90"
          onClick={() => router.push("/checkout")}
          data-testid="go-checkout"
        >
          finalizar compra simulada
        </button>
        <button type="button" className="mt-2 w-full text-xs text-white/40 hover:text-white" onClick={clear}>
          esvaziar carrinho
        </button>
      </div>
    </div>
  );
}
