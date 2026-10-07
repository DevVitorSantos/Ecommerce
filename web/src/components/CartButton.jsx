"use client";

import Link from "next/link";
import { useCart, cartCount, cartTotal } from "@/store/cart";
import { brl } from "@/lib/format";

export default function CartButton() {
  const items = useCart((s) => s.items);
  const count = cartCount(items);
  const total = cartTotal(items);

  return (
    <Link
      href="/carrinho"
      className="relative flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:border-indigo-600"
      data-testid="cart-button"
    >
      <span className="text-lg">🛍️</span>
      <span className="hidden sm:inline">
        {count > 0 ? `Total: ${brl(total)}` : "Carrinho"}
      </span>
      {count > 0 && (
        <span
          className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[11px] font-bold text-white"
          data-testid="cart-count"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
