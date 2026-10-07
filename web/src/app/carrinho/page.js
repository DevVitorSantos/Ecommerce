import CartView from "@/components/CartView";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900">Seu carrinho</h1>
      <p className="mt-1 text-sm text-slate-500">Revise os itens antes do checkout simulado.</p>
      <CartView />
    </div>
  );
}
