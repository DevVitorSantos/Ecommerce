import { getProducts } from "@/lib/catalog";
import FavoritesView from "@/components/FavoritesView";

export const metadata = {
  title: "Favoritos",
  description: "Os produtos que você salvou no simulador de compras dopamina.",
  robots: { index: false, follow: true },
};

export default async function FavoritesPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900">Seus favoritos ❤️</h1>
      <p className="mt-1 text-sm text-slate-500">
        A lista de desejos do simulador — compre tudo de mentirinha, sem gastar nada.
      </p>
      <FavoritesView products={products} />
    </div>
  );
}
