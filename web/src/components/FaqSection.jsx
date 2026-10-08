// Bloco de FAQ visível na página. Usa <details> nativo (sem JS de cliente)
// e o mesmo conteúdo enviado no JSON-LD FAQPage — requisito do Google.
export default function FaqSection({ id = "faq", title, intro, faqs }) {
  if (!faqs || faqs.length === 0) return null;
  return (
    <section aria-labelledby={id} className="nx-card mt-8 p-6">
      <h2 id={id} className="text-lg font-extrabold text-slate-900">
        {title}
      </h2>
      {intro && <p className="mt-1 text-sm text-slate-500">{intro}</p>}
      <div className="mt-4 divide-y divide-slate-100">
        {faqs.map((f) => (
          <details key={f.q} className="group py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-slate-800">
              {f.q}
              <span className="text-indigo-600 transition-transform group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
