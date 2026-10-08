# PERGUNTAS — perguntas de negócio, tracking plan e tagging plan

> Documento-guia (offline, como o `BRAINSTORM.md`). Regra de ouro:
> **sem pergunta → sem mart.** Toda tabela da camada gold precisa responder a pelo menos
> uma pergunta daqui (coluna `P#`). Revisar o status a cada milestone.

---

## 1. Perguntas de negócio

Legenda de **Fonte**: `orders` = Supabase (dado já disponível); `events` = export GA4 no BigQuery
(aguarda 24–48h do link); `silver/gold` = marts Databricks (Fase 2/3).

### A. Aquisição e atribuição (o coração do projeto)

| # | Pergunta | Métrica / abordagem | Fonte | Status |
|---|---|---|---|---|
| P1 | Quais `utm_source × utm_medium` trazem mais **compradores** (não só sessões)? | Pedidos e receita simulada por canal, normalizado por sessões | orders → events | ⏳ Onda 1 |
| P2 | Quantos toques/sessões um comprador tem antes de comprar (distância média)? | Distribuição de path length por `user_pseudo_id` | gold | ⏳ Onda 3 |
| P3 | Como os modelos (first/last/linear/time-decay/position-based) mudam o crédito por canal? | Comparação lado a lado das 5 matrizes de crédito | gold `mart_attribution_paths` | ⏳ Onda 3 |
| P4 | Quais canais são **assistidores** (muito toque, pouco crédito no last-click)? | Diferença first-click − last-click por canal | gold | ⏳ Onda 3 |
| P5 | A landing page da 1ª sessão prediz a compra? | Taxa de conversão por `page_location` de entrada | silver | ⏳ Onda 3 |
| P6 | Compradores com cupom vêm de campanhas diferentes dos sem cupom? | `coupon` × origem UTM do pedido | **orders (hoje)** | ⏳ Onda 1 |

### B. Funil e conversão

| # | Pergunta | Métrica / abordagem | Fonte | Status |
|---|---|---|---|---|
| P7 | Onde o funil trava: `view_item → add_to_cart → begin_checkout → purchase`? | Taxa de passagem por etapa (funil clássico) | events | ⏳ Onda 2 |
| P8 | Quanto tempo entre a 1ª visita e a compra (time-to-conversion)? | Mediana/p90 em horas/dias | silver | ⏳ Onda 3 |
| P9 | O cupom **DOPAMINA10** aumenta a conclusão ou só reduz o valor simulado? | Checkout com/sem cupom × `checkout_ms` × `value_simulated` | **orders (hoje)** | ⏳ Onda 1 |
| P10 | Mobile × desktop mudam o funil? | Funil por `device_category` | events | ⏳ Onda 2 |
| P11 | Em qual dos 4 passos do checkout o usuário abandona? | Contagem `begin_checkout` vs `add_shipping_info` vs `add_payment_info` vs `purchase` | events | ⏳ Onda 2 |

### C. Catálogo e produto

| # | Pergunta | Métrica / abordagem | Fonte | Status |
|---|---|---|---|---|
| P12 | Produtos com muita visualização e pouca compra (gap interesse→conversão)? | `view_item` × pedidos por SKU | events + orders | ⏳ Onda 3 |
| P13 | Quais categorias convertem melhor? | Pedidos ÷ sessões por categoria | events + orders | ⏳ Onda 3 |
| P14 | Quais categorias são compradas juntas (cross-sell)? | Co-ocorrência de categorias em `order_items` | **orders (hoje)** | ⏳ Onda 1 |
| P15 | Faixa de preço mais vendida? | Receita e volume por bucket de `price` | **orders (hoje)** | ⏳ Onda 1 |

### D. Retenção e coortes

| # | Pergunta | Métrica / abordagem | Fonte | Status |
|---|---|---|---|---|
| P16 | Compradores repetem? Taxa de 2ª compra? | Repeat rate por `user_pseudo_id` | **orders (hoje)** | ⏳ Onda 1 |
| P17 | Coortes mensais: o engajamento cai com o tempo? | Retenção por mês de aquisição (curva de coorte) | events + orders | ⏳ Onda 3 |

### E. Qualidade do dado (sem isso, nenhuma resposta vale)

| # | Pergunta | Métrica / abordagem | Fonte | Status |
|---|---|---|---|---|
| P18 | % de pedidos com `user_pseudo_id`/`session_id` preenchidos? | Cobertura dos campos de stitch em `orders` | **orders (hoje)** | ⏳ Onda 1 |
| P19 | Quanto % do GA4 conseguimos casar com pedidos (cobertura do join)? | Pedidos com match em `events_*` ÷ total | silver | ⏳ Onda 3 |
| P20 | Volumetria diária de eventos bate com o esperado (sem duplicatas/perda)? | Contagem diária por `event_name` vs baseline | events | ⏳ Onda 2 |

