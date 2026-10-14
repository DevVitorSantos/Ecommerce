import { notFound } from "next/navigation";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import BlogContent from "@/components/BlogContent";
import BlogCard from "@/components/BlogCard";
import BlogCta from "@/components/BlogCta";
import FaqSection from "@/components/FaqSection";
import { jsonLdBreadcrumb, jsonLdArticle, jsonLdFaq } from "@/lib/jsonld";
import { getPost, getPublishedPosts, getRelated, PILLARS, KIND_LABEL } from "@/lib/blog";

export const revalidate = 3600;

export function generateStaticParams() {
  return getPublishedPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const title = post.seoTitle || post.title;
  const canonical = `/blog/${post.slug}`;
  return {
    title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical },
    openGraph: { url: canonical, title, description: post.description, type: "article" },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const pillar = post.pillar ? PILLARS[post.pillar] : null;
  const section = pillar ? pillar.title : post.title;

  const crumbs = [{ name: "Início", href: "/" }, { name: "Blog", href: "/blog" }];
  if (pillar) crumbs.push({ name: pillar.title, href: `/blog/${pillar.slug}` });
  crumbs.push({ name: post.title, href: `/blog/${post.slug}` });

  const related = getRelated(post);
  const faqs = post.faqs || [];

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd data={jsonLdBreadcrumb(crumbs)} />
      <JsonLd data={jsonLdArticle({ ...post, section })} />
      {faqs.length > 0 && <JsonLd data={jsonLdFaq(faqs)} />}

      <nav className="flex flex-wrap items-center gap-x-1 text-xs text-slate-400">
        {crumbs.map((c, i) => (
          <span key={c.href} className="flex items-center gap-x-1">
            {i > 0 && <span>/</span>}
            {i < crumbs.length - 1 ? (
              <Link href={c.href} className="hover:text-indigo-600">
                {c.name}
              </Link>
            ) : (
              <span className="text-slate-600">{c.name}</span>
            )}
          </span>
        ))}
      </nav>

      <span className="nx-chip mt-3 inline-block bg-indigo-50 text-indigo-700">
        {KIND_LABEL[post.kind] || "Artigo"}
      </span>
      <h1 className="mt-2 text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">
        {post.title}
      </h1>
      <p className="mt-2 text-xs text-slate-400">
        {new Date(post.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
        {" · "}
        {post.reading} min de leitura
      </p>

      <p className="mt-5 text-lg leading-relaxed text-slate-700">{post.intro}</p>

      <BlogContent blocks={post.blocks} />

      <BlogCta {...(post.cta || {})} />

      {faqs.length > 0 && (
        <FaqSection
          title="Perguntas frequentes"
          intro="Dúvidas rápidas sobre este assunto."
          faqs={faqs}
        />
      )}

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-extrabold text-slate-900">Leia também</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}

      <p className="mt-8 text-sm">
        <Link href="/blog" className="font-semibold text-indigo-600 hover:underline">
          ← Voltar para o blog
        </Link>
      </p>
    </article>
  );
}
