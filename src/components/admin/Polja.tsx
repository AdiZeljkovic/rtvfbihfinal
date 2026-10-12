"use client";

import { useId } from "react";
import { ArrowDown, ArrowUp, CalendarCheck, CircleAlert, Link as LinkIkona, Plus, Trash2 } from "lucide-react";
import type { Polje } from "@/cms/kolekcije";
import { KarticaDokumenta, ZonaZaFajl, nazivIzFajla } from "./Upload";

export const ULAZ =
  "w-full min-h-14 rounded-2xl border-2 border-line bg-white px-4 py-3 text-lg text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-brand";

export const MALO_DUGME =
  "inline-flex min-h-12 items-center gap-2 rounded-xl px-3 font-semibold transition-colors disabled:opacity-35";

/** Zajednički izgled polja: naziv, pomoć ispod naziva, greška crvenom bojom */
export function Okvir({
  id,
  naziv,
  pomoc,
  greska,
  obavezno,
  grupa = false,
  children,
}: {
  id: string;
  naziv: string;
  pomoc?: string;
  greska?: string;
  obavezno?: boolean;
  /** fieldset + legend (za izbor među karticama) */
  grupa?: boolean;
  children: React.ReactNode;
}) {
  const Oznaka = grupa ? "legend" : "label";
  const sadrzaj = (
    <>
      <Oznaka {...(grupa ? {} : { htmlFor: id })} className="block font-display text-xl font-semibold text-navy">
        {naziv}
        {obavezno && <span className="ml-2 align-middle text-sm font-semibold text-brand-strong">obavezno</span>}
      </Oznaka>
      {pomoc && (
        <p id={`${id}-pomoc`} className="mt-1 text-base text-muted">
          {pomoc}
        </p>
      )}
      <div className="mt-3">{children}</div>
      {greska && (
        <p id={`${id}-greska`} className="mt-2 flex items-center gap-2 text-base font-semibold text-red-700">
          <CircleAlert className="h-5 w-5 shrink-0" aria-hidden="true" /> {greska}
        </p>
      )}
    </>
  );
  return grupa ? (
    <fieldset id={`polje-${id}`} className="scroll-mt-32">
      {sadrzaj}
    </fieldset>
  ) : (
    <div id={`polje-${id}`} className="scroll-mt-32">
      {sadrzaj}
    </div>
  );
}

/** aria atributi koji povezuju polje s pomoći i greškom */
export const opisano = (id: string, pomoc?: string, greska?: string) => ({
  "aria-describedby": [pomoc && `${id}-pomoc`, greska && `${id}-greska`].filter(Boolean).join(" ") || undefined,
  "aria-invalid": greska ? true : undefined,
  "data-greska": greska ? "da" : undefined,
});

type Svojstva<V> = {
  polje: Polje;
  vrijednost: V;
  /** Nova vrijednost ili funkcija koja je računa iz trenutne */
  postavi: (v: V | ((stari: V) => V)) => void;
  greska?: string;
  /** Dodatne opcije koje stižu sa servera (npr. postojeći sektori) */
  opcije?: string[];
  /** Postavlja drugo polje (npr. naziv iz imena fajla) */
  postaviDrugo?: (ime: string, v: unknown, samoAkoPrazno?: boolean) => void;
};

// ── tekst, dugi tekst, broj ─────────────────────────────────────────────
export function TekstPolje({ polje, vrijednost, postavi, greska }: Svojstva<string>) {
  const id = useId();
  const pomoc = "pomoc" in polje ? polje.pomoc : undefined;
  const obavezno = "obavezno" in polje ? polje.obavezno : false;
  const a = opisano(id, pomoc, greska);
  return (
    <Okvir id={id} naziv={polje.naziv} pomoc={pomoc} greska={greska} obavezno={obavezno}>
      {polje.vrsta === "dugiTekst" ? (
        <textarea
          id={id}
          name={polje.ime}
          rows={polje.redova ?? 4}
          value={vrijednost ?? ""}
          onChange={(e) => postavi(e.target.value)}
          className={`${ULAZ} leading-relaxed`}
          {...a}
        />
      ) : (
        <input
          id={id}
          name={polje.ime}
          type="text"
          inputMode={polje.vrsta === "broj" ? "decimal" : undefined}
          value={vrijednost ?? ""}
          placeholder={polje.vrsta === "tekst" && polje.primjer ? `npr. ${polje.primjer}` : undefined}
          onChange={(e) => postavi(e.target.value)}
          className={`${ULAZ} ${polje.vrsta === "broj" ? "max-w-xs" : ""}`}
          {...a}
        />
      )}
    </Okvir>
  );
}

