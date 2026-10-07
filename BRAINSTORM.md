# BRAINSTORM — Dopamina Ecommerce

> Simulador de compras 100% gratuito: carrinho, checkout e "entrega" fictícia.
> Nenhum produto real, nenhum dinheiro real. O produto final é **dado**.

---

## 1. Conceito

| Pergunta | Resposta |
|---|---|
| O que é? | Um e-commerce estático onde o usuário "compra" sem gastar nada — estética, UX e psicologia idênticas a um e-commerce real (urgência, frete grátis, cupom, oferta relâmpago). |
| Para quem? | Gen Z / millennials que curtem a macro-tendência coreana de *dopamine sites*; gente que quer o "hit" da compra sem culpa; estudantes de dados que querem ver a jornada real. |
| Qual é o diferencial? | **Nossos concorrentes vendem entretenimento. Nós vendemos instrumentação.** O site é um laboratório de multi-touch attribution: todo clique é evento, toda compra é linha em base de dados, e o público pode ver o dashboard. |
| Como ganha dinheiro? | Fase 1: nada (portfólio/estudo). Fase 2 opcional: ads claramente rotulados + artigos SEO. **Nunca** cobrar do usuário — isso mataria o conceito. |
| Como mede sucesso? | Nº de checkouts simulados, valor simulado "não gasto", taxa de conclusão do funil, tamanho médio do carrinho, satisfação (eventos de repeat session). |

### Concorrência analisada (referências)
- **dopaminashop.com.br/pt** — PT-BR, catálogo grande, 7 idiomas, artigos SEO, tom terapêutico (Oniomania).
- **dopamineshop.co** — EN, 17k produtos, FoodDash, Mystery Packs, **página /stats pública** com dados ao vivo (CC BY 4.0). Bom benchmark de "data as content".
- **dopamine-shop.com** — EN, blog forte, receipt "quanto você *não* gastou".
- **foodnevercomes.com** — food delivery simulado; press real (The Times, CNN).
- **thedopamine.shop** — luxo + gamificação (badges, closet).
- **dopaminesite.app** — anti-dark-pattern: sem streaks, sem escassez falsa, sem recompensas aleatórias. **Referência ética.**
- **lojafalsa.com / compreinada.com** — ângulo de ofertas/cupons (modelo mais "brincadeira").

**Nosso ângulo único:** store + *data platform*. Ninguém nesse mercado publica a arquitetura de medição, os modelos de atribuição e os dados brutos.

---

## 2. Arquitetura de dados (visão geral)

```
                    ┌─────────────────────────────────────────────┐
   [USUÁRIO]        │  WEB (Next.js SSG) — Vercel Hobby  R$0      │
   navegador/app ──►│  data/products.csv (build time)             │
        │           │  carrinho: localStorage (Zustand)           │
        │           │  checkout simulado (4 telas)                │
        │           └──────────────┬──────────────────────────────┘
        │                          │
        │            dupla escrita (dual-write)
        │                          │
   ┌────▼───────────────┐   ┌──────▼───────────────────────────────┐
   │ CAMADA 1: GA4      │   │ CAMADA 2: BASE DE PEDIDOS PRÓPRIA    │
   │ gtag ecommerce      │   │ POST /api/orders (serverless)       │
   │ + UTM simulados     │   │ → Supabase free (Postgres)          │
   │ → BigQuery export   │   │ → load job diário p/ BigQuery       │
   │   diário (grátis)   │   │   + CSV backup no git               │
   └────┬───────────────┘   └──────┬───────────────────────────────┘
        │                          │
        └────────────┬─────────────┘
                     ▼
        ┌───────────────────────────────────────┐
        │ BRONZE (RAW) — BigQuery               │
        │ dataset bronze: eventos web+app e      │
        │ pedidos INTOCADOS (GA4 export diário +  │
        │ load job) + CSV backup no git          │
        └───────────────────┬───────────────────┘
                            │ ingestão diária (job)
                            ▼
   ┌────────────────────────────────────────────────────────┐
   │ CAMADA 3 — DATABRICKS FREE EDITION (Medallion)         │
   │ Unity Catalog + Delta Lake                             │
   │  🥈 SILVER — limpeza, dedupe, stitch user×session×UTM  │
   │  🥇 GOLD  — mart_funnel, mart_attribution_paths,       │
   │             mart_products, mart_retention              │
   └───────┬──────────────────────────────┬─────────────────┘
           ▼                              ▼
   Databricks SQL WH + Genie      /stats público
   (dashboards primários)         (data-as-content)
   Looker Studio (BigQuery bronze
   p/ relatórios auxiliares)
```

