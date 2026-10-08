# Log de Modificações

> Registro de cada alteração feita no projeto (formato exigido pelo `config.txt`).

---

## 2026-10-06 — Início do projeto (Fase 0: Brainstorm)

**O que foi feito:**
1. Lido `config.txt.rtf` (instruções) antes de qualquer execução.
2. Pesquisa online antes de escrever: GA4 multi-touch/attribution 2026, GA4 BigQuery export free tier, GA4 App+Web streams, custo de publicar PWA/TWA na Play Store, e-commerce estático com CSV em Vercel/Netlify, tendências de "dopamine sites" (Reddit, Korea Times, CNN, Independent), repositórios GitHub de lojas demo.
3. Análise das referências: dopaminashop.com.br/pt, lojafalsa.com, compreinada.com/ofertas (mais dopamineshop.co, dopamine-shop.com, foodnevercomes.com, thedopamine.shop, dopaminesite.app).
4. Criados os documentos de planejamento:
   - `BRAINSTORM.md` — conceito, arquitetura de dados, engenharia de dados, plano de medição GA4, estratégia multi-touch, custos, riscos, stack.
   - `Linha do tempo.md` — fases e marcos.
   - `log.md` — este arquivo.
   - `historygit.md` — histórico de commits.
   - `.gitignore`.
5. `git init` e primeiro commit.

**Decisões técnicas registradas:** Next.js + Vercel (Hobby), catálogo em CSV, pedidos em Supabase free com dual-write GA4+próprio, GA4 BigQuery export diário, Looker Studio + DuckDB para análise, TWA/Bubblewrap para Play Store, custo total fase 1 = R$ 0.

**Testes/print:** nenhuma execução de código de aplicação nesta fase (apenas escrita de documentos e git). Prints dos testes da Fase 1 serão salvos em `tests/`.

**Pendências:** ver seção "Fase 1" do `Linha do tempo.md`.

**Commits desta sessão:**
- `90592ab` — docs(brainstorm): planejamento inicial do Dopamina Ecommerce

---

## 2026-10-06 — Decisão analítica: BigQuery substitui o DuckDB

**O que foi feito:**
1. Discussão sobre o papel do DuckDB na arquitetura; decisão de usar o **BigQuery como motor analítico único**.
2. Motivos: o export de eventos do GA4 já cai no BigQuery, o Looker Studio conecta nativamente, uma só fonte de verdade, menos peças e custo $0 dentro do free tier (1 TiB query + 10 GiB storage/mês — nossa escala fica ordens de longe do limite).
3. DuckDB rebaixado a **plano B opcional** (análise local offline só com CSVs), fora do caminho crítico.
4. Alterações:
   - `BRAINSTORM.md` — diagrama da arquitetura (camada 3 100% BigQuery), §3.2 (export = load job BigQuery + CSV backup no git), §3.3 (tabela da camada analítica sem linha local; nota de decisão), §5.2 (modelos em SQL no BigQuery), §9 (nova linha "Motor analítico").
   - `Linha do tempo.md` — Fase 2 (Conta GCP com fatura, load job, `sql/` no BigQuery) e Fase 3 (SQL dos modelos e dashboard Looker no BigQuery; notebook DuckDB substituído por consultas versionadas em `sql/`).

**Testes/print:** nenhuma execução de código (escrita de documentos e git).

**Pendências:** Fase 1 — scaffold do Next.js + `data/products.csv`.

---

## 2026-10-06 — Opção A: Medallion híbrido (bronze BigQuery + silver/gold Databricks)

**O que foi feito:**
1. Pesquisa sobre Databricks (Free Edition limitations, medallion architecture) antes de decidir.
2. Decisão **opção A — híbrida**: camada 3 reestruturada em padrão Medallion:
   - 🥉 **Bronze (raw web+app)** permanece no **BigQuery** (único destino nativo do export do GA4; append-only, auditável).
   - 🥈🥈 **Silver/Gold** no **Databricks Free Edition** (Delta Lake + Unity Catalog + Lakeflow) — ingestão diária bronze→silver; models silver (limpeza/stitch) e gold (marts de funil, atribuição, produtos, retenção).
   - Custo total $0 (quotas diárias do Free Edition; sem SLA; uso não-comercial; conta inativa pode ser removida → usar semanalmente).
