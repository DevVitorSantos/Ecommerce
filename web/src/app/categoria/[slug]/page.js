import { notFound } from "next/navigation";
import { getCategories, getProducts } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c }));
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = decodeURIComponent(slug);
  if (!(await getCategories()).includes(category)) notFound();

  const products = (await getProducts()).filter((p) => p.category === category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-black">{category}</h1>
      <p className="mt-1 text-sm text-white/50">{products.length} itens prontos para viciar você</p>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.sku} product={p} />
        ))}
      </div>
    </div>
  );
}
