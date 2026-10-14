import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mainNav } from "@/content/site";
import { bezArhiviranih } from "@/server/sadrzaj";

/**
 * Stranice su statične i osvježavaju se odmah nakon izmjene u adminu.
 * Dodatno se obnavljaju svaki sat, da tekst koji zavisi od datuma
 * (istekli rokovi konkursa, godina u podnožju) ne ostane zastario.
 */
export const revalidate = 3600;

/** Javni dio stranice: zaglavlje, sadržaj i podnožje (admin ima svoj izgled) */
export default function StranicaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header nav={bezArhiviranih(mainNav)} />
      <main id="sadrzaj" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
