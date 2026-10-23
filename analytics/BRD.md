# BRD — Business Requirements Document · Dopamina Ecommerce

| Campo | Valor |
|---|---|
| Projeto | Dopamina Ecommerce — loja simulada + laboratório público de Web Analytics |
| Documento | BRD (Fase 1 do plano de Web Analytics) |
| Versão | 1.0 |
| Data | 2026-10-14 |
| Autor | Vitor Santos |
| Status | Em revisão |
| Relacionados | `PERGUNTAS.md` (perguntas de negócio), `docs/MEASUREMENT.md` (dicionário de eventos), `analytics/03-tracking-plan.csv`, `analytics/09-dashboard-spec.csv` |

> Este BRD documenta **por que** o tracking existe: cada evento do `dataLayer` precisa responder a uma pergunta de negócio abaixo. Regra de ouro do projeto: **sem pergunta → sem mart → sem evento novo.**

---

## 1. Contexto de negócio

A **Dopamina Ecommerce** é uma loja online **100% simulada**: há vitrine, carrinho, checkout, cupom (`DOPAMINA10`) e entrega fictícia, mas **nenhum produto real, nenhum pagamento e nenhuma entrega**. O objetivo não é vender, e sim servir como **laboratório público de dados de e-commerce** para estudar **atribuição multi-touch** de ponta a ponta, com custo próximo de zero.

O ambiente foi desenhado para gerar **dados limpos e observáveis** e permitir responder perguntas que lojas reais fazem — mas raramente conseguem investigar com calma: de onde vêm os compradores, onde o funil trava, quais produtos geram desejo sem conversão, e se os rastreadores estão medindo a verdade.

## 2. Objetivos de negócio

- **O1.** Entender a **jornada de aquisição** (quais canais trazem *compradores*, não só sessões) e comparar modelos de atribuição.
- **O2.** Medir o **funil de conversão** completo (`view_item → add_to_cart → begin_checkout → purchase`) e localizar onde ele trava.
- **O3.** Ligar **catálogo e produto** a comportamento (interesse × conversão, desejo × compra, viralização).
- **O4.** Medir **retenção e recompra**.
- **O5.** Garantir a **qualidade do dado** (cobertura de stitch, volumetria, ausência de duplicatas) — sem isso nenhuma resposta vale.
- **O6.** Criar um **baseline de plataforma (web)** para comparar, no futuro (V3), com um app Android.

**Meta transversal:** todo número rastreável deve ter **rastreabilidade** — do evento no `dataLayer` até o KPI no dashboard, passando por uma pergunta de negócio.

## 3. Escopo

**Dentro do escopo**
- Web (Next.js) em produção; eventos GA4 via GTM (`GTM-5RLXF4BF`); pedidos no Supabase; export GA4 + pedidos no BigQuery (bronze); marts no Databricks (silver/gold).
- 15 eventos GA4 ecommerce/custom já implementados (ver `analytics/01-tracking-audit.csv`).
- Consentimento LGPD (Consent Mode v2) e taxonomia de campanha (UTM + `/lanca/[campaign]`).

**Fora do escopo (por ora)**
- App Android/TWA (V3) — apenas baseline preparada (dimensão `platform`).
- Vendas reais, pagamentos, logística.
- Tráfego pago real em GA4 de produção (campanhas são **simuladas**).

## 4. Stakeholders

| Papel | Responsabilidade |
|---|---|
| Liderança / Produto | Prioriza perguntas, consome dashboards, decide o fechamento de cada milestone |
| Analytics | Define perguntas, tracking/tagging plan, valida o dado, responde as ondas |
| Engenharia | Implementa eventos/GTM, mantém o pipeline (bronze → silver → gold) |
| Desenvolvedor / Autor | Dono técnico do projeto |

---

## 5. Perguntas de negócio (as que originaram o tracking)

> Fonte `orders` = Supabase; `events` = export GA4 no BigQuery; `silver/gold` = marts Databricks.
> A coluna **Eventos requeridos** mostra por que cada pergunta exigiu um evento do tracking plan.

### A. Aquisição e atribuição

