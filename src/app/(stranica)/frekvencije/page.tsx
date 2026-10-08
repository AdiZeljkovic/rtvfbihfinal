import type { Metadata } from "next";
import { ChevronDown, Mail, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import DvbRegije from "@/components/DvbRegije";
import FmLista from "@/components/FmLista";
import { PillButton, UnderlineLink } from "@/components/Tiles";
import { TowerIcon, TvIcon, TunerIcon } from "@/components/StatIcons";
import {
  dvbt2Tekst,
  tvNapomena,
  tvPredajnici,
  tvRepetitori,
  type TvPredajnik,
} from "@/content/frekvencije";
import { dvbRegije, fmFrekvencije } from "@/server/sadrzaj";

export const metadata: Metadata = {
  title: "Frekvencije i prijem",
  description:
    "DVB-T2 digitalne regije, mreža predajnika i repetitora Federalne televizije te FM frekvencije Radija Federacije BiH.",
};

const koraci = [
  {
    icon: TvIcon,
    naslov: "Prijemnik DVB-T2",
    tekst: "TV prijemnik ili set-top box koji podržava DVB-T2 i dekodiranje H.264/MPEG-4.",
  },
  {
    icon: TowerIcon,
    naslov: "Usmjerena antena",
    tekst: "Prijemna antena usmjerena prema najbližoj emisionoj lokaciji, kao i kod analognog prijema.",
  },
  {
    icon: TunerIcon,
    naslov: "Pretraga kanala",
    tekst: "Pokrenite automatsku pretragu. Kanal emitovanja je isti za cijelu digitalnu regiju.",
  },
];

function TvTabela({ rows, caption }: { rows: TvPredajnik[]; caption: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white">
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="sticky top-0 bg-navy text-left text-[0.68rem] uppercase tracking-wider text-white/70">
          <tr>
            <th className="px-4 py-3 font-semibold">Mjesto</th>
            <th className="px-4 py-3 font-semibold">Lokacija</th>
            <th className="px-4 py-3 text-right font-semibold">f (MHz)</th>
            <th className="px-4 py-3 text-right font-semibold">Kanal</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line even:bg-sky-mist/60 hover:bg-sky-soft">
              <td className="px-4 py-2.5 font-medium text-navy">{r.mjesto}</td>
              <td className="px-4 py-2.5 text-muted">{r.lokacija}</td>
              <td className="px-4 py-2.5 text-right tabular-nums">{r.mhz}</td>
              <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-brand">{r.kanal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function FrekvencijePage() {
  return (
    <>
      <PageHero
        eyebrow="Prijem signala"
        title="Frekvencije i"
        highlight="prijem"
        lead="Digitalna zemaljska televizija DVB-T2/MPEG-4, FM frekvencije Radija Federacije BiH i arhiva analogne mreže predajnika Federalne televizije."
        crumbs={[{ label: "Frekvencije" }]}
        actions={
          <>
            <PillButton href="#dvb-t2">DVB-T2 regije</PillButton>
            <UnderlineLink href="#radio">FM frekvencije</UnderlineLink>
          </>
        }
        stats={[
          { value: dvbRegije().length, label: "DVB-T2 regija" },
          { value: fmFrekvencije().length, label: "FM frekvencija" },
          { value: tvPredajnici.length, label: "TV predajnika" },
          { value: tvRepetitori.length, label: "TV repetitora" },
        ]}
      />

      <Section
        id="dvb-t2"
        eyebrow="Televizija"
        title="DVB-T2 zemaljska digitalna televizija"
        lead="Multipleks A pokriva cijelu Bosnu i Hercegovinu u devet digitalnih regija. Svi programi emituju se u HD rezoluciji."
        className="scroll-mt-16"
      >
        <ol className="grid gap-4 md:grid-cols-3">
          {koraci.map((k, i) => {
            const Icon = k.icon;
            return (
              <li key={k.naslov} className="relative overflow-hidden rounded-3xl bg-navy p-7 text-white shadow-[var(--shadow-card)]">
                <span
                  aria-hidden="true"
                  className="absolute -right-2 -top-6 font-display text-[7rem] font-bold leading-none text-white/[0.06]"
                >
                  {i + 1}
                </span>
                <Icon className="relative h-10 w-10 text-sky" />
                <p className="relative mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-sky">Korak {i + 1}</p>
                <h3 className="relative mt-1 font-display text-xl font-semibold">{k.naslov}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-white/75">{k.tekst}</p>
              </li>
            );
          })}
        </ol>

        <div className="mt-10">
          <DvbRegije />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4 text-[0.98rem] leading-relaxed text-ink">
            {dvbt2Tekst.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <UnderlineLink href="/frekvencije/dvb-t2" dark={false}>
              Kompletne upute za gledaoce i prelazak na DVB-T2
            </UnderlineLink>
          </div>
          <aside className="h-fit rounded-3xl border border-line bg-sky-mist p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Tehnička podrška</p>
            <p className="mt-2 font-display text-lg font-semibold text-navy">Gledaoci Multipleksa A</p>
            <p className="mt-1 text-sm text-muted">Pitanja o prijemu digitalnog signala rješava BHRT.</p>
            <div className="mt-4 space-y-2 text-sm">
              <a href="tel:+38733464064" className="flex items-center gap-2 text-ink hover:text-brand">
                <Phone className="h-4 w-4 text-brand" /> 033 464 064
              </a>
              <a href="mailto:terminal@bhrt.ba" className="flex items-center gap-2 text-brand hover:underline">
                <Mail className="h-4 w-4" /> terminal@bhrt.ba
              </a>
            </div>
          </aside>
        </div>
      </Section>

      <Section id="radio" tone="mist" eyebrow="Radio" title="FM frekvencije Radija Federacije BiH" className="scroll-mt-16">
        <FmLista />
      </Section>

      <Section
        id="analogna-mreza"
        eyebrow="Arhiva"
        title="Analogna mreža predajnika FTV-a"
        lead="Historijski pregled analogne emisione mreže Federalne televizije na području Federacije BiH. Za aktuelni prijem koristite DVB-T2 regije."
      >
        <details className="group rounded-3xl border border-line bg-white shadow-[var(--shadow-card)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 font-display font-semibold text-navy marker:content-none sm:px-8">
            <span>
              Prikaži tabele predajnika i repetitora
              <span className="ml-2 text-sm font-normal text-muted">
                ({tvPredajnici.length} + {tvRepetitori.length})
              </span>
            </span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line transition-transform group-open:rotate-180">
              <ChevronDown className="h-4 w-4" />
            </span>
          </summary>
          <div className="grid gap-8 border-t border-line p-6 sm:p-8 lg:grid-cols-[1fr_2fr]">
            <div className="min-w-0">
              <h3 className="mb-3 font-display font-semibold text-navy">Predajnici</h3>
              <TvTabela rows={tvPredajnici} caption="Predajnici FTV" />
              <p className="mt-4 text-sm text-muted">{tvNapomena}</p>
            </div>
            <div className="min-w-0">
              <h3 className="mb-3 font-display font-semibold text-navy">Repetitori</h3>
              <div className="max-h-[36rem] overflow-y-auto rounded-2xl">
                <TvTabela rows={tvRepetitori} caption="Repetitori FTV" />
              </div>
            </div>
          </div>
        </details>
      </Section>
    </>
  );
}
