import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, Tv } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { emisije, produkcija } from "@/content/program";
import { dvbt2Regije } from "@/content/frekvencije";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Federalna televizija",
  description:
    "Federalna televizija (FTV): programske cjeline, emisije i termini, digitalni prijem DVB-T2 u Multipleksu A.",
};

const vrste = Array.from(new Set(emisije.map((e) => e.vrsta)));

export default function TelevizijaPage() {
  return (
    <>
      <PageHero
        eyebrow="Televizija"
        title="Federalna televizija"
        lead="Prvi Dnevnik emitovan je 27. oktobra 2001. godine. Od tada Federalna televizija donosi informativni, dokumentarni, zabavni, sportski i program za djecu i mlade – gledaocima u cijeloj Bosni i Hercegovini."
        crumbs={[{ label: "Televizija" }]}
      />

      <Section eyebrow="Produkcija RTVFBiH" title="Programske cjeline">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {produkcija.map((p) => (
            <div key={p.naziv} className="card p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-soft text-brand">
                <Tv className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display font-semibold text-navy">{p.naziv}</h3>
              <p className="mt-2 text-sm text-muted">{p.opis}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="emisije"
        tone="mist"
        eyebrow="Programska shema"
        title="Emisije i termini"
        lead="Aktuelne emisije Federalne televizije. Dnevni TV program dostupan je na Teletextu i portalu federalna.ba."
      >
        <div className="mb-6 flex flex-wrap gap-2">
          {vrste.map((v) => (
            <span key={v} className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-navy">
              {v}
            </span>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {emisije.map((e) => (
            <article key={e.naziv} className="card flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-sky-soft px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-brand-deep">
                  {e.vrsta}
                </span>
                <span className="text-right text-xs font-medium text-muted">{e.termin}</span>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-navy">{e.naziv}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{e.opis}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={site.external.teletext} target="_blank" rel="noopener" className="btn btn-primary">
            TV program na Teletextu <ExternalLink className="h-4 w-4" />
          </a>
          <a href={site.external.federalna} target="_blank" rel="noopener" className="btn btn-ghost">
            federalna.ba <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </Section>

      <Section
        eyebrow="Prijem signala"
        title="Digitalna zemaljska televizija DVB-T2"
        lead="Federalna televizija emitira se u Multipleksu A u HD rezoluciji. Bosna i Hercegovina podijeljena je na devet digitalnih regija – usmjerite antenu prema najbližoj emisionoj lokaciji i pokrenite pretragu kanala."
      >
        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-sky-mist text-left text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Digitalna regija</th>
                <th className="px-4 py-3">Kanal</th>
                <th className="hidden px-4 py-3 md:table-cell">Područje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-white">
              {dvbt2Regije.map((r) => (
                <tr key={r.naziv}>
                  <td className="px-4 py-3 font-semibold text-navy">{r.naziv}</td>
                  <td className="px-4 py-3 font-display font-bold text-brand">{r.kanal}</td>
                  <td className="hidden px-4 py-3 text-muted md:table-cell">{r.podrucje}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link href="/frekvencije" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-brand hover:underline">
          Sve frekvencije i upute za prijem <ArrowRight className="h-4 w-4" />
        </Link>
      </Section>
    </>
  );
}
