import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import DocList from "@/components/DocList";
import { PillButton, UnderlineLink } from "@/components/Tiles";
import { mnozina } from "@/lib/plural";
import { godineNabavki, legacyNabavkeUrl, nabavke2026 } from "@/content/javne-nabavke";

export const metadata: Metadata = {
  title: "Javne nabavke",
  description:
    "Planovi javnih nabavki, obavještenja o nabavci i dodjeli ugovora, odluke o izboru i izvještaji o provedenim postupcima RTVFBiH.",
};

export default function JavneNabavkePage() {
  const tekuca = godineNabavki[0];
  const arhiva = godineNabavki.slice(1);
  const brojObjava = nabavke2026.reduce((n, g) => n + g.stavke.length, 0);

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
          { value: brojObjava, label: `objava u ${tekuca.godina}.` },
          { value: nabavke2026.length, label: "vrste objava" },
          { value: godineNabavki.length, label: "godina arhive" },
        ]}
      />

      <Section
        id="aktuelno"
        eyebrow={`Javne nabavke u ${tekuca.godina}. godini`}
        title="Aktuelni postupci"
        className="scroll-mt-16"
        actions={
          <UnderlineLink href={legacyNabavkeUrl(tekuca.legacyId)} external dark={false}>
            Sve objave za {tekuca.godina}.
          </UnderlineLink>
        }
      >
        <div className="grid gap-10">
          {nabavke2026.map((g, i) => (
            <div key={g.naslov} className="grid gap-4 lg:grid-cols-[16rem_1fr] lg:gap-10">
              <div>
                <p className="font-mono text-sm tabular-nums text-brand">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 font-display text-lg font-semibold text-navy">{g.naslov}</h3>
                <p className="mt-1 text-sm text-muted">
                  {g.stavke.length} {mnozina(g.stavke.length, "objava", "objave", "objava")}
                </p>
              </div>
              <DocList items={g.stavke} />
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="arhiva"
        tone="mist"
        eyebrow="Arhiva"
        title="Javne nabavke po godinama"
        lead="Objave iz prethodnih godina dostupne su u arhivi javnog servisa."
        className="scroll-mt-16"
      >
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {arhiva.map((g) => (
            <li key={g.godina}>
              <a
                href={legacyNabavkeUrl(g.legacyId)}
                target="_blank"
                rel="noopener"
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-[var(--shadow-card)] transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-brand/40"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Nabavke</span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-navy transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
                <span className="skala-broj mt-4 font-display text-4xl font-bold leading-none tabular-nums sm:text-5xl">
                  {g.godina}.
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
