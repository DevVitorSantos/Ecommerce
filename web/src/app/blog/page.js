import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import BlogCard from "@/components/BlogCard";
import BlogCta from "@/components/BlogCta";
import { jsonLdBreadcrumb, jsonLdBlog } from "@/lib/jsonld";
import { getPublishedPosts, getPublishedPillars, getPostsByPillar } from "@/lib/blog";

export const revalidate = 3600;

export const metadata = {
  title: "Blog — simulador de compras e compras de mentirinha",
  description:
    "Artigos sobre simulador de compras online, compras de mentirinha e consumo consciente: entenda o prazer de comprar sem gastar dinheiro.",
  keywords: ["blog simulador de compras", "compras de mentirinha", "comprar sem gastar dinheiro"],
  alternates: { canonical: "/blog" },
  openGraph: {
    url: "/blog",
    title: "Blog — simulador de compras e compras de mentirinha",
    description:
      "Artigos sobre simulador de compras online, compras de mentirinha e consumo consciente.",
    type: "website",
  },
};

export default function BlogIndex() {
  const posts = getPublishedPosts();
  const pillars = getPublishedPillars();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd
        data={jsonLdBreadcrumb([
          { name: "Início", href: "/" },
          { name: "Blog", href: "/blog" },
        ])}
      />
      <JsonLd data={jsonLdBlog(posts)} />

      <nav className="text-xs text-slate-400">
        <Link href="/" className="hover:text-indigo-600">Início</Link>
        {" / "}
        <span className="text-slate-600">Blog</span>
      </nav>

      <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Blog dopamina.</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">
        Histórias e explicações sobre simuladores de compras, compras de mentirinha e o prazer de
        comprar sem gastar dinheiro.
      </p>

      {pillars.map((pl) => {
        const pillarPost = posts.find((p) => p.slug === pl.slug);
        const clusters = getPostsByPillar(pl.slug);
        return (
          <section key={pl.slug} className="mt-10">
            <h2 className="text-2xl font-extrabold text-slate-900">{pl.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{pl.blurb}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pillarPost && <BlogCard post={pillarPost} featured />}
              {clusters.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        );
      })}

      <BlogCta />
    </div>
  );
}