| # | Pergunta | Métrica / abordagem | Fonte | Eventos requeridos |
|---|---|---|---|---|
| P1 | Quais `utm_source × utm_medium` trazem mais **compradores**? | Pedidos/receita por canal, normalizado por sessões | orders → events | `purchase` + sessão (UTM) |
| P2 | Quantos toques um comprador tem até comprar? | Path length por `user_pseudo_id` | gold | todos os eventos + identidade |
| P3 | Como first/last/linear/time-decay/position-based mudam o crédito por canal? | 5 matrizes de crédito lado a lado | gold | todos os eventos + `user_pseudo_id` |
| P4 | Quais canais são **assistidores** (muito toque, pouco last-click)? | first-click − last-click por canal | gold | todos os eventos |
| P5 | A landing page da 1ª sessão prediz a compra? | CVR por `page_location` de entrada | silver | `view_item_list` + sessão |
| P6 | Compradores com cupom vêm de campanhas diferentes? | `coupon` × UTM do pedido | orders | `purchase`/`apply_coupon` + UTM |

### B. Funil e conversão

| # | Pergunta | Métrica / abordagem | Fonte | Eventos requeridos |
|---|---|---|---|---|
| P7 | Onde o funil trava? | Taxa de passagem por etapa | events | `view_item`, `add_to_cart`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase` |
| P8 | Tempo entre 1ª visita e compra | Mediana/p90 (horas/dias) | silver | todos os eventos + identidade |
| P9 | O cupom aumenta a conclusão ou só reduz o valor? | com/sem cupom × `checkout_ms` × valor | orders | `begin_checkout`/`purchase` + `apply_coupon` (+ `checkout_ms`) |
| P10 | Mobile × desktop mudam o funil? | Funil por `device_category` | events | funil completo (todas as etapas) |
| P11 | Em qual dos 4 passos do checkout há abandono? | contagem `begin_checkout` → `add_shipping_info` → `add_payment_info` → `purchase` | events | as 4 etapas do checkout |

### C. Catálogo e produto

| # | Pergunta | Métrica / abordagem | Fonte | Eventos requeridos |
|---|---|---|---|---|
| P12 | Produtos com muita visualização e pouca compra | `view_item` × pedidos por SKU | events + orders | `view_item` (+ pedidos) |
| P13 | Quais categorias convertem melhor? | pedidos ÷ sessões por categoria | events + orders | `view_item_list`, `select_item` |
| P14 | Quais categorias são compradas juntas? | co-ocorrência em `order_items` | orders | — (só pedidos) |
| P15 | Faixa de preço mais vendida | receita/volume por bucket de `price` | orders | — (só pedidos) |
| P22 | Mais favoritados × mais comprados | `add_to_wishlist` × pedidos | events + orders | `add_to_wishlist`, `remove_from_wishlist` |
| P23 | Produtos que geram mais compartilhamento | `share` por `item_id`/`method` | events | `share` (+ `view_promotion`, a implementar) |

### D. Retenção e coortes

| # | Pergunta | Métrica / abordagem | Fonte | Eventos requeridos |
|---|---|---|---|---|
| P16 | Compradores repetem? | Repeat rate por `user_pseudo_id` | orders | `purchase` (+ pedidos) |
| P17 | Coortes: o engajamento cai com o tempo? | retenção por mês de aquisição | events + orders | todos os eventos + identidade |

### E. Qualidade do dado

| # | Pergunta | Métrica / abordagem | Fonte | Eventos requeridos |
|---|---|---|---|---|
| P18 | % de pedidos com `user_pseudo_id`/`session_id`? | cobertura dos campos de stitch | orders | identidade (`identity.js`) + `purchase` |
| P19 | Quanto % do GA4 casa com pedidos? | match `events_*` ÷ total | silver | todos os eventos + `transaction_id` |
| P20 | Volumetria diária bate (sem duplicatas/perda)? | contagem diária por `event_name` | events | **todos** os eventos |

### F. Baseline de plataforma

| # | Pergunta | Métrica / abordagem | Fonte | Eventos requeridos |
|---|---|---|---|---|
| P21 | Baseline web para comparar com app (antes × depois / DiD) | funil/conversão/ticket por `platform` | events + orders | todos + dimensão `platform` |

---

## 6. Da pergunta ao tracking plan (requisitos de medição)

As perguntas acima **determinam** os requisitos de instrumentação:

- **RQ1 — Funil instrumentado por completo (P7, P10, P11, P20).** Cada etapa do funil precisa de um evento próprio, com `items[]` padronizado (schema GA4) e disparo único (anti-duplicidade).
- **RQ2 — Identidade persistente (P2, P3, P8, P17, P18, P19).** Todo evento deve carregar `user_pseudo_id`/`client_id` para permitir *stitching* entre GA4 e pedidos (`identity.js`).
- **RQ3 — Aquisição rastreável (P1, P5, P6).** UTMs consistentes (`utm_source/medium/campaign/content`) + landing canônica `/lanca/[campaign]`.
- **RQ4 — Cupom e checkout mensuráveis (P6, P9, P11).** `coupon` em `begin_checkout`/`purchase` + evento custom `apply_coupon` + `checkout_ms` (dimensão a implementar).
- **RQ5 — Produto e desejo (P12, P13, P22, P23).** `view_item`, `view_item_list`, `select_item`, `add_to_wishlist`/`remove_from_wishlist`, `share`.
- **RQ6 — Qualidade e governança (P18, P19, P20).** Volumetria sem duplicatas, cobertura de stitch e reconciliação events × orders.
- **RQ7 — Privacidade (transversal).** Consent Mode v2 *default denied* + banner; nada de dado pessoal sensível no `dataLayer`.
- **RQ8 — Baseline de plataforma (P21).** Dimensão `platform` para comparar web × app no futuro.

### Requisitos não-funcionais

| # | Requisito | Verificação |
|---|---|---|
| NFR1 | Eventos idempotentes (1x por ação) | refs em React (`docs/MEASUREMENT.md`) |
| NFR2 | `items[]` no schema GA4, `currency: BRL` sempre | `05-parameter-dictionary.csv` |
| NFR3 | `transaction_id` prefixo `SIM-` (ambiente simulado) | `CheckoutFlow.jsx` |
| NFR4 | Consentimento antes de qualquer tag Google | GTM built-in consent + QA-14 |
| NFR5 | Rastreabilidade evento ↔ P# | `03-tracking-plan.csv` |

---

## 7. Matriz de rastreabilidade (P# → evento → mart → dashboard)

| P# | Eventos | Mart (gold) planejado | Dashboard |
|---|---|---|---|
| P1–P5 | todos + identidade | `mart_attribution_paths` | DASH-01 |
| P6, P9 | `purchase`, `apply_coupon` | (orders) | DASH-07 |
| P7, P10, P11, P20 | funil completo | `mart_funnel` | DASH-02, DASH-05 |
| P12, P13, P22, P23 | `view_item`, `view_item_list`, `select_item`, wishlist, `share` | `mart_products` | DASH-03 |
| P16, P17 | `purchase` + identidade | `mart_retention` | DASH-04 |
| P18, P19 | identidade + todos | (silver: match) | DASH-05 |
| P21 | todos + `platform` | `mart_funnel`/`mart_products` (por plataforma) | (V3) |

## 8. KPIs e critérios de sucesso

- **Funil completo e sem buraco** (P7): 4 etapas registradas, taxa de passagem por etapa calculável.
- **Atribuição multi-modelo** (P3): 5 matrizes de crédito materializadas em `mart_attribution_paths`.
- **Stitch** (P18/P19): % de pedidos com identidade GA4 medida e meta definida com a liderança.
- **Governança**: 100% dos eventos mapeados a um P# (regra de ouro satisfeita).
- **Marco M3** só fecha com **P3, P4 e P7** respondidas com query/print salvos.

## 9. Premissas, restrições e riscos

**Premissas**
- Export GA4 no BigQuery disponível (link leva 24–48h → marco M2.1).
- Campanhas são simuladas; nada de tráfego pago real no GA4 de produção.

**Restrições**
- Custo R$ 0 (exceto US$ 25 do Play Console, na V3).
- Vercel sem CLI/token → deploy via Git.

**Riscos**

| Risco | Impacto | Mitigação |
|---|---|---|
| Evento sem pergunta associada (ex.: `search`) | Governança quebrada | Mapear a um P# ou documentar como qualidade |
| Dimensões custom não implementadas (`checkout_ms`, `simulation_flag`, ...) | P9/P21 e análises travam | Implementar ou reduzir escopo (ver `README.md` G1/G3) |
| Container GTM não auditado | Auditoria incompleta | Export JSON → `analytics/gtm/` (G5) |
| Sem reset `ecommerce: null` | `items[]` vaza entre eventos | Ajustar `push()` (G4) |

## 10. Aprovações

| Nome | Papel | Data | Assinatura |
|---|---|---|---|
| Vitor Santos | Dono do projeto | | |
| | Liderança / Produto | | |

## 11. Referências

- `PERGUNTAS.md` — perguntas de negócio + tracking/tagging plan.
- `docs/MEASUREMENT.md` — dicionário canônico de eventos.
- `analytics/01-tracking-audit.csv` · `02-tagging-audit.csv` · `03-tracking-plan.csv` · `05-parameter-dictionary.csv` · `06-gtm-spec.csv` · `07-qa-test-plan.csv` · `08-consent-lgpd.csv` · `09-dashboard-spec.csv` · `10-changelog.csv`.
- `BRAINSTORM.md` §4 (medição) e §5 (multi-touch).
