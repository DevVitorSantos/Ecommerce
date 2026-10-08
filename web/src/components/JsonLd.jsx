// Renderiza JSON-LD como <script> nativo (Server Component).
// `next/script` não serve aqui: dados estruturados não são código executável.
// O replace de "<" evita injeção de HTML (recomendação oficial do Next).
export default function JsonLd({ data }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
