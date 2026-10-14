const post = {
  slug: "simulador-funciona",
  status: "published",
  kind: "decision",
  pillar: "guia-simulador-de-compras",
  title: "Como funciona o simulador de compras da dopamina.",
  seoTitle: "Como funciona o simulador de compras (passo a passo)",
  description:
    "Veja como funciona o simulador de compras da dopamina.: carrinho, cupom DOPAMINA10, checkout de mentirinha e rastreio fictício — grátis e sem cartão.",
  keywords: ["como funciona simulador de compras", "simulador de compras online", "checkout de mentirinha"],
  date: "2026-10-14",
  reading: 6,
  intro:
    "O simulador de compras da dopamina. imita um e-commerce de verdade do início ao fim, mas sem cobrar nada. Neste artigo você entende exatamente o que acontece em cada etapa, o que fica registrado e por que é totalmente seguro usar.",
  blocks: [
    { type: "h2", text: "O que o simulador faz — e o que não faz" },
    {
      type: "ul",
      items: [
        "Faz: vitrine, busca, carrinho, cupom, checkout, resumo do pedido e rastreio.",
        "Faz: salvar favoritos e montar uma lista de desejos.",
        "Não faz: nenhuma cobrança, nenhum envio real, nenhum pedido de cartão.",
        "Não faz: coleta de dados sensíveis, como CPF, senha ou CVV.",
      ],
    },
    { type: "h2", text: "Passo a passo por dentro do fluxo" },
    {
      type: "ol",
      items: [
        "Vitrine: você navega pelos departamentos e vê produtos com preço e descrição.",
        "Carrinho: adiciona, remove e ajusta quantidades; o total se recalcula na hora.",
        "Cupom: o código DOPAMINA10 aplica 10% de desconto sobre o valor simulado.",
        "Checkout: você preenche dados fictícios — nenhum campo pede pagamento real.",
        "Pedido e rastreio: em segundos aparece um status e um código de rastreio inventado.",
      ],
    },
    {
      type: "p",
      text:
        "Todo o fluxo roda no navegador. É a mesma mecânica de uma [[compra de mentirinha|/blog/compras-de-mentirinha]], só que organizada como uma loja completa. Se você quer a visão geral do conceito, veja [[o que é um simulador de compras|/blog/o-que-e-simulador-de-compras]].",
    },
    { type: "h2", text: "O cupom e o cálculo do total" },
    {
      type: "p",
      text:
        "O desconto é aplicado sobre o subtotal do carrinho e reflete imediatamente no resumo. Como não há pagamento, o “total a pagar” é apenas um número de tela: serve para você sentir o efeito de uma promoção e comparar decisões, sem que nada saia da sua conta.",
    },
    { type: "h2", text: "O que é registrado" },
    {
      type: "p",
      text:
        "O simulador registra eventos agregados e anônimos: quantas pessoas visitaram uma categoria, adicionaram ao carrinho, aplicaram cupom ou finalizaram. Esses dados alimentam um estudo público de funil e comportamento de compra — nunca vinculados a você. É o mesmo tipo de métrica que um e-commerce usa para melhorar a loja, só que sem fins comerciais.",
    },
    { type: "h2", text: "É grátis e não pede cartão" },
    {
      type: "p",
      text:
        "Sim. Não há cadastro obrigatório, assinatura ou qualquer cobrança. Se algum site pedir seus dados de pagamento, ele não é um simulador de compras — e sim uma loja (ou um golpe). Aqui, a regra é simples: você entra, se diverte e sai sem pagar nada. Sobre como identificar sites fraudulentos, veja [[como identificar lojas falsas|/blog/identificar-lojas-falsas]].",
    },
    { type: "h2", text: "Como testar agora mesmo" },
    {
      type: "ol",
      items: [
        "Abra a loja e escolha um departamento.",
        "Adicione alguns produtos ao carrinho.",
        "Aplique o cupom DOPAMINA10 e confira o desconto.",
        "Finalize o pedido de mentirinha e veja o rastreio fictício.",
      ],
    },
    {
      type: "callout",
      title: "Pronto em minutos:",
      text:
        "sem cadastro, sem cartão e sem custo. Se depois disso a vontade de comprar passar, você acabou de economizar 100% do valor.",
    },
    { type: "h2", text: "O simulador nunca pede isto" },
    {
      type: "p",
      text:
        "Para deixar claro o que é seguro, vale listar o que um simulador honesto jamais solicita. Se algum site pedir qualquer um destes itens, ele não está simulando nada — e você deve sair imediatamente.",
    },
    {
      type: "ul",
      items: [
        "Número de cartão de crédito ou débito.",
        "Senha, código de segurança (CVV) ou token do banco.",
        "CPF ou qualquer documento real.",
        "Pix, transferência ou boleto para “liberar” a compra.",
      ],
    },
    {
      type: "p",
      text:
        "No simulador da dopamina. nada disso é pedido: os campos do checkout são de mentirinha e podem ser preenchidos com o que você quiser. É a diferença entre uma brincadeira segura e uma loja de verdade — ou, no pior caso, um golpe.",
    },
  ],
  faqs: [
    {
      q: "O simulador de compras da dopamina. é gratuito?",
      a: "Sim. É 100% gratuito, não exige cadastro e não pede dados de pagamento.",
    },
    {
      q: "O simulador envia algum produto?",
      a: "Não. O rastreio é fictício: nenhum produto existe e nada é enviado.",
    },
    {
      q: "Preciso informar cartão de crédito?",
      a: "Nunca. Um simulador de verdade não pede cartão, senha ou CPF. Os dados do checkout são de mentirinha.",
    },
    {
      q: "Que dados o simulador coleta?",
      a: "Apenas eventos agregados e anônimos sobre o funil (visitas, carrinho, checkout), usados para estudo de comportamento de compra.",
    },
  ],
};

export default post;
