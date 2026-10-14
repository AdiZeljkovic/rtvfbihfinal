import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import DocList from "@/components/DocList";
import { IconCard } from "@/components/Tiles";
import { mnozina } from "@/lib/plural";
import { DocsIcon, ReceiptIcon, TenderIcon } from "@/components/StatIcons";
import { dokumenti, rutaArhivirana } from "@/server/sadrzaj";

export const metadata: Metadata = {
  title: "Opći akti i izvještaji",
  description:
    "Zakoni, statut, uređivačka načela, pravilnici, programski planovi, izvještaji o radu i poslovanju te revizorski izvještaji RTVFBiH.",
};

export default function DokumentiPage() {
  /* sadržaj iz CMS-a (Dokumenti → kategorija) */
  const opciAkti = [
    { naslov: "Zakoni i statut", stavke: dokumenti("Zakoni i statut") },
    { naslov: "Uređivačka načela / principi Javnog RTV sistema u BiH", stavke: dokumenti("Uređivačka načela") },
    { naslov: "Pravilnici", stavke: dokumenti("Pravilnici") },
  ].filter((g) => g.stavke.length);
  const programskiPlanovi = dokumenti("Programski planovi");
  const izvjestajiORadu = dokumenti("Izvještaji o radu");
  const revizorskiIzvjestaji = dokumenti("Revizorski izvještaji");
  const brojAkata = opciAkti.reduce((n, g) => n + g.stavke.length, 0);
  const sekcije = [
    { id: "opci-akti", label: "Opći akti", broj: brojAkata },
    { id: "programski-planovi", label: "Programski planovi", broj: programskiPlanovi.length },
    { id: "izvjestaji", label: "Izvještaji o radu", broj: izvjestajiORadu.length },
    { id: "revizije", label: "Revizorski izvještaji", broj: revizorskiIzvjestaji.length },
  ];
  const ukupno = sekcije.reduce((n, s) => n + s.broj, 0);
  const taksa = !rutaArhivirana("/rtv-taksa");

  return (
    <>
      <PageHero
        eyebrow="Dokumenti"
        title="Opći akti i"
        highlight="izvještaji"
        lead="Pravni okvir javnog servisa, interni pravilnici te godišnji izvještaji o radu, poslovanju i nezavisnoj reviziji."
        crumbs={[{ label: "Dokumenti" }]}
        stats={[
          { value: ukupno, label: "objavljenih dokumenata" },
          { value: brojAkata, label: "zakona, akata i pravilnika" },
          { value: izvjestajiORadu.length, label: "izvještaja o radu" },
          { value: revizorskiIzvjestaji.length, label: "revizorskih izvještaja" },
        ]}
      />

      {/* sticky navigacija kroz sekcije */}
      <div className="sticky top-[4.5rem] z-30 border-b border-line bg-white/90 backdrop-blur">
        <nav aria-label="Sekcije" className="container-x flex gap-1 overflow-x-auto py-2.5">
          {sekcije.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-sky-mist hover:text-brand-strong"
            >
              {s.label}
              <span className="rounded-full bg-sky-soft px-2 py-0.5 text-[0.7rem] tabular-nums text-brand-deep">{s.broj}</span>
            </a>
          ))}
        </nav>
      </div>

      <Section id="opci-akti" eyebrow="Pravni okvir" title="Opći akti" className="scroll-mt-28">
        <div className="grid gap-10">
          {opciAkti.map((g) => (
            <div key={g.naslov} className="grid gap-4 lg:grid-cols-[16rem_1fr] lg:gap-10">
              <div>
                <h3 className="font-display text-lg font-semibold text-navy">{g.naslov}</h3>
                <p className="mt-1 text-sm text-muted">
                  {g.stavke.length} {mnozina(g.stavke.length, "dokument", "dokumenta", "dokumenata")}
                </p>
              </div>
              <DocList items={g.stavke} />
            </div>
          ))}
        </div>
      </Section>

      <Section id="programski-planovi" tone="mist" eyebrow="Planiranje" title="Programski planovi" className="scroll-mt-28">
        <DocList items={programskiPlanovi} />
      </Section>

      <Section id="izvjestaji" eyebrow="Poslovanje" title="Izvještaji o radu i poslovanju RTVFBiH" className="scroll-mt-28">
        <DocList items={izvjestajiORadu} />
      </Section>

      <Section id="revizije" tone="mist" eyebrow="Nezavisna revizija" title="Revizorski izvještaji" className="scroll-mt-28">
        <DocList items={revizorskiIzvjestaji} />
      </Section>

      <Section eyebrow="Također" title="Ostale objave">
        <div className={`grid gap-5 ${taksa ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          <IconCard
            icon={TenderIcon}
            title="Javne nabavke"
            text="Planovi nabavki, obavještenja, odluke o izboru i izvještaji o postupcima."
            href="/javne-nabavke"
            cta="Otvori"
          />
          <IconCard
            icon={DocsIcon}
            title="Obavijesti i konkursi"
            text="Javni konkursi i natječaji te ostale obavijesti javnog servisa."
            href="/obavijesti"
            cta="Otvori"
          />
          {taksa && (
            <IconCard
              icon={ReceiptIcon}
              title="RTV taksa"
              text="Odgovori na najčešća pitanja građana o plaćanju RTV takse."
              href="/rtv-taksa"
              cta="Otvori"
            />
          )}
        </div>
      </Section>
    </>
  );
}
