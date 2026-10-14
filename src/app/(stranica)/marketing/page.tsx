import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import DocList from "@/components/DocList";
import ContactCard from "@/components/ContactCard";
import { DarkTile, PillButton, UnderlineLink } from "@/components/Tiles";
import { RadioSetIcon, TeletextIcon, TvIcon, WebIcon } from "@/components/StatIcons";
import { cjenovnik as nadjiCjenovnik, dokumenti, marketingOdjeli } from "@/server/sadrzaj";

export const metadata: Metadata = {
  title: "Marketing i oglašavanje",
  description:
    "Cjenovnici usluga oglašavanja i sponzorstva na Federalnoj televiziji, Radiju Federacije BiH, portalu i Teletekstu te kontakti Odjela prodaje.",
};

const cjenovnik = (dio: string) =>
  nadjiCjenovnik(dio, "#cjenovnici");

const kanali = [
  { icon: TvIcon, naziv: "Federalna televizija", opis: "TV oglašavanje, sponzorstva i posebni programski paketi na vodećem televizijskom mediju u BiH.", href: cjenovnik("CPP cjenovnik") },
  { icon: RadioSetIcon, naziv: "Radio Federacije BiH", opis: "Radijski spotovi i sponzorstva emisija na 15 FM frekvencija širom Federacije.", href: cjenovnik("Radio Federacije BiH 2026") },
  { icon: WebIcon, naziv: "Web portal", opis: "Banner oglašavanje i sponzorisani sadržaj na portalu javnog servisa.", href: cjenovnik("web portal") },
  { icon: TeletextIcon, naziv: "Teletekst", opis: "Oglasne stranice i rubrike na jednom od najstarijih teletekst servisa u regiji.", href: cjenovnik("Teletekstu") },
];

export default function MarketingPage() {
  const { rukovodstvo, odjeli, ukupno } = marketingOdjeli();
  const cjenovnici = dokumenti("Cjenovnici");
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
          { value: ukupno, label: "osoba u prodaji" },
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
          <div className="space-y-5">
            {rukovodstvo.map((p) => (
              <ContactCard key={p._id} dark ime={p.ime} uloga={p.uloga} tel={p.telefon} fax={p.fax} email={p.email} />
            ))}
          </div>
          <div>
            {odjeli.map((o, i) => (
              <div key={o.naziv}>
                <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted ${i ? "mt-8" : ""}`}>{o.naziv}</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  {o.osobe.map((p) => (
                    <ContactCard key={p._id} ime={p.ime} uloga={p.uloga} tel={p.telefon} fax={p.fax} email={p.email} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
