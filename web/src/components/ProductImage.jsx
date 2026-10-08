"use client";

import { useState } from "react";

// Foto real com fallback para emoji se a imagem falhar
export default function ProductImage({ product, className = "", imgClassName = "" }) {
  const [failed, setFailed] = useState(false);

  if (!product.image_url || failed) {
    return (
      <div className={`flex items-center justify-center bg-slate-50 ${className}`}>
        <span>{product.emoji}</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-slate-50 ${className}`}>
      <img
        src={product.image_url}
        alt={`${product.name} — ${product.category} no simulador de compras dopamina.`}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