3. **Dataviz definida:** primária = **Databricks SQL dashboards + Genie** (nativo na gold); auxiliar = **Looker Studio** (conecta nativamente no BigQuery bronze); público = `/stats` própria.
4. Atualizações: `BRAINSTORM.md` (diagrama §2, §3.3 Medallion + §3.3.1 dataviz, §5.2 modelos em gold, §7 custos + Databricks Free, §9 stack, §10 próximos passos) e `Linha do tempo.md` (Fase 2 = bronze + Medallion, Fase 3 = dataviz, marco M2.5).

**Testes/print:** nenhuma execução de código (escrita de documentos e git).

**Pendências:** Fase 1 — scaffold do Next.js + `data/products.csv`.

---

## 2026-10-06 — Organograma da arquitetura + Power BI como dataviz pessoal

**O que foi feito:**
1. Confirmado na documentação oficial: **Power BI Desktop é grátis** e tem conector nativo para Databricks SQL warehouse e BigQuery → serve como **bancada pessoal de análise** ($0). Publicar/compartilhar no Power BI Service exige licença paga (Pro ~US$ 14/mês ou Premium/PPU) → fora da regra de custo do projeto.
2. Adicionado o **organograma da estrutura e ferramentas** (entrada → camadas 1+2 → camada 3 Databricks → consumo) em `BRAINSTORM.md` §3.3.

**Testes/print:** nenhuma execução de código (escrita de documentos; commit a seguir).

**Pendências:** Fase 1 — scaffold do Next.js + `data/products.csv`.

---

## 2026-10-07 — V1 construída em JavaScript (sem TypeScript)

**O que foi feito:**
1. Decisão: app **100% JavaScript** (sem TypeScript) — scaffold `create-next-app` com `--js`, `cacheComponents: false` no `next.config.mjs` (ISR clássico com `export const revalidate = 3600`).
2. `data/products.csv` — 40 produtos fictícios recriado com correções (coluna `active`, SKU DOP-017, descrições com vírgula entre aspas); validado por `scripts/validate_products.mjs` → OK (40 linhas, 14 colunas).
3. App `web/` (JS): `lib/catalog.js` (Supabase REST com fallback CSV), `lib/events.js` (dataLayer ecommerce), `store/cart.js` (Zustand + persist), páginas home, categoria, produto, carrinho, checkout 4 passos, confirmação, rastreio falso, `/lanca/[campaign]` (redirect com UTM), `/stats`, `POST /api/orders` (grava no Supabase se configurado, senão modo simulado).
4. `npm run lint` → 0 erros; `npm run build` → 58 páginas estáticas (9 categorias + 40 produtos SSG, ISR 1h).

**Testes/print:** saída do build salva em `tests/build-v1-js.txt`.

**Pendências:** GA4_ID (instrumentação real), projeto Supabase + seed, deploy Vercel.

---

## 2026-10-07 — Restyle no layout Nexus Store (Stitch MCP)

**O que foi feito:**
1. Consultado o Stitch MCP: projeto "Multi-Niche Modern E-Commerce" (Nexus Store, desktop) — decodificado o HTML real da Home e da PDP (base64) + screenshots.
2. App refeito no **tema claro Nexus**: Plus Jakarta Sans, primária índigo `#4f46e5`, cards brancos com borda slate, pills por departamento (`lib/departments.js`), header com barra utilitária + busca + nav de departamentos, hero índigo, countdown de ofertas, seções por departamento, depoimentos, newsletter, footer completo.
3. Novas rotas: `/busca` (filtra catálogo) e `/pedidos` (lista pedidos do localStorage). Cupom DOPAMINA10 funcional (-10%, persistido no store e respeitado no checkout). PDP com migalhas, galeria, especificações e combo cross-sell.
4. `npm run lint` → 0 erros; `npm run build` → 60+ rotas (9 categorias + 40 produtos SSG + dinâmicas). Servidor dev validado no navegador + screenshots reais.

