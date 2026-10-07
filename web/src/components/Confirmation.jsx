"use client";

import Link from "next/link";
import { brl } from "@/lib/format";
import { useStoredJson } from "@/lib/useStored";

export default function Confirmation() {
  const order = useStoredJson("dopamina-last-order");

  if (!order) {
    return (
      <div className="nx-card p-8 text-center">
        <p className="text-slate-500">Nenhum pedido encontrado — que tal comprar uma coisinha?</p>
        <Link href="/" className="nx-btn-primary mt-4 inline-block px-5 py-2.5 text-sm">
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="nx-card p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
        ✓
      </div>
      <h1 className="mt-3 text-2xl font-extrabold text-slate-900">Pedido confirmado!</h1>
      <p className="mt-1 text-slate-500">Entrega estimada: 5 segundos (já era agora)</p>
      <div className="mt-5 rounded-xl bg-slate-50 p-4 text-left text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Código</span>
          <strong className="text-slate-900" data-testid="order-code">{order.code}</strong>
        </div>
        <div className="mt-1 flex justify-between">
          <span className="text-slate-400">Total simulado</span>
          <strong className="text-slate-900">{brl(order.value)}</strong>
        </div>
        <div className="mt-1 flex justify-between">
          <span className="text-slate-400">Itens</span>
          <span className="text-slate-700">{order.items}</span>
        </div>
        <div className="mt-1 flex justify-between">
          <span className="text-slate-400">Entregar em</span>
          <span className="max-w-[60%] truncate text-slate-700">{order.address}</span>
        </div>
      </div>
      <Link
        href={`/rastreio/${order.code}`}
        className="nx-btn-primary mt-5 inline-block px-6 py-3 font-bold"
        data-testid="track-link"
      >
        Acompanhar entrega
      </Link>
      <p className="mt-4 text-xs text-slate-400">Nenhum dinheiro mudou de mãos. Nenhum pacote existe.</p>
    </div>
  );
}
