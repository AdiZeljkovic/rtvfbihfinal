import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import DocList from "@/components/DocList";
import { godineNabavki, legacyNabavkeUrl, nabavke2026 } from "@/content/javne-nabavke";

export const metadata: Metadata = {
  title: "Javne nabavke",
  description:
    "Planovi javnih nabavki, obavještenja o nabavci i dodjeli ugovora, odluke o izboru i izvještaji o provedenim postupcima RTVFBiH.",
};

export default function JavneNabavkePage() {
  const tekuca = godineNabavki[0];
  const arhiva = godineNabavki.slice(1);

  return (
    <>
      <PageHero
        eyebrow="Dokumenti"
        title="Javne nabavke"
        lead="U skladu sa Zakonom o javnim nabavkama BiH objavljujemo planove nabavki, obavještenja o nabavci i dodjeli ugovora, odluke o izboru i izvještaje o provedenim postupcima."
        crumbs={[{ label: "Dokumenti", href: "/dokumenti" }, { label: "Javne nabavke" }]}
      />

      <Section eyebrow={`Javne nabavke u ${tekuca.godina}. godini`} title="Aktuelni postupci">
        <div className="grid gap-8">
          {nabavke2026.map((g) => (
            <div key={g.naslov}>
              <h3 className="mb-3 font-display text-lg font-semibold text-navy">{g.naslov}</h3>
              <DocList items={g.stavke} />
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">
          Kompletan pregled svih objava za {tekuca.godina}. godinu, uključujući odluke o izboru i
          poništenju, dostupan je u{" "}
          <a href={legacyNabavkeUrl(tekuca.legacyId)} target="_blank" rel="noopener" className="font-semibold text-brand hover:underline">
            arhivi objava
          </a>
          .
        </p>
      </Section>

      <Section tone="mist" eyebrow="Arhiva" title="Javne nabavke po godinama">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {arhiva.map((g) => (
            <li key={g.godina}>
              <a
                href={legacyNabavkeUrl(g.legacyId)}
                target="_blank"
                rel="noopener"
                className="card flex items-center justify-between p-5"
              >
                <span className="font-display text-lg font-semibold text-navy">Javne nabavke {g.godina}.</span>
                <ExternalLink className="h-4 w-4 text-brand" />
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
