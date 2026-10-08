# 4. SEO — Otimização para Home, Categorias e PDP

> Documento novo (offline). Baseado nos 3 grupos sugeridos: **Grupo A** (descoberta/funcionalidade) → começar por ele; **Grupo B** (desejo/comportamento); **Grupo C** (tendência emergente). Esta é a **Fase 4a** do desenvolvimento (SEO), separada das análises (Fases 2–6).

## 4.1 Objetivo
Otimizar SEO on-page (títulos, meta descriptions, URLs, dados estruturados, heading tags, imagens) para **Home**, **Categorias (`/categoria/[slug]`)** e **PDP (`/produto/[slug]`)**, guiado por intent de busca (A → B → C). Não vamos criar conteúdo de blog por enquanto — foco em **páginas comerciais/estruturais**.

## 4.2 Grupos de palavras-chave (KPI de intenção)

| Grupo | Função | Palavras-chave | Intenção |
|---|---|---|---|
| **A — Descoberta** | Trazer quem quer **usar/simular** | `simulador de compras`, `simulador de compras online`, `compras de mentirinha`, `site para simular compras` | Alta (produto-função). **Prioritário (começar aqui)** |
| **B — Desejo/Comportamento** | Trazer quem quer **sentir/comportamento** | `vontade de comprar`, `comprar sem gastar dinheiro`, `prazer em fazer compras`, `como controlar compras por impulso` | Emocional/informativa (topo-médio funil). Secundário. |
| **C — Tendência emergente** | Trazer quem pesquisa o **fenômeno** | `site de dopamina`, `dopamine shopping`, `o que é dopamine shopping`, `como funciona um dopamine shop` | Descoberta/tendência (amplia alcance). Terciário. |

**Recomendação:** começar por **Grupo A** (mais direto à funcionalidade). B e C para ampliar aquisição orgânica depois de validar CTR/indexação.

## 4.3 Home (`/`) — SEO

### Meta Title (≤ 60)
Sugestões (priorizar A):

1. `Simulador de compras online — Compre tudo, gaste nada`
2. `Simulador de compras — Site para simular compras sem gastar dinheiro`
3. `Compras de mentirinha — Simulador de compras online`

### Meta Description (≤ 160)
1. `Simulador de compras online para experimentar o desejo de comprar sem gastar dinheiro. Adicione ao carrinho, faça checkout e veja a entrega simulada.`
2. `Site para simular compras: adicione produtos, carrinho, checkout e entrega simulada — sem gastar dinheiro.`
3. `Compras de mentirinha: simule uma compra online com carrinho, frete e checkout, sem nenhum gasto real.`

### H1
`Simulador de compras — compre tudo, gaste nada`

### H2 sugeridos (heading structure)
- `Navegue por departamentos` (já existe)
- `Ofertas Relâmpago 24 Horas` (já existe)
- `Destaques da semana` (já existe)
- `O que dizem os clientes da dopamina.` (já existe)
- `Como funciona o simulador de compras` *(novo — pode explicar o propósito sem vender gasto real)*

### Texto auxiliar (above-the-fold, natural)
Frase opcional no hero (não duplicar H1): *"Experimente o prazer de fazer compras sem gastar dinheiro. É só o desejo, sem o custo real."*

