"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { brl } from "@/lib/format";

function readOrders() {
  try {
    const out = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("dopamina-order-")) {
        try {
          out.push(JSON.parse(localStorage.getItem(key)).order);
        } catch {
          // ignora registro corrompido
        }
      }
    }
    return JSON.stringify(out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
  } catch {
    return "[]";
  }
}

function subscribe(cb) {
  window.addEventListener("storage", cb);
  window.addEventListener("dopamina-local", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("dopamina-local", cb);
  };
}

export default function OrdersPage() {
  const raw = useSyncExternalStore(subscribe, readOrders, () => "[]");
  const orders = JSON.parse(raw);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900">Meus pedidos</h1>
      <p className="mt-1 text-sm text-slate-500">Todos fictícios. Todos entregues em 5 segundos.</p>
      {orders.length === 0 ? (
        <div className="nx-card mt-6 p-10 text-center text-slate-500">
          Você ainda não simulou nenhuma compra.
          <div>
            <Link href="/" className="nx-btn-primary mt-4 inline-block px-5 py-2.5 text-sm">
              Começar agora
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((o) => (
            <Link key={o.code} href={`/rastreio/${o.code}`} className="nx-card nx-card-hover flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">📦</div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">{o.code}</div>
                <div className="text-xs text-slate-400">
                  {o.items} itens · {new Date(o.createdAt).toLocaleString("pt-BR")}
                </div>
              </div>
              <div className="text-sm font-extrabold text-slate-900">{brl(o.value)}</div>
              <span className="nx-chip bg-emerald-100 text-emerald-700">Entregue</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
