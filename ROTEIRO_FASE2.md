# Roteiro: Fase 2 — Perguntas de negócio (conversa com a liderança)

O objetivo é descobrir: **"O que você precisa saber para essa loja crescer?"** e transformar isso em perguntas documentadas em `PERGUNTAS.md`. Fazemos antes de qualquer traqueamento extra, engenharia ou dashboard.

## 1. Contexto para a conversa
Você está no projeto **Dopamina Ecommerce (simulador, sem dinheiro real)**. Fundamentos prontos:
- Pedidos gravando em **Supabase** → já exportamos para **BigQuery bronze** (M2 ✅)
- **GA4 + GTM** instalados (auditoria de eventos vai na Fase 3)
- Export GA4 → BigQuery começa a chegar em 24–48h (M2.1)
- Queremos responder perguntas de negócio, validar traqueamento, entender atribuição e, só depois, estruturar as tabelas.

## 2. Guião da reunião (script prático)
Responda junto com a liderança, anotando as respostas brutas (palavras usadas por eles, não traduza ainda).

| Ordem | Pergunta para a liderança | Dica |
|---|---|---|
| 1 | "Do que você precisa saber pra fazer a loja crescer?" | Aberta. Não liste eventos — liste decisões: "Quero saber pra decidir X" |
| 2 | "Qual decisão mais importante pra tomar nos próximos 30 dias?" | Força priorização (o que pesa mais). |
| 3 | "Pra quem você quer mostrar esse número? (direção, marketing, vendas, ou só você?)" | Evita ficar no genérico. |
| 4 | "Se pudéssemos responder UMA pergunta hoje, qual seria?" | Descobre a "candidata #1". |
| 5 | "Hoje você olha qual dado? Acha que falta algo pra confiar nele?" | Descobre "qualidade do dado" sem perguntar sobre GA4 diretamente. |

## 3. Tradução: das respostas → Perguntas P#
Para cada resposta da liderança, transformar em **pergunta mensurável**.

Exemplos prontos (inspirados nas P1–P21 de `PERGUNTAS.md`):

| Se a liderança disse | Pergunta mensurável (colocar em PERGUNTAS.md) | Fonte provável |
|---|---|---|
| "Quero saber qual canal traz mais vendas" | "Quais utm_source×utm_medium trazem mais compradores (pedidos + receita simulada)?" | `orders` (hoje) / `events` (quando chegar) |
| "Onde as pessoas desistem?" | "Onde trava o funil view_item → add_to_cart → begin_checkout → purchase?" | `events` (GA4) |
| "Cupom vale a pena?" | "O cupom DOPAMINA10 aumenta a conclusão ou só reduz o valor simulado?" (P9) | `orders` (hoje) |
| "Quais produtos vendem mais?" | "Top SKUs por volume/receita simulada nos últimos 30d?" (P15) | `orders` (hoje) |
| "Há canal que ajuda a vender mas não aparece como 1º clique?" | "Quais canais são assistidores (muito toque, pouco crédito last-click)?" (P4) | precisa stitching (Onda 3) |

## 4. Checklist da Fase 2
Esta é a versão com sub tarefas para fechar **Fase 2** (0/4 → 4/4).

### Sub tarefas
- [ ] **1. Gravar a reunião** — anotar respostas brutas, sem filtrar. Salvar trecho no `log.md`.
- [ ] **2. Extrair perguntas** — para cada resposta, escrever uma pergunta **mensurável** com métrica (contagem, taxa, mediana, %). Não aceitar "temos que ver os dados" como pergunta.
- [ ] **3. Catalogar em `PERGUNTAS.md`** — adicionar ao `§1. Perguntas de negócio`. Usar numeração sequencial **P#** (se já existem 1–21, continuar P22, P23...). Preencher: `Pergunta`, `Métrica / abordagem`, `Fonte (orders/events/silver/gold)`, `Status ⏳ Onda X`, `Origem (Liderança: <nome/data>)`.
- [ ] **4. Priorizar com a liderança e validar** — definir **top 3** (atual + acionável). Registrar no `PERGUNTAS.md` uma seção `## Priorização (Fase 2)` com os 3 + justificativa. **Fechar Fase 2 só quando isso estiver feito.**

## 5. Onda X (onde encaixar)
- **Onda 1** — responde com `orders` hoje (ex.: cupom, top produtos, cobertura `user_pseudo_id`).
- **Onda 2** — precisa do `events_*` (funil, device, volumetria).
- **Onda 3** — precisa stitching + marts (atribuição, caminhos, assistências, coortes).
- **Onda 4** — baseline app.

Não criar mart para perguntas "nice-to-have". Pergunte sempre: **"Pra que decisão isso serve?"** Se não conseguir responder com clareza, não sobe para Onda 3.

## 6. Evidências obrigatórias para fechar Fase 2
- Trecho anotado (respostas brutas) em `log.md`
- Novas perguntas em `PERGUNTAS.md` com P#, métrica, fonte, status, origem
- Seção "Priorização (Fase 2)" com **top 3** e justificativa
- `Linha do tempo.md` → Fase 2 marcada como concluída

**Próximo após fechar Fase 2:** **Fase 3 — Tracking & tagging** (auditar interface contra essas perguntas priorizadas → checklist de eventos base → traquear o que faltar → M1).
