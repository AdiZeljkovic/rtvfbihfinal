import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, ExternalLink, House, Plus } from "lucide-react";
import { kolekcija } from "@/cms/kolekcije";
import Fokus from "@/components/admin/Fokus";
import { jedan, lista } from "@/server/db";
import { obaveznaPrijava } from "@/server/auth";

export const metadata: Metadata = { title: "Sačuvano" };

const dugme =
  "inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl px-7 font-display text-lg font-semibold transition-colors";

export default async function GotovoPage({ searchParams }: PageProps<"/admin/gotovo">) {
  await obaveznaPrijava();
  const sp = await searchParams;
  const def = kolekcija(String(sp.k ?? ""));
  const z = jedan(Number(sp.id));
  if (!def || !z) notFound();
  const novo = sp.novo === "1";
  const naslov = String(z.podaci[def.naslovPolje] ?? "");
  const naStranici = z.status === "objavljeno";
  // novi duži tekst ima svoju stranicu, ali na listi Dokumenti se vidi tek kad se doda kao dokument s tom adresom
  const ruta = String(z.podaci.ruta ?? "");
  const tekstBezLinka =
    def.kljuc === "tekstovi" && naStranici && ruta && !lista("dokumenti").some((d) => d.podaci.adresa === ruta);

  return (
    <div className="mx-auto max-w-3xl py-6 text-center sm:py-12">
      <span className="mx-auto inline-flex h-24 w-24 items-center justify-center rounded-full bg-emerald-600 text-white shadow-[0_18px_40px_-16px_rgba(5,150,105,0.8)]">
        <Check className="h-14 w-14" strokeWidth={3} aria-hidden="true" />
      </span>
      <Fokus className="mt-7 font-display text-4xl font-bold text-navy">
        {def.jedinstven ? "Promjene su sačuvane!" : novo ? "Objavljeno!" : "Promjene su sačuvane!"}
      </Fokus>
      <p className="mt-3 text-xl leading-relaxed text-muted">
        {naslov && (
          <>
            <strong className="text-navy">{naslov}</strong>
            <br />
          </>
        )}
        {naStranici
          ? "Promjena je već vidljiva na stranici."
          : z.status === "arhiva"
            ? "Stavka je u arhivi i ne vidi se na stranici. Vratite je iz Arhive kad je želite ponovo prikazati."
            : "Stavka je u korpi i ne vidi se na stranici. Vratite je iz Korpe kad je želite ponovo prikazati."}
      </p>

      {tekstBezLinka && (
        <div className="mt-8 rounded-3xl border-2 border-brand/40 bg-sky-soft p-6 text-left">
          <p className="text-lg leading-relaxed text-navy">
            Tekst ima svoju stranicu, ali se još ne vidi u listi na stranici <strong>Dokumenti</strong>. Da bi ga posjetioci našli,
            dodajte ga u listu (naziv i adresa su već upisani, samo odaberite gdje ga prikazati).
          </p>
          <Link
            href={`/admin/dokumenti/novo?naziv=${encodeURIComponent(naslov)}&adresa=${encodeURIComponent(ruta)}`}
            className={`${dugme} mt-4 bg-brand-strong text-white hover:bg-brand-deep`}
          >
            <Plus className="h-6 w-6" aria-hidden="true" /> Dodaj u listu Dokumenti
          </Link>
        </div>
      )}

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {naStranici && (
          <a href={def.naStranici(z.podaci)} target="_blank" rel="noopener" className={`${dugme} bg-navy text-white hover:bg-brand-deep`}>
            <ExternalLink className="h-6 w-6" aria-hidden="true" /> Pogledaj na stranici
          </a>
        )}
        {def.dodavanje ? (
          <Link href={`/admin/${def.kljuc}/novo`} className={`${dugme} bg-brand-strong text-white hover:bg-brand-deep`}>
            <Plus className="h-6 w-6" aria-hidden="true" /> Dodaj još {def.jednina}
          </Link>
        ) : (
          <Link href={`/admin/${def.kljuc}/${z.id}`} className={`${dugme} bg-brand-strong text-white hover:bg-brand-deep`}>
            Nastavi uređivanje
          </Link>
        )}
        <Link href={def.jedinstven ? "/admin" : `/admin/${def.kljuc}`} className={`${dugme} border-2 border-line bg-white text-navy hover:border-navy`}>
          <ArrowLeft className="h-6 w-6" aria-hidden="true" /> {def.jedinstven ? "Nazad" : `Nazad na listu: ${def.naziv}`}
        </Link>
        <Link href="/admin" className={`${dugme} border-2 border-line bg-white text-navy hover:border-navy`}>
          <House className="h-6 w-6" aria-hidden="true" /> Početna
        </Link>
      </div>
    </div>
  );
}
