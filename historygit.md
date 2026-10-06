# History Git — histórico de commits do projeto

> Cada commit com ID (hash curto) e resumo do que foi feito.
> Observação: este arquivo registra os commits **anteriores ao próprio commit corrente**
> (o registro do commit atual entra na próxima atualização), para evitar auto-referência circular.

---

| # | Hash | Mensagem | Resumo |
|---|------|----------|--------|
| 1 | `__C1__` | `docs(brainstorm): planejamento inicial do Dopamina Ecommerce` | Cria `BRAINSTORM.md` (conceito, arquitetura de dados, engenharia de dados, plano de medição GA4, estratégia multi-touch, custos, riscos, stack), `Linha do tempo.md` (5 fases + marcos), `log.md` (primeira entrada) e `.gitignore`. Pesquisa de referências prévia. |

---

### Como usar
Para ver o histórico real: `git log --oneline --stat`
Para ver a ID completa de um commit: `git log -1 --format=%H <hash>`
