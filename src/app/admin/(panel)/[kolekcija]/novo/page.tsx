import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { kolekcija } from "@/cms/kolekcije";
import { POGLAVLJE_KOLEKCIJE } from "@/cms/uputstvo";
import Naslov from "@/components/admin/Naslov";
import Obrazac from "@/components/admin/Obrazac";
import { opcijeObrasca } from "@/server/admin";
import { obaveznaPrijava } from "@/server/auth";

const POMOC: Record<string, string> = {
  nabavke: "Odaberite dokument – naziv se upiše sam. Zatim označite vrstu objave i godinu, pa sačuvajte.",
  dokumenti: "Odaberite dokument – naziv se upiše sam. Zatim označite gdje ga prikazati, pa sačuvajte.",
  obavijesti: "Upišite naslov i dodajte dokument konkursa ili obavijesti, pa sačuvajte.",
};

export async function generateMetadata({ params }: PageProps<"/admin/[kolekcija]/novo">): Promise<Metadata> {
  const def = kolekcija((await params).kolekcija);
  return { title: def ? `Dodaj ${def.jednina}` : undefined };
}

export default async function NovoPage({ params, searchParams }: PageProps<"/admin/[kolekcija]/novo">) {
  await obaveznaPrijava();
  const def = kolekcija((await params).kolekcija);
  if (!def) notFound();
  if (def.jedinstven || !def.dodavanje) redirect(`/admin/${def.kljuc}`);
  // „Dodaj u listu Dokumenti“ poslije novog dužeg teksta: naziv i adresa su već upisani
  const sp = await searchParams;
  const pocetno =
    def.kljuc === "dokumenti" && typeof sp.adresa === "string"
      ? { naziv: typeof sp.naziv === "string" ? sp.naziv : "", adresa: sp.adresa }
      : undefined;

  return (
    <>
      <Naslov
        naslov={`Dodaj ${def.jednina}`}
        opis={POMOC[def.kljuc] ?? "Popunite polja i sačuvajte. Polja označena s „obavezno“ moraju biti popunjena."}
        nazad={{ href: `/admin/${def.kljuc}`, tekst: def.naziv }}
        uputstvo={POGLAVLJE_KOLEKCIJE[def.kljuc]}
      />
      <Obrazac kljuc={def.kljuc} id={null} pocetno={pocetno} opcije={opcijeObrasca(def.kljuc)} nazad={`/admin/${def.kljuc}`} />
    </>
  );
}
