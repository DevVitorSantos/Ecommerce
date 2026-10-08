import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/catalog";
import CartButton from "@/components/CartButton";
import SearchBar from "@/components/SearchBar";
import CookieConsent from "@/components/CookieConsent";
import CookieReset from "@/components/CookieReset";
import { SITE_URL, SITE_NAME, KEYWORDS } from "@/lib/seo";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-5RLXF4BF";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Simulador de compras — compre tudo, gaste nada",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Simulador de compras online para fazer compras de mentirinha: monte o carrinho, faça o checkout e receba uma entrega simulada sem gastar dinheiro.",
  keywords: KEYWORDS,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "pt_BR",
    title: "Simulador de compras — compre tudo, gaste nada",
    description:
      "Compras de mentirinha com carrinho, checkout e entrega simulada. Compre tudo e não gaste nada.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simulador de compras — compre tudo, gaste nada",
    description: "Compras de mentirinha com carrinho e checkout simulados: compre tudo, gaste nada.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }) {
  const categories = await getCategories();
  const products = await getProducts();
  const counts = {};
  products.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });

  return (
    <html lang="pt-BR" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-jakarta)" }}>
        {/* Consent Mode: default negado (LGPD) — o aceite via banner faz 'consent update' */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});`}
        </Script>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>

        {/* barra utilitária */}
        <div className="nx-topbar text-center text-xs font-medium">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2">
            <span>🚚 Entrega simulada acima de R$ 150</span>
            <span className="hidden sm:inline">🎟️ Cupom DOPAMINA10 = 10% OFF de mentira</span>
            <span className="hidden md:inline">⚡ Envio em até 5 segundos</span>
          </div>
        </div>

        {/* header principal */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-slate-900">
              dopamina<span className="text-indigo-600">.</span>
            </Link>
            <div className="hidden flex-1 md:block">
              <SearchBar />
            </div>
            <nav className="ml-auto flex items-center gap-4 text-sm">
              <Link href="/pedidos" className="hidden text-slate-600 hover:text-indigo-600 lg:block">
                📦 Meus Pedidos
              </Link>
              <span className="hidden text-slate-600 lg:block">
                Olá, <strong>visitante</strong>
              </span>
              <CartButton />
            </nav>
          </div>
          <div className="border-t border-slate-100 md:hidden">
            <div className="mx-auto max-w-6xl px-4 py-2">
              <SearchBar />
            </div>
          </div>
          {/* navegação por departamentos */}
          <nav className="border-t border-slate-100">
            <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 text-sm">
              <Link href="/" className="whitespace-nowrap px-2 py-2.5 font-bold text-slate-900">
                ☰ Departamentos
              </Link>
              {categories.map((c) => (
                <Link
                  key={c}
                  href={`/categoria/${encodeURIComponent(c)}`}
                  className="whitespace-nowrap px-2 py-2.5 text-slate-600 hover:text-indigo-600"
                >
                  {c}
                </Link>
              ))}
              <Link href="/stats" className="whitespace-nowrap px-2 py-2.5 font-semibold text-indigo-600">
                📊 Dados
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>
        <CookieConsent />

        {/* rodapé */}
        <footer className="mt-12 border-t border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm md:grid-cols-4">
            <div>
              <div className="text-xl font-extrabold text-slate-900">
                dopamina<span className="text-indigo-600">.</span>
              </div>
              <p className="mt-2 text-slate-500">
                A loja onde você compra tudo e não gasta nada. Laboratório público de dados de e-commerce.
              </p>
            </div>
            <div>
              <div className="font-bold text-slate-900">Departamentos</div>
              <ul className="mt-2 space-y-1.5 text-slate-500">
                {categories.slice(0, 5).map((c) => (
                  <li key={c}>
                    <Link href={`/categoria/${encodeURIComponent(c)}`} className="hover:text-indigo-600">
                      {c} ({counts[c] || 0})
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-bold text-slate-900">Ajuda</div>
              <ul className="mt-2 space-y-1.5 text-slate-500">
                <li><Link href="/pedidos" className="hover:text-indigo-600">Meus pedidos</Link></li>
                <li><Link href="/stats" className="hover:text-indigo-600">Dados da loja</Link></li>
                <li><Link href="/carrinho" className="hover:text-indigo-600">Carrinho</Link></li>
                <li><CookieReset /></li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-slate-900">Aviso honesto</div>
              <p className="mt-2 text-slate-500">
                Loja 100% simulada — nenhum produto real, nenhum dinheiro real, nenhum pacote será entregue.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
            dopamina. © 2026 — feita para gerar dados, não boletos.{" "}
            <a
              href="https://wa.me/5521965076858?text=Ol%C3%A1%2C%20acabei%20de%20vir%20do%20seu%20site%3A%20http%3A%2F%2Fdopaminaloja.com.br%2F%0A"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-500 hover:text-indigo-600"
            >
              Desenvolvido por Vitor Santos
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
