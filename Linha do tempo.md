# Linha do Tempo — Dopamina Ecommerce

> Documento exigido pelo `config.txt`: o que estamos fazendo agora, de onde viemos e para onde queremos chegar.

## Visão de longo prazo
**Chegar a um simulador de compras publicado (web + Play Store) que funcione como laboratório público de multi-touch attribution**, com dados abertos, dashboard público e arquitetura documentada — tudo com custo R$ 0 / US$ 25.

## As 3 frentes do projeto
O projeto separa 3 trabalhos (que se confundem se não tiverem checklist próprio):

| Frente | O quê | Fases |
|---|---|---|
| 🎨 **Desenvolvimento** | Construir o produto (simulador de compras) | Fase 1 ✅ (e melhorias pontuais com as outras) |
| 🔎 **Análise de dados** | Perguntas de negócio → tracking/tagging → entender o dado → dashboards | Fases 2, 3, 4, 6 |
| 🛢️ **Engenharia de dados** | Estruturar as tabelas (Medallion) para as perguntas serem respondidas | Fase 5 |

**Ordenação (jornada):** pegar a loja pronta → conversar com a liderança (perguntas) →
verificar na interface o que já está sendo traqueado (checklist) → entender os dados que temos e
os problemas de atribuição → **aí sim** estruturar as tabelas (engenharia) → dashboards.

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

## Fase 1 — Desenvolvimento: MVP web ✅ (CONCLUÍDA)
- [x] Scaffold Next.js + Tailwind + Zustand (**JavaScript**, sem TypeScript — decisão 2026-10-07; `cacheComponents: false` + ISR 1h).
- [x] `data/products.csv` (40 produtos) + fotos do Unsplash (`image_url`, 40/40 verificadas) + validador `scripts/validate_products.mjs`.
- [x] Home, categoria, PDP, carrinho (localStorage/Zustand), checkout simulado em 4 passos, confirmação e rastreio falso + busca, pedidos, `/stats`, cupom DOPAMINA10.
- [x] Instrumentação de eventos (14 pushes no dataLayer, `docs/MEASUREMENT.md`, anti-duplicidade) + GTM instalado (GTM-5RLXF4BF) + banner LGPD/Consent Mode v2.
- [x] Deploy na Vercel (URL temporária no ar) + catálogo validado vindo do Supabase.
- [x] Fundação de dados: Supabase (`orders`/`order_items`/`products`), BigQuery bronze + loads validados.
> Validação dos eventos na interface (DebugView) acontece na **Fase 3**, junto com a auditoria de tracking.

## Fase 1b — Desenvolvimento: SEO On-Page (Home, Categorias, PDP) ✅
> **Otimização guiada por intenção.** Iniciar pelo **Grupo A** (simulador de compras / compras de mentirinha), depois B/C. Foco: páginas estruturais, não blog. Plano em `SEO_PLANO4.md`.
- [x] **Home**: `generateMetadata()` (title/description/canonical) + JSON-LD `WebSite`/`Organization`/`FAQPage` + bloco "Como funciona o simulador de compras" (H2) + FAQ.
- [x] **Categorias**: `generateMetadata()` dinâmico + JSON-LD `BreadcrumbList`/`ItemList`/`FAQPage` + intro dinâmica + FAQ (9 categorias).
- [x] **PDP**: `generateMetadata()` dinâmico + JSON-LD `Product+Offer+AggregateRating`/`BreadcrumbList`/`FAQPage` + bloco "Sobre o produto" + FAQ + `alt` descritivo.
- [x] Heading hierarchy: 1 H1 por página (Home/Categoria/PDP).
- [x] Sitemap (`/sitemap.xml`, 51 URLs) + `robots.txt` (bloqueia carrinho/checkout/api/busca).
- [x] Helpers reutilizáveis: `lib/seo.js`, `lib/jsonld.js`, `components/JsonLd.jsx`, `components/FaqSection.jsx`.
- [x] Validado com `next build` (EXIT 0) + JSON-LD parseável (3 blocos/página, FAQ visível = FAQPage).
- [ ] Evidências em `tests/seo/` (Rich Results Test da URL de produção) + registro no `log.md`.
- [ ] Definir `NEXT_PUBLIC_SITE_URL` na Vercel quando o domínio `dopaminaloja.com.br` estiver ativo.

