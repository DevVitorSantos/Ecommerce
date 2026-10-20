"use client";

// Lê a identidade do GA4 no navegador para costurar web × pedidos.
// Retorna null quando o GA4 não está no ar ou o usuário recusou cookies.

// Descobre o ID de medição (G-XXXX) em runtime: a env nem sempre existe e o
// GA4 é injetado pelo GTM (o <script> do gtag carrega com ?id=G-XXXX).
function findGa4Id() {
  try {
    if (process.env.NEXT_PUBLIC_GA4_ID) return process.env.NEXT_PUBLIC_GA4_ID;
    const scripts = Array.from(document.querySelectorAll("script[src]"));
    for (const s of scripts) {
      const m = s.src.match(/[?&]id=(G-[A-Z0-9]+)/i);
      if (m) return m[1];
    }
  } catch {}
  return null;
}

function parseGaCookie(field) {
  try {
    if (field === "client_id") {
      const m = document.cookie.match(/_ga=([^;]+)/);
      if (!m) return null;
      // formato: GA1.1.<client_id>.<timestamp>
      const parts = decodeURIComponent(m[1]).split(".");
      if (parts.length < 4) return null;
      return `${parts[2]}.${parts[3]}`;
    }
    if (field === "session_id") {
      const ga4 = findGa4Id();
      if (!ga4) return null;
      // cookie _ga_<container> = GS1.1.<session_id>.<seq>....
      const m = document.cookie.match(new RegExp(`_ga_${ga4.replace("G-", "")}=([^;]+)`));
      if (!m) return null;
      const parts = decodeURIComponent(m[1]).split(".");
      if (parts.length < 3) return null;
      return parts[2];
    }
    return null;
  } catch {
    return null;
  }
}

function gtagGet(field) {
  return new Promise((resolve) => {
    try {
      const id = findGa4Id();
      if (typeof window === "undefined" || typeof window.gtag !== "function" || !id) {
        resolve(parseGaCookie(field));
        return;
      }
      // GA4 só suporta 'get' de client_id; session_id vem do cookie _ga_<container>.
      if (field !== "client_id") {
        resolve(parseGaCookie(field));
        return;
      }
      const timeout = setTimeout(() => resolve(parseGaCookie(field)), 1500);
      window.gtag("get", id, field, (value) => {
        clearTimeout(timeout);
        resolve(value || parseGaCookie(field));
      });
    } catch {
      resolve(parseGaCookie(field));
    }
  });
}

export function getGaClientId() {
  return gtagGet("client_id");
}

export function getGaSessionId() {
  return gtagGet("session_id");
}
