"use client";

import { useState } from "react";
import { trackShare, toGaItem } from "@/lib/events";

export default function ShareButton({ product, variant = "icon", className = "" }) {
  const [copied, setCopied] = useState(false);

  async function onClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/produto/${product.slug}`
        : `/produto/${product.slug}`;
    const text = `${product.name} — veja no simulador de compras dopamina.`;
    const item = toGaItem({ ...product, qty: 1 });

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: product.name, text, url });
        trackShare(item, "webshare");
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        trackShare(item, "clipboard");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // usuário cancelou o share (AbortError) — não faz nada nem rastreia
    }
  }

  const label = copied ? "Link copiado!" : "Compartilhar produto";

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        data-testid={`share-${product.slug}`}
        className={`nx-btn-ghost flex items-center justify-center gap-2 px-4 py-3 text-sm text-slate-700 ${className}`}
      >
        <span className="text-lg leading-none">{copied ? "✅" : "🔗"}</span>
        <span>{copied ? "Link copiado" : "Compartilhar"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      data-testid={`share-${product.slug}`}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-base shadow-sm backdrop-blur transition hover:scale-105 ${className}`}
    >
      {copied ? "✅" : "🔗"}
    </button>
  );
}
