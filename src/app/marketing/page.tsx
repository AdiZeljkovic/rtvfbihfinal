import type { Metadata } from "next";
import { Globe, Radio, Tv, Waves } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import DocList from "@/components/DocList";
import ContactCard from "@/components/ContactCard";
import { marketingKontakti } from "@/content/uprava";

export const metadata: Metadata = {
  title: "Marketing i oglašavanje",
  description:
    "Cjenovnici usluga oglašavanja i sponzorstva na Federalnoj televiziji, Radiju Federacije BiH, portalu i Teletextu te kontakti Odjela prodaje.",
};

const kanali = [
  { icon: Tv, naziv: "Federalna televizija", opis: "TV oglašavanje, sponzorstva i posebni programski paketi." },
  { icon: Radio, naziv: "Radio Federacije BiH", opis: "Radijski spotovi i sponzorstva emisija na 15 FM frekvencija." },
  { icon: Globe, naziv: "Web portal", opis: "Banner oglašavanje i sponzorisani sadržaj na portalu." },
  { icon: Waves, naziv: "Teletext", opis: "Oglasne stranice i rubrike na Teletextu FTV-a." },
];

export default function MarketingPage() {
  const { direktor, prodaja, plan, cjenovnici } = marketingKontakti;
  return (
    <>
      <PageHero
        eyebrow="Marketing"
        title="Oglašavanje na javnom servisu"
        lead="Federalna televizija je vodeći medij u Bosni i Hercegovini s uvjerljivo najvećim udjelom marketinške potražnje. Ponudu za sva četiri kanala pripremit će Sektor marketinga RTVFBiH."
        crumbs={[{ label: "Marketing" }]}
      />

      <Section eyebrow="Kanali" title="Gdje se možete oglašavati">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {kanali.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.naziv} className="card p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-soft text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display font-semibold text-navy">{k.naziv}</h3>
                <p className="mt-2 text-sm text-muted">{k.opis}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section tone="mist" id="cjenovnici" eyebrow="2026. godina" title="Cjenovnici i opšti uslovi">
        <DocList items={cjenovnici} />
      </Section>

      <Section id="kontakti" eyebrow="Sektor marketinga" title="Kontakti">
        <div className="grid gap-5 lg:grid-cols-3">
          <ContactCard {...direktor} className="lg:col-span-3 bg-sky-mist" />
          <div className="lg:col-span-3">
            <p className="eyebrow mb-3">Odjel prodaje</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {prodaja.map((p) => (
                <ContactCard key={p.email} {...p} />
              ))}
            </div>
          </div>
          <div className="lg:col-span-3">
            <p className="eyebrow mb-3">Odjel plana i realizacije</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {plan.map((p) => (
                <ContactCard key={p.email} {...p} />
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
