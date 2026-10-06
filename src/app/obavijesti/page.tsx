import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import DocList from "@/components/DocList";
import ContactCard from "@/components/ContactCard";
import { IconCard } from "@/components/Tiles";
import { BoardIcon, DocsIcon, TenderIcon } from "@/components/StatIcons";
import { upravniOdbor } from "@/content/uprava";

export const metadata: Metadata = {
  title: "Obavijesti i konkursi",
  description: "Javni konkursi, natječaji i obavijesti Radio-televizije Federacije BiH.",
};

/**
 * Napomena: na staroj stranici ova rubrika nije imala sadržaj.
 * Ovdje su prikazani aktuelni javni konkursi; nove objave dodajte u niz `objave`.
 */
const objave = upravniOdbor.dokumenti.filter((d) => d.label.toLowerCase().includes("konkurs"));

export default function ObavijestiPage() {
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
                <DocList items={objave} />
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
