import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { kolekcija } from "@/cms/kolekcije";
import Naslov from "@/components/admin/Naslov";
import Obrazac from "@/components/admin/Obrazac";
import { jedan } from "@/server/db";
import { opcijeObrasca, vrijemeBs } from "@/server/admin";

async function ucitaj(params: PageProps<"/admin/[kolekcija]/[id]">["params"]) {
  const { kolekcija: k, id } = await params;
  const def = kolekcija(k);
  const z = /^\d+$/.test(id) ? jedan(Number(id)) : undefined;
  if (!def || !z || z.kolekcija !== def.kljuc) return null;
  return { def, z };
}

export async function generateMetadata({ params }: PageProps<"/admin/[kolekcija]/[id]">): Promise<Metadata> {
  const r = await ucitaj(params);
  return { title: r ? `Uredi: ${String(r.z.podaci[r.def.naslovPolje] ?? "").slice(0, 60)}` : undefined };
}

export default async function UrediPage({ params }: PageProps<"/admin/[kolekcija]/[id]">) {
  const r = await ucitaj(params);
  if (!r) notFound();
  const { def, z } = r;
  const naslov = String(z.podaci[def.naslovPolje] ?? "") || def.jednina;

  return (
    <>
      <Naslov
        naslov={naslov}
        opis={
          <>
            {z.status === "korpa" ? (
              <strong className="text-red-700">Ova stavka je u korpi i ne vidi se na stranici. </strong>
            ) : null}
            Zadnja izmjena: {vrijemeBs(z.izmijenjeno)}
            {z.izmijenio ? ` (${z.izmijenio})` : ""}
          </>
        }
        nazad={{ href: `/admin/${def.kljuc}`, tekst: def.naziv }}
      />
      <Obrazac
        kljuc={def.kljuc}
        id={z.id}
        pocetno={z.podaci}
        opcije={opcijeObrasca(def.kljuc, z.id)}
        naStranici={z.status === "objavljeno" ? def.naStranici(z.podaci) : undefined}
        nazad={`/admin/${def.kljuc}`}
      />
    </>
  );
}
