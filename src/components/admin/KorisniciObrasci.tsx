"use client";

import { useActionState, useState, useTransition } from "react";
import { CircleCheck, KeyRound, LoaderCircle, Trash2, UserPlus } from "lucide-react";
import { dodajKorisnikaAkcija, lozinkaAkcija, obrisiKorisnikaAkcija, type StanjeObrasca } from "@/app/admin/akcije";
import { Greska, LozinkaUlaz } from "./PrijavaObrazac";
import Potvrda from "./Potvrda";
import { ULAZ } from "./Polja";

function Uspjeh({ stanje }: { stanje: StanjeObrasca }) {
  if (!stanje?.uspjeh) return null;
  return (
    <p role="status" className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-lg font-semibold text-emerald-900">
      <CircleCheck className="h-6 w-6 shrink-0" aria-hidden="true" /> {stanje.uspjeh}
    </p>
  );
}

const DUGME =
  "inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-navy px-6 font-display text-lg font-semibold text-white hover:bg-brand-deep disabled:opacity-70";

export function PromjenaLozinke() {
  const [stanje, akcija, salje] = useActionState(lozinkaAkcija, undefined);
  return (
    <form action={akcija} className="space-y-5" key={stanje?.uspjeh}>
      <Greska stanje={stanje} />
      <Uspjeh stanje={stanje} />
      <LozinkaUlaz ime="stara" oznaka="Trenutna lozinka" autoComplete="current-password" />
      <LozinkaUlaz ime="lozinka" oznaka="Nova lozinka" autoComplete="new-password" pomoc="Najmanje 8 znakova." />
      <LozinkaUlaz ime="lozinka2" oznaka="Ponovite novu lozinku" autoComplete="new-password" />
      <p className="text-base text-muted">Nakon promjene, na svim drugim računarima trebat će se ponovo prijaviti.</p>
      <button type="submit" disabled={salje} className={DUGME}>
        {salje ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : <KeyRound className="h-5 w-5" aria-hidden="true" />}
        Promijeni lozinku
      </button>
    </form>
  );
}

export function NoviKorisnik() {
  const [stanje, akcija, salje] = useActionState(dodajKorisnikaAkcija, undefined);
  return (
    <form action={akcija} className="space-y-5" key={stanje?.uspjeh}>
      <Greska stanje={stanje} />
      <Uspjeh stanje={stanje} />
      <label className="block">
        <span className="font-display text-lg font-semibold text-navy">Ime i prezime</span>
        <input name="ime" className={`${ULAZ} mt-2`} />
      </label>
      <label className="block">
        <span className="font-display text-lg font-semibold text-navy">Korisničko ime</span>
        <input name="korisnik" required autoCapitalize="none" autoComplete="off" className={`${ULAZ} mt-2`} />
      </label>
      <LozinkaUlaz ime="lozinka" oznaka="Lozinka" autoComplete="new-password" pomoc="Najmanje 8 znakova." />
      <button type="submit" disabled={salje} className={DUGME}>
        {salje ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : <UserPlus className="h-5 w-5" aria-hidden="true" />}
        Dodaj urednika
      </button>
    </form>
  );
}

export function ObrisiKorisnika({ id, ime }: { id: number; ime: string }) {
  const [pitaj, setPitaj] = useState(false);
  const [greska, setGreska] = useState("");
  const [radi, start] = useTransition();
  return (
    <>
      <button
        type="button"
        disabled={radi}
        onClick={() => setPitaj(true)}
        className="inline-flex min-h-12 items-center gap-2 rounded-xl px-3 font-semibold text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-5 w-5" aria-hidden="true" /> Ukloni<span className="sr-only">: {ime}</span>
      </button>
      {greska && (
        <p role="alert" className="w-full text-base font-semibold text-red-700">
          {greska}
        </p>
      )}
      <Potvrda
        otvoreno={pitaj}
        naslov={`Ukloniti urednika ${ime}?`}
        tekst="Ova osoba se više neće moći prijaviti."
        potvrdi="Da, ukloni"
        opasno
        onPotvrdi={() =>
          start(async () => {
            try {
              const r = await obrisiKorisnikaAkcija(id);
              setGreska(r.poruka ?? "");
            } catch {
              setGreska("Nema veze sa serverom. Pokušajte ponovo.");
            }
          })
        }
        onZatvori={() => setPitaj(false)}
      />
    </>
  );
}
