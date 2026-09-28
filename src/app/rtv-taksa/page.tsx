import type { Metadata } from "next";
import { Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { rtvTaksaFaq, rtvTaksaUvod } from "@/content/rtv-taksa";

export const metadata: Metadata = {
  title: "RTV taksa – pitanja i odgovori",
  description: "Najčešća pitanja građana o plaćanju RTV takse i odgovori Odjela RTV takse Radio-televizije Federacije BiH.",
};

export default function RtvTaksaPage() {
  return (
    <>
      <PageHero
        eyebrow="Za građane"
        title="RTV taksa – pitanja i odgovori"
        lead="RTV taksa je zakonska obaveza svakog domaćinstva koje posjeduje radijski ili televizijski prijemnik i osnovni izvor finansiranja nezavisnog javnog servisa."
        crumbs={[{ label: "RTV taksa" }]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
          <div>
            <blockquote className="rounded-2xl border-l-4 border-brand bg-sky-mist p-6">
              <p className="text-sm font-semibold text-navy">{rtvTaksaUvod.zakon}</p>
              <p className="mt-2 italic leading-relaxed text-ink">„{rtvTaksaUvod.citat}“</p>
            </blockquote>

            <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-white">
              {rtvTaksaFaq.map((f, i) => (
                <details key={i} className="group px-5 py-4 open:bg-sky-mist/40 sm:px-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display font-semibold text-navy marker:content-none">
                    <span>{f.pitanje}</span>
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-soft text-brand transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="prose-ftv mt-2 text-sm">
                    {f.odgovor.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <p className="eyebrow">{rtvTaksaUvod.kontakt.odjel}</p>
              <p className="mt-2 text-sm text-muted">Za sve nejasnoće u vezi s evidencijom i plaćanjem RTV takse nazovite:</p>
              <ul className="mt-3 space-y-2 text-sm">
                {rtvTaksaUvod.kontakt.tel.map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {t}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted">
                Rukovodilac Odjela RTV takse: Denis Hajdarević,{" "}
                <a href="mailto:denis.hajdarevic@rtvfbih.ba" className="text-brand hover:underline">
                  denis.hajdarevic@rtvfbih.ba
                </a>
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
