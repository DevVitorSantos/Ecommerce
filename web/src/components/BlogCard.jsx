import Link from "next/link";
import { KIND_LABEL } from "@/lib/blog";

export default function BlogCard({ post, featured = false }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`nx-card nx-card-hover block p-5 ${featured ? "border-indigo-200 bg-indigo-50/40" : ""}`}
    >
      <span className={`nx-chip ${featured ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-700"}`}>
        {KIND_LABEL[post.kind] || "Artigo"}
      </span>
      <h3 className="mt-3 text-base font-bold text-slate-900">{post.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-500">{post.description}</p>
      <span className="mt-3 inline-block text-xs font-semibold text-indigo-600">
        Ler artigo · {post.reading} min →
      </span>
    </Link>
  );
}