## Fase 2 — Análise: Perguntas de negócio (com a liderança)
> **Objetivo: saber o que o ecommerce precisa para crescer, traduzido em perguntas que o dado precisa responder.**
> Nada é traqueado, atingido ou modelado antes desta conversa estar documentada (`PERGUNTAS.md`).
- [ ] Diálogo com a liderança: "o que você precisa saber para a loja crescer?" → registrar perguntas.
- [ ] Priorização com a liderança: quais perguntas dão mais valor × quais já têm dado hoje.
- [ ] Catalogar as perguntas (P1–P21 em `PERGUNTAS.md`) com métrica, fonte e status — ajustar ao que a liderança disser.
- [ ] Validar: **toda decisão de medição/tabela daqui em diante tem que responder uma P#** (sem pergunta → sem mart).

## Fase 3 — Análise: Tracking & tagging (auditoria na interface)
> **Objetivo: verificar se os dados para responder as perguntas da Fase 2 já estão sendo traqueados, tagueados e enviados ao GA4.**
> Se sim → checklist de eventos base de ecommerce funcionando. Se não → traquear.
- [ ] Auditoria na interface: percorrer home → categoria → PDP → carrinho → checkout → confirmação e conferir dataLayer/GTM/GA4 (DebugView + Preview).
- [ ] **Checklist de eventos base de ecommerce funcionando** (prints em `tests/`): `view_item_list`, `view_item`, `add_to_cart`, `view_cart`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase` + consent LGPD.
- [ ] Traquear o que faltar (gatilhos/dataLayer no GTM) até o checklist passar 100%.
- [ ] Registrar **key events** + **dimensões customizadas** no GA4 (checklist `PERGUNTAS.md` §2) → fecha **M1**.
- [ ] **Tagging plan:** taxonomia UTM (`PERGUNTAS.md` §3) + `data/campaigns.csv` + `/lanca/[campaign_id]`.

## Fase 4 — Análise: Entender os dados + diagnóstico de atribuição
> **Objetivo: saber quais dados temos, se há problema de atribuição, e deixar especificada a estrutura de tabelas para a engenharia (Fase 5).**
- [ ] Assegurar a **fundação**: confirmar 1ª tabela `events_*` do export GA4 no BigQuery (**M2.1**; `orders` no bronze já validado — M2 ✓).
- [ ] Sanidade/volumetria: contagem por `event_name`, pedidos Supabase × CSV × bronze (batem?), atraso do export, cobertura `user_pseudo_id`/`session_id` (P18).
- [ ] **Diagnóstico de atribuição:** primeiras queries no bronze (source/medium/campaign × purchase, funil básico, cupom × canal); identificar o que exige stitching/coorte vs. o que já dá para responder (Ondas 1–2).
- [ ] **Especificação das tabelas para engenharia:** rascunho do schema silver/gold no `PERGUNTAS.md`/`sql/` (o que esticar, o que agregar) — entrega para a Fase 5.
- [ ] Atualizar status das perguntas P1–P21 com o que a Fase 4 descobriu.

## Fase 5 — Engenharia de dados: estruturar as tabelas (Medallion)
> **Objetivo: transformar bronze → silver → gold conforme a especificação da Fase 4.**
- [ ] Conta **Databricks Free Edition** (Unity Catalog + Delta Lake) + verificação das quotas diárias.
- [ ] Job de ingestão diária **bronze (BigQuery) → silver**: limpeza, dedupe, stitch `user×session×UTM`.
- [ ] Marts silver → **gold** (`mart_funnel`, `mart_products`, `mart_retention`) — **cada um vinculado a uma P# da Fase 2** (gate = Ondas 3).

## Fase 6 — Análise: Dashboards & dataviz
- [ ] SQL de caminhos + modelos: first/last/linear/time-decay/position-based + assistências (gold, Databricks) → **responde P3/P4**.
- [ ] **`mart_attribution_paths`** publicado na camada gold.
- [ ] Dataviz primária: **dashboards Databricks SQL (warehouse 2XS) + Genie**.
- [ ] Dataviz auxiliar: **Looker Studio** conectado ao BigQuery bronze (relatórios didáticos do dado bruto).
- [ ] Página pública `/stats` ("dinheiro não gasto", top produtos, funil) alimentada pela gold → **responde P7 (funil)**.
- [ ] Consultas reproduzíveis versionadas em `sql/` (bronze → silver → gold).
- [ ] Revisão com a liderança: apresentar as respostas das perguntas da Fase 2 e o "o que devemos medir/traquear agora" → vira backlog da Fase 8.

## Fase 7 — Desenvolvimento: App Play Store
- [ ] PWA (manifest, service worker, ícones, Lighthouse ≥ 80).
- [ ] Bubblewrap/PWABuilder → TWA assinada + `assetlinks.json`.
- [ ] Play Console (US$ 25) + 12 testers × 14 dias (teste fechado).
- [ ] Publicação e validação de `platform_shell=twa` no GA4 (**baseline P21 para comparar**).

## Fase 8 — Crescimento (opcional)
- [ ] Gamificação ética (badges, "clareira" de gastos), artigos SEO, idiomas.
- [ ] Monetização só se fizer sentido (ads rotulados / apoio).
- [ ] Novas perguntas da liderança (Fase 6) → novo ciclo de medição.

---

## Marcos (definition of done)

| Marco | Critério | Onde fecha |
|---|---|---|
| M1 | Site no ar com checkout simulado emitindo os 15 eventos do GA4 **validado em DebugView** (checklist de eventos base ok). | Fase 3 |
| M2 | `orders` recebendo pedidos, bronze no BigQuery e CSV diário (✅ já validado — hoje as três frentes dependem disso). | Fase 1 |
| M2.1 | **1ª tabela `events_*` do export GA4 confirmada no BigQuery** (fundação da Fase 4). | Fase 4 |
| M2.5 | Camada Medallion rodando: job bronze→silver→gold no Databricks com dados limpos. | Fase 5 |
| M3 | 1º dashboard de atribuição multi-touch publicado (Databricks SQL/Genie + Looker) **e perguntas P3, P4, P7 respondidas** com query/print salvo. | Fase 6 |
| M4 | App publicado na Play Store. | Fase 7 |

---

## Níveis — fechamento (subtarefas obrigatórias por nível)

> Regra: um nível **só fecha quando TODAS as sub tarefas estiverem marcadas**. Evidência sempre em `tests/` (prints) ou `sql/` (queries versionadas); registo no `log.md`.

### Nível M2 — Bronze de pedidos funcionando ・ **status: ✅ FECHADO (validado com dado real)**
- [x] Tabelas `orders` / `order_items` / `products` no Supabase (RLS + índices).
- [x] `POST /api/orders` gravando pedido com `user_pseudo_id`/`session_id`.
- [x] Seed de 40 produtos rodado e conferido (`products: 40/40`).
- [x] Workflow `export-orders` verde (cron 03h BRT + manual).
- [x] Load no `Dopamina_Ecommerce_Bronze` executado sem erro (schema explícito).
- [x] CSVs de backup versionados no git (`exports/`).
- [x] **Dado conferido na tabela pelo usuário no console do BigQuery.**

### Nível M1 — Eventos base de ecommerce validados (Fase 3)
- [ ] **GTM Preview** ativo e carregando o container na URL de produção.
- [ ] **DebugView** captando os eventos em tempo real na mesma sessão.
- [ ] Checklist dos **15 eventos** presentes (1 print de cada): `view_item_list`, `select_item`, `view_item`, `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase`, `refund`, `view_promotion`/`select_promotion`, `search`, `fake_delivery_progress`, `share`.
- [ ] `purchase` completo: `transaction_id`, `items[]`, `value`, `coupon`, `currency=BRL`.
- [ ] **Consent LGPD:** aceitar → `consent update` granted; recusar → denied (sem disparos).
- [ ] Anti-duplicidade: 3 cliques = 1 evento (PDP/categoria/checkout).
- [ ] Key events marcados no GA4 (`purchase`, `begin_checkout`, `fake_delivery_progress`).
- [ ] Dimensões customizadas registradas no GA4 (checklist `PERGUNTAS.md` §2).
- [ ] Prints salvos em `tests/` + registro no `log.md`.

### Nível M2.1 — Export GA4 confirmado no BigQuery (Fase 4)
- [ ] 1ª tabela `analytics_<id>.events_*` aparecer no dataset do GA4 (24–48h do link).
- [ ] Query de validação: `event_name × COUNT(*)` para o 1º dia (contagem > 0 e coerente).
- [ ] Conferir no schema: `user_pseudo_id`, `session_id`, `event_params`, `traffic_source` presentes.
- [ ] Conferir que os 15 eventos aparecem com os parâmetros esperados.
- [ ] Medir **atraso** do export (data de eventos × data de carga).
- [ ] Query salva em `sql/` + print em `tests/`.

### Nível M2.5 — Medallion rodando (Fase 5)
- [ ] Conta **Databricks Free Edition** criada (Unity Catalog + Delta Lake) + quotas conferidas.
- [ ] Conexão/leitura do BigQuery bronze (carga diária em Delta).
- [ ] **Silver:** limpeza + **dedupe** (eventos duplicados removidos) + **stitch** `user_pseudo_id × session_id × UTM`.
- [ ] Cobertura do stitch medida (**P18/P19**) — % de pedidos casados.
- [ ] **Gold `mart_funnel`** (passa a etapa + drop-off → P7).
- [ ] **Gold `mart_products`** (gap view×compra, categoria, preço → P12/P13/P15).
- [ ] **Gold `mart_retention`** (2ª compra, coortes → P16/P17).
- [ ] Validação: contagens da gold batem com o bronze (tolerância documentada).
- [ ] Cada mart com pelo menos uma **P#** vinculada.
- [ ] Job agendado (datas determinísticas) + print dos gráficos/livros de tabelas.

### Nível M3 — Atribuição + dashboard publicado (Fase 6)
- [ ] SQL de **caminho** por `user_pseudo_id` (sequência de source/medium/campaign ordenada).
- [ ] Modelos implementados na gold: **first-click, last-click (non-direct), linear, time-decay, position-based (40/20/40)** + assistências.
- [ ] **`mart_attribution_paths`** publicado.
- [ ] Dashboard **Databricks SQL (warehouse 2XS) + Genie** criado e compartilhado.
- [ ] **Looker Studio** conectado ao bronze (relatório didático do dado bruto).
- [ ] `/stats` pública alimentada pela gold (funil, top produtos, "dinheiro não gasto").
- [ ] **P3, P4, P7 respondidas** com query/print salvo em `sql/` ou `tests/`.
- [ ] Revisão com a liderança → novas perguntas documentadas (loop da Fase 8).

### Nível M4 — App na Play Store (Fase 7)
- [ ] PWA: manifest + service worker + ícones + **Lighthouse ≥ 80** (PWA installable).
- [ ] TWA assinada via **Bubblewrap/PWABuilder** + `assetlinks.json` no domínio.
- [ ] Play Console: **US$ 25** pago + conta de desenvolvedor verificada.
- [ ] Teste fechado: **12 testers × 14 dias** + relatório de feedback.
- [ ] Publicação (produção) aprovada.
- [ ] `platform_shell=twa` validado no GA4 + **baseline P21** (antes × depois) disponível.