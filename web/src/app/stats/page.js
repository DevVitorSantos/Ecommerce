import { getProducts } from "@/lib/catalog";

export const revalidate = 3600;

export default async function StatsPage() {
  const products = await getProducts();
  const spent = products.reduce((sum, p) => sum + p.price, 0);
  const sold = products.reduce((sum, p) => sum + p.sold_fake, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <span className="nx-chip bg-indigo-100 text-indigo-700">📊 Data as content</span>
      <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Os dados da loja</h1>
      <p className="mt-1 text-sm text-slate-500">Tudo que a loja simulada gera é mensurado — este painel cresce a cada versão.</p>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          [products.length, "produtos no catálogo"],
          ["R$ " + spent.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, "."), "valor total do catálogo"],
          [sold.toLocaleString("pt-BR"), "vendas fictícias"],
          ["R$ 0", "reais gastos de verdade"],
        ].map(([big, small]) => (
          <div key={small} className="nx-card p-4 text-center">
            <div className="text-xl font-extrabold text-slate-900">{big}</div>
            <div className="mt-1 text-xs text-slate-400">{small}</div>
          </div>
        ))}
      </div>
      <div className="nx-card mt-6 p-6 text-sm text-slate-500">
        <strong className="text-slate-900">Próximos passos:</strong> funil completo no BigQuery bronze,
        modelos de atribuição na gold do Databricks, dashboards no Databricks SQL + Looker Studio.
      </div>
    </div>
  );
}