// ── datum ───────────────────────────────────────────────────────────────
export const danas = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export function DatumPolje({ polje, vrijednost, postavi, greska }: Svojstva<string>) {
  const id = useId();
  const pomoc = "pomoc" in polje ? polje.pomoc : undefined;
  return (
    <Okvir id={id} naziv={polje.naziv} pomoc={pomoc} greska={greska} obavezno={"obavezno" in polje && polje.obavezno}>
      <div className="flex flex-wrap items-center gap-3">
        <input
          id={id}
          type="date"
          value={vrijednost ?? ""}
          onChange={(e) => postavi(e.target.value)}
          className={`${ULAZ} max-w-xs`}
          {...opisano(id, pomoc, greska)}
        />
        <button type="button" onClick={() => postavi(danas())} className={`${MALO_DUGME} border-2 border-line bg-white text-navy hover:border-brand`}>
          <CalendarCheck className="h-5 w-5" aria-hidden="true" /> Danas
        </button>
        {vrijednost && (
          <button type="button" onClick={() => postavi("")} className={`${MALO_DUGME} text-muted hover:text-red-700`}>
            Očisti datum
          </button>
        )}
      </div>
    </Okvir>
  );
}

// ── izbor (kartice, padajuća lista ili slobodan unos) ───────────────────
export function IzborPolje({ polje, vrijednost, postavi, greska, opcije }: Svojstva<string>) {
  const id = useId();
  if (polje.vrsta !== "izbor") return null;
  const sve = [...new Set([...polje.opcije, ...(opcije ?? [])])];
  const a = opisano(id, polje.pomoc, greska);

  if (polje.slobodno) {
    return (
      <Okvir id={id} naziv={polje.naziv} pomoc={polje.pomoc ?? "Odaberite s liste ili upišite."} greska={greska} obavezno={polje.obavezno}>
        <input id={id} list={`${id}-lista`} value={vrijednost ?? ""} onChange={(e) => postavi(e.target.value)} className={ULAZ} {...a} />
        <datalist id={`${id}-lista`}>
          {sve.map((o) => (
            <option key={o} value={o} />
          ))}
        </datalist>
      </Okvir>
    );
  }

  if (!polje.kartice) {
    return (
      <Okvir id={id} naziv={polje.naziv} pomoc={polje.pomoc} greska={greska} obavezno={polje.obavezno}>
        <select id={id} value={vrijednost ?? ""} onChange={(e) => postavi(e.target.value)} className={ULAZ} {...a}>
          <option value="">{polje.prazno ?? (polje.obavezno ? "— odaberite —" : "— ništa —")}</option>
          {sve.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </Okvir>
    );
  }

  const izbori = polje.obavezno ? sve : ["", ...sve];
  const kratko = sve.every((o) => o.length <= 5);
  return (
    <Okvir id={id} naziv={polje.naziv} pomoc={polje.pomoc} greska={greska} obavezno={polje.obavezno} grupa>
      <div
        className={`grid gap-2.5 ${kratko ? "grid-cols-3 sm:grid-cols-5 lg:grid-cols-7" : "sm:grid-cols-2 lg:grid-cols-3"}`}
        {...(greska ? { "aria-describedby": `${id}-greska` } : {})}
      >
        {izbori.map((o) => (
          <label key={o || "-"} className="relative block cursor-pointer">
            <input
              type="radio"
              name={id}
              value={o}
              checked={(vrijednost ?? "") === o}
              onChange={() => postavi(o)}
              className="peer sr-only"
            />
            <span
              className={`flex min-h-14 items-center gap-3 rounded-2xl border-2 px-4 py-3 text-lg font-semibold transition-colors peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand ${
                (vrijednost ?? "") === o ? "border-navy bg-navy text-white" : "border-line bg-white text-navy hover:border-brand"
              } ${kratko ? "justify-center tabular-nums" : ""}`}
            >
              {!kratko && (
                <span
                  aria-hidden="true"
                  className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                    (vrijednost ?? "") === o ? "border-white" : "border-line"
                  }`}
                >
                  {(vrijednost ?? "") === o && <span className="h-3 w-3 rounded-full bg-white" />}
                </span>
              )}
              {o || <span className="font-normal italic">ništa</span>}
            </span>
          </label>
        ))}
      </div>
    </Okvir>
  );
}

// ── prekidač (da / ne) ──────────────────────────────────────────────────
export function PrekidacPolje({ polje, vrijednost, postavi }: Svojstva<boolean>) {
  const id = useId();
  const ukljuceno = Boolean(vrijednost);
  return (
    <div className="flex items-center justify-between gap-6 rounded-3xl border-2 border-line bg-white p-5">
      <div>
        <p id={id} className="font-display text-xl font-semibold text-navy">
          {polje.naziv}
        </p>
        {"pomoc" in polje && polje.pomoc && <p className="mt-1 text-base text-muted">{polje.pomoc}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={ukljuceno}
        aria-labelledby={id}
        onClick={() => postavi(!ukljuceno)}
        className={`relative inline-flex h-12 w-28 shrink-0 items-center rounded-full px-1.5 font-display font-bold transition-colors ${
          ukljuceno ? "bg-brand-strong text-white" : "bg-line text-navy"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-1.5 h-9 w-9 rounded-full bg-white shadow transition-[left] ${ukljuceno ? "left-[calc(100%-2.625rem)]" : "left-1.5"}`}
        />
        <span className={`w-full text-base ${ukljuceno ? "pr-10 text-left pl-2" : "pl-10 text-right pr-2"}`}>{ukljuceno ? "DA" : "NE"}</span>
      </button>
    </div>
  );
}

// ── jedan dokument ──────────────────────────────────────────────────────
export function DokumentPolje({ polje, vrijednost, postavi, greska, postaviDrugo }: Svojstva<string>) {
  const id = useId();
  if (polje.vrsta !== "dokument") return null;
  const poslano = (ime: string, izvorno: string) => {
    postavi(ime);
    if (polje.nazivIz) postaviDrugo?.(polje.nazivIz, nazivIzFajla(izvorno), true);
  };
  return (
    <Okvir id={id} naziv={polje.naziv} pomoc={polje.pomoc} greska={greska} obavezno={polje.obavezno}>
      <div data-greska={greska ? "da" : undefined} className="rounded-3xl">
        {vrijednost ? (
          <KarticaDokumenta ime={vrijednost} onZamijeni={(p, iz) => poslano(p.ime, iz)} onUkloni={() => postavi("")} />
        ) : (
          <ZonaZaFajl vrsta="dokument" oznaka="Odaberi dokument sa računara" opisId={polje.pomoc ? `${id}-pomoc` : undefined} onPoslano={(p, iz) => poslano(p.ime, iz)} />
        )}
      </div>
    </Okvir>
  );
}

// ── više dokumenata (prilozi) ───────────────────────────────────────────
type Prilog = { naziv: string; dokument?: string; adresa?: string };

export function DokumentiPolje({ polje, vrijednost, postavi, greska }: Svojstva<Prilog[]>) {
  const id = useId();
  const lista = vrijednost ?? [];
  const izmijeni = (i: number, p: Partial<Prilog>) => postavi(lista.map((x, j) => (j === i ? { ...x, ...p } : x)));
  return (
    <Okvir id={id} naziv={polje.naziv} pomoc={"pomoc" in polje ? polje.pomoc : undefined} greska={greska}>
      <ul className="space-y-4">
        {lista.map((d, i) => (
          <li key={i} className="admin-kartica rounded-3xl border border-line bg-sky-mist p-4 sm:p-5">
            {d.dokument ? (
              <KarticaDokumenta ime={d.dokument} onUkloni={() => postavi(lista.filter((_, j) => j !== i))} />
            ) : (
              <div className="flex items-center gap-3">
                <LinkIkona className="h-5 w-5 text-brand-strong" aria-hidden="true" />
                <span className="break-all">{d.adresa}</span>
                <button type="button" onClick={() => postavi(lista.filter((_, j) => j !== i))} className={`${MALO_DUGME} ml-auto text-red-700 hover:bg-red-50`}>
                  <Trash2 className="h-5 w-5" aria-hidden="true" /> Ukloni
                </button>
              </div>
            )}
            <label className="mt-3 block">
              <span className="text-base font-semibold text-navy">Naziv priloga na stranici</span>
              <input value={d.naziv} onChange={(e) => izmijeni(i, { naziv: e.target.value })} className={`${ULAZ} mt-1.5`} />
            </label>
          </li>
        ))}
      </ul>
      <div className={lista.length ? "mt-4" : ""}>
        <ZonaZaFajl
          vrsta="dokument"
          vise
          oznaka={lista.length ? "Dodaj još dokumenata" : "Odaberi dokumente sa računara"}
          onPoslano={(p, iz) => postavi((stari) => [...(stari ?? []), { naziv: nazivIzFajla(iz), dokument: p.ime }])}
        />
      </div>
    </Okvir>
  );
}

// ── slika ───────────────────────────────────────────────────────────────
export function SlikaPolje({ polje, vrijednost, postavi, greska }: Svojstva<string>) {
  const id = useId();
  return (
    <Okvir id={id} naziv={polje.naziv} pomoc={"pomoc" in polje ? polje.pomoc : undefined} greska={greska}>
      {vrijednost ? (
        <div className="admin-kartica flex flex-wrap items-center gap-5 rounded-3xl border border-line bg-white p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={vrijednost} alt="Odabrana slika" className="h-32 w-48 rounded-2xl bg-navy object-cover" />
          <button type="button" onClick={() => postavi("")} className={`${MALO_DUGME} text-red-700 hover:bg-red-50`}>
            <Trash2 className="h-5 w-5" aria-hidden="true" /> Ukloni sliku
          </button>
        </div>
      ) : (
        <ZonaZaFajl vrsta="slika" oznaka="Odaberi sliku sa računara" onPoslano={(p) => postavi(p.adresa)} />
      )}
    </Okvir>
  );
}

// ── lista (npr. osobe u odjelu) ─────────────────────────────────────────
export function ListaPolje({ polje, vrijednost, postavi, greska }: Svojstva<Record<string, string>[]>) {
  const id = useId();
  if (polje.vrsta !== "lista") return null;
  const lista = vrijednost ?? [];
  const pomjeri = (i: number, s: number) => {
    const n = [...lista];
    [n[i], n[i + s]] = [n[i + s], n[i]];
    postavi(n);
  };
  return (
    <Okvir id={id} naziv={polje.naziv} pomoc={polje.pomoc} greska={greska}>
      <ol className="space-y-4">
        {lista.map((s, i) => (
          <li key={i} className="admin-kartica rounded-3xl border border-line bg-sky-mist p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="font-display text-lg font-semibold text-navy">
                {i + 1}. {s[polje.polja[0].ime] || "(nova stavka)"}
              </p>
              <div className="flex flex-wrap gap-1">
                <button type="button" disabled={i === 0} onClick={() => pomjeri(i, -1)} className={`${MALO_DUGME} text-navy hover:bg-white`}>
                  <ArrowUp className="h-5 w-5" aria-hidden="true" /> Gore
                </button>
                <button type="button" disabled={i === lista.length - 1} onClick={() => pomjeri(i, 1)} className={`${MALO_DUGME} text-navy hover:bg-white`}>
                  <ArrowDown className="h-5 w-5" aria-hidden="true" /> Dolje
                </button>
                <button type="button" onClick={() => postavi(lista.filter((_, j) => j !== i))} className={`${MALO_DUGME} text-red-700 hover:bg-red-50`}>
                  <Trash2 className="h-5 w-5" aria-hidden="true" /> Ukloni
                </button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {polje.polja.map((pp) => (
                <label key={pp.ime} className="block">
                  <span className="text-base font-semibold text-navy">{pp.naziv}</span>
                  <input
                    value={s[pp.ime] ?? ""}
                    placeholder={pp.primjer ? `npr. ${pp.primjer}` : undefined}
                    onChange={(e) => postavi(lista.map((x, j) => (j === i ? { ...x, [pp.ime]: e.target.value } : x)))}
                    className={`${ULAZ} mt-1.5`}
                  />
                </label>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => postavi([...lista, Object.fromEntries(polje.polja.map((pp) => [pp.ime, ""]))])}
        className="mt-4 inline-flex min-h-14 items-center gap-2 rounded-2xl border-2 border-dashed border-brand px-5 font-display text-lg font-semibold text-brand-strong hover:bg-sky-soft"
      >
        <Plus className="h-5 w-5" aria-hidden="true" /> Dodaj {polje.stavka}
      </button>
    </Okvir>
  );
}
