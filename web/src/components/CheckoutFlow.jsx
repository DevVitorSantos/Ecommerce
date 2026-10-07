"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, cartTotal } from "@/store/cart";
import { brl, makeOrderCode } from "@/lib/format";
import { setStoredJson } from "@/lib/useStored";
import { getGaClientId, getGaSessionId } from "@/lib/identity";
import {
  trackAddPaymentInfo,
  trackAddShippingInfo,
  trackBeginCheckout,
  trackPurchase,
  toGaItem,
} from "@/lib/events";

const STEPS = ["Identificação", "Entrega", "Pagamento", "Revisão"];
const FREE_SHIPPING = 150;
const SHIPPING = 19.9;

export default function CheckoutFlow() {
  const router = useRouter();
  const { items, clear, coupon } = useCart();
  const value = cartTotal(items);
  const [step, setStep] = useState(0);
  const startedRef = useRef(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    payment: "cartao-fantasia",
    card: "",
  });

  useEffect(() => {
    if (items.length > 0 && !startedRef.current) {
      startedRef.current = true;
      trackBeginCheckout(items.map(toGaItem), value);
    }
  }, [items, value]);

  useEffect(() => {
    if (items.length === 0 && !error) router.replace("/carrinho");
  }, [items, error, router]);

  if (items.length === 0) return null;

  const discountCoupon = coupon === "DOPAMINA10" ? value * 0.1 : 0;
  const shipping = value - discountCoupon >= FREE_SHIPPING ? 0 : SHIPPING;
  const subtotal = value - discountCoupon + shipping;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const next = () => {
    if (step === 0 && (!form.name.trim() || !form.email.includes("@"))) {
      setError("Preencha nome e um e-mail com @ — só para o cenário.");
      return;
    }
    if (step === 1 && !form.address.trim()) {
      setError("Precisamos de um endereço (de mentira) para simular o envio.");
      return;
    }
    setError(null);
    if (step === 1) trackAddShippingInfo(items.map(toGaItem), subtotal);
    if (step === 2) trackAddPaymentInfo(items.map(toGaItem), subtotal);
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const finish = async () => {
    const [userPseudoId, sessionId] = await Promise.all([getGaClientId(), getGaSessionId()]);
    const order = {
      code: makeOrderCode(),
      value: subtotal,
      items: items.reduce((n, i) => n + i.qty, 0),
      createdAt: new Date().toISOString(),
      name: form.name,
      email: form.email,
      address: `${form.address}, ${form.city || "Cidade Fictícia"}`,
      payment: form.payment,
      campaign: sessionStorage.getItem("dopamina-utm") || undefined,
    };
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order,
          products: items,
          analytics: { user_pseudo_id: userPseudoId, session_id: sessionId },
        }),
      });
    } catch {
      // sem Supabase configurado o pedido segue apenas no cliente
    }
    trackPurchase(order.code, items.map(toGaItem), subtotal);
    setStoredJson("dopamina-last-order", order);
    setStoredJson(`dopamina-order-${order.code}`, { order, products: items });
    clear();
    router.push("/confirmacao");
  };

  return (
    <div className="mt-6">
      <ol className="flex gap-2 text-xs">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={`flex-1 rounded-lg px-2 py-2 text-center font-semibold ${
              i < step
                ? "bg-emerald-100 text-emerald-700"
                : i === step
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-400"
            }`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      <div className="nx-card mt-4 p-5">
        {step === 0 && (
          <div className="space-y-3">
            <input className="nx-input" placeholder="Nome (pode ser fake)" value={form.name} onChange={set("name")} data-testid="field-name" />
            <input className="nx-input" placeholder="email@exemplo.com" value={form.email} onChange={set("email")} data-testid="field-email" />
            <p className="text-xs text-slate-400">Nada é enviado — 0 PII, 0 spam, 0 cobrança.</p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <input className="nx-input" placeholder="Endereço da fantasia" value={form.address} onChange={set("address")} data-testid="field-address" />
            <input className="nx-input" placeholder="Cidade" value={form.city} onChange={set("city")} />
            <div className="rounded-lg bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
              {shipping === 0
                ? "🎉 Frete grátis de ilusão liberado!"
                : `Faltam ${brl(FREE_SHIPPING - (value - discountCoupon))} para o frete grátis (também de ilusão)`}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <select className="nx-input" value={form.payment} onChange={set("payment")} data-testid="field-payment">
              <option value="cartao-fantasia">Cartão de fantasia •••• 4242</option>
              <option value="pix-de-mentira">Pix de mentira (instantâneo)</option>
              <option value="boleto-invisivel">Boleto invisível (3 dias úteis eternos)</option>
            </select>
            <input className="nx-input" placeholder="Número do cartão inventado" value={form.card} onChange={set("card")} />
            <p className="rounded-lg bg-amber-50 p-3 text-xs font-semibold text-amber-700">
              ⚠️ Nunca digite cartões reais aqui. É cenário.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2 text-sm">
            {items.map((i) => (
              <div key={i.sku} className="flex justify-between text-slate-700">
                <span>{i.qty}× {i.name}</span>
                <span className="font-semibold">{brl(i.price * i.qty)}</span>
              </div>
            ))}
            {discountCoupon > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Cupom DOPAMINA10</span>
                <span>-{brl(discountCoupon)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Frete simulado</span>
              <span>{shipping === 0 ? "Grátis" : brl(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-lg font-extrabold text-slate-900">
              <span>Total (não cobrado)</span>
              <span>{brl(subtotal)}</span>
            </div>
          </div>
        )}

        {error && <p className="mt-3 text-sm font-semibold text-red-500">{error}</p>}

        <div className="mt-5 flex gap-3">
          {step > 0 && (
            <button type="button" className="nx-btn-ghost px-4 py-2.5 text-sm" onClick={() => setStep((s) => s - 1)}>
              Voltar
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              className="nx-btn-primary flex-1 py-2.5 font-bold"
              onClick={next}
              data-testid="checkout-next"
            >
              Continuar
            </button>
          ) : (
            <button
              type="button"
              className="flex-1 rounded-lg bg-emerald-600 py-2.5 font-bold text-white hover:bg-emerald-700"
              onClick={finish}
              data-testid="checkout-finish"
            >
              Confirmar pedido
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
