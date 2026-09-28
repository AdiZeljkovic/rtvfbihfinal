import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { historijat, timeline } from "@/content/historijat";

export const metadata: Metadata = {
  title: "O nama – Historijat",
  description:
    "Historijat Radio-televizije Federacije Bosne i Hercegovine: transformacija RTVBiH, Radio Federacije BiH, Federalna televizija, Radio 202 i Teletekst.",
};

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="prose-ftv">
      {items.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export default function ONamaPage() {
  return (
    <>
      <PageHero
        eyebrow="O nama"
        title="Historijat javnog servisa"
        lead="Radio-televizija Federacije Bosne i Hercegovine nastala je transformacijom nekadašnje Radio-televizije Bosne i Hercegovine, a baštini tradiciju Radio-Sarajeva i Televizije Sarajevo."
        crumbs={[{ label: "O nama" }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_18rem]">
          <div className="max-w-3xl">
            <Paragraphs items={historijat.uvod} />

            <h2 className="mt-12 font-display text-2xl font-bold text-navy">Radio Federacije Bosne i Hercegovine</h2>
            <Paragraphs items={historijat.radio} />
            <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-muted">Formirano je devet redakcija</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {historijat.radioRedakcije.map((r) => (
                <li key={r} className="rounded-full border border-line bg-sky-mist px-3 py-1 text-sm text-navy">
                  {r}
                </li>
              ))}
            </ul>

            <h2 className="mt-12 font-display text-2xl font-bold text-navy">Televizija Federacije Bosne i Hercegovine</h2>
            <Paragraphs items={historijat.televizija} />

            <h2 className="mt-12 font-display text-2xl font-bold text-navy">Radio 202</h2>
            <Paragraphs items={historijat.radio202} />

            <h2 className="mt-12 font-display text-2xl font-bold text-navy">Teletekst</h2>
            <Paragraphs items={historijat.teletekst} />
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-line bg-sky-mist p-5">
              <p className="eyebrow">Vremenska linija</p>
              <ol className="mt-4 space-y-4 border-l-2 border-sky pl-4">
                {timeline.map((t, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[1.4rem] top-1.5 h-2.5 w-2.5 rounded-full bg-brand ring-4 ring-sky-mist" />
                    <p className="font-display text-sm font-bold text-brand">{t.year}</p>
                    <p className="text-sm font-semibold text-navy">{t.title}</p>
                    <p className="text-xs text-muted">{t.text}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-5 space-y-2">
              <Link href="/o-nama/upravni-odbor" className="card flex items-center justify-between p-4 text-sm font-semibold text-navy">
                Upravni odbor <ArrowRight className="h-4 w-4 text-brand" />
              </Link>
              <Link href="/o-nama/organizacija" className="card flex items-center justify-between p-4 text-sm font-semibold text-navy">
                Organizacija i uredništva <ArrowRight className="h-4 w-4 text-brand" />
              </Link>
              <Link href="/dokumenti" className="card flex items-center justify-between p-4 text-sm font-semibold text-navy">
                Opći akti i izvještaji <ArrowRight className="h-4 w-4 text-brand" />
              </Link>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
