"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { trackSearch } from "@/lib/events";

export default function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <form
      className="flex w-full items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 focus-within:border-indigo-600"
      onSubmit={(e) => {
        e.preventDefault();
        const term = q.trim();
        if (!term) return;
        trackSearch(term);
        router.push(`/busca?q=${encodeURIComponent(term)}`);
      }}
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar: fone, petisco, edredom…"
        className="w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-400"
        data-testid="search-input"
      />
      <button type="submit" className="bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700" data-testid="search-submit">
        🔍
      </button>
    </form>
  );
}
