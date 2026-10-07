"use client";

import { resetConsent } from "@/components/CookieConsent";

export default function CookieReset() {
  return (
    <button type="button" className="hover:text-indigo-600" onClick={resetConsent}>
      🍪 Preferências de cookies
    </button>
  );
}
