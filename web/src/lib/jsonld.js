import { SITE_NAME, absUrl, KEYWORDS } from "./seo";

export function jsonLdWebsite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absUrl("/"),
    description:
      "Simulador de compras online para fazer compras de mentirinha e comprar sem gastar dinheiro.",
    inLanguage: "pt-BR",
    keywords: KEYWORDS.join(", "),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absUrl("/busca?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function jsonLdOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absUrl("/"),
    description:
      "Laboratório público de e-commerce simulado: compre tudo, gaste nada e gere dados reais de funil.",
    slogan: "Compre tudo. Gaste nada.",
  };
}

export function jsonLdBreadcrumb(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absUrl(item.href),
    })),
  };
}

export function jsonLdItemList(products) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name,
        url: absUrl(`/produto/${p.slug}`),
        image: p.image_url || undefined,
        category: p.category,
      },
    })),
  };
}

export function jsonLdProduct(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image_url ? [product.image_url] : undefined,
    description: product.description,
    sku: product.sku,
    category: product.category,
    keywords: product.tags.join(", "),
    brand: { "@type": "Brand", name: SITE_NAME },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: Math.max(product.sold_fake, 1),
      bestRating: 5,
      worstRating: 1,
    },
    offers: {
      "@type": "Offer",
      url: absUrl(`/produto/${product.slug}`),
      priceCurrency: "BRL",
      price: Number(product.price).toFixed(2),
      priceValidUntil: "2099-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE_NAME, url: absUrl("/") },
    },
  };
}

export function jsonLdFaq(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
