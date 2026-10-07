"use client";

import Link from "next/link";
import { useCart, cartCount } from "@/store/cart";

export default function CartButton() {
  const items = useCart((s) => s.items);
  const count = cartCount(items);

  return (
    <Link
      href="/carrinho"
      className="relative rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
      data-testid="cart-button"
    >
      carrinho
      {count > 0 && (
        <span
          className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full badge-flash px-1 text-[11px] font-bold text-black"
          data-testid="cart-count"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
