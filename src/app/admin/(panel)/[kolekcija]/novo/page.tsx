import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { kolekcija } from "@/cms/kolekcije";
import Naslov from "@/components/admin/Naslov";
import Obrazac from "@/components/admin/Obrazac";
import { opcijeObrasca } from "@/server/admin";

const POMOC: Record<string, string> = {
  nabavke: "Odaberite dokument – naziv se upiše sam. Zatim označite vrstu objave i godinu, pa sačuvajte.",
  dokumenti: "Odaberite dokument – naziv se upiše sam. Zatim označite gdje ga prikazati, pa sačuvajte.",
  obavijesti: "Upišite naslov i dodajte dokument konkursa ili obavijesti, pa sačuvajte.",
};

export async function generateMetadata({ params }: PageProps<"/admin/[kolekcija]/novo">): Promise<Metadata> {
  const def = kolekcija((await params).kolekcija);
  return { title: def ? `Dodaj ${def.jednina}` : undefined };
}

export default async function NovoPage({ params }: PageProps<"/admin/[kolekcija]/novo">) {
  const def = kolekcija((await params).kolekcija);
  if (!def) notFound();
  if (def.jedinstven || !def.dodavanje) redirect(`/admin/${def.kljuc}`);

  return (
    <>
      <Naslov
        naslov={`Dodaj ${def.jednina}`}
        opis={POMOC[def.kljuc] ?? "Popunite polja i sačuvajte. Polja označena s „obavezno“ moraju biti popunjena."}
        nazad={{ href: `/admin/${def.kljuc}`, tekst: def.naziv }}
      />
      <Obrazac kljuc={def.kljuc} id={null} opcije={opcijeObrasca(def.kljuc)} nazad={`/admin/${def.kljuc}`} />
    </>
  );
}
