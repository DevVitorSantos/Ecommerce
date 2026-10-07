"use client";

import Link from "next/link";
import { brl, discount } from "@/lib/format";
import { deptStyle } from "@/lib/departments";
import { trackAddToCart, trackSelectItem, toGaItem } from "@/lib/events";
import { useCart } from "@/store/cart";
import ProductImage from "@/components/ProductImage";

export default function ProductCard({ product }) {
  const add = useCart((s) => s.add);
  const off = discount(product.price, product.price_list);
  const dept = deptStyle(product.category);

  return (
    <div className="nx-card nx-card-hover group flex flex-col overflow-hidden">
      <Link href={`/produto/${product.slug}`} onClick={() => trackSelectItem(toGaItem({ ...product, qty: 1 }))}>
        <ProductImage
          product={product}
          className="relative h-48 text-7xl"
          imgClassName="transition-transform duration-300 group-hover:scale-105"
        />
        {off > 0 && (
          <span className="nx-chip absolute left-3 top-3 bg-sky-600 text-white">-{off}% OFF</span>
        )}
        <div className="flex flex-1 flex-col p-4">
          <span className={`nx-chip w-fit ${dept.badge}`}>{product.category}</span>
          <h3 className="mt-2 line-clamp-2 text-sm font-bold text-slate-900">{product.name}</h3>
          <div className="mt-1 flex items-center gap-1 text-sm">
            <span className="text-amber-400">★</span>
            <strong className="text-slate-900">{product.rating.toFixed(1)}</strong>
            <span className="text-slate-400">({product.sold_fake.toLocaleString("pt-BR")})</span>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        {off > 0 && <span className="block text-sm text-slate-400 line-through">{brl(product.price_list)}</span>}
        <span className="text-xl font-extrabold text-slate-900">{brl(product.price)}</span>
        <button
          type="button"
          className="nx-btn-primary mt-2 w-full py-2 text-sm"
          onClick={() => {
            add(product);
            trackAddToCart(toGaItem({ ...product, qty: 1 }));
          }}
          data-testid={`add-${product.slug}`}
        >
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
}
