import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import NabavkeLista from "@/components/NabavkeLista";
import { PillButton, UnderlineLink } from "@/components/Tiles";
import {
  brojDokumenataGodine,
  godineNabavki,
  nabavke,
  tekucaNabavke,
  ukupnoDokumenataNabavki,
} from "@/content/javne-nabavke";
import { mnozina } from "@/lib/plural";

export const metadata: Metadata = {
  title: "Javne nabavke",
  description:
    "Planovi javnih nabavki, obavještenja o nabavci i dodjeli ugovora, odluke o izboru i izvještaji o provedenim postupcima RTVFBiH od 2015. godine.",
};

export default function JavneNabavkePage() {
  const sve = nabavke();
  const tekuca = tekucaNabavke();
  const arhiva = sve.slice(1);
  const brojTekuce = brojDokumenataGodine(tekuca);

  return (
    <>
      <PageHero
        eyebrow="Dokumenti"
        title="Javne"
        highlight="nabavke"
        lead="U skladu sa Zakonom o javnim nabavkama BiH objavljujemo planove nabavki, obavještenja o nabavci i dodjeli ugovora, odluke o izboru i izvještaje o provedenim postupcima."
        crumbs={[{ label: "Dokumenti", href: "/dokumenti" }, { label: "Javne nabavke" }]}
        actions={
          <>
            <PillButton href="#aktuelno">Nabavke u {tekuca.godina}.</PillButton>
            <UnderlineLink href="#arhiva">Arhiva po godinama</UnderlineLink>
          </>
        }
        stats={[
          { value: `${tekuca.godina}.`, label: "tekuća godina" },
          { value: brojTekuce, label: `objava u ${tekuca.godina}.` },
          { value: godineNabavki().length, label: "godina arhive" },
          { value: ukupnoDokumenataNabavki().toLocaleString("bs-BA"), label: "dokumenata ukupno" },
        ]}
      />

      <Section id="aktuelno" eyebrow={`Javne nabavke u ${tekuca.godina}. godini`} title="Aktuelni postupci" className="scroll-mt-16">
        <NabavkeLista godina={tekuca} />
      </Section>

      <Section
        id="arhiva"
        tone="mist"
        eyebrow="Arhiva"
        title="Javne nabavke po godinama"
        lead="Sve objave iz prethodnih godina, s planovima, obavještenjima, odlukama i izvještajima."
        className="scroll-mt-16"
      >
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {arhiva.map((g) => {
            const n = brojDokumenataGodine(g);
            return (
              <li key={g.godina}>
                <Link
                  href={`/javne-nabavke/${g.godina}`}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-[var(--shadow-card)] transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-brand/40"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Nabavke</span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-navy transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <span className="skala-broj mt-4 font-display text-4xl font-bold leading-none tabular-nums sm:text-5xl">
                    {g.godina}.
                  </span>
                  <span className="mt-2 text-sm text-muted">
                    {n} {mnozina(n, "dokument", "dokumenta", "dokumenata")}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}
