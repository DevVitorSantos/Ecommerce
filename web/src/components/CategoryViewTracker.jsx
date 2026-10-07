"use client";

import { useEffect, useRef } from "react";
import { trackViewItemList, toGaItem } from "@/lib/events";

export default function CategoryViewTracker({ category, products }) {
  const viewedRef = useRef(null);

  useEffect(() => {
    if (viewedRef.current === category) return; // evita view_item_list duplicado (remount/HMR)
    viewedRef.current = category;
    trackViewItemList(
      category,
      products.map((p) => toGaItem({ ...p, qty: 1 })),
    );
  }, [category, products]);

  return null;
}
