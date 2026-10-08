import { brl, discount } from "./format";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ecommerce-ruby-delta-12.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "dopamina.";
export const SITE_TAGLINE = "simulador de compras";

export function absUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function clamp(text, max) {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

export const KEYWORDS = [
  "simulador de compras",
  "simulador de compras online",
  "compras de mentirinha",
  "comprar sem gastar dinheiro",
  "site para simular compras",
];

/* ------------------------------------------------------------------ *
 * Conteúdo por categoria (lead + FAQ específico)
 * ------------------------------------------------------------------ */

const CATEGORY_CONTENT = {
  Tech: {
    lead: "gadgets que você namora na vitrine e testa no carrinho sem abrir a carteira.",
    faqs: [
      {
        q: "Posso simular a compra de celular, fone e notebook?",
        a: "Sim. Em Tech você encontra fones, acessórios e aparelhos para adicionar ao carrinho do simulador de compras e finalizar o checkout de mentirinha — sem pagar nada.",
      },
      {
        q: "Os produtos de tecnologia têm garantia?",
        a: "A garantia é eterna e imaginária: o item não existe de verdade, então nunca vai dar defeito. É o jeito mais barato de montar um setup dos sonhos.",
      },
    ],
  },
  Pets: {
    lead: "mimos para o seu pet que não geram boleto — só alegria.",
    faqs: [
      {
        q: "Consigo simular compras para cachorro e gato?",
        a: "Consigo. De comedouros a brinquedos, tudo entra no carrinho do simulador. A entrega é simulada em segundos e seu pet continua esperando o petisco real.",
      },
      {
        q: "Vale a pena testar produtos para pets antes de comprar de verdade?",
        a: "Aqui você usa a compra de mentirinha como rascunho: monte a lista, veja o total e decida depois se quer levar a ideia a sério na loja real.",
      },
    ],
  },
  Beleza: {
    lead: "cosméticos e autocuidado para o prazer de comprar sem culpa.",
    faqs: [
      {
        q: "Posso montar minha rotina de beleza de mentirinha?",
        a: "Sim. Adicione skincare, maquiagem e perfumaria ao carrinho, use o cupom DOPAMINA10 e veja o total simulado mudar — tudo sem gastar dinheiro.",
      },
      {
        q: "Comprar de mentirinha em Beleza ajuda a evitar compras por impulso?",
        a: "Muita gente usa o simulador como válvula de escape: satisfaz a vontade de comprar, mas o valor cobrado é sempre R$ 0.",
      },
    ],
  },
  Snacks: {
    lead: "guloseimas que estufam a tela e nunca a balança nem o bolso.",
    faqs: [
      {
        q: "Dá para simular um carrinho cheio de snacks?",
        a: "Dá sim. Encha o carrinho de doces e salgadinhos, veja o desconto do cupom e feche o pedido de mentirinha sem nenhuma caloria nem cobrança.",
      },
      {
        q: "Os produtos de Snacks têm entrega rápida?",
        a: "A entrega simulada sai em até 5 segundos — mais rápido que qualquer delivery real, porque aqui nada é enviado de verdade.",
      },
    ],
  },
  Bebidas: {
    lead: "do café ao espumante: o brinde imaginário que não pesa na fatura.",
    faqs: [
      {
        q: "Posso simular a compra de bebidas alcoólicas?",
        a: "O simulador não vende nem entrega nada real. Você apenas monta o carrinho e faz o checkout de mentirinha para sentir o prazer da escolha.",
      },
      {
        q: "Como funciona o total do meu carrinho de bebidas?",
        a: "É tudo simulado: preços de vitrine, frete de ilusão e o cupom DOPAMINA10 aplicados sobre valores que nunca saem da tela.",
      },
    ],
  },
  Casa: {
    lead: "itens de casa que deixam o ambiente bonito sem mexer no orçamento.",
    faqs: [
      {
        q: "Consigo planejar a decoração simulando compras?",
        a: "Sim. Junte móveis, utensílios e decoração no carrinho do simulador para visualizar o total e a lista de desejos antes de decidir comprar de verdade.",
      },
      {
        q: "A entrega dos itens de Casa é real?",
        a: "Não. Nada é enviado: a entrega é 100% simulada e nenhum valor é cobrado, mesmo em pedidos grandes.",
      },
    ],
  },
  Fitness: {
    lead: "equipamentos e roupas para o treino que começa amanhã — sem boleto hoje.",
    faqs: [
      {
        q: "Posso simular compras de academia e suplementos?",
        a: "Pode. Monte o kit fitness completo no carrinho, aplique o cupom e feche o pedido de mentirinha: motivação grátis, gasto zero.",
      },
      {
        q: "Simular compras de fitness ajuda a manter a meta?",
        a: "Funciona como recompensa simbólica: você sente o gostinho da compra sem gastar dinheiro e sem quebrar a meta do mês.",
      },
    ],
  },
  Brinquedos: {
    lead: "brinquedos para todas as idades, com a felicidade de comprar e a calma de não pagar.",
    faqs: [
      {
        q: "Posso simular compras de brinquedos para presentear?",
        a: "Sim. Escolha os presentes no simulador, veja o total e o desconto do cupom e monte sua lista antes de comprar de verdade em outro lugar.",
      },
      {
        q: "Tem brinquedos para todas as idades?",
        a: "A vitrine é fictícia e divertida, então vale tanto para crianças quanto para adultos que querem brincar de comprar sem gastar nada.",
      },
    ],
  },
  "Bem-estar": {
    lead: "o cuidado que acalma a mente — e a fatura.",
    faqs: [
      {
        q: "Comprar de mentirinha ajuda no autocuidado?",
        a: "Para muita gente, sim: a compra simulada reduz a ansiedade do impulso e ainda entrega a sensação de recompensa, com gasto real de R$ 0.",
      },
      {
        q: "O que encontro em Bem-estar na dopamina.?",
        a: "Produtos fictícios de relaxamento e autocuidado para simular a compra, montar rituais e testar o prazer de escolher sem culpa.",
      },
    ],
  },
};

const FALLBACK_CONTENT = {
  lead: "produtos de vitrine para você simular a compra e sentir o prazer de escolher sem gastar dinheiro.",
  faqs: [],
};

export function categoryContent(category) {
  return CATEGORY_CONTENT[category] || FALLBACK_CONTENT;
}

/* ------------------------------------------------------------------ *
 * FAQs — respondem dúvidas do usuário e perguntas de negócio
 * ------------------------------------------------------------------ */

const SIMULATOR_FAQS = [
  {
    q: "O que é o simulador de compras da dopamina.?",
    a: "É um site para simular compras online, também conhecido como compras de mentirinha. Você monta o carrinho e faz um checkout simulado para sentir o prazer de comprar sem gastar dinheiro.",
  },
  {
    q: "Preciso informar cartão ou pagar alguma coisa?",
    a: "Não. O simulador nunca pede cartão e nenhum valor é cobrado: o total aparece só na tela, com R$ 0 saindo da sua conta.",
  },
  {
    q: "Como funciona o cupom DOPAMINA10?",
    a: "O cupom DOPAMINA10 aplica 10% de desconto simulado no seu pedido de mentirinha. É a forma mais barata de ver o total cair sem abrir a carteira.",
  },
  {
    q: "Como recebo o produto que \u201ccomprei\u201d?",
    a: "A entrega é 100% simulada e acontece em até 5 segundos por meio de um rastreio fictício. Nenhum pacote é enviado e nenhum produto é real.",
  },
  {
    q: "Posso cancelar, devolver ou pedir reembolso?",
    a: "Não há o que devolver: nada é cobrado nem enviado. Você pode refazer o pedido quantas vezes quiser, sempre de mentirinha.",
  },
  {
    q: "Comprar de mentirinha ajuda a controlar compras por impulso?",
    a: "Para muita gente, sim. A compra simulada oferece a recompensa da escolha e do carrinho cheio sem o custo real, virando uma válvula de escape contra o impulso.",
  },
];

export function buildHomeFaqs() {
  return SIMULATOR_FAQS.slice(0, 4);
}

export function buildCategoryFaqs(category, products = []) {
  const specific = categoryContent(category).faqs;
  const top = [...products].sort((a, b) => b.sold_fake - a.sold_fake).slice(0, 3);
  const dynamic = top.length
    ? [
        {
          q: `Quais produtos são mais desejados em ${category}?`,
          a: `No simulador, os mais procurados de ${category} são ${top
            .map((p) => p.name)
            .join(", ")}. Você pode adicionar todos ao carrinho e finalizar a compra de mentirinha sem pagar nada.`,
        },
      ]
    : [];
  return [...dynamic, ...specific, ...SIMULATOR_FAQS];
}

export function buildProductFaqs(product) {
  const off = discount(product.price, product.price_list);
  const installment = brl(product.price / 10);
  return [
    {
      q: `Quanto custa o ${product.name} na dopamina.?`,
      a: `O preço simulado do ${product.name} é ${brl(product.price)}${
        off > 0 ? ` (de ${brl(product.price_list)}, ${off}% OFF)` : ""
      }, em até 10x de ${installment} sem juros de mentira. Nenhum valor é cobrado de verdade.`,
    },
    {
      q: `O ${product.name} está em promoção?`,
      a:
        off > 0
          ? `Sim: o ${product.name} está com ${off}% de desconto simulado na oferta relâmpago. Você pode ainda usar o cupom DOPAMINA10 para reduzir mais o total fictício.`
          : `O ${product.name} está com preço simulado de ${brl(product.price)}. Use o cupom DOPAMINA10 para simular 10% de desconto no checkout de mentirinha.`,
    },
    {
      q: `Como recebo o ${product.name}?`,
      a: `A entrega do ${product.name} é 100% simulada e sai em até 5 segundos, com rastreio fictício. Nenhum produto real é enviado para o seu endereço.`,
    },
    {
      q: `Qual a garantia do ${product.name}?`,
      a: `A garantia é eterna e imaginária: o ${product.name} é uma vitrine de simulação, não existe de verdade e nunca vai dar defeito.`,
    },
    {
      q: `É seguro \u201ccomprar\u201d o ${product.name} aqui?`,
      a: `É totalmente seguro. O simulador não pede cartão, não solicita dados sensíveis e não cobra nada: o ${product.name} existe só para a experiência de compra de mentirinha.`,
    },
    {
      q: `Qual a avaliação e as especificações do ${product.name}?`,
      a: `O ${product.name} (SKU ${product.sku}) pertence ao departamento ${product.category}, tem nota ${product.rating.toFixed(
        1,
      )} com ${product.sold_fake.toLocaleString("pt-BR")} vendidos fictícios e as tags ${product.tags.join(", ")}.`,
    },
  ];
}
