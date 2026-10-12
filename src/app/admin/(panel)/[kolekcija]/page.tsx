import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { kolekcija } from "@/cms/kolekcije";
import Naslov from "@/components/admin/Naslov";
import ListaZapisa from "@/components/admin/ListaZapisa";
import Obrazac from "@/components/admin/Obrazac";
import { lista } from "@/server/db";
import { opcijeFiltera, redoviKolekcije } from "@/server/admin";
import { tekucaGodina } from "@/lib/datum";
import { obaveznaPrijava } from "@/server/auth";

export async function generateMetadata({ params }: PageProps<"/admin/[kolekcija]">): Promise<Metadata> {
  const def = kolekcija((await params).kolekcija);
  return { title: def?.naziv };
}

export default async function KolekcijaPage({ params }: PageProps<"/admin/[kolekcija]">) {
  await obaveznaPrijava();
  const def = kolekcija((await params).kolekcija);
  if (!def) notFound();
  const nazad = { href: "/admin", tekst: "Početna" };

  // podešavanja: odmah obrazac, bez liste
  if (def.jedinstven) {
    const z = lista(def.kljuc)[0];
    return (
      <>
        <Naslov naslov={def.naziv} opis={def.opis} nazad={nazad} />
        <Obrazac kljuc={def.kljuc} id={z?.id ?? null} pocetno={z?.podaci ?? {}} naStranici={def.naStranici(z?.podaci ?? {})} nazad="/admin" />
      </>
    );
  }

  const redovi = redoviKolekcije(def);
  const filterPolje = def.polja.find((f) => f.ime === def.filter);
  const opcije = opcijeFiltera(def, redovi);
  // javne nabavke se otvaraju na tekućoj godini (ima ih preko hiljadu)
  const tekuca = String(tekucaGodina());
  const pocetniFilter = def.filter === "godina" ? (opcije.includes(tekuca) ? tekuca : (opcije[0] ?? "")) : "";

  return (
    <>
      <Naslov naslov={def.naziv} opis={def.opis} nazad={nazad}>
        {def.dodavanje && (
          <Link
            href={`/admin/${def.kljuc}/novo`}
            className="inline-flex min-h-16 items-center gap-3 rounded-2xl bg-brand-strong px-7 font-display text-xl font-bold text-white shadow-[0_10px_30px_-12px_rgba(43,141,222,0.8)] hover:bg-brand-deep"
          >
            <Plus className="h-6 w-6" aria-hidden="true" /> Dodaj {def.jednina}
          </Link>
        )}
      </Naslov>
      <ListaZapisa
        kljuc={def.kljuc}
        redovi={redovi}
        jednina={def.jednina}
        filterNaziv={filterPolje?.naziv}
        filterOpcije={opcije}
        pocetniFilter={pocetniFilter}
      />
    </>
  );
}