**Testes/print:** `tests/build-v2-nexus.txt`, `tests/home-hero-nexus.png`, `tests/home-grid-nexus.png`. Console do navegador limpo.

**Pendências:** GA4_ID, Supabase + seed, deploy Vercel.

---

## 2026-10-07 — Base de produtos com fotos (Unsplash, licença livre)

**O que foi feito:**
1. Mapeada 1 foto do Unsplash (CDN `images.unsplash.com`, uso gratuito) para cada um dos 40 produtos — `scripts/set_images.mjs`.
2. Todas as 40 URLs verificadas com HTTP 200 + `content-type: image/*` (`scripts/check_images.mjs` → "TODAS OK"; 1 troca necessária: almofada DOP-018).
3. `data/products.csv` com `image_url` preenchido (40/40) + novo componente `ProductImage.jsx` (foto real com fallback para emoji).
4. Cards, PDP (galeria + combo), carrinho e pedidos passaram a exibir fotos; `store` do carrinho guarda `image_url`.
5. `npm run lint` → 0 erros (1 warning sobre `<img>` vs `next/image`, aceito); `npm run build` OK. Verificação visual em servidor `next start` com screenshots reais.

**Testes/print:** `tests/build-v3-fotos.txt`, `tests/pdp-foto.png`, `tests/grid-fotos.png`.

**Atenção:** o servidor dev da porta 3000 estava com cache antigo do CSV (mostrava emojis) — **reinicie o `npm run dev`** para ver as fotos.

**Pendências:** GA4_ID, Supabase + seed (agora com `image_url`), deploy Vercel.

---

## 2026-10-07 — Banner de consentimento LGPD/Consent Mode v2

**O que foi feito:**
1. Novo `CookieConsent.jsx`: banner fixo que só aparece sem escolha salva; "Aceitar medição" grava `granted` e dispara `gtag('consent','update', granted)` (ou evento `consent_update` no dataLayer se o GA4 ainda não carregou); "Recusar" mantém tudo `denied`. O `gtag('consent','default', denied)` já existia no layout — agora há caminho de aceite.
2. Novo `CookieReset.jsx` no rodapé ("🍪 Preferências de cookies") para reabrir o banner e trocar a escolha.
3. Verificação no navegador: banner aparece após limpar a chave, aceitar grava `granted` + dataLayer com os 4 `granted`, banner some. Console limpo.

**Testes/print:** `tests/banner-consent.png`. Build OK.

**Pendências:** GA4_ID, Supabase + seed, deploy Vercel.

---

## 2026-10-07 — Etapa 8 (user_pseudo_id) + Etapa 7 (export diário)

**O que foi feito:**
1. **Etapa 8 — `user_pseudo_id` no pedido:** novo `lib/identity.js` lê o `client_id` via `gtag('get')` com fallback para o cookie `_ga` (retorna null sem GA4 ou com cookies recusados); `CheckoutFlow` envia `analytics: {user_pseudo_id, session_id}` no `POST /api/orders`; a rota repassa ao Supabase (colunas já no schema) e ecoa no modo simulado.
2. **Etapa 7 — export diário:** `scripts/export_orders.mjs` lê `orders`+`order_items` do Supabase, grava snapshot `exports/orders_YYYY-MM-DD.csv` (+ itens) e faz `bq load --replace` no dataset bronze quando há credenciais; sem env, faz SKIP gracioso (testado, exit 0). Workflow `.github/workflows/export-orders.yml` (cron 03h BRT + manual) com autenticação GCP opcional e commit automático dos CSVs. Secrets documentados no workflow.
3. **Schema Supabase** em `sql/supabase_orders.sql` (tabelas + índices + RLS com insert anônimo) — aplicar via SQL Editor.

**Testes/print:** dry-run do export sem credenciais (SKIP OK); `npm run lint` 0 erros; `npm run build` OK.

