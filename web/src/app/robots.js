import { SITE_URL, absUrl } from "@/lib/seo";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/carrinho", "/checkout", "/confirmacao", "/rastreio/", "/pedidos", "/busca"],
      },
    ],
    sitemap: absUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
