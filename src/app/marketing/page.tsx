import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import DocList from "@/components/DocList";
import ContactCard from "@/components/ContactCard";
import { DarkTile, PillButton, UnderlineLink } from "@/components/Tiles";
import { RadioSetIcon, TeletextIcon, TvIcon, WebIcon } from "@/components/StatIcons";
import { marketingKontakti } from "@/content/uprava";

export const metadata: Metadata = {
  title: "Marketing i oglašavanje",
  description:
    "Cjenovnici usluga oglašavanja i sponzorstva na Federalnoj televiziji, Radiju Federacije BiH, portalu i Teletextu te kontakti Odjela prodaje.",
};

const cjenovnik = (dio: string) =>
  marketingKontakti.cjenovnici.find((c) => c.label.includes(dio))?.href ?? "#cjenovnici";

const kanali = [
  { icon: TvIcon, naziv: "Federalna televizija", opis: "TV oglašavanje, sponzorstva i posebni programski paketi na vodećem televizijskom mediju u BiH.", href: cjenovnik("CPP cjenovnik") },
  { icon: RadioSetIcon, naziv: "Radio Federacije BiH", opis: "Radijski spotovi i sponzorstva emisija na 15 FM frekvencija širom Federacije.", href: cjenovnik("Radio Federacije BiH 2026") },
  { icon: WebIcon, naziv: "Web portal", opis: "Banner oglašavanje i sponzorisani sadržaj na portalu javnog servisa.", href: cjenovnik("web portal") },
  { icon: TeletextIcon, naziv: "Teletext", opis: "Oglasne stranice i rubrike na jednom od najstarijih teletekst servisa u regiji.", href: cjenovnik("Teletekstu") },
];

export default function MarketingPage() {
  const { direktor, prodaja, plan, cjenovnici } = marketingKontakti;
  return (
    <>
      <PageHero
        eyebrow="Marketing"
        title="Oglašavanje na"
        highlight="javnom servisu"
        lead="Federalna televizija je vodeći medij u Bosni i Hercegovini s uvjerljivo najvećim udjelom marketinške potražnje. Ponudu za sva četiri kanala pripremit će Sektor marketinga RTVFBiH."
        crumbs={[{ label: "Marketing" }]}
        actions={
          <>
            <PillButton href="#cjenovnici">Cjenovnici 2026.</PillButton>
            <UnderlineLink href="#kontakti">Odjel prodaje</UnderlineLink>
          </>
        }
        stats={[
          { value: kanali.length, label: "kanala oglašavanja" },
          { value: cjenovnici.length, label: "cjenovnika i uslova" },
          { value: prodaja.length + plan.length + 1, label: "osoba u prodaji" },
          { value: "2026.", label: "važeći cjenovnici" },
        ]}
      />

      <Section eyebrow="Kanali" title="Gdje se možete oglašavati">
        <div className="grid gap-5 md:grid-cols-2">
          {kanali.map((k) => (
            <DarkTile key={k.naziv} icon={k.icon} title={k.naziv} text={k.opis} href={k.href} external cta="Cjenovnik 2026." />
          ))}
        </div>
      </Section>

      <Section tone="mist" id="cjenovnici" eyebrow="2026. godina" title="Cjenovnici i opšti uslovi" className="scroll-mt-16">
        <DocList items={cjenovnici} />
      </Section>

      <Section id="kontakti" eyebrow="Sektor marketinga" title="Kontakti" className="scroll-mt-16">
        <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
          <ContactCard dark {...direktor} />
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Odjel prodaje</p>
            <div className="grid gap-5 sm:grid-cols-2">
              {prodaja.map((p) => (
                <ContactCard key={p.email} {...p} />
              ))}
            </div>
            <p className="mb-4 mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Odjel plana i realizacije</p>
            <div className="grid gap-5 sm:grid-cols-2">
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
