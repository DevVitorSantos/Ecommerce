# GTM — container GTM-5RLXF4BF

Aqui vai a **evidência do container** (export JSON) e a versão publicada.
Sem credencial de API no ambiente, o export é manual.

## Exportar (manual)

1. Abra o Google Tag Manager → container **GTM-5RLXF4BF**.
2. **Admin → Export Container** → formato **JSON**.
3. Salve como `gtm-GTM-5RLXF4BF-YYYY-MM-DD.json` nesta pasta.
4. Confira contra `../06-gtm-spec.csv` (tags, triggers, variáveis, consent).

## Publicar uma versão (changelog)

1. GTM → **Versions** → **Publish**.
2. Descrição clara (ex.: `vN — add view_promotion`).
3. Registre em `../10-changelog.csv`.

## Checklist de auditoria do container

- [ ] Google tag (GA4 Config) em Initialization / All Pages
- [ ] 15 triggers `CE - <event>` (ver `../06-gtm-spec.csv`)
- [ ] Tags GA4 Event para cada evento ecommerce
- [ ] Built-in consent: GA4 e Ads com verificações de consentimento
- [ ] Dimensões event-scoped registradas no GA4 (ver `../05-parameter-dictionary.csv`, G3)

> O export JSON acompanha o workflow de commit/push normal (não é offline-only).
