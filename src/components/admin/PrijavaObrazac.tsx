"use client";

import { useActionState, useState } from "react";
import { CircleAlert, Eye, EyeOff, LoaderCircle, LogIn, UserPlus } from "lucide-react";
import { prijavaAkcija, prviKorisnikAkcija, type StanjeObrasca } from "@/app/admin/akcije";
import { ULAZ } from "./Polja";

export function LozinkaUlaz({ ime, oznaka, autoComplete, pomoc }: { ime: string; oznaka: string; autoComplete: string; pomoc?: string }) {
  const [vidljiva, setVidljiva] = useState(false);
  return (
    <label className="block">
      <span className="font-display text-lg font-semibold text-navy">{oznaka}</span>
      {pomoc && <span className="block text-base text-muted">{pomoc}</span>}
      <span className="mt-2 flex gap-2">
        <input name={ime} type={vidljiva ? "text" : "password"} required autoComplete={autoComplete} className={ULAZ} />
        <button
          type="button"
          onClick={() => setVidljiva(!vidljiva)}
          aria-pressed={vidljiva}
          className="inline-flex min-h-14 shrink-0 items-center gap-2 rounded-2xl border-2 border-line bg-white px-3.5 font-semibold text-navy hover:border-brand"
        >
          {vidljiva ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
          <span className="hidden sm:inline">{vidljiva ? "Sakrij" : "Prikaži"}</span>
          <span className="sr-only sm:hidden">{vidljiva ? "Sakrij lozinku" : "Prikaži lozinku"}</span>
        </button>
      </span>
    </label>
  );
}

export function Greska({ stanje }: { stanje: StanjeObrasca }) {
  if (!stanje?.greska) return null;
  return (
    <p role="alert" className="flex items-start gap-3 rounded-2xl border-2 border-red-700 bg-red-50 p-4 text-lg font-semibold text-red-900">
      <CircleAlert className="mt-0.5 h-6 w-6 shrink-0" aria-hidden="true" /> {stanje.greska}
    </p>
  );
}

export default function PrijavaObrazac({ prvi, trebaKod = false }: { prvi: boolean; trebaKod?: boolean }) {
  const [stanje, akcija, salje] = useActionState(prvi ? prviKorisnikAkcija : prijavaAkcija, undefined);
  const Ikona = salje ? LoaderCircle : prvi ? UserPlus : LogIn;

  return (
    <form action={akcija} className="space-y-6">
      <Greska stanje={stanje} />
      {prvi && trebaKod && (
        <label className="block">
          <span className="font-display text-lg font-semibold text-navy">Kod za postavljanje</span>
          <span className="block text-base text-muted">Dobili ste ga od osobe koja je postavila stranicu.</span>
          <input name="kod" required autoComplete="off" autoCapitalize="none" className={`${ULAZ} mt-2`} />
        </label>
      )}
      {prvi && (
        <label className="block">
          <span className="font-display text-lg font-semibold text-navy">Vaše ime i prezime</span>
          <input name="ime" autoComplete="name" className={`${ULAZ} mt-2`} />
        </label>
      )}
      <label className="block">
        <span className="font-display text-lg font-semibold text-navy">Korisničko ime</span>
        {prvi && <span className="block text-base text-muted">Kratko ime za prijavu, npr. „urednik“.</span>}
        <input name="korisnik" required autoComplete="username" autoCapitalize="none" autoFocus className={`${ULAZ} mt-2`} />
      </label>
      <LozinkaUlaz ime="lozinka" oznaka="Lozinka" autoComplete={prvi ? "new-password" : "current-password"} pomoc={prvi ? "Najmanje 8 znakova." : undefined} />
      {prvi && <LozinkaUlaz ime="lozinka2" oznaka="Ponovite lozinku" autoComplete="new-password" />}
      <button
        type="submit"
        disabled={salje}
        className="inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-brand-strong px-8 font-display text-xl font-bold text-white hover:bg-brand-deep disabled:opacity-70"
      >
        <Ikona className={`h-6 w-6 ${salje ? "animate-spin" : ""}`} aria-hidden="true" />
        {salje ? "Trenutak…" : prvi ? "Napravi račun i uđi" : "Prijavi se"}
      </button>
    </form>
  );
}
