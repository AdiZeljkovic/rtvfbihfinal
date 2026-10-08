import Header from "@/components/Header";
import Footer from "@/components/Footer";

/** Javni dio stranice: zaglavlje, sadržaj i podnožje (admin ima svoj izgled) */
export default function StranicaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="sadrzaj" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
