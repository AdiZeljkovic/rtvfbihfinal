import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LogoMark } from "@/components/Logo";
import { PillButton, UnderlineLink } from "@/components/Tiles";
import { mainNav } from "@/content/site";
import { bezArhiviranih } from "@/server/sadrzaj";

export default function NotFound() {
  return (
    <>
    <Header nav={bezArhiviranih(mainNav)} />
    <main id="sadrzaj" className="flex-1">
    <section className="relative -mt-[4.5rem] flex min-h-[80svh] items-center overflow-hidden bg-navy text-white">
      <div aria-hidden="true" className="absolute inset-0 bg-[url(/brand/kartice-bg.webp)] bg-cover bg-right opacity-70" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/40 lg:bg-gradient-to-r lg:from-navy lg:via-navy/80 lg:to-navy/20"
      />
      <div className="container-x relative py-32">
        <LogoMark tone="white" className="h-14 w-14 opacity-90" />
        <p className="eyebrow mt-8 text-sky">Greška 404</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
          Signal je{" "}
          <span className="bg-gradient-to-r from-sky to-white bg-clip-text text-transparent">izgubljen</span>
        </h1>
        <p className="mt-4 max-w-lg text-lg text-white/75">
          Stranica koju tražite ne postoji ili je premještena. Vratite se na početnu stranicu ili
          potražite informaciju u navigaciji.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
          <PillButton href="/">Početna stranica</PillButton>
          <UnderlineLink href="/kontakt">Kontakt</UnderlineLink>
        </div>
      </div>
    </section>
    </main>
    <Footer />
    </>
  );
}
