import Link from "next/link";

// Caixa de conversão que aparece nos artigos e leva para o simulador.
export default function BlogCta({
  text = "Gostou da ideia? O simulador é grátis — e o gasto real é sempre R$ 0.",
  href = "/",
  label = "Abrir o simulador",
}) {
  return (
    <aside className="nx-hero my-8 rounded-2xl p-6 text-white sm:p-8">
      <p className="text-lg font-extrabold sm:text-xl">{text}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={href}
          className="rounded-lg bg-white px-5 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-50"
        >
          {label} →
        </Link>
        <Link
          href="/#departamentos"
          className="rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
        >
          Explorar departamentos
        </Link>
      </div>
    </aside>
  );
}
