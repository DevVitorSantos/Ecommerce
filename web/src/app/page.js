import Link from "next/link";
import { getCategories, getProducts } from "@/lib/catalog";
import { deptStyle } from "@/lib/departments";
import ProductCard from "@/components/ProductCard";
import Countdown from "@/components/Countdown";
import Newsletter from "@/components/Newsletter";
import { discount } from "@/lib/format";

export const revalidate = 3600;

export default async function Home() {
  const products = await getProducts();
  const categories = await getCategories();

  const withOff = [...products].sort(
    (a, b) => discount(b.price, b.price_list) - discount(a.price, a.price_list),
  );
  const flash = withOff.slice(0, 4);
  const destaques = products.slice(8, 16);

  const counts = {};
  products.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });

  return (
    <div>
      {/* HERO */}
      <section className="nx-hero text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:items-center md:py-16">
          <div>
            <span className="nx-chip bg-white/15 text-white">dopamina. hub integrado</span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
              Compre tudo. <br /> Gaste nada.
            </h1>
            <p className="mt-4 max-w-md text-indigo-100">
              A curadoria definitiva de desejos impossíveis — carrinho, checkout e entrega simulada
              com frete unificado de ilusão.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="#departamentos" className="rounded-lg bg-white px-5 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-50">
                Explorar departamentos →
              </Link>
              <Link href="#ofertas" className="rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                Ver ofertas do dia
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            {[
              ["⚡", "5s", "entrega simulada"],
              ["💸", "R$ 0", "gasto real"],
              ["🎧", "24h", "suporte fantasma"],
            ].map(([icon, big, small]) => (
              <div key={small} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <div className="text-2xl">{icon}</div>
                <div className="mt-1 text-lg font-extrabold">{big}</div>
                <div className="text-indigo-100">{small}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        {/* DEPARTAMENTOS */}
        <section id="departamentos" className="py-10">
          <h2 className="text-2xl font-extrabold text-slate-900">Navegue por departamentos</h2>
          <p className="mt-1 text-sm text-slate-500">Cada corredor foi desenhado para prender sua atenção.</p>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((c) => {
              const dept = deptStyle(c);
              return (
                <Link
                  key={c}
                  href={`/categoria/${encodeURIComponent(c)}`}
                  className="nx-card nx-card-hover p-4 text-center"
                >
                  <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full text-2xl ${dept.soft}`}>
                    {dept.icon}
                  </div>
                  <div className="mt-2 text-sm font-bold text-slate-900">{c}</div>
                  <div className="text-xs text-slate-400">{counts[c]} produtos</div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* OFERTAS RELÂMPAGO */}
        <section id="ofertas" className="py-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="nx-chip bg-red-600 text-white">🔴 Ao vivo</span>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Ofertas Relâmpago 24 Horas</h2>
              <p className="mt-1 text-sm text-slate-500">
                Preços promocionais válidos enquanto durar o estoque infinito.
              </p>
            </div>
            <Countdown />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {flash.map((p) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        </section>

        {/* DESTAQUES */}
        <section className="py-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-extrabold text-slate-900">Destaques da semana</h2>
            <span className="text-xs text-slate-400">escolhidos pelo algoritmo do desejo</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            {destaques.map((p) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        </section>

        {/* PROVA SOCIAL */}
        <section className="nx-hero rounded-2xl p-8 text-white">
          <h2 className="text-center text-2xl font-extrabold">O que dizem os clientes da dopamina.</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["★★★★★", "“Comprei 14 coisas e minha fatura veio zerada. Terapia.”", "— Camila, SP"],
              ["★★★★★", "“Chegou em 5 segundos. Nunca fui tão feliz por tão pouco.”", "— Rafael, RJ"],
              ["★★★★★", "“Meu carrinho tem 200 itens e zero culpa. Recomendo.”", "— Ju, MG"],
            ].map(([stars, text, author]) => (
              <div key={author} className="rounded-xl bg-white/10 p-5 backdrop-blur">
                <div className="text-amber-300">{stars}</div>
                <p className="mt-2 text-sm">{text}</p>
                <p className="mt-2 text-xs text-indigo-200">{author}</p>
              </div>
            ))}
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="py-10">
          <div className="nx-card mx-auto max-w-2xl p-8 text-center">
            <h3 className="text-xl font-extrabold text-slate-900">Receba promoções exclusivas e cupons VIP</h3>
            <p className="mt-1 text-sm text-slate-500">(que não valem nada, mas chegam rápido)</p>
            <Newsletter />
          </div>
        </section>
      </div>
    </div>
  );
}
