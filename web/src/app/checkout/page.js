import CheckoutFlow from "@/components/CheckoutFlow";

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900">Checkout</h1>
      <p className="mt-1 text-sm text-slate-500">4 passos, 0 cartões, 0 cobranças.</p>
      <CheckoutFlow />
    </div>
  );
}