**Pendências:** criar GA4/Supabase/GCP de verdade e preencher os secrets (`NEXT_PUBLIC_GA4_ID`, Supabase URL/keys, `BQ_PROJECT`, `GCP_SA_KEY`).

---

## 2026-10-07 — Google Tag Manager instalado (GTM-5RLXF4BF)

**O que foi feito:**
1. Snippet do GTM no `layout.js` (vale para todas as páginas): `<Script id="gtm-init" strategy="afterInteractive">` com o loader oficial + `<noscript>` com iframe logo após `<body>`. ID via `NEXT_PUBLIC_GTM_ID` com fallback para `GTM-5RLXF4BF`.
2. Usa o mesmo `dataLayer` dos eventos de ecommerce — tags criadas no GTM enxergam `view_item`, `add_to_cart`, `purchase` etc. sem mudar código.
3. Verificação no HTML servido (`next start`): iframe `ns.html?id=GTM-5RLXF4BF` renderizado + loader `gtm.js` no payload do Next (o `afterInteractive` executa no cliente; o literal aparece quebrado como `gtm.js?id='+i+dl` — formato oficial do Google).

**Testes/print:** `npm run lint` 0 erros; `npm run build` OK; HTML inspecionado com as 2 ocorrências do container.

**Atenção:** o gtag direto do GA4 continua ativo; quando criar a tag do GA4 **dentro do GTM**, remova o bloco gtag do layout para não duplicar `page_view`.

**Pendências:** criar a tag GA4 dentro do container GTM + DebugView (Tag Assistant).

---

## 2026-10-07 — gtag direto removido (GA4 passa a ser via GTM)

**O que foi feito:**
1. Removido o bloco `gtag.js` + `gtag('config')` do `layout.js` — GA4 agora dispara só pela tag dentro do GTM (sem `page_view` duplicado).
2. Mantido o `consent default denied` (padrão oficial do Google para GTM): shim `dataLayer` + `gtag()` com `beforeInteractive` acima do snippet do container. O banner continua fazendo `consent update` pelo mesmo caminho.
3. Verificado no HTML servido: `consent default` presente, `gtag/js?id=G-` ausente.

**Testes/print:** `npm run lint` 0 erros; `npm run build` OK; inspeção do HTML.

**Pendências:** validar no Preview do GTM + DebugView do GA4.

---

## 2026-10-07 — Departamentos clicável + evento apply_coupon

**O que foi feito:**
1. "☰ Departamentos" virou link para `/` (era `<span>` sem ação).
2. Novo evento customizado `apply_coupon` (`{coupon, discount_value, value}`) ao aplicar cupom válido — o GA4 não tem evento padrão para isso; o padrão (`coupon` em `begin_checkout`/`purchase`) também foi corrigido: antes ia hardcoded `"DOPAMINA10"`, agora vai o cupom real aplicado (ou omitido).
3. Cupom gravado no pedido (`order.coupon` → coluna `coupon` no Supabase).

**Testes/print:** carrinho com item via navegador → aplicar DOPAMINA10 → `apply_coupon` presente no dataLayer + "Cupom aplicado" visível; `npm run lint` 0 erros; build OK.

**Pendências:** Preview GTM + DebugView.

---

## 2026-10-07 — Auditoria anti-duplicidade de eventos + docs/MEASUREMENT.md

**O que foi feito:**
1. Auditoria dos 14 pushes do dataLayer: sem StrictMode/gtag duplo; 4 fontes reais de repetição corrigidas com guardas síncronos (refs — state atrasa 1 tick e não segura clique duplo):
   - `view_item` 1x por produto (`viewedRef` na PDP);
   - `add_shipping_info`/`add_payment_info` 1x (voltar+continuar não repete);
   - `purchase` 1x (trava `placingRef` + botão "Processando…");
   - `apply_coupon` 1x por cupom (o teste com 3 cliques no mesmo tick pegou a 1ª versão com state — corrigido com ref).
2. Criado `docs/MEASUREMENT.md`: mapa evento→quando→parâmetros, regras anti-duplicidade e roteiro de validação (Preview + DebugView).

