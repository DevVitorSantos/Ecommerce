# MEASUREMENT — mapa de eventos (dataLayer → GTM → GA4)

Todos os eventos são empurrados para o mesmo `dataLayer`. O GTM (GTM-5RLXF4BF)
lê daqui; a tag do GA4 vive **dentro do GTM** (gtag direto removido do layout).

## Regras anti-duplicidade (garantidas em código)

| Regra | Onde |
|---|---|
| `view_item` dispara 1x por produto (mesmo com remount/HMR) | `ProductDetail.jsx` (`viewedRef`) |
| `view_cart` e `begin_checkout` disparam 1x por montagem | `CartView.jsx` / `CheckoutFlow.jsx` (refs) |
| `add_shipping_info` / `add_payment_info` disparam 1x (voltar+continuar não repete) | `CheckoutFlow.jsx` (`firedStepsRef`) |
| `purchase` dispara 1x (botão trava em "Processando…") | `CheckoutFlow.jsx` (`placing`) |
| `apply_coupon` dispara 1x por cupom (re-aplicar o mesmo não repete) | `CartView.jsx` |

## Eventos

| Evento | Quando | Parâmetros | Tipo GA4 |
|---|---|---|---|
| `view_item_list` | (reservado p/ home/categoria) | `items[]` | — |
| `select_item` | clique no card → PDP | `items[]` | padrão |
| `view_item` | PDP | `value`, `items[]` | padrão |
| `add_to_cart` | "Adicionar"/"Comprar agora" | `value`, `items[]` | padrão |
| `remove_from_cart` | "remover" no carrinho | `value`, `items[]` | padrão |
| `view_cart` | página do carrinho | `value`, `items[]` | padrão |
| `begin_checkout` | entra no checkout | `value`, `coupon?`, `items[]` | padrão |
| `add_shipping_info` | avança passo entrega | `value`, `shipping_tier: "simulado"`, `items[]` | padrão |
| `add_payment_info` | avança passo pagamento | `value`, `payment_type: "simulado"`, `items[]` | padrão |
| `purchase` | confirma pedido | `transaction_id` (`SIM-…`), `value`, `coupon?`, `items[]` | padrão (key event) |
| `apply_coupon` | cupom válido aplicado | `coupon`, `discount_value`, `value` | **customizado** |
| `search` | busca no header | `search_term` | padrão |
| `consent_update` | aceite/recusa de cookies | `consent: {ad_storage, ad_user_data, ad_personalization, analytics_storage}` | **customizado** (Consent Mode) |

`items[]` segue o schema GA4: `{item_id: sku, item_name, item_category, price, quantity}`.
Moeda sempre `BRL`. `transaction_id` sempre prefixo `SIM-`.

## Consent Mode

- `layout.js` fixa `consent default denied` (4 flags) antes do container.
- Banner (`CookieConsent.jsx`) emite `consent update` via `gtag()` (definido pelo shim).
- No GTM: checar em Preview que tags do Google ficam "Consent Denied" antes do aceite.

## Validação

1. GTM Preview no `localhost:3000` → aba Data Layer: cada evento aparece **1x**.
2. GA4 DebugView: funil `view_item → add_to_cart → begin_checkout → purchase` completo.
3. Prints em `tests/`.
