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
