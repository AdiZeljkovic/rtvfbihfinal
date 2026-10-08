"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleAlert, ExternalLink, LoaderCircle, Save } from "lucide-react";
import { kolekcija, type Polje } from "@/cms/kolekcije";
import type { Blok } from "@/content/arhiva";
import { sacuvajZapis } from "@/app/admin/akcije";
import BlokoviPolje from "./BlokoviPolje";
import Potvrda from "./Potvrda";
import {
  DatumPolje,
  DokumentPolje,
  DokumentiPolje,
  IzborPolje,
  ListaPolje,
  PrekidacPolje,
  SlikaPolje,
  TekstPolje,
  danas,
} from "./Polja";

type Podaci = Record<string, unknown>;

/** Početne vrijednosti nove stavke: današnji datum, tekuća godina… */
function pocetne(polja: Polje[]): Podaci {
  const p: Podaci = {};
  for (const f of polja) {
    if (f.vrsta === "datum" && f.danas) p[f.ime] = danas();
    if (f.vrsta === "izbor" && f.ime === "godina") p[f.ime] = String(new Date().getFullYear());
  }
  return p;
}

export default function Obrazac({
  kljuc,
  id,
  pocetno,
  opcije = {},
  naStranici,
  nazad,
}: {
  kljuc: string;
  id: number | null;
  pocetno?: Podaci;
  opcije?: Record<string, string[]>;
  naStranici?: string;
  nazad: string;
}) {
  const def = kolekcija(kljuc)!;
  const router = useRouter();
  const [podaci, setPodaci] = useState<Podaci>(() => pocetno ?? pocetne(def.polja));
  const [greske, setGreske] = useState<Record<string, string>>({});
  const [poruka, setPoruka] = useState("");
  const [prljavo, setPrljavo] = useState(false);
  const [pitajOdustani, setPitajOdustani] = useState(false);
  const [cuvanje, startCuvanje] = useTransition();
  const sazetak = useRef<HTMLDivElement>(null);

  // upozorenje ako se stranica zatvori prije čuvanja
  useEffect(() => {
    if (!prljavo) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [prljavo]);

  const postavi = (ime: string) => (v: unknown) => {
    setPrljavo(true);
    setPodaci((s) => ({ ...s, [ime]: typeof v === "function" ? (v as (x: unknown) => unknown)(s[ime]) : v }));
    if (greske[ime])
      setGreske((g) => {
        const n = { ...g };
        delete n[ime];
        return n;
      });
  };
  const postaviDrugo = (ime: string, v: unknown, samoAkoPrazno = false) =>
    setPodaci((s) => (samoAkoPrazno && String(s[ime] ?? "").trim() ? s : { ...s, [ime]: v }));

  function sacuvaj() {
    setPoruka("");
    startCuvanje(async () => {
      try {
        const r = await sacuvajZapis(kljuc, id, podaci);
        if (r.greske || r.poruka) {
          setGreske(r.greske ?? {});
          setPoruka(r.poruka ?? "");
          requestAnimationFrame(() => sazetak.current?.focus());
          return;
        }
        setPrljavo(false);
        router.push(`/admin/gotovo?k=${kljuc}&id=${r.id}${id ? "" : "&novo=1"}`);
      } catch {
        setPoruka("Čuvanje nije uspjelo. Provjerite internet vezu i pokušajte ponovo.");
        requestAnimationFrame(() => sazetak.current?.focus());
      }
    });
  }

  const listaGresaka = def.polja.filter((f) => greske[f.ime]);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        sacuvaj();
      }}
    >
      {(poruka || listaGresaka.length > 0) && (
        <div
          ref={sazetak}
          tabIndex={-1}
          role="alert"
          className="mb-8 rounded-3xl border-2 border-red-700 bg-red-50 p-6 text-red-900"
        >
          <p className="flex items-center gap-3 font-display text-xl font-bold">
            <CircleAlert className="h-7 w-7 shrink-0" aria-hidden="true" /> {poruka || "Nešto nije popunjeno."}
          </p>
          {listaGresaka.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-12 text-lg">
              {listaGresaka.map((f) => (
                <li key={f.ime}>
                  <a href={`#p-${f.ime}`} className="font-semibold underline">
                    {f.naziv}
                  </a>
                  : {greske[f.ime]}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <ol className="space-y-5">
        {def.polja.map((f, i) => {
          const zajednicko = { polje: f, greska: greske[f.ime], opcije: opcije[f.ime], postaviDrugo };
          const v = podaci[f.ime];
          let polje: React.ReactNode;
          switch (f.vrsta) {
            case "tekst":
            case "dugiTekst":
            case "broj":
              polje = <TekstPolje {...zajednicko} vrijednost={v == null ? "" : String(v)} postavi={postavi(f.ime)} />;
              break;
            case "datum":
              polje = <DatumPolje {...zajednicko} vrijednost={String(v ?? "")} postavi={postavi(f.ime)} />;
              break;
            case "izbor":
              polje = <IzborPolje {...zajednicko} vrijednost={String(v ?? "")} postavi={postavi(f.ime)} />;
              break;
            case "prekidac":
              polje = <PrekidacPolje {...zajednicko} vrijednost={Boolean(v)} postavi={postavi(f.ime)} />;
              break;
            case "dokument":
              polje = <DokumentPolje {...zajednicko} vrijednost={String(v ?? "")} postavi={postavi(f.ime)} />;
              break;
            case "dokumenti":
              polje = <DokumentiPolje {...zajednicko} vrijednost={(v as never[]) ?? []} postavi={postavi(f.ime)} />;
              break;
            case "slika":
              polje = <SlikaPolje {...zajednicko} vrijednost={String(v ?? "")} postavi={postavi(f.ime)} />;
              break;
            case "lista":
              polje = <ListaPolje {...zajednicko} vrijednost={(v as Record<string, string>[]) ?? []} postavi={postavi(f.ime)} />;
              break;
            case "blokovi":
              polje = <BlokoviPolje polje={f} greska={greske[f.ime]} vrijednost={(v as Blok[]) ?? []} postavi={postavi(f.ime)} />;
              break;
          }
          return (
            <li
              key={f.ime}
              id={`p-${f.ime}`}
              className="admin-kartica relative scroll-mt-32 rounded-[1.75rem] border border-line bg-white p-5 shadow-[var(--shadow-card)] sm:p-7 sm:pl-20"
            >
              <span
                aria-hidden="true"
                className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-soft font-display text-lg font-bold text-brand sm:absolute sm:left-6 sm:top-7 sm:mb-0"
              >
                {i + 1}
              </span>
              {polje}
            </li>
          );
        })}
      </ol>

      {/* traka za čuvanje – uvijek pri dnu ekrana */}
      <div className="sticky bottom-0 z-20 -mx-4 mt-8 border-t border-line bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={cuvanje}
            className="inline-flex min-h-16 flex-1 items-center justify-center gap-3 rounded-2xl bg-brand px-6 sm:flex-none sm:px-8 font-display text-xl font-bold text-white shadow-[0_10px_30px_-12px_rgba(43,141,222,0.8)] hover:bg-brand-deep disabled:opacity-70"
          >
            {cuvanje ? <LoaderCircle className="h-6 w-6 animate-spin" aria-hidden="true" /> : <Save className="h-6 w-6" aria-hidden="true" />}
            {cuvanje ? "Čuvam…" : def.jedinstven ? "Sačuvaj promjene" : id ? "Sačuvaj promjene" : "Sačuvaj i objavi"}
          </button>
          <button
            type="button"
            onClick={() => (prljavo ? setPitajOdustani(true) : router.push(nazad))}
            className="inline-flex min-h-16 items-center justify-center rounded-2xl border-2 border-line bg-white px-5 font-display text-lg font-semibold text-navy hover:border-navy"
          >
            Odustani
          </button>
          {naStranici && (
            <Link
              href={naStranici}
              target="_blank"
              className="inline-flex min-h-12 items-center justify-center gap-2 px-4 font-semibold text-brand underline-offset-4 hover:underline sm:ml-auto"
            >
              <ExternalLink className="h-5 w-5" aria-hidden="true" /> Pogledaj na stranici
            </Link>
          )}
          <p aria-live="polite" className="sr-only">
            {cuvanje ? "Čuvam promjene" : ""}
          </p>
        </div>
      </div>

      <Potvrda
        otvoreno={pitajOdustani}
        naslov="Odustati od promjena?"
        tekst="Promjene koje ste upisali neće biti sačuvane."
        potvrdi="Da, odustani"
        odustani="Ne, nastavi uređivanje"
        opasno
        onPotvrdi={() => {
          setPrljavo(false);
          router.push(nazad);
        }}
        onZatvori={() => setPitajOdustani(false)}
      />
    </form>
  );
}
