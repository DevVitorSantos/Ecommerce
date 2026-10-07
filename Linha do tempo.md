# Linha do Tempo — Dopamina Ecommerce

> Documento exigido pelo `config.txt`: o que estamos fazendo agora, de onde viemos e para onde queremos chegar.

## Visão de longo prazo
**Chegar a um simulador de compras publicado (web + Play Store) que funcione como laboratório público de multi-touch attribution**, com dados abertos, dashboard público e arquitetura documentada — tudo com custo R$ 0 / US$ 25.

---

## Fase 0 — Brainstorm e documentação (ATUAL) ✅
- [x] Pesquisar referências de mercado (Google, GitHub, Reddit, YouTube, docs oficiais GA4).
- [x] Analisar concorrência: dopaminashop.com.br, dopamineshop.co, dopamine-shop.com, foodnevercomes, lojafalsa, compreinada, dopaminesite.app.
- [x] Definir conceito, diferencial (store + data platform) e stack.
- [x] Especificar arquitetura de dados (dual-write: GA4 + base própria de pedidos).
- [x] Especificar plano de medição GA4 e estratégia multi-touch.
- [x] Criar `BRAINSTORM.md`, `Linha do tempo.md`, `log.md`, `historygit.md`.
- [x] `git init` + primeiro commit.

**Saída desta fase:** documentos de planejamento versionados no git.

## Fase 1 — MVP do site (próxima)
- [ ] Scaffold Next.js + TypeScript + Tailwind.
- [ ] `data/products.csv` (catálogo inicial ~40 produtos) + geração build-time.
- [ ] Home, categoria, PDP, carrinho (localStorage/Zustand), checkout simulado em 4 passos, confirmação e rastreio falso.
- [ ] Instrumentação GA4 (tabela de eventos da seção 4 do brainstorm).
- [ ] Deploy na Vercel Hobby + validação em DebugView (prints em `tests/`).

## Fase 2 — Engenharia de dados
- [ ] Conta GCP (com fatura, dentro do free tier) + link de export GA4 → BigQuery (diário).
- [ ] Tabelas `orders`/`order_items` no Supabase + `POST /api/orders`.
- [ ] Script de export diário → **load job no BigQuery** + `exports/*.csv` no git (backup human-readable).
- [ ] Views de staging e primeiros marts em SQL (`sql/`, rodam no BigQuery).

## Fase 3 — Análise multi-touch
- [ ] `data/campaigns.csv` + página `/lanca/[campaign_id]` de geração de links UTM.
- [ ] SQL de caminhos + modelos: first/last/linear/time-decay/position-based + assistências (no BigQuery).
- [ ] Dashboard Looker Studio conectado ao BigQuery.
- [ ] Página pública `/stats` ("dinheiro não gasto", top produtos, funil) alimentada pelo BigQuery.
- [ ] Consultas reproduzíveis versionadas em `sql/` (camadas staging → marts → dashboards).

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
| M2 | Tabela `orders` recebendo pedidos e exportando CSV diário. |
| M3 | 1º dashboard de atribuição multi-touch publicado. |
| M4 | App publicado na Play Store. |
