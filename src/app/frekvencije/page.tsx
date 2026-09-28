import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import {
  dvbt2Regije,
  dvbt2Tekst,
  radioFM,
  tvNapomena,
  tvPredajnici,
  tvRepetitori,
  type TvPredajnik,
} from "@/content/frekvencije";

export const metadata: Metadata = {
  title: "Frekvencije i prijem",
  description:
    "DVB-T2 digitalne regije, mreža predajnika i repetitora Federalne televizije te FM frekvencije Radija Federacije BiH.",
};

function TvTabela({ rows, caption }: { rows: TvPredajnik[]; caption: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-sky-mist text-left text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="px-4 py-3">Mjesto</th>
            <th className="px-4 py-3">Lokacija</th>
            <th className="px-4 py-3 text-right">f (MHz)</th>
            <th className="px-4 py-3 text-right">Kanal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r, i) => (
            <tr key={i}>
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
        title="Frekvencije i prijem"
        lead="Digitalna zemaljska televizija DVB-T2/MPEG-4, mreža predajnika i repetitora Federalne televizije te FM frekvencije Radija Federacije BiH."
        crumbs={[{ label: "Frekvencije" }]}
      />

      <Section
        id="dvb-t2"
        eyebrow="Televizija"
        title="DVB-T2/MPEG-4 zemaljska digitalna televizija"
      >
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="prose-ftv">
            {dvbt2Tekst.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div className="mt-6 rounded-2xl border border-line bg-sky-mist p-5 text-sm">
              <p className="font-semibold text-navy">Tehnička podrška za gledaoce Multipleksa A (BHRT)</p>
              <p className="mt-2 flex items-center gap-2"><Phone className="h-4 w-4 text-brand" /> 033 464 064</p>
              <a href="mailto:terminal@bhrt.ba" className="mt-1 flex items-center gap-2 text-brand hover:underline">
                <Mail className="h-4 w-4" /> terminal@bhrt.ba
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <table className="w-full text-sm">
              <caption className="sr-only">Digitalne regije Multipleksa A</caption>
              <thead className="bg-sky-mist text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">Digitalna regija</th>
                  <th className="px-4 py-3">Kanal</th>
                  <th className="px-4 py-3">Područje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {dvbt2Regije.map((r) => (
                  <tr key={r.naziv} className="align-top">
                    <td className="px-4 py-3 font-semibold text-navy">{r.naziv}</td>
                    <td className="px-4 py-3 font-display font-bold text-brand">{r.kanal}</td>
                    <td className="px-4 py-3 text-xs leading-relaxed text-muted">{r.podrucje}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section
        id="radio"
        tone="mist"
        eyebrow="Radio"
        title="FM frekvencije Radija Federacije BiH"
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
      </Section>

      <Section
        id="analogna-mreza"
        eyebrow="Arhiva"
        title="Mreža predajnika i repetitora FTV-a"
        lead="Historijski pregled analogne emisione mreže Federalne televizije na području Federacije BiH. Za aktuelni digitalni prijem pogledajte DVB-T2 regije."
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <div>
            <h3 className="mb-3 font-display font-semibold text-navy">Predajnici</h3>
            <TvTabela rows={tvPredajnici} caption="Predajnici FTV" />
            <p className="mt-4 text-sm text-muted">{tvNapomena}</p>
          </div>
          <div>
            <h3 className="mb-3 font-display font-semibold text-navy">Repetitori</h3>
            <div className="max-h-[36rem] overflow-y-auto rounded-2xl">
              <TvTabela rows={tvRepetitori} caption="Repetitori FTV" />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
