import { notFound } from "next/navigation";
import { getProducts, getProduct } from "@/lib/catalog";
import ProductDetail from "@/components/ProductDetail";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
