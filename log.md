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
