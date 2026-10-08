import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import DocList from "@/components/DocList";
import ContactCard from "@/components/ContactCard";
import { IconCard } from "@/components/Tiles";
import { BoardIcon, DocsIcon, TenderIcon } from "@/components/StatIcons";
import { obavijesti, pasusi } from "@/server/sadrzaj";
import { docUrl } from "@/lib/doc";
import { datumBs, prosao } from "@/lib/datum";

export const metadata: Metadata = {
  title: "Obavijesti i konkursi",
  description: "Javni konkursi, natječaji i obavijesti Radio-televizije Federacije BiH.",
};

export default function ObavijestiPage() {
  const objave = obavijesti();
  return (
    <>
      <PageHero
        eyebrow="Dokumenti"
        title="Obavijesti i"
        highlight="konkursi"
        lead="Javni konkursi i natječaji za prijem u radni odnos i izbor rukovodilaca, te ostale obavijesti javnog servisa."
        crumbs={[{ label: "Dokumenti", href: "/dokumenti" }, { label: "Obavijesti i konkursi" }]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="eyebrow">Aktuelno</p>
            <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">Javni konkursi i obavijesti</h2>
            <div className="mt-6">
              {objave.length > 0 ? (
                <ul className="space-y-5">
                  {objave.map((o) => {
                    const zavrseno = prosao(o.rok);
                    return (
                      <li key={o._id} className="rounded-3xl border border-line bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.14em]">
                          {o.datum && <time dateTime={o.datum} className="text-brand">{datumBs(o.datum)}</time>}
                          {o.rok && (
                            <span
                              className={`rounded-full px-3 py-1 tracking-wider ${
                                zavrseno ? "bg-sky-mist text-muted" : "bg-navy text-white"
                              }`}
                            >
                              {zavrseno ? "Rok istekao" : `Prijave do ${datumBs(o.rok)}`}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-3 font-display text-xl font-semibold text-navy">{o.naslov}</h3>
                        {pasusi(o.tekst).map((p, i) => (
                          <p key={i} className="mt-3 leading-relaxed text-ink">
                            {p}
                          </p>
                        ))}
                        {o.dokumenti.length > 0 && (
                          <div className="mt-5">
                            <DocList
                              items={o.dokumenti.map((d) => ({
                                label: d.naziv,
                                href: d.dokument ? docUrl(d.dokument) : d.adresa || "#",
                              }))}
                            />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="rounded-3xl border border-dashed border-line p-12 text-center">
                  <DocsIcon className="mx-auto h-12 w-12 text-sky" />
                  <p className="mt-4 font-display text-lg font-semibold text-navy">Trenutno nema aktivnih konkursa</p>
                  <p className="mt-1 text-sm text-muted">Nove objave pojavit će se na ovoj stranici.</p>
                </div>
              )}
            </div>
          </div>
          <aside className="space-y-4">
            <ContactCard
              dark
              ime="Marinko Jozić"
              uloga="Rukovodilac Odjela za ljudske resurse"
              email="ljudski.potencijali@rtvfbih.ba"
            />
            <p className="px-2 text-sm leading-relaxed text-muted">
              Za pitanja o konkursima, prijavama i potrebnoj dokumentaciji obratite se Odjelu za ljudske resurse.
            </p>
          </aside>
        </div>
      </Section>

      <Section tone="mist" eyebrow="Također" title="Ostale objave javnog servisa">
        <div className="grid gap-5 md:grid-cols-3">
          <IconCard icon={TenderIcon} title="Javne nabavke" text="Planovi, obavještenja i odluke o izboru." href="/javne-nabavke" cta="Otvori" />
          <IconCard icon={BoardIcon} title="Upravni odbor" text="Sastav, poslovnik o radu i saopštenja." href="/o-nama/upravni-odbor" cta="Otvori" />
          <IconCard icon={DocsIcon} title="Opći akti i izvještaji" text="Zakoni, pravilnici, izvještaji i revizije." href="/dokumenti" cta="Otvori" />
        </div>
      </Section>
    </>
  );
}
