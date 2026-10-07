"use client";

import Link from "next/link";
import { brl } from "@/lib/format";
import { useStoredJson } from "@/lib/useStored";

export default function Confirmation() {
  const order = useStoredJson("dopamina-last-order");

  if (!order) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-white/70">nenhum pedido encontrado — compra uma coisinha antes?</p>
      </div>
    );
  }

  return (
    <div className="dopamine-card rounded-3xl p-8 text-center">
      <div className="text-6xl">📦</div>
      <h1 className="mt-3 text-2xl font-black">pedido confirmado!</h1>
      <p className="mt-1 text-white/60">entrega estimada: 5 segundos (já era agora)</p>
      <div className="mt-5 rounded-2xl bg-white/5 p-4 text-left text-sm">
        <div className="flex justify-between">
          <span className="text-white/50">código</span>
          <strong data-testid="order-code">{order.code}</strong>
        </div>
        <div className="mt-1 flex justify-between">
          <span className="text-white/50">total simulado</span>
          <strong>{brl(order.value)}</strong>
        </div>
        <div className="mt-1 flex justify-between">
          <span className="text-white/50">itens</span>
          <span>{order.items}</span>
        </div>
        <div className="mt-1 flex justify-between">
          <span className="text-white/50">para</span>
          <span className="max-w-[60%] truncate">{order.address}</span>
        </div>
      </div>
      <Link
        href={`/rastreio/${order.code}`}
        className="mt-5 inline-block rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-6 py-3 font-bold hover:opacity-90"
        data-testid="track-link"
      >
        acompanhar entrega fictícia
      </Link>
      <p className="mt-4 text-xs text-white/40">nenhum dinheiro mudou de mãos. nenhum pacote existe.</p>
    </div>
  );
}
