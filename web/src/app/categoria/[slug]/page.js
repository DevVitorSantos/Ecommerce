import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/catalog";
import { deptStyle } from "@/lib/departments";
import ProductCard from "@/components/ProductCard";
import CategoryViewTracker from "@/components/CategoryViewTracker";
import JsonLd from "@/components/JsonLd";
import FaqSection from "@/components/FaqSection";
import { jsonLdBreadcrumb, jsonLdItemList, jsonLdFaq } from "@/lib/jsonld";
import { buildCategoryFaqs, categoryContent, clamp } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = decodeURIComponent(slug);
  const { lead } = categoryContent(category);
  const title = `${category} — simulador de compras`;
  const opener = lead.charAt(0).toUpperCase() + lead.slice(1);
  const description = clamp(
    `${opener} Explore ${category} no simulador de compras online e faça compras de mentirinha sem gastar dinheiro.`,
    160,
  );
  const canonical = `/categoria/${encodeURIComponent(category)}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { url: canonical, title, description, type: "website" },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = decodeURIComponent(slug);
  if (!(await getCategories()).includes(category)) notFound();

  const products = (await getProducts()).filter((p) => p.category === category);
  const dept = deptStyle(category);
  const content = categoryContent(category);
  const faqs = buildCategoryFaqs(category, products);
  const canonical = `/categoria/${encodeURIComponent(category)}`;
  const listed = products.slice(0, 12);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd
        data={jsonLdBreadcrumb([
          { name: "Início", href: "/" },
          { name: category, href: canonical },
        ])}
      />
      <JsonLd data={jsonLdItemList(listed)} />
      <JsonLd data={jsonLdFaq(faqs)} />

      <CategoryViewTracker key={category} category={category} products={products} />

      <nav className="text-xs text-slate-400">
        <Link href="/" className="hover:text-indigo-600">Início</Link>
        {" / "}
        <span className="text-slate-600">{category}</span>
      </nav>

      <span className={`nx-chip mt-3 ${dept.badge}`}>Departamento</span>
      <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
        {category} — simulador de compras
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">
        {products.length} produtos para simular compras em {category}: {content.lead}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.sku} product={p} />
        ))}
      </div>

      <FaqSection
        title={`Perguntas frequentes sobre ${category}`}
        intro="Tudo o que você precisa saber antes de simular sua compra neste departamento."
        faqs={faqs}
      />
    </div>
  );
}
