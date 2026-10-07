import CheckoutFlow from "@/components/CheckoutFlow";

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-black">checkout simulado</h1>
      <p className="mt-1 text-sm text-white/50">4 passos, 0 cartões, 0 cobranças.</p>
      <CheckoutFlow />
    </div>
  );
}
