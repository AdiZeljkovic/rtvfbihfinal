"use client";

import { useId, useState } from "react";
import { ArrowDown, ArrowUp, FileText, Heading, Image as SlikaIkona, Pilcrow, Plus, Table, Trash2 } from "lucide-react";
import type { ArhivaLink, Blok } from "@/content/arhiva";
import type { Polje } from "@/cms/kolekcije";
import { MALO_DUGME, Okvir, ULAZ } from "./Polja";
import { KarticaDokumenta, ZonaZaFajl, nazivIzFajla } from "./Upload";

const VRSTE: { t: Blok["t"]; naziv: string; ikona: typeof Pilcrow; novi: () => Blok }[] = [
  { t: "pasus", naziv: "Tekst (pasus)", ikona: Pilcrow, novi: () => ({ t: "pasus", tekst: "" }) },
  { t: "naslov", naziv: "Podnaslov", ikona: Heading, novi: () => ({ t: "naslov", tekst: "" }) },
  { t: "linkovi", naziv: "Dokumenti i linkovi", ikona: FileText, novi: () => ({ t: "linkovi", prefiks: "", stavke: [] }) },
  { t: "slika", naziv: "Slika", ikona: SlikaIkona, novi: () => ({ t: "slika", src: "" }) },
  { t: "tabela", naziv: "Tabela", ikona: Table, novi: () => ({ t: "tabela", redovi: [["", ""]] }) },
];
const vrsta = (t: Blok["t"]) => VRSTE.find((v) => v.t === t)!;

type Promjena = (b: Blok | ((stari: Blok) => Blok)) => void;

/** Stalni ključ svakog dijela teksta, da React ne pomiješa dijelove kad se pomjeraju */
let sljedeciKljuc = 0;
const noviKljuc = () => ++sljedeciKljuc;

/** Adresa koja izgleda kao web stranica (npr. www.fbih.gov.ba) je vanjski link */
const vanjskaAdresa = (v: string) => /^(https?:|mailto:|tel:)/i.test(v) || /^(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/|$)/i.test(v);

/** Tabela se uređuje kao tekst: jedan red po liniji, ćelije odvojene znakom | */
function TabelaUredi({ blok, promijeni }: { blok: Extract<Blok, { t: "tabela" }>; promijeni: Promjena }) {
  const [tekst, setTekst] = useState(() => blok.redovi.map((r) => r.join("|")).join("\n"));
  return (
    <label className="block">
      <span className="text-base text-muted">Jedan red tabele u jednoj liniji. Ćelije odvojite uspravnom crtom |</span>
      <textarea
        rows={Math.min(14, Math.max(3, blok.redovi.length + 1))}
        value={tekst}
        onChange={(e) => {
          setTekst(e.target.value);
          promijeni({ t: "tabela", redovi: e.target.value.split("\n").filter((r) => r.trim()).map((r) => r.split("|")) });
        }}
        className={`${ULAZ} mt-1.5 font-mono text-base`}
      />
    </label>
  );
}

