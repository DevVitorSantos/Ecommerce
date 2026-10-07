import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import { getCategories } from "@/lib/catalog";
import CartButton from "@/components/CartButton";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

export const metadata = {
  title: "dopamina. — loja simulada, dados reais",
  description:
    "Um e-commerce onde voce compra sem gastar nada. Chegada instantanea, dopamina garantida — e cada clique vira dado.",
};

export default async function RootLayout({ children }) {
  const categories = await getCategories();

  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {GA4_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});gtag('config','${GA4_ID}');`}
            </Script>
          </>
        )}
        <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur bg-[#0b0517]/80">
          <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
            <Link href="/" className="text-xl font-black tracking-tight gradient-text">
              dopamina.
            </Link>
            <nav className="hidden gap-4 text-sm text-white/70 md:flex">
              {categories.map((c) => (
                <Link key={c} href={`/categoria/${encodeURIComponent(c)}`} className="hover:text-white">
                  {c}
                </Link>
              ))}
            </nav>
            <div className="ml-auto">
              <CartButton />
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/10 px-4 py-6 text-center text-xs text-white/50">
          loja 100% simulada — nenhum produto real, nenhum dinheiro real. dopamina é um laboratório de dados.
        </footer>
      </body>
    </html>
  );
}
