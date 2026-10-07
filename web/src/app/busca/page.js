import { getProducts } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

export const revalidate = 3600;

export default async function SearchPage({ searchParams }) {
  const { q = "" } = await searchParams;
  const term = q.trim().toLowerCase();
  const products = (await getProducts()).filter((p) =>
    `${p.name} ${p.description} ${p.category} ${p.tags.join(" ")}`.toLowerCase().includes(term),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-extrabold text-slate-900">
        Resultados para “{q}”
      </h1>
      <p className="mt-1 text-sm text-slate-500">{products.length} produto(s) encontrado(s)</p>
      {products.length === 0 ? (
        <div className="nx-card mt-6 p-10 text-center text-slate-500">
          Nada por aqui — mas o desejo continua. Tente “fone”, “pet” ou “edredom”.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.sku} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
