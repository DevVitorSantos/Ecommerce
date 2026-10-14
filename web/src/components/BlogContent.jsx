import Link from "next/link";

// Renderiza o corpo do artigo (server component). Tipos: p, h2, ul, ol, callout, quote.
// Links internos no texto são escritos como [[texto|/destino]] e viram <Link>.
function RichText({ text }) {
  const re = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;
  const nodes = [];
  let last = 0;
  let m;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(<span key={`t${k++}`}>{text.slice(last, m.index)}</span>);
    nodes.push(
      <Link key={`l${k++}`} href={m[2]} className="font-medium text-indigo-600 hover:underline">
        {m[1]}
      </Link>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(<span key={`t${k++}`}>{text.slice(last)}</span>);
  return <>{nodes}</>;
}

export default function BlogContent({ blocks = [] }) {
  return (
    <div>
      {blocks.map((b, i) => {
        if (b.type === "h2") {
          return (
            <h2 key={i} className="mt-8 text-2xl font-extrabold text-slate-900">
              {b.text}
            </h2>
          );
        }
        if (b.type === "p") {
          return (
            <p key={i} className="mt-4 text-[15px] leading-relaxed text-slate-600">
              <RichText text={b.text} />
            </p>
          );
        }
        if (b.type === "ul") {
          return (
            <ul key={i} className="mt-4 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-slate-600">
              {b.items.map((t, j) => (
                <li key={j}>
                  <RichText text={t} />
                </li>
              ))}
            </ul>
          );
        }
        if (b.type === "ol") {
          return (
            <ol key={i} className="mt-4 list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed text-slate-600">
              {b.items.map((t, j) => (
                <li key={j}>
                  <RichText text={t} />
                </li>
              ))}
            </ol>
          );
        }
        if (b.type === "callout") {
          return (
            <aside key={i} className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm leading-relaxed text-slate-600">
              <strong className="text-slate-900">{b.title}</strong> <RichText text={b.text} />
            </aside>
          );
        }
        if (b.type === "quote") {
          return (
            <blockquote key={i} className="mt-6 border-l-4 border-indigo-200 pl-4 text-[15px] italic text-slate-500">
              <RichText text={b.text} />
            </blockquote>
          );
        }
        return null;
      })}
    </div>
  );
}
