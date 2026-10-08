import { notFound } from "next/navigation";
import Link from "next/link";
import { getProducts, getProduct } from "@/lib/catalog";
import ProductDetail from "@/components/ProductDetail";
import JsonLd from "@/components/JsonLd";
import FaqSection from "@/components/FaqSection";
import { jsonLdProduct, jsonLdBreadcrumb, jsonLdFaq } from "@/lib/jsonld";
import { buildProductFaqs, clamp } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Produto não encontrado" };
  const title = `${product.name} — ${product.category}`;
  const description = clamp(
    `${product.description} Veja o preço simulado e faça compras de mentirinha sem gastar dinheiro.`,
    160,
  );
  const canonical = `/produto/${product.slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title,
      description,
      type: "website",
      images: product.image_url ? [product.image_url] : undefined,
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const combo = (await getProducts())
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 2);
  const faqs = buildProductFaqs(product);
  const canonical = `/produto/${product.slug}`;

  return (
    <>
      <JsonLd data={jsonLdProduct(product)} />
      <JsonLd
        data={jsonLdBreadcrumb([
          { name: "Início", href: "/" },
          { name: product.category, href: `/categoria/${encodeURIComponent(product.category)}` },
          { name: product.name, href: canonical },
        ])}
      />
      <JsonLd data={jsonLdFaq(faqs)} />

      <ProductDetail product={product} combo={combo} />

      <div className="mx-auto max-w-6xl px-4 pb-8">
        <section aria-labelledby="sobre-produto" className="nx-card p-6">
          <h2 id="sobre-produto" className="text-lg font-extrabold text-slate-900">
            Sobre o {product.name}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            O <strong>{product.name}</strong> é uma das opções de <strong>{product.category}</strong> no
            simulador de compras online da dopamina. Aqui você faz compras de mentirinha: adiciona o produto
            ao carrinho, aplica o cupom DOPAMINA10 e finaliza um checkout simulado para sentir o prazer de
            comprar <strong>sem gastar dinheiro</strong>. Nenhum valor é cobrado, nenhum produto real é
            enviado e a entrega é apenas simulada em até 5 segundos.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Com nota {product.rating.toFixed(1)} e {product.sold_fake.toLocaleString("pt-BR")} vendidos
            fictícios, o {product.name} faz parte da vitrine de {product.category}.{" "}
            <Link
              href={`/categoria/${encodeURIComponent(product.category)}`}
              className="font-semibold text-indigo-600 hover:underline"
            >
              Ver todos os produtos de {product.category} →
            </Link>
          </p>
        </section>

        <FaqSection
          title={`Perguntas frequentes sobre o ${product.name}`}
          intro="Respostas rápidas antes de simular sua compra."
          faqs={faqs}
        />
      </div>
    </>
  );
}
