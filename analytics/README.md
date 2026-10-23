# Analytics Workbook — Dopamina Ecommerce

Entregável de Web Analytics: **auditoria (tracking/tagging) + specs + QA + consent + dashboard + changelog**, em planilhas (`.csv`) versionáveis neste repositório.

> Base gerada a partir do código real (`web/src/lib/events.js`, call sites, `layout.js`, `CookieConsent.jsx`, `campaigns.js`, `/lanca`), do dicionário `docs/MEASUREMENT.md` e das perguntas de negócio `PERGUNTAS.md`.
> Fonte da verdade do "como medir" = `docs/MEASUREMENT.md`; do "por quê" = `PERGUNTAS.md`.

## Como usar

1. Abra os `.csv` no Google Sheets / Excel (ou `arquivo > importar`). Separador: vírgula, campos com vírgula entre aspas.
2. O `README` (este arquivo) é o resumo executivo + análise de lacunas.
3. A coluna `status` usa: `OK` · `GAP` (falta) · `RISCO` · `N/A` · `A VALIDAR`.
4. Container GTM: exportar para `analytics/gtm/` (ver seção "Exportar o container GTM").

## Índice das abas

| Fase do plano | Arquivo | Conteúdo |
|---|---|---|
| 0 | `01-tracking-audit.csv` | Audit dos eventos: esperado × implementado, onde, evidência, status |
| 0 | `02-tagging-audit.csv` | Audit de UTM/taxonomia de campanha + regras de link canônico |
| 2 | `03-tracking-plan.csv` | Evento → pergunta de negócio (P#) → gatilho → parâmetros → destino |
| 2 | `04-datalayer-spec.csv` | Spec do `dataLayer.push` por evento |
| 2 | `05-parameter-dictionary.csv` | Dicionário de parâmetros e do `items[]` |
| 3 | `06-gtm-spec.csv` | GTM Spec: tags/triggers/variáveis/destinos (alvo, a validar) |
| 4 | `07-qa-test-plan.csv` | Casos de teste (GTM Preview + GA4 DebugView) |
| 4 | `08-consent-lgpd.csv` | Matriz de consentimento por destino |
| 4 | `09-dashboard-spec.csv` | Spec de dashboard (KPIs, fonte, mart) |
| 4 | `10-changelog.csv` | Changelog de tracking (data, mudança, motivo, P#) |

## Resumo executivo

- **O que já existe e funciona:** 15 eventos no `dataLayer` (GA4 ecommerce + custom), tags anti-duplicidade garantidas em código (refs), Consent Mode v2 com *default denied* + banner (LGPD), container GTM no ar (`GTM-5RLXF4BF`), landing de campanha `/lanca/[campaign]` que injeta UTMs a partir de `campaigns.js`.
- **O que falta para "auditável":** (1) **exportar o container GTM** (JSON) e comparar com o `06-gtm-spec.csv`; (2) implementar eventos/dimensões citados mas ausentes (ver lacunas); (3) prints GTM Preview + DebugView em `tests/`. ~~(4) campaigns.csv~~ ✅ resolvido 2026-10-19.

## Análise de lacunas (audit vs. spec)

| # | Achado | Severidade | Detalhe | Ação |
|---|---|---|---|---|
| G1 | **`fake_delivery_progress` não existe** | Alta | `PERGUNTAS.md §2` manda marcar como key event, mas não há push em `events.js` nem call site | Implementar em `rastreio` (Tracking.jsx) ou remover da lista |
| G2 | **`view_promotion` declarado e nunca chamado** | Média | `trackPromotion()` existe em `events.js`, sem uso | Chamar em banner/promo ou remover |
| G3 | **Dimensões customizadas ausentes** | Alta | `simulation_flag`, `platform_shell`, `checkout_ms`, `cart_size_bucket`, `dopamine_level`, `catalog_section` citadas em `PERGUNTAS.md §2`, sem push no código | Definir onde setar (set once/user prop) ou adiar |
| G4 | **Sem reset `ecommerce: null`** | Média | Pushes não fazem o reset recomendado antes de cada evento ecommerce (risco de vazamento de `items[]` entre eventos no GTM) | Adicionar reset no `push()` ou em cada evento |
| G5 | **Container GTM não auditado** | Alta | `06-gtm-spec.csv` é o alvo; falta o export real do container | Exportar JSON → `analytics/gtm/` |
| G6 | ~~**`campaigns.csv` não existe**~~ | Média | ✅ **FECHADO (2026-10-19)** — `data/campaigns.csv` criado com 23 campanhas (9 home, 9 categoria, 5 produto) e coluna `hipotese`/`pergunta`; `prebuild` gera `campaigns.generated.js` | — |
| G7 | **`search` sem pergunta associada** | Baixa | Viola a regra de ouro "sem pergunta → sem evento" | Vincular a uma P# ou documentar como qualidade de dado |
| G8 | ~~**`/lanca` divergência de convenção**~~ | Baixa | ✅ **FECHADO (2026-10-19)** — ids em `snake_case`, `direto-colaborador` removido (baseline = direto sem UTM), slugs antigos redirecionam via `LEGACY_CAMPAIGN_SLUGS` | — |
| G9 | **Evidência de validação parcial** | Média | `docs/MEASUREMENT.md § Validação` pede prints em `tests/`; confirmar existência/atualidade | Rodar Preview/DebugView e arquivar |

## Vínculo com as fases do plano (0→4)

| Fase do plano | Status neste repo |
|---|---|
| 0 · Kit de Auditoria | **Parcial** — audit de tracking/tagging criado (abas 01–02); falta o export do container |
| 1 · BRD | **Existe como `PERGUNTAS.md`** (P1–P23) — reformatável em BRD se necessário |
| 2 · Tracking Plan + Data Layer Spec + Dicionário | **Completo** (abas 03–05) a partir do código |
| 3 · Tagging Plan (GTM Spec) + Triggers/Variáveis/Destinos | **Alvo = aba 06** (a validar com o container) |
| 4 · QA/Test + Consent/LGPD + Dashboard + Changelog | **Completo como spec** (abas 07–10); QA depende de rodar Preview/DebugView |

## Exportar o container GTM (evidência)

Sem credencial de API no ambiente, o export é manual (1 min):

1. GTM → selecione o container **GTM-5RLXF4BF**.
2. **Admin → Export Container** → formato **JSON**.
3. Salve em `analytics/gtm/gtm-GTM-5RLXF4BF-YYYY-MM-DD.json`.
4. (Opcional) GTM → **Versions → Publish** com descrição para gerar changelog.

Detalhes em `analytics/gtm/README.md`.
