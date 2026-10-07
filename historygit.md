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

---

### Como usar
Para ver o histórico real: `git log --oneline --stat`
Para ver a ID completa de um commit: `git log -1 --format=%H <hash>`