### F. Baseline de plataforma (prepara a V3)

| # | Pergunta | Métrica / abordagem | Fonte | Status |
|---|---|---|---|---|
| P21 | Baseline web para comparar com TWA/Android depois (antes × depois / DiD)? | Funil, conversão e ticket por dimensão `platform` | events + orders | ⏳ Onda 4 |

### Ondas de resposta (prioridade)

1. **Onda 1 — agora (só Supabase):** P6, P9, P14, P15, P16, P18 → SQL simples em `orders`/`order_items`, pode ser feito já (candidato natural a virar as primeiras linhas da `/stats`).
2. **Onda 2 — +24–48h (export GA4):** P7, P10, P11, P20 → consultas diretas no BigQuery.
3. **Onda 3 — Fase 2/3 (silver/gold):** P1–P5, P8, P12, P13, P17, P19 → exigem stitching e marts; **definem quais marts entram na gold**.
4. **Onda 4 — V3 (app):** P21 → baseline para comparação de plataforma.

---

## 2. Tracking plan (medição)

- **Dicionário canônico de eventos:** `docs/MEASUREMENT.md` (eventos, parâmetros, regras anti-duplicidade, consent, validação). Este documento é o "como"; as perguntas da Seção 1 são o "porquê".
- **Checklist de registro no GA4** (obrigatório antes de analisar — senão os dados existem mas não aparecem nas explorations):
  - [ ] Marcar como **key events**: `purchase`, `begin_checkout`, `fake_delivery_progress` (e revisar se `add_to_cart` deve entrar).
  - [ ] Registrar **dimensões customizadas (event-scoped)**: `simulation_flag`, `platform_shell`, `checkout_ms`, `cart_size_bucket`, `dopamine_level`, `catalog_section`.
  - [ ] Conferir se `coupon`, `transaction_id`, `search_term` (padrão GA4) estão chegando no DebugView.
  - [ ] Validar `user_pseudo_id`/`client_id` presentes nos eventos (teto do stitch → P18/P19).
  - [ ] **App (V3):** mesmos eventos no stream `android` + dimensão `platform` para P21.
- **Regra:** evento novo só entra no GTM se responder a uma pergunta da Seção 1 (ou for obrigatório de qualidade — P18/P20).

## 3. Tagging plan (UTM e convenções de campanha)

Toda campanha simulada nasce em `/lanca/[campaign_id]` e usa `data/campaigns.csv`.

**Taxonomia UTM (alinhada ao channel grouping padrão do GA4):**

| Parâmetro | Valores permitidos | Exemplo |
|---|---|---|
| `utm_source` | `google`, `meta`, `instagram`, `tiktok`, `youtube`, `newsletter`, `whatsapp`, `parceiro-*` (minúsculas, sem espaço) | `instagram` |
| `utm_medium` | `cpc`, `paid_social`, `social`, `email`, `referral`, `video` | `social` |
| `utm_campaign` | `snake_case` do `campaign_id`, **sem data dentro** (senão fragmenta o relatório) | `ig_reel_01` |
| `utm_content` | variante criativa A/B ou slug do criativo | `reel_dopamina_a` |
| `utm_term` | keyword (só search ads simulados) | `fone+bluetooth` |

**Regras:**
1. Link canônico sempre com URL absoluta + UTMs completos; direto = sem UTM (é baseline).
2. Todo link novo é testado 1x com clique e conferido no DebugView antes de virar campanha.
3. Convenções de evento: parâmetros `snake_case`, `currency: BRL`, `value` sempre numérico e **simulado** (`simulation_flag: true`).
4. Trocar `utm_source` sem trocar `campaign_id` = mesmo teste ao contrário (isola variável) — documentar em `campaigns.csv` a coluna `hipotese`.

---

### Conexão com o plano
- `Linha do tempo.md` (3 frentes: dev / análise / engenharia):
  - **Fase 2** = perguntas de negócio definidas com a liderança;
  - **Fase 3** = tracking & tagging (auditar o que já é traqueado, checklist de eventos base, traquear o que falta);
  - **Fase 4** = entender os dados + diagnóstico de atribuição (Ondas 1–2 respondíveis, especificação das tabelas);
  - **Fase 5** = Onda 3 define os marts da gold (engenharia);
  - **Fase 6** = modelos/atribuição/dashboards (inclusive revisão com a liderança).
- `BRAINSTORM.md` §4 (medição) e §5 (multi-touch) são a execução destas perguntas.
- Marco **M3** só conta como fechado se **P3, P4 e P7** estiverem respondidas com print/query salva em `tests/` ou `sql/`.
