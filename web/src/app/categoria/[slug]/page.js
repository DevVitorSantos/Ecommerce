import { notFound } from "next/navigation";
import { getCategories, getProducts } from "@/lib/catalog";
import { deptStyle } from "@/lib/departments";
import ProductCard from "@/components/ProductCard";
import CategoryViewTracker from "@/components/CategoryViewTracker";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c }));
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = decodeURIComponent(slug);
  if (!(await getCategories()).includes(category)) notFound();

  const products = (await getProducts()).filter((p) => p.category === category);
  const dept = deptStyle(category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <CategoryViewTracker key={category} category={category} products={products} />
      <span className={`nx-chip ${dept.badge}`}>Departamento</span>
      <h1 className="mt-2 text-3xl font-extrabold text-slate-900">{category}</h1>
      <p className="mt-1 text-sm text-slate-500">{products.length} produtos prontos para desejar</p>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.sku} product={p} />
        ))}
      </div>
    </div>
  );
}