**Testes/print:** PDP → `view_item: 1`; 3 cliques em Aplicar → `apply_coupon: 1`; lint 0 erros; build OK.

**Pendências:** Preview GTM + DebugView.

---

## 2026-10-07 — view_item_list + pré-deploy Vercel

**O que foi feito:**
1. `view_item_list` integrado e verificado: `trackViewItemList` + `CategoryViewTracker.jsx` (mesmo padrão anti-duplicidade) → 1 disparo com `item_list_name: "Tech"` e 6 itens.
2. **Correção pré-deploy:** catálogo via `fs` em runtime quebra na Vercel (file-tracing não inclui `../data`). Novo `scripts/generate_products.mjs` gera `web/src/lib/products.generated.js` no `prebuild`; `catalog.js` usa o bundle (Supabase continua prioritário). Rota dinâmica `/busca` testada em `next start` → 200 com resultados.

**Testes/print:** lint 0 erros; build OK (prebuild gerou 40 produtos); `/busca?q=fone` e `/categoria/Tech` verificados em produção local.

**Pendências:** push + import na Vercel (Root Directory `web/`).

---

## 2026-10-07 — Limpa do GitHub: repo só com web+data+essenciais

**O que foi feito:**
1. `git rm --cached` em docs de planejamento (`BRAINSTORM.md`, `Linha do tempo.md`, `log.md`, `historygit.md`, `config.txt.rtf`, `prompt.txt.rtf`), `docs/`, `tests/` (prints), `sql/` e scripts auxiliares — **arquivos mantidos no disco, removidos só do git**.
2. Mantidos no GitHub: `web/`, `data/` + essenciais técnicos (`.github/workflows`, `generate_products.mjs`, `export_orders.mjs`, `.gitignore`).
3. `.gitignore` com seção offline-only para não recommitar por acidente.

**Atenção:** `log.md`/`historygit.md` continuam atualizados aqui, mas sem backup no GitHub — considere backup periódico (zip/OneDrive).

**Pendências:** `git push origin main` (apaga do GitHub) + import na Vercel.

---

## 2026-10-07 — Deploy no ar (ecommerce-ruby-delta-12.vercel.app)

**O que foi feito (validação pós-deploy):**
1. Home 200 + snippet GTM-5RLXF4BF + `consent default` presentes no HTML de produção.
2. Rota dinâmica `/busca?q=fone` → 200 com resultados (prova que o `prebuild` gerou o catálogo na Vercel).
3. PDP em produção: `view_item: 1`, `gtm.js: 1`, payload correto (`DOP-021`, 199.9).

**Pendências:** Preview GTM + DebugView na URL de produção; domínio permanente (DNS) quando propagar.

---

## 2026-10-07 — Supabase: tabela products + seed (lado código pronto)

**O que foi feito (código):**
1. `sql/supabase_products.sql` (local): tabela `products` + índices + RLS (leitura pública, escrita só service_role).
2. `scripts/seed_products.mjs` (local): CSV → upsert em lotes de 20 (`resolution=merge-duplicates` por sku); dry-run sem credenciais testado (40 produtos prontos).
3. `catalog.js`: normaliza `tags` vindas como array do PostgREST; Supabase continua prioritário sobre o bundle.

**Testes/print:** dry-run OK; lint 0 erros; build OK.

---

## 2026-10-08 — BigQuery bronze ONLINE: 1ª carga validada com dado real

