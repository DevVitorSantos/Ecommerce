"use client";

import { useEffect, useState } from "react";
import { useStoredJson } from "@/lib/useStored";

const STEPS = [
  ["pedido aceito pelo robô", "há 0 segundos"],
  ["separado no galpão invisível", "há 1 segundo"],
  ["saiu para entrega telepática", "há 3 segundos"],
  ["entregue (você segura o ar)", "agora"],
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
    <div className="dopamine-card rounded-3xl p-8">
      <div className="text-center">
        <div className="text-5xl">🚚</div>
        <h1 className="mt-3 text-2xl font-black">rastreio em tempo real (de mentira)</h1>
        <p className="mt-1 text-sm text-white/50">{code}</p>
        {order && <p className="text-xs text-white/40">para {order.name}</p>}
      </div>
      <ol id="progress" className="mt-6 space-y-4">
        {STEPS.map(([label, when], i) => (
          <li
            key={label}
            className={`flex items-center gap-3 rounded-xl p-3 transition ${
              i <= step ? "bg-emerald-500/15 text-emerald-200" : "bg-white/5 text-white/40"
            }`}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-sm">{i <= step ? "✓" : i + 1}</span>
            <span className="text-sm">{label}</span>
            <span className="ml-auto text-xs opacity-70">{when}</span>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-center text-xs text-white/40">
        nenhum motorista saiu. nenhuma encomenda existe. você é o produto.
      </p>
    </div>
  );
}
