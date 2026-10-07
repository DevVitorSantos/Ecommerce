"use client";

import { useState } from "react";

export default function Newsletter() {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="mx-auto mt-4 max-w-md rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
        ✓ Inscrito! O primeiro cupom chega em 5 segundos (mentira, mas obrigado).
      </p>
    );
  }

  return (
    <form
      className="mx-auto mt-4 flex max-w-md gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <input className="nx-input" placeholder="seu melhor e-mail de mentira" data-testid="newsletter-email" />
      <button type="submit" className="nx-btn-primary whitespace-nowrap px-5" data-testid="newsletter-submit">
        Quero
      </button>
    </form>
  );
}