**O que foi feito (infra + debugging da Action):**
1. **Conta GCP** criada (projeto `projeto-dev-410722`) com fatura ligada dentro do free tier; BigQuery API ativada; dataset **`Dopamina_Ecommerce_Bronze`** (região `US`) criado.
2. **Link de export GA4 → BigQuery** configurado (diário; identificadores de publicidade desmarcados — é só web por enquanto). Tabelas `analytics_*/events_*` devem aparecer em 24–48h.
3. **Service account** `dopamina-export` (BigQuery Data Editor + Job User) → JSON no secret `GCP_SA_KEY`; secrets `BQ_PROJECT` + Supabase completos no GitHub.
4. **4 bugs corrigidos na Action** (commits `ac1f888`, `36fc71c`, `1685e7d`, `326b528`):
   - `if: secrets...` não é permitido em step → autenticação GCP virou incondicional;
   - `git add exports/` quebrava com pasta inexistente → `mkdir -p`;
   - **causa raiz do HTTP 400:** `fetchTable` ordenava tudo por `created_at` e `order_items` não tem essa coluna → Supabase rejeitava (agora `orders`→`created_at`, `order_items`→`id` + erro mostra o corpo da resposta);
   - `bq load --autodetect` quebra com CSV de 0 linhas → **schema explícito** (`--schema=...`); em CI, falha de load agora derruba o job (não é mais engolida);
   - `exports/` estava no `.gitignore` (contrariava o plano de CSV backup) → removido da lista offline-only.
5. **Validação final:** Action verde — CSVs gerados, `bq load` OK e **dado conferido na tabela pelo usuário no console do BigQuery**. Marco M2 praticamente fechado (falta só confirmar as tabelas do export GA4).

**Testes/print:** job export-orders verde; tabela `Dopamina_Ecommerce_Bronze.orders` com dados conferidos pelo usuário.

**Pendências:** confirmar 1ª tabela `events_*` do GA4 (24–48h); Preview GTM + DebugView (M1); push dos commits locais; domínio permanente.

---

## 2026-10-08 — Governança analítica: PERGUNTAS.md (negócio + tracking + tagging)

**O que foi feito:**
1. Novo `PERGUNTAS.md` (offline, offline-only no `.gitignore`) com três planos:
   - **Perguntas de negócio** P1–P21 em 6 áreas (atribuição, funil, produto, retenção, qualidade do dado, baseline de plataforma), cada uma com métrica, fonte (`orders`/`events`/`gold`) e status.
   - **Ondas de resposta:** Onda 1 (hoje, SQL em `orders`: P6/P9/P14/P15/P16/P18), Onda 2 (export GA4: P7/P10/P11/P20), Onda 3 (silver/gold: P1–P5/P8/P12/P13/P17/P19), Onda 4 (V3 app: P21).
   - **Tracking plan** (checklist de registro de key events + dimensões no GA4, ponteiro ao `docs/MEASUREMENT.md`).
   - **Tagging plan** (taxonomia UTM por parâmetro alinhada ao channel grouping do GA4, regras de link canônico, `snake_case`, `simulation_flag`).
2. **Regra de ouro:** sem pergunta → sem mart → sem evento novo. Marts da gold entram só se responderem perguntas da Onda 3.
3. Ligações: `BRAINSTORM.md` §4 ganhou nota de governança + §10 reordenado; `Linha do tempo.md` ganhou 3 checkboxes (Fase 1 tracking, Fase 2 ondas/gate, Fase 3 tagging) e M3 agora exige P3+P4+P7 respondidas.

**Pendências:** executar Onda 1 em SQL (bom candidato às primeiras linhas de `/stats`); checklist GA4 ao validar DebugView.

---

## 2026-10-08 — Reestruturação das fases (Linha do tempo, Fases 1–8)

**O que mudou (pedido do usuário):**
- **Fase 2 = BigQuery bronze** — termina na **confirmação da 1ª tabela `events_*` do GA4** (novo marco **M2.1** = saída da fase). Até lá o bronze existe, mas o feed de eventos não.
- **Fase 3 = Exploração do dado bruto** — sanidade/volumetria, primeiro diagnóstico de atribuição direto no bronze, e mapeamento do que exige stitching vs. do que já dá para responder.
- **Fase 4 = Perguntas de negócio + tracking + tagging** — Ondas 1–2 do `PERGUNTAS.md` em SQL, registro de key events/dimensões no GA4 + DebugView (fecha M1), e taxonomia UTM + `/lanca`.
- **Fase 5 = Engenharia de dados (Databricks)** — conta + quotas, bronze→silver, marts gold (gate = Onda 3).
- **Fase 6 = Atribuição multi-touch + dataviz** (modelos, marts, dashboards, `/stats`). **Fase 7 = Play Store.** **Fase 8 = Crescimento.**
- Maros: M2 ✅ já feito; **M2.1** novo (events_* confirmada); M1 fecha na Fase 4; M3 exige P3/P4/P7; localização de cada marco anotada na tabela.