**Por que dual-write (GA4 + base própria)?**
1. GA4 é agregado, com *thresholds*, amostragem a partir de 10M eventos/mês e retenção de 14 meses (free) → **não é seu dado**.
2. A base própria dá linha-a-linha de pedido (`user_pseudo_id`, `session_id`, itens, UTM) → permite calcular **qualquer modelo de atribuição** sem depender do DDA preto-do-GA4.
3. Se um dos dois falhar, o outro sustenta a análise.

---

## 3. Engenharia de dados

### 3.1 Origem do catálogo (sem custo)
- `data/products.csv` — fonte única da verdade (sku, nome, categoria, preco, preco_cheio, rating, vendidos_fake, imagem, slug, tags).
- Build do Next.js transforma em `src/generated/products.ts` → páginas SSG `/produto/[slug]` (zero runtime DB).
- `data/campaigns.csv` — catálogo de touchpoints (ver §5).
- `data/coupons.csv` — cupons simulados (DOPAMINA10 etc.).

### 3.2 Base de pedidos (Camada 2)
Schema Postgres (Supabase free — 500 MB, SQL nativo, export CSV):

```sql
orders (
  order_id       uuid PK,
  code           text unique,        -- SIM-20261006-8F3A
  user_pseudo_id text,               -- mesmo do GA4 (client_id)
  user_id        text null,          -- pseudoanonimo opcional
  session_id     text,
  created_at     timestamptz,
  value_simulated numeric(12,2),     -- valor "gasto" fictício (BRL)
  items_count    int,
  coupon         text,
  utm_source/medium/campaign/content text,
  referrer text, landing_page text,
  platform text,                     -- web | twa (app)
  checkout_ms int,                   -- tempo do início ao fim
  status text                        -- confirmed | simulated_refund
)
order_items (
  order_id fk, sku, name, category, price, qty
)
```

**Escrita:** `POST /api/orders` (Route Handler da Vercel) — valida payload, grava no Supabase. Fallback: se o Supabase cair, o evento `purchase` do GA4 ainda registra. Rate-limit por `order_id` para deduplicar.

**Export:** script `scripts/export_orders.mjs` (cron Vercel ou GitHub Action gratuita) → duas saídas:
1. **Load job para o BigQuery bronze** (`orders` + `order_items`) — dado bruto intocado, junto dos eventos do GA4 que já caem lá; é a origem da camada Medallion.
2. `exports/orders_YYYY-MM-DD.csv` versionado no git — **backup human-readable** (git-as-data-lake), não é mais usado para análise.

### 3.3 Camada analítica (Camada 3) — Medallion: bronze no BigQuery, silver/gold no Databricks

**Padrão Medallion (bronze → silver → gold)** aplicado em duas plataformas:

| Camada | Onde | Conteúdo | Ferramenta | Custo |
|---|---|---|---|---|
| 🥉 **Bronze (RAW)** | BigQuery (é onde os dados já nascem) | eventos **web + app** (`events_*` do GA4) e pedidos (`orders`/`order_items`) **intocados**, append-only | GA4 export diário + load job GitHub Action | $0 |
| 🥈 **Silver** | Databricks Free Edition | limpeza, dedupe, validação de schema, stitch `user_pseudo_id × session × UTM`, `UNNEST(items)` | Delta Lake + job (Lakeflow/notebook) | $0 |
| 🥇 **Gold** | Databricks Free Edition | marts prontos p/ consumo: `mart_funnel`, `mart_attribution_paths`, `mart_products`, `mart_retention` | Delta tables no Unity Catalog | $0 |
| **Dataviz** | ver abaixo | dashboards | Databricks SQL WH + Genie; Looker Studio (bronze) | $0 |

**Fluxo:** BigQuery bronze → **job diário lê bronze e grava silver/gold no Databricks** (Spark connector JDBC/BigQuery) → consumo.

**Organograma da estrutura e ferramentas:**