function LinkoviUredi({ blok, promijeni }: { blok: Extract<Blok, { t: "linkovi" }>; promijeni: Promjena }) {
  const stavke = blok.stavke;
  const postavi = (n: ArhivaLink[]) => promijeni({ ...blok, stavke: n });
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-base font-semibold text-navy">Uvodni tekst ispred liste (nije obavezno)</span>
        <input value={blok.prefiks} onChange={(e) => promijeni({ ...blok, prefiks: e.target.value })} className={`${ULAZ} mt-1.5`} />
      </label>
      <ul className="space-y-3">
        {stavke.map((s, i) => (
          <li key={i} className="rounded-2xl border border-line bg-white p-4">
            {s.doc ? (
              <KarticaDokumenta ime={s.doc} onUkloni={() => postavi(stavke.filter((_, j) => j !== i))} />
            ) : (
              <div className="flex flex-wrap items-end gap-3">
                <label className="block min-w-0 flex-1">
                  <span className="text-base font-semibold text-navy">Adresa (link)</span>
                  <input
                    value={s.href ?? s.ruta ?? ""}
                    placeholder="npr. /javne-nabavke ili https://…"
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      postavi(stavke.map((x, j) => (j === i ? { tekst: x.tekst, ...(vanjskaAdresa(v) ? { href: v } : { ruta: v }) } : x)));
                    }}
                    className={`${ULAZ} mt-1.5`}
                  />
                </label>
                <button type="button" onClick={() => postavi(stavke.filter((_, j) => j !== i))} className={`${MALO_DUGME} text-red-700 hover:bg-red-50`}>
                  <Trash2 className="h-5 w-5" aria-hidden="true" /> Ukloni
                </button>
              </div>
            )}
            <label className="mt-3 block">
              <span className="text-base font-semibold text-navy">Tekst linka</span>
              <input
                value={s.tekst}
                onChange={(e) => postavi(stavke.map((x, j) => (j === i ? { ...x, tekst: e.target.value } : x)))}
                className={`${ULAZ} mt-1.5`}
              />
            </label>
          </li>
        ))}
      </ul>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
        <ZonaZaFajl
          vrsta="dokument"
          vise
          kompaktno
          oznaka="Dodaj dokumente"
          onPoslano={(p, iz) =>
            promijeni((b) => (b.t === "linkovi" ? { ...b, stavke: [...b.stavke, { tekst: nazivIzFajla(iz), doc: p.ime }] } : b))
          }
        />
        <button
          type="button"
          onClick={() => postavi([...stavke, { tekst: "", ruta: "" }])}
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-line bg-white px-5 font-semibold text-navy hover:border-brand"
        >
          <Plus className="h-5 w-5" aria-hidden="true" /> Dodaj link na stranicu
        </button>
      </div>
    </div>
  );
}