**Pendências:** Fase 1 agora 100% ✅ (validação migrada p/ Fase 4); ajuste de referências de fase no `PERGUNTAS.md` feito; falta confirmar events_* (M2.1).

---

## 2026-10-08 — Reestruturação v2: 3 frentes + jornada de negócio (Linha do tempo, Fases 1–8)

**Contexto do usuário:** chegou num ecommerce pronto e percebeu que fazia várias funções misturadas (dev × engenharia de dados × análise). A jornada real de um data track é: **conversar com a liderança (perguntas) → verificar na interface o que já é traqueado/tagueado (checklist eventos base, traquear o que falta) → entender quais dados temos e os problemas de atribuição → estruturar as tabelas (engenharia) → dashboards**.

**O que mudou (FASES 1–8, com frentes marcadas 🎨 dev / 🔎 análise / 🛢️ eng.):**
- **Fase 1 — Desenvolvimento** ✅ (fundo: MVP completo + fundação de dados validada).
- **Fase 2 — Perguntas de negócio (com liderança)** [🔎] — dialogar, priorizar e catalogar em `PERGUNTAS.md`; regra "sem pergunta → sem mart".
- **Fase 3 — Tracking & tagging (auditoria)** [🔎] — DebugView + checklist de eventos base de ecommerce, traquear faltantes, key events/dimensões (fecha M1), taxonomia UTM + `/lanca`.
- **Fase 4 — Entender o dado + diagnóstico de atribuição** [🔎] — M2.1 (events_* confirmada), sanidade/volumetria, primeiras queries de atribuição, **especificação das tabelas silver/gold** entregue à engenharia.
- **Fase 5 — Engenharia de dados (Medallion)** [🛢️] — Databricks, bronze→silver, marts gold vinculados a P#.
- **Fase 6 — Dashboards & dataviz** [🔎] — modelos de atribuição, dashboards, `/stats`, **revisão com liderança** (fecha M3).
- **Fase 7 — Play Store** [🎨] · **Fase 8 — Crescimento** [todos].
- Marcos: M1→Fase 3; M2→Fase 1 ✅; **M2.1 novo**→Fase 4; M2.5→Fase 5; M3→Fase 6.

**Pendências:** Diary com liderança (Fase 2) ainda não realizado — é o próximo passo do fluxo; M2.1 aguarda 24–48h.

---

## 2026-10-08 — Níveis com sub tarefas de fechamento (Linha do tempo)

**O que foi feito:** adicionada a seção **"Níveis — fechamento (subtarefas obrigatórias por nível)"** ao fim da `Linha do tempo.md`. Cada marco (M1, M2, M2.1, M2.5, M3, M4) agora tem a lista detalhada de sub tarefas que precisam estar marcadas para fechar o nível (regra: só fecha com TODAS ✓; evidência em `tests/`/`sql/`; registro em `log.md`).
- **M2** já nasce marcado ✅ (dado validado no BigQuery).
- **M1** detalha os 15 eventos + consent + anti-duplicidade + key events/dimensões.
- **M2.1** detalha validação do `events_*` (query, schema, atraso).
- **M2.5** detalha Databricks, dedupe/stitch e os 3 marts com P# vinculada.
- **M3** detalha modelos de atribuição, dashboards e as 3 perguntas exigidas.
- **M4** detalha PWA/TWA/Play e baseline P21.

**Pendências:** M2.1 (24–48h) e o resto do fluxo conforme Fases 2–8.

---

## 2026-10-08 — Fase 1b implementada: SEO On-Page (Home, Categorias, PDP) + conteúdo/FAQ

