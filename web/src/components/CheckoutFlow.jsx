"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, cartTotal } from "@/store/cart";
import { brl, makeOrderCode } from "@/lib/format";
import { setStoredJson } from "@/lib/useStored";
import {
  trackAddPaymentInfo,
  trackAddShippingInfo,
  trackBeginCheckout,
  trackPurchase,
  toGaItem,
} from "@/lib/events";

const STEPS = ["seus dados", "entrega", "pagamento", "revisão"];
const FREE_SHIPPING = 150;

export default function CheckoutFlow() {
  const router = useRouter();
  const { items, clear } = useCart();
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

  const subtotal = value >= FREE_SHIPPING ? value : value + 19.9;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const next = () => {
    if (step === 0 && (!form.name.trim() || !form.email.includes("@"))) {
      setError("preencha nome e um e-mail com @ — só para o cenário");
      return;
    }
    if (step === 1 && !form.address.trim()) {
      setError("precisamos de um endereço (de mentira) para simular o envio");
      return;
    }
    setError(null);
    if (step === 1) trackAddShippingInfo(items.map(toGaItem), subtotal);
    if (step === 2) trackAddPaymentInfo(items.map(toGaItem), subtotal);
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const finish = async () => {
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
        body: JSON.stringify({ order, products: items }),
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
            className={`flex-1 rounded-lg px-2 py-2 text-center ${
              i < step ? "bg-emerald-500/20 text-emerald-300" : i === step ? "bg-white/15 font-bold" : "bg-white/5 text-white/40"
            }`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      <div className="dopamine-card mt-4 rounded-2xl p-5">
        {step === 0 && (
          <div className="space-y-3">
            <input className="w-full rounded-lg bg-white/5 p-3 outline-none ring-white/20 focus:ring" placeholder="nome (pode ser fake)" value={form.name} onChange={set("name")} data-testid="field-name" />
            <input className="w-full rounded-lg bg-white/5 p-3 outline-none ring-white/20 focus:ring" placeholder="email@exemplo.com" value={form.email} onChange={set("email")} data-testid="field-email" />
            <p className="text-xs text-white/40">nada é enviado — 0 PII, 0 spam, 0 cobrança.</p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <input className="w-full rounded-lg bg-white/5 p-3 outline-none ring-white/20 focus:ring" placeholder="endereço da fantasia" value={form.address} onChange={set("address")} data-testid="field-address" />
            <input className="w-full rounded-lg bg-white/5 p-3 outline-none ring-white/20 focus:ring" placeholder="cidade" value={form.city} onChange={set("city")} />
            <div className="rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-300">
              {value >= FREE_SHIPPING ? "frete grátis de ilusão liberado!" : `faltam ${brl(FREE_SHIPPING - value)} para o frete grátis (também de ilusão)`}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <select className="w-full rounded-lg bg-white/5 p-3 outline-none ring-white/20 focus:ring" value={form.payment} onChange={set("payment")} data-testid="field-payment">
              <option value="cartao-fantasia">cartão de fantasia •••• 4242</option>
              <option value="pix-de-mentira">pix de mentira (instantâneo)</option>
              <option value="boleto-invisivel">boleto invisível (3 dias úteis eternos)</option>
            </select>
            <input className="w-full rounded-lg bg-white/5 p-3 outline-none ring-white/20 focus:ring" placeholder="número do cartão inventado" value={form.card} onChange={set("card")} />
            <p className="text-xs text-amber-300/80">⚠️ nunca digite cartões reais aqui. é cenário.</p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2 text-sm">
            {items.map((i) => (
              <div key={i.sku} className="flex justify-between">
                <span>{i.qty}× {i.name}</span>
                <span>{brl(i.price * i.qty)}</span>
              </div>
            ))}
            <div className="flex justify-between text-white/50">
              <span>frete simulado</span>
              <span>{value >= FREE_SHIPPING ? "grátis" : brl(19.9)}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2 text-lg font-black">
              <span>total (não cobrado)</span>
              <span>{brl(subtotal)}</span>
            </div>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <div className="mt-5 flex gap-3">
          {step > 0 && (
            <button type="button" className="rounded-xl border border-white/15 px-4 py-2.5 text-sm" onClick={() => setStep((s) => s - 1)}>
              voltar
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              className="flex-1 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 py-2.5 font-bold hover:opacity-90"
              onClick={next}
              data-testid="checkout-next"
            >
              continuar
            </button>
          ) : (
            <button
              type="button"
              className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 font-black hover:opacity-90"
              onClick={finish}
              data-testid="checkout-finish"
            >
              confirmar pedido simulado
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
