"use client";

import { useEffect, useState } from "react";
import { useStoredJson } from "@/lib/useStored";

const STEPS = [
  ["Pedido aceito pelo sistema", "há 0 segundos"],
  ["Separado no galpão invisível", "há 1 segundo"],
  ["Saiu para entrega expressa", "há 3 segundos"],
  ["Entregue com sucesso", "agora"],
];

export default function Tracking({ code }) {
  const [step, setStep] = useState(0);
  const stored = useStoredJson(`dopamina-order-${code}`);
  const order = stored?.order ?? null;

  useEffect(() => {
    const t1 = setInterval(() => setStep((s) => Math.min(STEPS.length - 1, s + 1)), 1500);
    const t2 = setTimeout(() => {
      const el = document.getElementById("progress");
      if (el) el.dataset.done = "true";
    }, 6000);
    return () => {
      clearInterval(t1);
      clearTimeout(t2);
    };
  }, [code]);

  return (
    <div className="nx-card p-8">
      <div className="text-center">
        <div className="text-5xl">🚚</div>
        <h1 className="mt-3 text-2xl font-extrabold text-slate-900">Rastreio do pedido</h1>
        <p className="mt-1 text-sm text-slate-400">{code}</p>
        {order && <p className="text-xs text-slate-400">para {order.name}</p>}
      </div>
      <ol id="progress" className="mt-6 space-y-3">
        {STEPS.map(([label, when], i) => (
          <li
            key={label}
            className={`flex items-center gap-3 rounded-xl p-3 transition ${
              i <= step ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-400"
            }`}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                i <= step ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400"
              }`}
            >
              {i <= step ? "✓" : i + 1}
            </span>
            <span className="text-sm font-semibold">{label}</span>
            <span className="ml-auto text-xs opacity-70">{when}</span>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-center text-xs text-slate-400">
        Nenhum motorista saiu. Nenhuma encomenda existe. (É tudo cenário.)
      </p>
    </div>
  );
}
