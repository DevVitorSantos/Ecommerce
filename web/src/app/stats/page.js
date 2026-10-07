import { getProducts } from "@/lib/catalog";

export const revalidate = 3600;

export default async function StatsPage() {
  const products = await getProducts();
  const spent = products.reduce((sum, p) => sum + p.price, 0);
  const sold = products.reduce((sum, p) => sum + p.sold_fake, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-black">os dados da loja</h1>
      <p className="mt-1 text-sm text-white/50">tudo que a loja simulada gera é mensurado — este painel cresce a cada versão.</p>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          [products.length, "produtos"],
          ["R$ " + spent.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, "."), "valor total do catálogo"],
          [sold.toLocaleString("pt-BR"), "vendas fictícias"],
          ["0", "reais gastos"],
        ].map(([big, small]) => (
          <div key={small} className="dopamine-card rounded-2xl p-4 text-center">
            <div className="text-xl font-black">{big}</div>
            <div className="mt-1 text-xs text-white/50">{small}</div>
          </div>
        ))}
      </div>
      <div className="dopamine-card mt-6 rounded-2xl p-6 text-sm text-white/60">
        <strong className="text-white">próximos passos (V2):</strong> funil completo, atribuição multi-touch
        (first/last/linear/time-decay/position-based), campanhas UTM e comparação web × app (V3) — tudo aberto.
      </div>
    </div>
  );
}
