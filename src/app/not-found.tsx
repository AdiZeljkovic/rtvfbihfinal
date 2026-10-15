import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Greska404 from "@/components/Greska404";
import { mainNav } from "@/content/site";
import { bezArhiviranih } from "@/server/sadrzaj";

/* Nepostojeća adresa: ne prolazi kroz layout javnih stranica, pa ovdje dolaze zaglavlje i podnožje */
export default function NotFound() {
  return (
    <>
      <Header nav={bezArhiviranih(mainNav)} />
      <main id="sadrzaj" className="flex-1">
        <Greska404 />
      </main>
      <Footer />
    </>
  );
}