### Schema.org (JSON-LD) — Homepage
**WebSite + Organization (ou apenas WebSite)**. Sugestão:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Dopamina Ecommerce",
  "url": "https://ecommerce-ruby-delta-12.vercel.app/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://ecommerce-ruby-delta-12.vercel.app/busca?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "description": "Simulador de compras online para simular compras sem gastar dinheiro."
}
```

### Ações Home
- [ ] Adicionar `generateMetadata()` (Next.js App Router) com Title + Description (priorizar Grupo A #2)
- [ ] Adicionar JSON-LD `WebSite` no `<head>` (layout ou page via script)
- [ ] Criar bloco "Como funciona o simulador de compras" (H2 + 3 bullets curtos, 40–60 palavras) — sem exagero
- [ ] Revisar H1 único (hero já tem). Garantir 1 H1 por página
- [ ] Adicionar `aria-label`/textos alternativos naturais (sem keyword stuffing)

## 4.4 Categorias (`/categoria/[slug]`) — SEO dinâmico

### Regra por página
Cada categoria vira uma página de **nicho** (descoberta + relevância). Usar nome da categoria no título.

### Meta Title (≤ 60)
`[Categoria] — Simulador de compras | Compras de mentirinha`

Ex.: `Eletrônicos — Simulador de compras online | Sem gastar dinheiro`

### Meta Description (≤ 160)
`Simule compras na categoria [Categoria] sem gastar dinheiro. Veja produtos, adicione ao carrinho e faça checkout simulado.`

### H1
`[Categoria] — simulador de compras`

### Texto descritivo (opcional, baixo ruído)
Bloco curto (1–2 linhas) abaixo do H1: *"Explore [Categoria] no nosso simulador de compras online. Adicione ao carrinho e finalize um checkout simulado, sem nenhum gasto real."*

### BreadcrumbList (Schema.org)
```json
{
  "@context":"https://schema.org",
  "@type":"BreadcrumbList",
  "itemListElement":[
    {"@type":"ListItem","position":1,"name":"Início","item":"https://.../"},
    {"@type":"ListItem","position":2,"name":"[Categoria]","item":"https://.../categoria/[slug]"}
  ]
}
```

### ItemList (opcional, útil p/ ecommerce)
```json
{
  "@context":"https://schema.org",
  "@type":"ItemList",
  "itemListElement": [
    {"@type":"ListItem","position":1,"item":{"@type":"Product","name":"...","url":"..."}},
    ...
  ]
}
```
*(ItemList leve: pode listar até 8–12 primeiros produtos para não pesar)*

### Ações Categorias
- [ ] `generateMetadata()` dinâmico (usa `category` decodificado)
- [ ] JSON-LD `BreadcrumbList` por página
- [ ] Incluir texto curto descritivo (natural, 1–2 frases) abaixo de H1
- [ ] Garantir H1 único, títulos com categoria no início

## 4.5 PDP (`/produto/[slug]`) — SEO produto

### Meta Title (≤ 60)
`[Nome do produto] — Simulador de compras | Sem gastar dinheiro`

### Meta Description (≤ 160)
`Veja [Nome do produto] no simulador de compras online. Adicione ao carrinho e faça um checkout simulado — sem gastar dinheiro.`

### H1
`[Nome do produto]`

### Schema.org — Product + BreadcrumbList + Offer

**Product + Offer (preço simulado):**
```json
{
  "@context":"https://schema.org",
  "@type":"Product",
  "name":"[Nome]",
  "image":["[image_url]"],
  "description":"[descrição curta]",
  "sku":"[SKU]",
  "brand":{"@type":"Brand","name":"Dopamina"},
  "offers":{
    "@type":"Offer",
    "url":"https://.../produto/[slug]",
    "priceCurrency":"BRL",
    "price":"[price]",
    "availability":"https://schema.org/InStock",
    "seller":{"@type":"Organization","name":"Dopamina Ecommerce"},
    "priceValidUntil":"2099-12-31"
  }
}
```
> **Nota:** preço é **simulado** (projeto não vende). `priceValidUntil` distante + texto no site deixa explícito o caráter de simulação (não enganoso). Também podemos reforçar com `simulation_flag` no tracking (já temos).

### BreadcrumbList PDP
Incluir Home → Categoria → Produto.

### Imagens
- Usar `alt` descritivo: `"Imagem de [Nome do produto] — simulador de compras"`
- `loading="lazy"` onde aplicável (já em cards) + manter `image_url` existente

### Ações PDP
- [ ] `generateMetadata()` dinâmico (nome + descrição curta)
- [ ] JSON-LD `Product` + `Offer` + `BreadcrumbList`
- [ ] Garantir 1 H1, descrição curta legível
- [ ] Alt text descritivo em todas as imagens do produto

## 4.6 Plano de execução (Fase 4a — Desenvolvimento/SEO)

Adicionar como **Fase 4a — SEO (Otimização On-Page)**, entre Fase 4 (Análise) e Fase 5 (Engenharia), ou **dentro de Desenvolvimento**. Sugestão: colocar como **subfase do Desenvolvimento** (não mistura com análise/engenharia).

**Sugestão de encaixe (Linha do tempo):**
Criar **Fase 1b — SEO On-Page (Home/Categorias/PDP)** logo após **Fase 1 — MVP web ✅** (antes de Fase 2 de análise). Motivo: otimizações são de código/markup (desenvolvimento), não dependem de GA4/Databricks.

### Subtarefas Fase 1b — SEO
- [ ] **Home**: `generateMetadata()` + WebSite JSON-LD + bloco "Como funciona o simulador de compras" (H2)
- [ ] **Categorias**: `generateMetadata()` dinâmico + BreadcrumbList (+ ItemList opcional)
- [ ] **PDP**: `generateMetadata()` + Product+Offer+BreadcrumbList + alt text
- [ ] Revisar heading hierarchy (1 H1/página, H2/H3 corretos)
- [ ] Testar títulos/metas (não ultrapassar limites) + validar JSON-LD (Rich Results Test)
- [ ] Registrar prints/evidências em `tests/seo/` (opcional) + `log.md`

## 4.7 Direção de palavras-chave (resumo prático)
1. **Começar Grupo A** (descoberta) — cobre a funcionalidade diretamente.
2. **Depois Grupo B** (desejo) — captura intenção emocional (bom p/ CTR).
3. **Depois Grupo C** (tendência) — amplia alcance orgânico.

**Foco inicial:** Home + Categorias (maior alcance de páginas). PDPs depois (milhões potenciais, mas começam com nomes de produto).

## 4.8 Observações (não-enganoso)
Projeto é **simulador** (sem venda real). Schema.org com preço está OK (oferta simulada). Reforçar no copy com "sem gastar dinheiro", "checkout simulado", "entrega simulada" — natural, sem keyword stuffing.