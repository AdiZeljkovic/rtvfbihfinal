import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Headphones, Mail, Phone, Radio } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { radioFM } from "@/content/frekvencije";
import { historijat } from "@/content/historijat";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Radio Federacije BiH",
  description:
    "Radio Federacije Bosne i Hercegovine: program uživo, FM frekvencije i područja pokrivanja, redakcije i kontakti.",
};

const redakcije = [
  { naziv: "Redakcija informativnog programa", email: "radiof2@rtvfbih.ba" },
  { naziv: "Redakcija zabavno-edukativnog programa", tel: "+387 (0)33 455 135", email: "ljiljana.simic@rtvfbih.ba" },
  { naziv: "Redakcija dokumentarno-dramskog programa", tel: "+387 (0)33 455 152", email: "selmadc@rtvfbih.ba" },
  { naziv: "Redakcija muzičkog programa", tel: "+387 (0)33 453 230", email: "muzicka.rf@rtvfbih.ba" },
];

export default function RadioPage() {
  return (
    <>
      <PageHero
        eyebrow="Radio"
        title="Radio Federacije Bosne i Hercegovine"
        lead="Od 7. maja 2001. godine u eteru. Brza i tačna informacija, priče o ljudima, kultura i muzika – 24 sata dnevno na 15 FM frekvencija i uživo na internetu."
        crumbs={[{ label: "Radio" }]}
      />

      {/* Uživo */}
      <section className="bg-navy text-white">
        <div className="container-x flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand">
              <Radio className="h-7 w-7" />
              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-red-500" />
              </span>
            </span>
            <div>
              <p className="font-display text-xl font-bold">Slušajte program uživo</p>
              <p className="text-sm text-white/70">Internet stream Radija Federacije BiH</p>
            </div>
          </div>
          <a href={site.external.radioLive} target="_blank" rel="noopener" className="btn btn-light">
            <Headphones className="h-4 w-4" /> Pokreni stream
          </a>
        </div>
      </section>

      <Section eyebrow="O radiju" title="Medij kojem se može vjerovati">
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
          <div className="prose-ftv max-w-3xl">
            {historijat.radio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <aside>
            <p className="eyebrow mb-3">Redakcije</p>
            <ul className="space-y-3">
              <li className="card p-4">
                <p className="font-semibold text-navy">Odjel za radijski program</p>
                <p className="text-xs text-muted">Jara Orozović, odgovorna urednica</p>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm"><Phone className="h-3.5 w-3.5 text-brand" /> +387 (0)33 455 102</p>
                <a href="mailto:jara.orozovic@rtvfbih.ba" className="flex items-center gap-1.5 text-sm text-brand hover:underline"><Mail className="h-3.5 w-3.5" /> jara.orozovic@rtvfbih.ba</a>
              </li>
              {redakcije.map((r) => (
                <li key={r.naziv} className="card p-4">
                  <p className="font-semibold text-navy">{r.naziv}</p>
                  {r.tel && <p className="mt-1.5 flex items-center gap-1.5 text-sm"><Phone className="h-3.5 w-3.5 text-brand" /> {r.tel}</p>}
                  {r.email && (
                    <a href={`mailto:${r.email}`} className="flex items-center gap-1.5 text-sm text-brand hover:underline">
                      <Mail className="h-3.5 w-3.5" /> {r.email}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>

      <Section
        id="frekvencije"
        tone="mist"
        eyebrow="FM frekvencije"
        title="Gdje nas možete slušati"
        lead="Emisioni objekti s kojih se emitira FM program Radija Federacije BiH i područja koja pokrivaju."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {radioFM.map((f) => (
            <div key={f.lokacija} className="card p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display font-semibold text-navy">{f.lokacija}</h3>
                <span className="font-display text-xl font-bold text-brand">
                  {f.mhz} <span className="text-xs font-semibold text-muted">MHz</span>
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.pokriva}</p>
            </div>
          ))}
        </div>
        <Link href="/frekvencije" className="mt-8 inline-flex items-center gap-1.5 font-semibold text-brand hover:underline">
          Sve frekvencije televizije i radija <ArrowRight className="h-4 w-4" />
        </Link>
      </Section>
    </>
  );
}