```
      ENTRADA              CAMADA 1+2 (raw de web+app)         CAMADA 3 (DATABRICKS)            CONSUMO
 ┌────────────────┐   ┌──────────────────────────────┐   ┌─────────────────────────────┐   ┌──────────────┐
 │ Next.js +      │   │  BRONZE (raw) — fica no      │   │  Databricks Free Edition    │   │ Databricks   │
 │ Vercel         ├──►│  BigQuery, onde os dados      ├──►│  Unity Catalog + Delta Lake │   │ SQL WH +     │
 │                │   │  já nascem:                   │   │                             │   │ dashboards/  │
 │ GA4 (web) ─────┼──►│  dataset bronze.events_*      │   │  🥈 SILVER                  │   │ Genie        │
 │ Firebase (app) ─┼──►│  (GA4 export diário)          │   │   limpeza, dedupe, stitch   │   │              │
 │ Supabase ──────┼──►│  dataset bronze.orders        │   │   por user/session, UTMs    │   │ /stats       │
 │ (pedidos)      │   │  (load job diário)            │   │                             │   │ (público)    │
 └────────────────┘   │  + CSV backup no git          │   │  🥇 GOLD                    │   │              │
                      └──────────────────────────────┘   │   mart_funnel               │   │ BigQuery     │
                                                         │   mart_attribution_paths ◄───┼──►│ console      │
                              ▲                          │   mart_products/retention    │   │ (bronze,     │
                              │                          └─────────────────────────────┘   │  auditoria)   │
                              └──── leitura diária (Spark connector / job)                 └──────────────┘
```

> **Decisão (opção A — híbrida):** bronze fica no BigQuery porque é o único destino nativo do export do GA4 e mantém o dado bruto auditável; Databricks Free Edition vira o **coração analítico** (Delta + Unity Catalog + Lakeflow), dando ao projeto um lakehouse de verdade no portfólio. **DuckDB permanece como plano B opcional** (análise local offline).

> ⚠️ **Riscos operacionais:** (1) BigQuery sandbox sem fatura expira tabelas em ~60 dias → usar conta de fatura dentro do free tier; (2) Databricks Free Edition é **serverless com quotas diárias** (compute desliga se estourar a cota), sem SLA, uso não-comercial e pode deletar conta inativa → usar semanalmente; (3) ingestão bronze→Databricks é o elo mais frágil → monitorar com alerta simples e backup CSV no git.

### 3.3.1 Plataformas de dataviz disponíveis (decisão de dataviz)

| Plataforma | Conecta em | Papel | Custo |
|---|---|---|---|
| **Databricks SQL dashboards + Genie** (recomendada como primária) | gold (Delta) nativamente, já está lá dentro | dashboards analíticos + consulta em linguagem natural | incluída no Free Edition ($0) |
| **Looker Studio** | BigQuery (bronze) nativamente | relatórios auxiliares/didáticos mostrando o dado bruto | $0 |
| **`/stats` público** (própria) | API Databricks SQL (ou export gold) | data-as-content para o público | $0 |
| **Power BI Desktop** (opcional, pessoal) | Databricks SQL warehouse e BigQuery (conectores nativos) | bancada pessoal de análise — só no seu PC | $0 (publicar/compartilhar no Service exige Pro/Premium → fora do escopo) |

### 3.4 Gerador de dados sintéticos (para desenvolver dashboard antes de ter tráfego)
- `scripts/simulate_journeys.py` gera jornadas sintéticas em **CSV local** (nunca dentro do GA4 — inflar dado de propriedade GA4 viola os termos).
- Marcar tráfego de teste no GA4 com `debug_mode=true` + filtro de tráfego de desenvolvimento, para nunca poluir os relatórios.

---

## 4. Plano de medição GA4 (especificação de eventos)

**Propriedade única GA4** com 2 data streams: `web` (site) + `android` (fase app).
Ecommerce padrão (dataLayer/gtag), tudo com `currency: BRL` e `value` **simulado**:

| Evento | Quando | Parâmetros-chave |
|---|---|---|
| `page_view` | automático | `page_location`, `page_title` |
| `session_start` | automático | — |
| `view_item_list` | home/categoria | `item_list_name`, `items[]` |
| `select_item` | clique no produto | `item_list_id` (posição) |
| `view_item` | PDP | `items[]`, `price`, `category` |
| `add_to_cart` | botão Adicionar | `items[]`, `value` |
| `remove_from_cart` | carrinho | `items[]` |
| `view_cart` | carrinho | `value`, `items_count` |
| `begin_checkout` | 1ª tela checkout | `coupon`, `value` |
| `add_shipping_info` | passo 2 | `shipping_tier` (fake: "Entrega Expressa Simulada") |
| `add_payment_info` | passo 3 | `payment_type: simulated` |
| **`purchase`** | confirmação | `transaction_id`, `value`, `coupon`, `items[]` |
| `refund` | "cancelar pedido" | `transaction_id` |
| `view_promotion` / `select_promotion` | banner oferta relâmpago | `promotion_id: FLASH-01` |
| `search` | busca | `search_term` |
| `fake_delivery_progress` | rastreio fictício | `eta_minutes` |
| `share` | compartilhar | `method` |

**Dimensões customizadas (event-scoped):**
`simulation_flag` (sempre "true"), `platform_shell` (`web`/`twa`), `checkout_ms`, `cart_size_bucket`, `dopamine_level` (0–100, progress bar do carrinho), `catalog_section`.

**Key events (conversões):** `purchase`, `begin_checkout`, `fake_delivery_progress`.

**Validação:** GTM/debug mode + GA4 **DebugView** antes de cada release (capturar print → pasta `tests/`).

---

## 5. Estratégia MULTI-TOUCH (o coração do projeto)

### 5.1 Como fabricar touchpoints sem gastar em mídia
Criamos nós mesmos as "campanhas". Em `data/campaigns.csv`:

| campaign_id | source | medium | canal simulado | exemplo de link |
|---|---|---|---|---|
| `ig_reel_01` | instagram | social | Reels | `/?utm_source=instagram&utm_medium=social&utm_campaign=ig_reel_01` |
| `tiktok_01` | tiktok | social | TikTok | ... |
| `google_brand` | google | cpc | Search (simulado) | ... |
| `ig_brand` | instagram | cpc | ads ( simulado ) | ... |
| `email_news` | newsletter | email | E-mail | ... |
| `wa_group` | whatsapp | referral | Grupo | ... |
| `yt_shorts` | youtube | video | Shorts | ... |
| `direct` | (none) | (none) | Direto | sem UTMs |

Cada link é um **cartão de visita** gerado em `/lanca/[campaign_id]` (página que carrega, dispara `session_start` já com a UTM e redireciona) — permite rodar campanhas reais depois sem mudar nada.

### 5.2 Stitching e modelos
- Caminho = sequência de `session_source/medium/campaign` ordenada por `event_timestamp` agrupada por `user_pseudo_id`.
- **Modelos calculados por nós** (SQL no Databricks, camada gold): first-click, last-click (non-direct), linear, time-decay, position-based (40/20/40), e assistências.
- GA4 nativo: `Advertising > Attribution > Conversion Paths` + `Explorations > Path exploration`.
- ⚠️ **DDA do GA4 exige ~400 conversões/mês** para funcionar; abaixo disso cai em *threshold*. Por isso calculamos os modelos rule-based nós mesmos — é o principal "truque" do projeto.
- Cross-device: usar `user_id` pseudo-anônimo (hash do `client_id` salvo em localStorage) → GA4 costura web+app.

### 5.3 Métricas que vamos publicar
Funil (view → cart → checkout → purchase), drop-off por passo, tamanho médio do carrinho, ticket médio simulado, top produtos, path length distribution, assist by channel, "total de dinheiro não gasto" (hook viral, igual dopamineshop.co).

---

## 6. App na Play Store (fase 2)

| Etapa | Ferramenta | Custo |
|---|---|---|
| PWA (manifest + service worker + ícones) | no próprio Next.js | $0 |
| Wrapper Android | **Bubblewrap / PWABuilder → TWA** (Trusted Web Activity) | $0 |
| Conta desenvolvedor | Play Console | **US$ 25 (único)** |
| Teste fechado | exige **12 testers × 14 dias** para contas pessoais novas | $0 (tempo) |
| Publicação | AAB + assetlinks.json no domínio + Lighthouse ≥ 80 | $0 |

