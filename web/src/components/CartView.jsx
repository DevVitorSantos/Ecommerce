"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, cartTotal } from "@/store/cart";
import { brl } from "@/lib/format";
import { trackApplyCoupon, trackRemoveFromCart, trackViewCart, toGaItem } from "@/lib/events";
import ProductImage from "@/components/ProductImage";

const FREE_SHIPPING = 150;
const SHIPPING = 19.9;

export default function CartView() {
  const { items, remove, setQty, clear, coupon, setCoupon } = useCart();
  const value = cartTotal(items);
  const tracked = useRef(false);
  const router = useRouter();
  const [couponInput, setCouponInput] = useState(coupon || "");
  const couponOk = coupon === "DOPAMINA10";
  const firedCouponRef = useRef(false); // guarda síncrona: cliques no mesmo tick não duplicam

  useEffect(() => {
    if (items.length > 0 && !tracked.current) {
      tracked.current = true;
      trackViewCart(items.map(toGaItem), value);
    }
  }, [items, value]);

  if (items.length === 0) {
    return (
      <div className="nx-card mt-8 p-10 text-center">
        <div className="text-5xl">🛒</div>
        <p className="mt-3 font-semibold text-slate-700">Seu carrinho está vazio.</p>
        <p className="text-sm text-slate-400">Um vazio bem organizado, pelo menos.</p>
        <Link href="/" className="nx-btn-primary mt-4 inline-block px-5 py-2.5 text-sm">
          Ver produtos
        </Link>
      </div>
    );
  }

  const discountCoupon = couponOk ? value * 0.1 : 0;
  const shipping = value - discountCoupon >= FREE_SHIPPING ? 0 : SHIPPING;
  const total = value - discountCoupon + shipping;

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.sku} className="nx-card flex items-center gap-4 p-4">
            <ProductImage product={item} className="h-16 w-16 shrink-0 rounded-xl text-3xl" />
            <div className="flex-1">
              <div className="text-sm font-bold text-slate-900">{item.name}</div>
              <div className="text-xs text-slate-400">{brl(item.price)} · {item.category}</div>
            </div>
            <div className="flex items-center rounded-lg border border-slate-200 text-sm">
              <button type="button" className="px-2.5 py-1 text-slate-500" onClick={() => setQty(item.sku, item.qty - 1)}>−</button>
              <span className="w-6 text-center font-bold">{item.qty}</span>
              <button type="button" className="px-2.5 py-1 text-slate-500" onClick={() => setQty(item.sku, item.qty + 1)}>+</button>
            </div>
            <div className="w-24 text-right text-sm font-extrabold text-slate-900">{brl(item.price * item.qty)}</div>
            <button
              type="button"
              className="text-xs text-slate-400 hover:text-red-500"
              onClick={() => {
                remove(item.sku);
                trackRemoveFromCart(toGaItem(item));
              }}
            >
              remover
            </button>
          </div>
        ))}
        <button type="button" className="text-xs text-slate-400 hover:text-slate-600" onClick={clear}>
          esvaziar carrinho
        </button>
      </div>

      <div className="nx-card h-fit p-5">
        <h2 className="font-extrabold text-slate-900">Resumo do pedido</h2>
        <div className="mt-3 flex gap-2">
          <input
            className="nx-input"
            placeholder="Cupom (tente DOPAMINA10)"
            value={couponInput}
            onChange={(e) => {
              setCouponInput(e.target.value);
              setCoupon(null);
              firedCouponRef.current = false;
            }}
          />
          <button
            type="button"
            className="nx-btn-ghost whitespace-nowrap px-3 text-sm"
            onClick={() => {
              const ok = couponInput.trim().toUpperCase() === "DOPAMINA10";
              if (ok && !firedCouponRef.current) {
                firedCouponRef.current = true;
                trackApplyCoupon("DOPAMINA10", value * 0.1, value);
              }
              setCoupon(ok ? "DOPAMINA10" : null);
            }}
          >
            Aplicar
          </button>
        </div>
        {couponOk && <p className="mt-1 text-xs font-semibold text-emerald-600">✓ Cupom aplicado: -10% de mentira</p>}
        <div className="mt-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>{brl(value)}</span>
          </div>
          {discountCoupon > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Cupom DOPAMINA10</span>
              <span>-{brl(discountCoupon)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-500">
            <span>Frete</span>
            <span>{shipping === 0 ? "Grátis" : brl(shipping)}</span>
          </div>
          {shipping > 0 && (
            <p className="text-xs text-slate-400">
              Faltam {brl(FREE_SHIPPING - (value - discountCoupon))} para o frete grátis
            </p>
          )}
          <div className="flex justify-between border-t border-slate-100 pt-2 text-lg font-extrabold text-slate-900">
            <span>Total</span>
            <span>{brl(total)}</span>
          </div>
        </div>
        <button
          type="button"
          className="nx-btn-primary mt-4 w-full py-3 font-bold"
          onClick={() => router.push("/checkout")}
          data-testid="go-checkout"
        >
          Finalizar compra
        </button>
        <p className="mt-2 text-center text-xs text-slate-400">nada será cobrado. é tudo cenário.</p>
      </div>
    </div>
  );
}
