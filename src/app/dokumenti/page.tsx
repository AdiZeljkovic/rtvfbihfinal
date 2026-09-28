import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import DocList from "@/components/DocList";
import { izvjestajiORadu, opciAkti, programskiPlanovi, revizorskiIzvjestaji } from "@/content/dokumenti";

export const metadata: Metadata = {
  title: "Opći akti i izvještaji",
  description:
    "Zakoni, statut, uređivačka načela, pravilnici, programski planovi, izvještaji o radu i poslovanju te revizorski izvještaji RTVFBiH.",
};

const sekcije = [
  { id: "opci-akti", label: "Opći akti" },
  { id: "programski-planovi", label: "Programski planovi" },
  { id: "izvjestaji", label: "Izvještaji o radu" },
  { id: "revizije", label: "Revizorski izvještaji" },
];

export default function DokumentiPage() {
  return (
    <>
      <PageHero
        eyebrow="Dokumenti"
        title="Opći akti i izvještaji"
        lead="Pravni okvir javnog servisa, interni pravilnici te godišnji izvještaji o radu, poslovanju i nezavisnoj reviziji."
        crumbs={[{ label: "Dokumenti" }]}
      />

      <div className="sticky top-[4.5rem] z-30 border-b border-line bg-white/90 backdrop-blur">
        <nav aria-label="Sekcije" className="container-x flex gap-1 overflow-x-auto py-2">
          {sekcije.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold text-navy hover:bg-sky-mist hover:text-brand"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>

      <Section id="opci-akti" eyebrow="Pravni okvir" title="Opći akti">
        <div className="grid gap-8">
          {opciAkti.map((g) => (
            <div key={g.naslov}>
              <h3 className="mb-3 font-display text-lg font-semibold text-navy">{g.naslov}</h3>
              <DocList items={g.stavke} />
            </div>
          ))}
        </div>
      </Section>

      <Section id="programski-planovi" tone="mist" eyebrow="Planiranje" title="Programski planovi">
        <DocList items={programskiPlanovi} />
      </Section>

      <Section id="izvjestaji" eyebrow="Poslovanje" title="Izvještaji o radu i poslovanju RTVFBiH">
        <DocList items={izvjestajiORadu} />
      </Section>

      <Section id="revizije" tone="mist" eyebrow="Nezavisna revizija" title="Revizorski izvještaji">
        <DocList items={revizorskiIzvjestaji} />
      </Section>
    </>
  );
}
