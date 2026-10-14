// Conteúdo do blog, estruturado em pilares (hubs) e clusters (artigos).
// Cada artigo vive em seu próprio arquivo: web/src/content/blog/<slug>.js
// Plano completo de títulos e links: ver BRAINSTORM.md, seção 11.
// Um post só existe no site (generateStaticParams, sitemap, índice) se status === "published".

import guiaSimulador from "@/content/blog/guia-simulador-de-compras";
import oQueESimulador from "@/content/blog/o-que-e-simulador-de-compras";
import comprasDeMentirinha from "@/content/blog/compras-de-mentirinha";
import comprarSemGastar from "@/content/blog/comprar-sem-gastar-dinheiro";
import truquesVontade from "@/content/blog/truques-matar-vontade-de-comprar";
import comprasOnlineXMentirinha from "@/content/blog/compras-online-x-mentirinha";
import simuladorEducacaoFinanceira from "@/content/blog/simulador-educacao-financeira";
import identificarLojasFalsas from "@/content/blog/identificar-lojas-falsas";
import porQueCompramos from "@/content/blog/por-que-compramos";
import porQueVontade from "@/content/blog/por-que-sentimos-vontade-de-comprar";
import mentirinhaSubstituiImpulso from "@/content/blog/mentirinha-substitui-impulso";
import sinaisCompraPorImpulso from "@/content/blog/9-sinais-de-compra-por-impulso";
import cerebroXPromocoes from "@/content/blog/cerebro-x-promocoes";
import listaDeDesejos from "@/content/blog/lista-de-desejos";
import consumoConsciente from "@/content/blog/consumo-consciente";
import dopamineShopping from "@/content/blog/dopamine-shopping";
import noBuyLowBuyDetox from "@/content/blog/no-buy-low-buy-detox";
import pagarComConsciencia from "@/content/blog/pagar-com-consciencia";
import simuladorFunciona from "@/content/blog/simulador-funciona";
import treinarDecisao from "@/content/blog/treinar-decisao-de-compra";
import mentirinhaXCompraReal from "@/content/blog/mentirinha-x-compra-real";

export const PILLARS = {
  "guia-simulador-de-compras": {
    slug: "guia-simulador-de-compras",
    title: "Guia do simulador de compras",
    blurb: "O guia completo de quem quer comprar tudo e gastar nada.",
    group: "A",
  },
  "por-que-compramos": {
    slug: "por-que-compramos",
    title: "Por que compramos",
    blurb: "A psicologia do desejo de comprar — e como lidar com ela.",
    group: "B",
  },
  "consumo-consciente": {
    slug: "consumo-consciente",
    title: "Consumo consciente",
    blurb: "No-buy, dopamine detox e o prazer de comprar sem gastar.",
    group: "C",
  },
};

export const KIND_LABEL = {
  pillar: "Guia completo",
  cluster: "Artigo",
  decision: "Comparativo",
};

// Marcador de link interno dentro dos textos: [[texto|/destino]]
const POSTS = [
  guiaSimulador,
  porQueCompramos,
  consumoConsciente,
  oQueESimulador,
  comprasDeMentirinha,
  comprarSemGastar,
  truquesVontade,
  comprasOnlineXMentirinha,
  simuladorEducacaoFinanceira,
  identificarLojasFalsas,
  porQueVontade,
  mentirinhaSubstituiImpulso,
  sinaisCompraPorImpulso,
  cerebroXPromocoes,
  listaDeDesejos,
  dopamineShopping,
  noBuyLowBuyDetox,
  pagarComConsciencia,
  simuladorFunciona,
  treinarDecisao,
  mentirinhaXCompraReal,
];

export function getPublishedPosts() {
  return POSTS.filter((p) => p.status === "published");
}

export function getPost(slug) {
  return getPublishedPosts().find((p) => p.slug === slug) || null;
}

export function getPostsByPillar(pillarSlug) {
  return getPublishedPosts().filter((p) => p.pillar === pillarSlug);
}

export function getPublishedPillars() {
  const posts = getPublishedPosts();
  return Object.values(PILLARS).filter((pl) =>
    posts.some((p) => p.slug === pl.slug || p.pillar === pl.slug),
  );
}

export function getRelated(post) {
  const posts = getPublishedPosts();
  const out = [];
  if (post.kind === "pillar") {
    out.push(...posts.filter((p) => p.pillar === post.slug));
  } else {
    if (post.pillar && PILLARS[post.pillar]) {
      const parent = posts.find((p) => p.slug === post.pillar);
      if (parent) out.push(parent);
    }
    out.push(...posts.filter((p) => p.pillar === post.pillar && p.slug !== post.slug));
  }
  return out.slice(0, 3);
}