**O que foi feito (código — frente 🎨 desenvolvimento):**
1. **Novos artefatos reutilizáveis:**
   - `web/src/lib/seo.js` — `SITE_URL` (`NEXT_PUBLIC_SITE_URL` com fallback Vercel), `SITE_NAME`, `absUrl`, `clamp`, `KEYWORDS` (Grupo A), conteúdo por categoria (lead + FAQ) e geradores `buildHomeFaqs`, `buildCategoryFaqs`, `buildProductFaqs`.
   - `web/src/lib/jsonld.js` — construtores `jsonLdWebsite`, `jsonLdOrganization`, `jsonLdBreadcrumb`, `jsonLdItemList`, `jsonLdProduct` (Product+Offer+AggregateRating), `jsonLdFaq`.
   - `web/src/components/JsonLd.jsx` — `<script type="application/ld+json">` nativo (Server Component), com `replace(/</g,'\\u003c')` (recomendação oficial do Next).
   - `web/src/components/FaqSection.jsx` — FAQ visível com `<details>` nativo (sem JS de cliente); mesmo conteúdo do JSON-LD `FAQPage`.
2. **Home** (`app/page.js`): `metadata` (title/description/canonical/OG), JSON-LD `WebSite`+`Organization`+`FAQPage`, seção "Como funciona o simulador de compras" (H2, 3 passos) e bloco de FAQ.
3. **Categoria** (`app/categoria/[slug]/page.js`): `generateMetadata()` dinâmico (título `[Categoria] — simulador de compras`), JSON-LD `BreadcrumbList`+`ItemList`+`FAQPage`, intro dinâmica por categoria e FAQ (dúvidas específicas + "produtos mais desejados" gerado de `sold_fake` + perguntas universais de negócio).
4. **PDP** (`app/produto/[slug]/page.js`): `generateMetadata()` dinâmico, JSON-LD `Product+Offer`+`BreadcrumbList`+`FAQPage`, bloco "Sobre o produto" (copy com keywords) e FAQ por produto (preço/parcelamento, promoção, entrega, garantia, segurança, especificações).
5. **Layout** (`app/layout.js`): `metadataBase`, `title.template` (`%s | dopamina.`), description/keywords/OG/Twitter padrão.
6. **Técnico**: `app/sitemap.js` (51 URLs: home + stats + 9 categorias + 40 produtos) e `app/robots.js` (allow `/`, disallow carrinho/checkout/confirmacao/rastreio/pedidos/busca/api).
7. **Acessibilidade/SEO de imagem**: `ProductImage.jsx` passou a usar `alt` descritivo (`[nome] — [categoria] no simulador de compras dopamina.`).

**Conteúdo de negócio:** as FAQ respondem às perguntas do `PERGUNTAS.md` de forma editorial (ex.: cupom DOPAMINA10 → P9; produtos mais desejados por categoria → P12/P13/P15; "comprar de mentirinha ajuda a controlar impulso" → Grupo B; "o que é dopamina shopping" → Grupo C), reforçando o Grupo A (descoberta) nos títulos/metas.

**Validação:**
- `npm run lint` → 0 erros (1 warning pré-existente de `<img>`).
- `npm run build` → EXIT 0; 62 páginas geradas (Home, 9 categorias, 40 PDPs, sitemap, robots).
- HTML pré-renderizado conferido: título/description/canonical corretos; 3 JSON-LD por página parseáveis (`ConvertFrom-Json` OK); FAQ visível (`<details>`) = nº de perguntas do `FAQPage`; 1 H1 por página.

**Arquivos:** `web/src/lib/seo.js`, `web/src/lib/jsonld.js`, `web/src/components/JsonLd.jsx`, `web/src/components/FaqSection.jsx`, `web/src/app/layout.js`, `web/src/app/page.js`, `web/src/app/categoria/[slug]/page.js`, `web/src/app/produto/[slug]/page.js`, `web/src/app/sitemap.js`, `web/src/app/robots.js`, `web/src/components/ProductImage.jsx`.

**Pendências:** rodar o Rich Results Test na URL de produção e salvar prints em `tests/seo/`; configurar `NEXT_PUBLIC_SITE_URL` na Vercel quando `dopaminaloja.com.br` estiver ativo; deploy.
