"use client";

// Lê a identidade do GA4 no navegador para costurar web × pedidos.
// Retorna null quando o GA4 não está configurado ou o usuário recusou cookies.
function parseGaCookie(field) {
  try {
    const m = document.cookie.match(/_ga=([^;]+)/);
    if (!m) return null;
    // formato: GA1.1.<client_id>.<timestamp>
    const parts = decodeURIComponent(m[1]).split(".");
    if (parts.length < 4) return null;
    if (field === "client_id") return `${parts[2]}.${parts[3]}`;
    return null;
  } catch {
    return null;
  }
}

function gtagGet(field) {
  return new Promise((resolve) => {
    try {
      const id = process.env.NEXT_PUBLIC_GA4_ID;
      if (typeof window === "undefined" || typeof window.gtag !== "function" || !id) {
        resolve(parseGaCookie(field));
        return;
      }
      const timeout = setTimeout(() => resolve(parseGaCookie(field)), 1500);
      window.gtag("get", id, field, (value) => {
        clearTimeout(timeout);
        resolve(value || parseGaCookie(field));
      });
    } catch {
      resolve(null);
    }
  });
}

export function getGaClientId() {
  return gtagGet("client_id");
}

export function getGaSessionId() {
  return gtagGet("session_id");
}
