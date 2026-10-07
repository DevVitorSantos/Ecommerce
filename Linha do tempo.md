# Linha do Tempo — Dopamina Ecommerce

> Documento exigido pelo `config.txt`: o que estamos fazendo agora, de onde viemos e para onde queremos chegar.

## Visão de longo prazo
**Chegar a um simulador de compras publicado (web + Play Store) que funcione como laboratório público de multi-touch attribution**, com dados abertos, dashboard público e arquitetura documentada — tudo com custo R$ 0 / US$ 25.

---

## Fase 0 — Brainstorm e documentação ✅
- [x] Pesquisar referências de mercado (Google, GitHub, Reddit, YouTube, docs oficiais GA4).
- [x] Analisar concorrência: dopaminashop.com.br, dopamineshop.co, dopamine-shop.com, foodnevercomes, lojafalsa, compreinada, dopaminesite.app.
- [x] Definir conceito, diferencial (store + data platform) e stack.
- [x] Especificar arquitetura de dados (dual-write: GA4 + base própria de pedidos).
- [x] Especificar plano de medição GA4 e estratégia multi-touch.
- [x] Criar `BRAINSTORM.md`, `Linha do tempo.md`, `log.md`, `historygit.md`.
- [x] `git init` + primeiro commit.

**Saída desta fase:** documentos de planejamento versionados no git.

## Fase 1 — MVP do site (EM ANDAMENTO)
- [x] Scaffold Next.js + Tailwind + Zustand (**JavaScript**, sem TypeScript — decisão 2026-10-07; `cacheComponents: false` + ISR 1h).
- [x] `data/products.csv` (40 produtos) + fotos do Unsplash (`image_url`, 40/40 verificadas) + validador `scripts/validate_products.mjs`.
- [x] Home, categoria, PDP, carrinho (localStorage/Zustand), checkout simulado em 4 passos, confirmação e rastreio falso + busca, pedidos, `/stats`, cupom DOPAMINA10.
- [x] Instrumentação de eventos (14 pushes no dataLayer, `docs/MEASUREMENT.md`, anti-duplicidade) + GTM instalado (GTM-5RLXF4BF) + banner LGPD/Consent Mode v2.
- [ ] Criar propriedade GA4 + tag GA4 dentro do GTM + `NEXT_PUBLIC_GA4_ID` (se necessário).
- [ ] Deploy na Vercel Hobby + validação em Preview (GTM) e DebugView (GA4) com prints em `tests/`.

## Fase 2 — Engenharia de dados (bronze + Medallion)
- [ ] Conta GCP (com fatura, dentro do free tier) + link de export GA4 → BigQuery (dataset **bronze**, raw web+app).
- [ ] Tabelas `orders`/`order_items` no Supabase + `POST /api/orders`.
- [ ] Script de export diário → **load job no BigQuery bronze** + `exports/*.csv` no git (backup human-readable).
- [ ] Conta **Databricks Free Edition** (Unity Catalog + Delta Lake) + verificação das quotas diárias.
- [ ] Job de ingestão diária **bronze (BigQuery) → silver (Databricks)**: limpeza, dedupe, stitch `user×session×UTM`.
- [ ] Transformações silver → **gold** (`mart_funnel`, `mart_products`, `mart_retention`) em `sql/`.

## Fase 3 — Análise multi-touch + dataviz
- [ ] `data/campaigns.csv` + página `/lanca/[campaign_id]` de geração de links UTM.
- [ ] SQL de caminhos + modelos: first/last/linear/time-decay/position-based + assistências (gold, Databricks).
- [ ] **`mart_attribution_paths`** publicado na camada gold.
- [ ] Dataviz primária: **dashboards Databricks SQL (warehouse 2XS) + Genie**.
- [ ] Dataviz auxiliar: **Looker Studio** conectado ao BigQuery bronze (relatórios didáticos do dado bruto).
- [ ] Página pública `/stats` ("dinheiro não gasto", top produtos, funil) alimentada pela gold.
- [ ] Consultas reproduzíveis versionadas em `sql/` (bronze → silver → gold).

## Fase 4 — App Play Store
- [ ] PWA (manifest, service worker, ícones, Lighthouse ≥ 80).
- [ ] Bubblewrap/PWABuilder → TWA assinada + `assetlinks.json`.
- [ ] Play Console (US$ 25) + 12 testers × 14 dias (teste fechado).
- [ ] Publicação e validação de `platform_shell=twa` no GA4.

## Fase 5 — Crescimento (opcional)
- [ ] Gamificação ética (badges, "clareira" de gastos), artigos SEO, idiomas.
- [ ] Monetização só se fizer sentido (ads rotulados / apoio).

---

## Marcos (definition of done)

| Marco | Critério |
|---|---|
| M1 | Site no ar com checkout simulado emitindo os 15 eventos do GA4. |
| M2 | Tabela `orders` recebendo pedidos, bronze no BigQuery e CSV diário. |
| M2.5 | Camada Medallion rodando: job bronze→silver→gold no Databricks com dados limpos. |
| M3 | 1º dashboard de atribuição multi-touch publicado (Databricks SQL/Genie + Looker). |
| M4 | App publicado na Play Store. |