- **TWA em vez de Capacitor**: mesmo site, app de ~3 MB, atualiza automático a cada deploy (sem re-submissão por mudança de conteúdo), risco menor de rejeição na política 4.3.
- GA4: a TWA continua usando o **web stream**; marcamos `platform_shell=twa`. Se quisermos app stream nativo no futuro → Firebase SDK (mesma propriedade GA4).
- iOS/Apple: **fora de escopo** (exige US$ 99/ano e não aceita TWA).

---

## 7. Custo total

| Item | Fase 1 (site+dados) | Fase 2 (app) |
|---|---|---|
| Vercel Hobby (host + serverless) | $0 | $0 |
| Domínio (opcional) | ~R$ 40/ano | idem |
| GA4 Standard (10M eventos/mês) | $0 | $0 |
| BigQuery export diário (≤1M ev/dia) | $0 | $0 |
| BigQuery free tier (10 GiB / 1 TiB query) | $0 | $0 |
| Databricks Free Edition (serverless, quotas) | $0 | $0 |
| Supabase free (500 MB) | $0 | $0 |
| Looker Studio + Google Sheets | $0 | $0 |
| GitHub Actions (CI/export) | $0 | $0 |
| Play Console | — | **US$ 25 (único)** |
| **Total** | **R$ 0** | **US$ 25** |

---

## 8. Riscos e conformidade

1. **LGPD / privacidade**: banner de consentimento (Consent Mode v2, default denied), zero PII, sem campo de cartão real (form é cenário teatro), página de Termos dizendo "simulação, nada é cobrado".
2. **Play Store**: mitigar política 4.3 com PWA completa (offline shell, service worker, Lighthouse ≥ 80) + assetlinks.json verificado.
3. **GA4**: DDA indisponível com pouco volume → modelos próprios; amostragem → BigQuery export.
4. **Termos GA4**: nunca injetar tráfego falso em produção; usar propriedade/depuração separada para dados sintéticos.
5. **AdSense/anúncios**: conteúdo "falso" pode ser considerado *thin content*. Não monetizar com ads na fase 1.
6. **Diferenciação ética**: como dopaminesite.app, evitar dark patterns reais (falso stock, contagem regressiva abusiva) — ou sinalizá-los explicitamente como "simulação". Manter o tom de "brincadeira honesta".

---

## 9. Stack escolhida (comando a decidir)

| Camada | Decisão | Alternativa descartada |
|---|---|---|
| Frontend | **Next.js (App Router) + Tailwind + Zustand** | Astro (menos ecosistema de API), Vite SPA (SSR/SEO) |
| Catálogo | **CSV no repo → gerado no build** | API/DB (custo e complexidade) |
| Carrinho | localStorage | backend de carrinho (desnecessário) |
| Pedidos | **Supabase (Postgres free)** via `/api/orders` | Google Sheets (rate limit), D1 (mais um vendor) |
| Analytics | **GA4 + BigQuery export** | só GA4 (sem dado bruto) |
| Motor analítico | **Medallion híbrido**: bronze no BigQuery (raw web+app) + silver/gold no **Databricks Free Edition** (Delta/Unity Catalog) | DuckDB (plano B local), Metabase self-host (mais infra) |
| Dataviz | **Databricks SQL dashboards + Genie** (primário) + **Looker Studio** (bronze, auxiliar) | Metabase, Grafana |
| Deploy | **Vercel Hobby** | Netlify (empate; Vercel = Next nativo) |
| App | **Android nativo** | Aplicativo postado na playstore |

---

## 10. Próximos passos (após este brainstorm)

1. Scaffold do Next.js + `data/products.csv` + home/PDP/carrinho/checkout.
2. Instrumentação GA4 completa + documentação de eventos (`docs/MEASUREMENT.md`).
3. `/api/orders` + schema Supabase + export (load job BigQuery bronze + CSV no git).
4. Deploy Vercel + domínio + validação DebugView (prints em `tests/`).
5. Conta **Databricks Free Edition** + job de ingestão bronze→silver + models silver/gold (`sql/`).
6. Dataviz: dashboards Databricks SQL/Genie + Looker Studio (bronze) + primeiros SQL de atribuição.
7. PWA + Bubblewrap + Play Console (US$ 25).

Ver `Linha do tempo.md` para o cronograma detalhado.
