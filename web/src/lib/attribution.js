"use client";

// Captura a atribuição da sessão (UTMs + referrer + landing page) na primeira
// visita e guarda em sessionStorage. É o que costura o pedido no Supabase com a
// sessão do GA4 — o /api/orders grava estas colunas (utm_source/medium/..., referrer,
// landing_page). Sem isso o pedido entra "órfão" de campanha.
const KEY = "dopamina-utm";
const LANDING_KEY = "dopamina-landing";

const UTM_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    // Primeira URL da sessão = landing page (não sobrescreve em navegações seguintes).
    const params = new URLSearchParams(window.location.search);
    const hasUtm = UTM_FIELDS.some((f) => params.get(f));

    if (!sessionStorage.getItem(LANDING_KEY)) {
      sessionStorage.setItem(
        LANDING_KEY,
        window.location.pathname + (window.location.search || ""),
      );
    }

    // Só grava/atualiza quando a URL traz UTM nova (toque de campanha).
    // Sem UTM, mantém a última atribuição da sessão em vez de zerar.
    if (hasUtm) {
      const attr = {};
      for (const f of UTM_FIELDS) {
        const v = params.get(f);
        if (v) attr[f] = v;
      }
      if (!attr.utm_campaign && params.get("campaign")) {
        attr.utm_campaign = params.get("campaign");
      }
      sessionStorage.setItem(KEY, JSON.stringify(attr));
    }

    if (!sessionStorage.getItem("dopamina-referrer")) {
      sessionStorage.setItem("dopamina-referrer", document.referrer || "");
    }
  } catch {
    // storage indisponível (modo privado) — pedido segue com atribuição parcial
  }
}

// Lê a atribuição acumulada da sessão (usada pelo CheckoutFlow ao finalizar).
export function getAttribution() {
  if (typeof window === "undefined") return {};
  try {
    const utm = JSON.parse(sessionStorage.getItem(KEY) || "{}") || {};
    return {
      utm_source: utm.utm_source || null,
      utm_medium: utm.utm_medium || null,
      utm_campaign: utm.utm_campaign || null,
      utm_content: utm.utm_content || null,
      utm_term: utm.utm_term || null,
      referrer: sessionStorage.getItem("dopamina-referrer") || null,
      landing_page: sessionStorage.getItem(LANDING_KEY) || null,
    };
  } catch {
    return {};
  }
}
