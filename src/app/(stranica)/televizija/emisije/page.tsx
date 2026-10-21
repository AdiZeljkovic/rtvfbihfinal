import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { ClapperIcon, KiteIcon, MicIcon, NoteIcon, TvIcon } from "@/components/StatIcons";
import { emisije, opisEmisije, type EmisijaCms } from "@/server/sadrzaj";

export const metadata: Metadata = {
  title: "Emisije i serije",
  description:
    "Emisije i serije Federalne televizije, aktuelna sezona i arhiva emisija – opisi, termini i najave.",
};

const GRUPE: { naziv: EmisijaCms["grupa"]; id: string; opis: string }[] = [
  { naziv: "Aktuelna sezona", id: "aktuelna-sezona", opis: "Nove emisije i najave iz aktuelne programske sheme Federalne televizije." },
  { naziv: "Emisije Federalne televizije", id: "emisije", opis: "Informativne, političke, sportske, obrazovne i zabavne emisije iz produkcije FTV-a." },
  { naziv: "Strani program", id: "strani-program", opis: "Igrane serije iz strane i regionalne produkcije na programu Federalne televizije." },
  { naziv: "Arhiva emisija", id: "arhiva", opis: "Emisije i serijali koji su bili na programu Federalne televizije." },
];

/** Ikona prema vrsti programa (iste kao programske cjeline na stranici Televizija) */
const IKONE: Partial<Record<string, typeof TvIcon>> = {
  Informativni: MicIcon,
  Kultura: NoteIcon,
  Muzika: NoteIcon,
  Dokumentarni: ClapperIcon,
  "Djeca i mladi": KiteIcon,
};

/** Tamna kartica u stilu kartica servisa na naslovnici (umjesto slike emisije) */
function Kartica({ e }: { e: EmisijaCms }) {
  const Ikona = IKONE[e.vrsta] ?? TvIcon;
  return (
    <Link
      href={`/televizija/emisije/${e.slug}`}
      className="group relative flex min-h-[15rem] flex-col overflow-hidden rounded-3xl bg-navy p-6 shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] sm:p-7"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url(/brand/kartice-bg.webp)] bg-cover bg-right transition-transform duration-700 group-hover:scale-105"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/60 to-navy/10" />
      <div className="relative flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <Ikona className="h-10 w-10 text-sky transition-colors duration-300 group-hover:text-white" />
          {e.serija && (
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-white backdrop-blur">
              Serija
            </span>
          )}
        </div>
        <h3 className="mt-5 font-display text-lg font-semibold uppercase leading-snug tracking-wide text-white">{e.naziv}</h3>
        {e.termin && <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-sky">{e.termin}</p>}
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-white/80">{opisEmisije(e, 150)}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-transform group-hover:translate-x-1">
          Opširnije <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export default function EmisijePage() {
  const sve = emisije();
  const grupe = GRUPE.map((g) => ({ ...g, stavke: sve.filter((e) => e.grupa === g.naziv) })).filter((g) => g.stavke.length);

  return (
    <>
      <PageHero
        eyebrow="Televizija"
        title="Emisije i"
        highlight="serije"
        lead="Emisije iz produkcije Federalne televizije, najave aktuelne sezone i arhiva emisija."
        crumbs={[{ label: "Televizija", href: "/televizija" }, { label: "Emisije i serije" }]}
        stats={grupe.map((g) => ({ value: g.stavke.length, label: g.naziv.toLowerCase() }))}
      />

      <div className="sticky top-[4.5rem] z-30 border-b border-line bg-white/90 backdrop-blur">
        <nav aria-label="Grupe emisija" className="container-x flex gap-1 overflow-x-auto py-2.5">
          {grupe.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-sky-mist hover:text-brand-strong"
            >
              {g.naziv}
            </a>
          ))}
        </nav>
      </div>

      {grupe.map((g, i) => (
        <Section key={g.id} id={g.id} tone={i % 2 ? "mist" : "white"} eyebrow={g.naziv} title={g.naziv} lead={g.opis} className="scroll-mt-28">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {g.stavke.map((e) => (
              <Kartica key={e.slug} e={e} />
            ))}
          </div>
        </Section>
      ))}
    </>
  );
}
