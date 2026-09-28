import type { Metadata } from "next";
import { BellRing, Mail } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import DocList from "@/components/DocList";
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
        title="Obavijesti i konkursi"
        lead="Javni konkursi i natječaji za prijem u radni odnos i izbor rukovodilaca, te ostale obavijesti javnog servisa."
        crumbs={[{ label: "Dokumenti", href: "/dokumenti" }, { label: "Obavijesti i konkursi" }]}
      />
      <Section>
        {objave.length > 0 ? (
          <DocList items={objave} />
        ) : (
          <div className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">
            <BellRing className="mx-auto h-8 w-8 text-sky" />
            <p className="mt-3">Trenutno nema aktivnih konkursa ni obavijesti.</p>
          </div>
        )}
        <div className="mt-10 rounded-2xl bg-sky-mist p-6 sm:p-8">
          <p className="font-display font-semibold text-navy">Odjel za ljudske resurse</p>
          <p className="mt-1 text-sm text-muted">Za pitanja o konkursima i prijavama obratite se Odjelu za ljudske resurse.</p>
          <a href="mailto:ljudski.potencijali@rtvfbih.ba" className="mt-3 inline-flex items-center gap-2 font-semibold text-brand hover:underline">
            <Mail className="h-4 w-4" /> ljudski.potencijali@rtvfbih.ba
          </a>
        </div>
      </Section>
    </>
  );
}
