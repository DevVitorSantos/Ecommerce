import Link from "next/link";
import { getProducts } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

export const revalidate = 3600;

export default async function Home() {
  const products = await getProducts();
  const destaques = products.slice(0, 8);

  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="grid gap-6 py-12 md:grid-cols-2 md:items-center">
        <div>
          <span className="badge-flash rounded-full px-3 py-1 text-xs font-bold text-black">
            100% simulado · 0% culpa
          </span>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            compre tudo. <span className="gradient-text">gaste nada.</span>
          </h1>
          <p className="mt-4 max-w-md text-white/70">
            carrinho, checkout e entrega de mentira — na velocidade de uma loja de verdade. chega em 5 segundos,
            dopamina garantida.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="#destaques"
              className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-bold hover:opacity-90"
            >
              começar a comprar
            </Link>
            <Link href="/stats" className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold hover:bg-white/5">
              ver os dados
            </Link>
          </div>
        </div>
        <div className="dopamine-card rounded-3xl p-6">
          <div className="grid grid-cols-3 gap-3 text-center text-xs text-white/60">
            {[
              ["5s", "entrega simulada"],
              ["R$ 0", "gasto real"],
              ["24h", "suporte fantasma"],
              ["+15", "eventos medidos"],
              ["∞", "dopamina"],
              ["1 clique", "para tudo"],
            ].map(([big, small]) => (
              <div key={small} className="rounded-xl bg-white/5 p-3">
                <div className="text-lg font-black text-white">{big}</div>
                <div>{small}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="destaques" className="py-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-2xl font-black">mais desejados</h2>
          <span className="text-xs text-white/50">estoque infinito, consciência finita</span>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {destaques.map((p) => (
            <ProductCard key={p.sku} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
