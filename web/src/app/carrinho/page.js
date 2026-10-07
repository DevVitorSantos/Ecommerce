import CartView from "@/components/CartView";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-black">seu carrinho</h1>
      <CartView />
    </div>
  );
}
