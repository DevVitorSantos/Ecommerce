"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "dopamina-consent";

function pushConsent(granted) {
  try {
    window.dataLayer = window.dataLayer || [];
    const update = {
      ad_storage: granted ? "granted" : "denied",
      ad_user_data: granted ? "granted" : "denied",
      ad_personalization: granted ? "granted" : "denied",
      analytics_storage: granted ? "granted" : "denied",
    };
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", update);
    } else {
      // GA4 ainda não carregou (sem ID configurado): registra a escolha no dataLayer
      window.dataLayer.push({ event: "consent_update", consent: update });
    }
  } catch {
    // modo privado / storage indisponível: mantém tudo negado
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {
      stored = null;
    }
    if (!stored) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
    return undefined;
  }, []);

  useEffect(() => {
    const reopen = () => setVisible(true);
    window.addEventListener("dopamina-consent-reset", reopen);
    return () => window.removeEventListener("dopamina-consent-reset", reopen);
  }, []);

  const choose = useCallback((granted) => {
    try {
      localStorage.setItem(KEY, granted ? "granted" : "denied");
    } catch {
      // sem storage: só aplica em memória
    }
    pushConsent(granted);
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
      role="dialog"
      aria-label="Aviso de cookies"
      data-testid="cookie-banner"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">🍪</span>
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-900">A gente usa cookies (os digitais, não os de comer)</p>
          <p className="mt-1 text-xs text-slate-500">
            Usamos Google Analytics 4 para medir visitas e melhorar a loja. Nada é vendido, nada identifica
            você — é tudo agregado e simulado. Sem aceite, a medição continua bloqueada.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="nx-btn-primary px-5 py-2 text-sm"
              onClick={() => choose(true)}
              data-testid="cookie-accept"
            >
              Aceitar medição
            </button>
            <button
              type="button"
              className="nx-btn-ghost px-5 py-2 text-sm"
              onClick={() => choose(false)}
              data-testid="cookie-reject"
            >
              Recusar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function resetConsent() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignora
  }
  window.dispatchEvent(new Event("dopamina-consent-reset"));
}
