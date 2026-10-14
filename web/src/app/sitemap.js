import { getCategories, getProducts } from "@/lib/catalog";
import { getPublishedPosts } from "@/lib/blog";
import { absUrl } from "@/lib/seo";

export default async function sitemap() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const lastModified = new Date();

  return [
    { url: absUrl("/"), lastModified, changeFrequency: "daily", priority: 1 },
    { url: absUrl("/stats"), lastModified, changeFrequency: "weekly", priority: 0.5 },
    { url: absUrl("/blog"), lastModified, changeFrequency: "weekly", priority: 0.6 },
    ...getPublishedPosts().map((p) => ({
      url: absUrl(`/blog/${p.slug}`),
      lastModified: new Date(p.date || lastModified),
      changeFrequency: "monthly",
      priority: 0.5,
    })),
    ...categories.map((c) => ({
      url: absUrl(`/categoria/${encodeURIComponent(c)}`),
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: absUrl(`/produto/${p.slug}`),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.6,
    })),
  ];
}
