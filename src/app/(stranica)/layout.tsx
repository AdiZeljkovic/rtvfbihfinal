import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mainNav } from "@/content/site";
import { bezArhiviranih, kontaktZaglavlja } from "@/server/sadrzaj";

/**
 * Cloudflare Web Analytics — broj posjetilaca i pregleda bez kolačića i bez
 * ličnih podataka. Domena NIJE na Cloudflareu (samo skripta); Cloudflare
 * prima podatke samo sa rtvfbih.ba, pa se preview adresa ne broji.
 * Token je javan (vidi se u izvoru stranice). Samo javni dio, ne admin.
 */
const CF_ANALITIKA_TOKEN = "7c7b334e01ee4232a7be9f1facf00cd8";

/**
 * Stranice su statične i osvježavaju se odmah nakon izmjene u adminu.
 * Dodatno se obnavljaju svakih 10 minuta, da tekst koji zavisi od datuma
 * (istekli rokovi konkursa, godina u podnožju) ne ostane zastario, a izmjena
 * koja se iz bilo kojeg razloga ne bi odmah vidjela pojavi se najkasnije tada.
 */
export const revalidate = 600;

/** Javni dio stranice: zaglavlje, sadržaj i podnožje (admin ima svoj izgled) */
export default function StranicaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header nav={bezArhiviranih(mainNav)} kontakt={kontaktZaglavlja()} />
      <main id="sadrzaj" className="flex-1">
        {children}
      </main>
      <Footer />
      <Script
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon={JSON.stringify({ token: CF_ANALITIKA_TOKEN })}
        strategy="afterInteractive"
      />
    </>
  );
}
