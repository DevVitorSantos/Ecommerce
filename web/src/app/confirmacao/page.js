import Link from "next/link";
import Confirmation from "@/components/Confirmation";

export default function ConfirmationPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Confirmation />
      <div className="mt-6 text-center">
        <Link href="/" className="text-sm text-white/60 underline">
          continuar comprando (dopamina é isso, gente)
        </Link>
      </div>
    </div>
  );
}
