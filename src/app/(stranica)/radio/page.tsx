import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import FmLista from "@/components/FmLista";
import ContactCard from "@/components/ContactCard";
import DocList from "@/components/DocList";
import { UnderlineLink } from "@/components/Tiles";
import { dokumenti, fmFrekvencije } from "@/server/sadrzaj";
import { historijat } from "@/content/historijat";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Radio Federacije BiH",
  description:
    "Radio Federacije Bosne i Hercegovine: program uživo, FM frekvencije i područja pokrivanja, redakcije i kontakti.",
};

const redakcije = [
  { naziv: "Redakcija informativnog programa", email: "radiof2@rtvfbih.ba" },
  { naziv: "Redakcija zabavno-edukativnog programa", osoba: "Ljiljana Simić", tel: "+387 (0)33 455 135", email: "ljiljana.simic@rtvfbih.ba" },
  { naziv: "Redakcija dokumentarno-dramskog programa", osoba: "Selma Dizdar-Cerović", tel: "+387 (0)33 455 152", email: "selmadc@rtvfbih.ba" },
  { naziv: "Redakcija muzičkog programa", tel: "+387 (0)33 453 230", email: "muzicka.rf@rtvfbih.ba" },
];

export default function RadioPage() {
  return (
    <>
      <PageHero
        eyebrow="Radio"
        title="Radio Federacije"
        highlight="Bosne i Hercegovine"
        lead="Od 7. maja 2001. godine u eteru. Brza i tačna informacija, priče o ljudima, kultura i muzika – na FM frekvencijama širom Federacije i uživo na internetu."
        crumbs={[{ label: "Radio" }]}
        actions={
          <>
            <a
              href={site.external.radioLive}
              target="_blank"
              rel="noopener"
              className="group inline-flex items-center gap-3 rounded-full bg-white py-3 pl-5 pr-6 font-display text-[0.95rem] font-semibold text-navy shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] transition-colors hover:bg-sky-soft"
            >
              <span aria-hidden="true" className="eq flex h-4 items-end gap-[3px] [&>span]:!bg-brand">
                <span />
                <span />
                <span />
                <span />
              </span>
              Slušajte uživo
            </a>
            <UnderlineLink href="#frekvencije">FM frekvencije</UnderlineLink>
          </>
        }
        stats={[
          { value: "2001.", label: "u eteru od 7. maja, 06.00" },
          { value: fmFrekvencije().length, label: "FM frekvencija" },
          { value: redakcije.length, label: "redakcije" },
          { value: "1971.", label: "tradicija Radija 202" },
        ]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          <div>
            <p className="eyebrow">O radiju</p>
            <h2 className="mt-2 text-balance text-2xl font-bold text-navy sm:text-3xl md:text-[2.1rem]">
              Medij kojem se može vjerovati
            </h2>
            <div className="mt-5 space-y-4 text-[0.98rem] leading-relaxed text-ink">
              {historijat.radio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <ContactCard
              dark
              ime="Jara Orozović"
              uloga="Odgovorna urednica radijskog programa"
              tel="+387 (0)33 455 102"
              email="jara.orozovic@rtvfbih.ba"
            />
            <ul className="overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-card)]">
              {redakcije.map((r) => (
                <li key={r.naziv} className="border-b border-line px-6 py-4 last:border-b-0">
                  <p className="font-display font-semibold text-navy">{r.naziv}</p>
                  {r.osoba && <p className="text-sm text-muted">{r.osoba}, urednica redakcije</p>}
                  <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                    {r.tel && (
                      <span className="inline-flex items-center gap-1.5 text-ink">
                        <Phone className="h-3.5 w-3.5 text-brand" /> {r.tel}
                      </span>
                    )}
                    <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1.5 text-brand hover:underline">
                      <Mail className="h-3.5 w-3.5" /> {r.email}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            {dokumenti("Radio").length > 0 && <DocList items={dokumenti("Radio")} />}
          </aside>
        </div>
      </Section>

      <Section
        id="frekvencije"
        tone="mist"
        eyebrow="FM frekvencije"
        title="Gdje nas možete slušati"
        lead="Emisioni objekti s kojih se emitira FM program Radija Federacije BiH i područja koja pokrivaju."
        className="scroll-mt-16"
        actions={
          <UnderlineLink href="/frekvencije" dark={false}>
            Sve frekvencije
          </UnderlineLink>
        }
      >
        <FmLista />
      </Section>
    </>
  );
}
