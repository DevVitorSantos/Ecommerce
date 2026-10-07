"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { brl, discount } from "@/lib/format";
import { deptStyle } from "@/lib/departments";
import { trackAddToCart, trackViewItem, toGaItem } from "@/lib/events";
import { useCart } from "@/store/cart";
import ProductImage from "@/components/ProductImage";

export default function ProductDetail({ product, combo }) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const viewedRef = useRef(null);
  const off = discount(product.price, product.price_list);
  const dept = deptStyle(product.category);
  const installment = product.price / 10;

  useEffect(() => {
    if (viewedRef.current === product.slug) return; // evita view_item duplicado (remount/HMR)
    viewedRef.current = product.slug;
    trackViewItem(toGaItem({ ...product, qty: 1 }));
  }, [product]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* migalhas */}
      <nav className="text-xs text-slate-400">
        <Link href="/" className="hover:text-indigo-600">Início</Link>
        {" / "}
        <Link href={`/categoria/${encodeURIComponent(product.category)}`} className="hover:text-indigo-600">
          {product.category}
        </Link>
        {" / "}
        <span className="text-slate-600">{product.name}</span>
      </nav>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        {/* galeria */}
        <div>
          <ProductImage product={product} className="nx-card h-80 text-[10rem] md:h-96" />
          <div className="mt-3 grid grid-cols-4 gap-2">
            <ProductImage product={product} className="nx-card h-16 text-2xl" />
            {["📦", "✨", "🏷️"].map((e, i) => (
              <div key={i} className="nx-card flex h-16 items-center justify-center bg-slate-50 text-2xl">
                {e}
              </div>
            ))}
          </div>
        </div>

        {/* infos */}
        <div>
          <span className={`nx-chip ${dept.badge}`}>{product.category}</span>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 md:text-3xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-amber-400">★★★★★</span>
            <strong className="text-slate-900">{product.rating.toFixed(1)}</strong>
            <span className="text-slate-400">({product.sold_fake.toLocaleString("pt-BR")} vendidos)</span>
          </div>
          <p className="mt-3 text-slate-600">{product.description}</p>

          <div className="nx-card mt-5 p-5">
            {off > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400 line-through">{brl(product.price_list)}</span>
                <span className="nx-chip bg-sky-600 text-white">-{off}% OFF</span>
              </div>
            )}
            <div className="mt-1 text-4xl font-extrabold text-slate-900">{brl(product.price)}</div>
            <div className="mt-1 text-sm text-slate-500">
              em até 10x de {brl(installment)} sem juros (de mentira)
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-slate-200">
                <button type="button" className="px-3 py-2 text-lg text-slate-600" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <span className="w-8 text-center text-sm font-bold">{qty}</span>
                <button type="button" className="px-3 py-2 text-lg text-slate-600" onClick={() => setQty((q) => q + 1)}>
                  +
                </button>
              </div>
              <button
                type="button"
                className="nx-btn-primary flex-1 py-3 font-bold"
                onClick={() => {
                  add(product, qty);
                  trackAddToCart(toGaItem({ ...product, qty }));
                  setAdded(true);
                  setTimeout(() => setAdded(false), 2000);
                }}
                data-testid="add-to-cart"
              >
                {added ? "✓ Adicionado!" : "Comprar agora"}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
              {["⚡ Entrega em 5s", "🚚 Frete de ilusão", "🔄 Troca imaginária"].map((t) => (
                <div key={t} className="rounded-lg bg-slate-50 py-2">
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            ⏰ Oferta relâmpago termina em <strong>04:59</strong> (é teatro, calma)
          </div>
        </div>
      </div>

      {/* especificações */}
      <div className="nx-card mt-8 p-6">
        <h2 className="text-lg font-extrabold text-slate-900">Especificações técnicas (fictícias)</h2>
        <dl className="mt-3 grid gap-x-8 gap-y-2 text-sm md:grid-cols-2">
          {[
            ["SKU", product.sku],
            ["Departamento", product.category],
            ["Avaliação", `★ ${product.rating.toFixed(1)} / 5`],
            ["Vendidos", product.sold_fake.toLocaleString("pt-BR")],
            ["Tags", product.tags.join(", ")],
            ["Garantia", "eterna (o produto não existe)"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-slate-100 py-2">
              <dt className="text-slate-400">{k}</dt>
              <dd className="font-semibold text-slate-700">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* combo */}
      {combo && combo.length > 0 && (
        <div className="nx-card mt-6 p-6">
          <h2 className="text-lg font-extrabold text-slate-900">💡 Compre junto e economize ilusão</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {combo.map((c) => (
              <div key={c.sku} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                <ProductImage product={c} className="h-12 w-12 shrink-0 rounded-lg text-xl" />
                <div className="flex-1">
                  <div className="line-clamp-1 text-sm font-bold text-slate-900">{c.name}</div>
                  <div className="text-sm font-extrabold text-indigo-600">{brl(c.price)}</div>
                </div>
                <button
                  type="button"
                  className="nx-btn-ghost px-3 py-1.5 text-xs"
                  onClick={() => {
                    add(c);
                    trackAddToCart(toGaItem({ ...c, qty: 1 }));
                  }}
                >
                  + Adicionar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
