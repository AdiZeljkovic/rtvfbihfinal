import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { TvIcon } from "@/components/StatIcons";
import { emisije, opisEmisije, type EmisijaCms } from "@/server/sadrzaj";

export const metadata: Metadata = {
  title: "Emisije i serije",
  description:
    "Emisije Federalne televizije, aktuelna sezona, strani program i arhiva emisija – opisi, termini i najave.",
};

const GRUPE: { naziv: EmisijaCms["grupa"]; id: string; opis: string }[] = [
  { naziv: "Aktuelna sezona", id: "aktuelna-sezona", opis: "Nove emisije i najave iz aktuelne programske sheme Federalne televizije." },
  { naziv: "Emisije Federalne televizije", id: "emisije", opis: "Informativne, političke, sportske, obrazovne i zabavne emisije iz produkcije FTV-a." },
  { naziv: "Strani program", id: "strani-program", opis: "Igrane serije iz strane i regionalne produkcije na programu Federalne televizije." },
  { naziv: "Arhiva emisija", id: "arhiva", opis: "Emisije i serijali koji su bili na programu Federalne televizije." },
];

function Kartica({ e }: { e: EmisijaCms }) {
  const slika = e.slika || e.logo;
  return (
    <Link
      href={`/televizija/emisije/${e.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-navy">
        {slika ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slika}
            alt=""
            loading="lazy"
            className={`h-full w-full transition-transform duration-700 group-hover:scale-105 ${
              e.slika ? "object-cover" : "object-contain p-8"
            }`}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[url(/brand/kartice-bg.jpg)] bg-cover bg-right">
            <TvIcon className="h-12 w-12 text-sky" />
          </div>
        )}
        {e.serija && (
          <span className="absolute left-3 top-3 rounded-full bg-navy/80 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-white backdrop-blur">
            Serija
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-navy group-hover:text-brand-deep">{e.naziv}</h3>
        {e.termin && <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand">{e.termin}</p>}
        <p className="mt-1.5 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{opisEmisije(e, 150)}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
          Opširnije <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
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
        lead="Emisije iz produkcije Federalne televizije, najave aktuelne sezone, strani program i arhiva emisija."
        crumbs={[{ label: "Televizija", href: "/televizija" }, { label: "Emisije i serije" }]}
        stats={grupe.map((g) => ({ value: g.stavke.length, label: g.naziv.toLowerCase() }))}
      />

      <div className="sticky top-[4.5rem] z-30 border-b border-line bg-white/90 backdrop-blur">
        <nav aria-label="Grupe emisija" className="container-x flex gap-1 overflow-x-auto py-2.5">
          {grupe.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-sky-mist hover:text-brand"
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
