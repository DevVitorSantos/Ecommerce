"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution } from "@/lib/attribution";

// Roda em toda navegação do App Router: fecha a atribuição da sessão (UTMs + referrer
// + landing page) para o pedido no Supabase. Não renderiza nada.
// Lê a query da própria URL (window.location) para não exigir Suspense como useSearchParams.
export default function AttributionTracker() {
  const pathname = usePathname();

  useEffect(() => {
    captureAttribution();
  }, [pathname]);

  return null;
}