export default function BlokoviPolje({
  polje,
  vrijednost,
  postavi,
  greska,
}: {
  polje: Polje;
  vrijednost: Blok[];
  postavi: (v: Blok[] | ((s: Blok[]) => Blok[])) => void;
  greska?: string;
}) {
  const id = useId();
  const blokovi = vrijednost ?? [];
  const [zadnjiDodan, setZadnjiDodan] = useState<number | null>(null);
  const [kljucevi, setKljucevi] = useState<number[]>(() => blokovi.map(noviKljuc));
  // ako se broj dijelova promijeni izvana, dopuni ključeve
  const k = kljucevi.length === blokovi.length ? kljucevi : blokovi.map((_, i) => kljucevi[i] ?? -1 - i);

  const promijeni =
    (i: number): Promjena =>
    (b) =>
      postavi((s) => s.map((x, j) => (j === i ? (typeof b === "function" ? b(x) : b) : x)));
  const zamijeni = <T,>(niz: T[], i: number, j: number) => {
    const n = [...niz];
    [n[i], n[j]] = [n[j], n[i]];
    return n;
  };
  const pomjeri = (i: number, s: number) => {
    setKljucevi(zamijeni(k, i, i + s));
    postavi((sv) => zamijeni(sv, i, i + s));
  };
  const ukloni = (i: number) => {
    setKljucevi(k.filter((_, j) => j !== i));
    postavi((s) => s.filter((_, j) => j !== i));
  };
  const dodaj = (b: Blok) => {
    const novi = noviKljuc();
    setKljucevi([...k, novi]);
    setZadnjiDodan(novi);
    postavi((s) => [...s, b]);
  };

  /** Pasus u kojem je zalijepljeno više pasusa (prazan red) dijeli se na više blokova */
  const podijeli = (i: number) => {
    const b = blokovi[i];
    if (b.t !== "pasus" || !/\n\s*\n/.test(b.tekst)) return;
    const dijelovi = b.tekst.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
    setKljucevi([...k.slice(0, i), k[i], ...dijelovi.slice(1).map(noviKljuc), ...k.slice(i + 1)]);
    postavi((s) => [...s.slice(0, i), ...dijelovi.map((tekst) => ({ t: "pasus" as const, tekst })), ...s.slice(i + 1)]);
  };

  return (
    <Okvir id={id} naziv={polje.naziv} pomoc={"pomoc" in polje && polje.pomoc ? polje.pomoc : "Tekst se slaže od dijelova. Dodajte ih dugmadima ispod i poredajte strelicama."} greska={greska}>
      {blokovi.length === 0 && (
        <p className="rounded-3xl border-2 border-dashed border-line bg-white p-6 text-center text-lg text-muted">Još nema teksta. Dodajte prvi dio dugmetom ispod.</p>
      )}
      <ol className="space-y-4">
        {blokovi.map((b, i) => {
          const v = vrsta(b.t);
          const Ikona = v.ikona;
          return (
            <li key={k[i]} className="admin-kartica rounded-3xl border border-line bg-sky-mist p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-2 font-display text-lg font-semibold text-navy">
                  <Ikona className="h-5 w-5 text-brand-strong" aria-hidden="true" /> {i + 1}. {v.naziv}
                </p>
                <div className="flex flex-wrap gap-1">
                  <button type="button" disabled={i === 0} onClick={() => pomjeri(i, -1)} aria-label={`Pomjeri dio ${i + 1} gore`} className={`${MALO_DUGME} text-navy hover:bg-white`}>
                    <ArrowUp className="h-5 w-5" aria-hidden="true" /> Gore
                  </button>
                  <button type="button" disabled={i === blokovi.length - 1} onClick={() => pomjeri(i, 1)} aria-label={`Pomjeri dio ${i + 1} dolje`} className={`${MALO_DUGME} text-navy hover:bg-white`}>
                    <ArrowDown className="h-5 w-5" aria-hidden="true" /> Dolje
                  </button>
                  <button type="button" onClick={() => ukloni(i)} aria-label={`Ukloni dio ${i + 1}`} className={`${MALO_DUGME} text-red-700 hover:bg-red-50`}>
                    <Trash2 className="h-5 w-5" aria-hidden="true" /> Ukloni
                  </button>
                </div>
              </div>

              {b.t === "pasus" && (
                <textarea
                  aria-label={`Tekst, dio ${i + 1}`}
                  autoFocus={zadnjiDodan === k[i]}
                  rows={Math.min(12, Math.max(3, Math.ceil(b.tekst.length / 80)))}
                  value={b.tekst}
                  onChange={(e) => promijeni(i)({ t: "pasus", tekst: e.target.value })}
                  onBlur={() => podijeli(i)}
                  className={`${ULAZ} leading-relaxed`}
                />
              )}
              {b.t === "naslov" && (
                <input
                  aria-label={`Podnaslov, dio ${i + 1}`}
                  autoFocus={zadnjiDodan === k[i]}
                  value={b.tekst}
                  onChange={(e) => promijeni(i)({ t: "naslov", tekst: e.target.value })}
                  className={`${ULAZ} font-display text-xl font-semibold`}
                />
              )}
              {b.t === "linkovi" && <LinkoviUredi blok={b} promijeni={promijeni(i)} />}
              {b.t === "tabela" && <TabelaUredi blok={b} promijeni={promijeni(i)} />}
              {b.t === "slika" &&
                (b.src ? (
                  <div className="flex flex-wrap items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.src} alt="" className="h-32 max-w-full rounded-2xl bg-white object-contain" />
                    <button type="button" onClick={() => promijeni(i)({ t: "slika", src: "" })} className={`${MALO_DUGME} text-red-700 hover:bg-red-50`}>
                      <Trash2 className="h-5 w-5" aria-hidden="true" /> Zamijeni sliku
                    </button>
                  </div>
                ) : (
                  <ZonaZaFajl vrsta="slika" kompaktno oznaka="Odaberi sliku" onPoslano={(p) => promijeni(i)({ t: "slika", src: p.adresa })} />
                ))}
            </li>
          );
        })}
      </ol>

      <div className="mt-5 rounded-3xl border-2 border-dashed border-brand/50 bg-white p-4 sm:p-5">
        <p className="font-display text-lg font-semibold text-navy">Dodaj na kraj teksta:</p>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {VRSTE.map((v) => {
            const Ikona = v.ikona;
            return (
              <button
                key={v.t}
                type="button"
                onClick={() => dodaj(v.novi())}
                className="inline-flex min-h-14 items-center gap-2 rounded-2xl border-2 border-line bg-white px-4 text-lg font-semibold text-navy hover:border-brand hover:text-brand-strong"
              >
                <Ikona className="h-5 w-5" aria-hidden="true" /> {v.naziv}
              </button>
            );
          })}
        </div>
      </div>
    </Okvir>
  );
}
