# History Git — histórico de commits do projeto

> Cada commit com ID (hash curto) e resumo do que foi feito.
> Observação: este arquivo registra os commits **anteriores ao próprio commit corrente**
> (o registro do commit atual entra na próxima atualização), para evitar auto-referência circular.

---

| # | Hash | Mensagem | Resumo |
|---|------|----------|--------|
| 1 | `90592ab` | `docs(brainstorm): planejamento inicial do Dopamina Ecommerce` | Cria `BRAINSTORM.md` (conceito, arquitetura de dados, engenharia de dados, plano de medição GA4, estratégia multi-touch, custos, riscos, stack), `Linha do tempo.md` (5 fases + marcos), `log.md` (primeira entrada) e `.gitignore`. Pesquisa de referências prévia. |
| 2 | `b163168` | `docs: registra commit 90592ab no historygit e no log` | Cria `historygit.md` com a linha do commit 1 e atualiza `log.md` com a seção de commits da sessão. |
| 3 | `6439e6d` | `docs(brainstorm): analitica unificada no BigQuery (substitui DuckDB)` | Atualiza `BRAINSTORM.md` (diagrama, §3.2 export com load job, §3.3 camada analítica só BigQuery, §5.2 modelos em SQL, §9 stack), `Linha do tempo.md` (Fases 2 e 3) e `log.md`. DuckDB vira plano B opcional. |
| 4 | `1229496` | `docs: registra commit 6439e6d no historygit` | Adiciona a linha do commit 3 na tabela. |
| 5 | `c7b7837` | `docs(brainstorm): medallion hibrido bronze BigQuery + silver/gold Databricks Free` | Reestrutura a camada 3 em Medallion (bronze raw no BigQuery, silver/gold no Databricks Free Edition), define dataviz (Databricks SQL/Genie + Looker Studio), atualiza custos, stack, próximos passos, Fases 2/3 e marco M2.5. |
| 6 | `fb567c9` | `docs(brainstorm): adiciona organograma da arquitetura e Power BI Desktop opcional` | Adiciona o organograma entrada→camadas→consumo no §3.3, registra Power BI Desktop como dataviz pessoal opcional (§3.3.1) e entrada no log. |
| 7 | `e10887f` | `feat(web): ecommerce V1 em JavaScript` | Constrói o app sem TypeScript: `data/products.csv` (40 produtos) + validador, `web/` (lib, store Zustand, 9 rotas + `/api/orders`), lint 0 erros, build com 58 páginas estáticas. Evidência em `tests/build-v1-js.txt`. |

---

### Como usar
Para ver o histórico real: `git log --oneline --stat`
Para ver a ID completa de um commit: `git log -1 --format=%H <hash>`
