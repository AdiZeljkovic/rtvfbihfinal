"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, CircleCheck, ExternalLink, Pencil, Search, Trash2, Undo2, X } from "lucide-react";
import { pomjeriZapis, uKorpu, vratiIzKorpe } from "@/app/admin/akcije";
import Potvrda from "./Potvrda";
import { ULAZ } from "./Polja";

export type Red = { id: number; naslov: string; podnaslov: string; filter: string; naStranici: string };

const KORAK = 40;
const normalizuj = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "dj");

export default function ListaZapisa({
  kljuc,
  redovi,
  filterNaziv,
  filterOpcije,
  pocetniFilter = "",
  jednina,
}: {
  kljuc: string;
  redovi: Red[];
  filterNaziv?: string;
  filterOpcije?: string[];
  pocetniFilter?: string;
  jednina: string;
}) {
  const router = useRouter();
  const [trazi, setTrazi] = useState("");
  const [filter, setFilter] = useState(pocetniFilter);
  const [prikazano, setPrikazano] = useState(KORAK);
  const [zaBrisanje, setZaBrisanje] = useState<Red | null>(null);
  const [obavijest, setObavijest] = useState<{ tekst: string; vrati?: number } | null>(null);
  const [radi, start] = useTransition();

  const vidljivi = useMemo(() => {
    const t = normalizuj(trazi.trim());
    return redovi.filter(
      (r) => (!filter || r.filter === filter) && (!t || normalizuj(`${r.naslov} ${r.podnaslov}`).includes(t))
    );
  }, [redovi, trazi, filter]);
  const mozePomjerati = !trazi && !filter;

  const radnja = (fn: () => Promise<void>, poruka?: { tekst: string; vrati?: number }) =>
    start(async () => {
      await fn();
      if (poruka) setObavijest(poruka);
      router.refresh();
    });

  return (
    <div>
      {/* pretraga i filter */}
      <div className="admin-kartica grid gap-4 rounded-[1.75rem] border border-line bg-white p-5 shadow-[var(--shadow-card)] sm:p-6 md:grid-cols-[1fr_auto]">
        <label className="block">
          <span className="font-display text-lg font-semibold text-navy">Pretraga</span>
          <span className="relative mt-2 block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={trazi}
              onChange={(e) => {
                setTrazi(e.target.value);
                setPrikazano(KORAK);
              }}
              placeholder="Upišite dio naziva…"
              className={`${ULAZ} pl-13`}
            />
          </span>
        </label>
        {filterOpcije && filterOpcije.length > 1 && (
          <label className="block">
            <span className="font-display text-lg font-semibold text-navy">{filterNaziv}</span>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPrikazano(KORAK);
              }}
              className={`${ULAZ} mt-2 md:min-w-64`}
            >
              <option value="">Sve</option>
              {filterOpcije.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      <p aria-live="polite" className="mt-6 text-lg text-muted">
        {vidljivi.length === redovi.length
          ? `Ukupno: ${redovi.length}`
          : `Pronađeno: ${vidljivi.length} od ${redovi.length}`}
        {!mozePomjerati && vidljivi.length > 1 && (
          <span className="block text-base">Redoslijed se mijenja kada su pretraga i filter isključeni.</span>
        )}
      </p>

      {vidljivi.length === 0 ? (
        <div className="mt-4 rounded-3xl border-2 border-dashed border-line bg-white p-10 text-center">
          <p className="font-display text-xl font-semibold text-navy">Ništa nije pronađeno.</p>
          {(trazi || filter) && (
            <button
              type="button"
              onClick={() => {
                setTrazi("");
                setFilter("");
              }}
              className="mt-4 min-h-12 rounded-xl px-4 text-lg font-semibold text-brand underline"
            >
              Prikaži sve
            </button>
          )}
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {vidljivi.slice(0, prikazano).map((r, i) => (
            <li
              key={r.id}
              className="admin-kartica flex flex-col gap-3 rounded-3xl border border-line bg-white p-4 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:p-5"
            >
              <Link href={`/admin/${kljuc}/${r.id}`} className="group min-w-0 flex-1 rounded-xl">
                <span className="block break-words font-display text-lg font-semibold leading-snug text-navy group-hover:text-brand">
                  {r.naslov || "(bez naziva)"}
                </span>
                {r.podnaslov && <span className="mt-0.5 block text-base text-muted">{r.podnaslov}</span>}
              </Link>
              <div className="flex flex-wrap items-center gap-1.5">
                <Link
                  href={`/admin/${kljuc}/${r.id}`}
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-navy px-4 font-semibold text-white hover:bg-brand-deep"
                >
                  <Pencil className="h-5 w-5" aria-hidden="true" /> Uredi
                  <span className="sr-only">: {r.naslov}</span>
                </Link>
                {mozePomjerati && (
                  <>
                    <button
                      type="button"
                      disabled={i === 0 || radi}
                      onClick={() => radnja(() => pomjeriZapis(r.id, -1))}
                      aria-label={`Pomjeri gore: ${r.naslov}`}
                      title="Pomjeri gore"
                      className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-navy hover:bg-sky-soft disabled:opacity-30"
                    >
                      <ArrowUp className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      disabled={i === vidljivi.length - 1 || radi}
                      onClick={() => radnja(() => pomjeriZapis(r.id, 1))}
                      aria-label={`Pomjeri dolje: ${r.naslov}`}
                      title="Pomjeri dolje"
                      className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-navy hover:bg-sky-soft disabled:opacity-30"
                    >
                      <ArrowDown className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </>
                )}
                <a
                  href={r.naStranici}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Pogledaj na stranici: ${r.naslov}`}
                  title="Pogledaj na stranici"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-brand hover:bg-sky-soft"
                >
                  <ExternalLink className="h-6 w-6" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={() => setZaBrisanje(r)}
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl px-3 font-semibold text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" aria-hidden="true" /> Obriši
                  <span className="sr-only">: {r.naslov}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {vidljivi.length > prikazano && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setPrikazano((p) => p + KORAK)}
            className="min-h-14 rounded-2xl border-2 border-line bg-white px-8 font-display text-lg font-semibold text-navy hover:border-brand"
          >
            Prikaži još ({vidljivi.length - prikazano} preostalo)
          </button>
        </div>
      )}

      <Potvrda
        otvoreno={Boolean(zaBrisanje)}
        naslov={`Obrisati ${jednina}?`}
        tekst={
          <>
            <strong className="text-navy">{zaBrisanje?.naslov}</strong>
            <br />
            Stavka ide u korpu i više se ne vidi na stranici. Iz korpe je možete vratiti kad god želite.
          </>
        }
        potvrdi="Da, obriši"
        opasno
        onPotvrdi={() => {
          const r = zaBrisanje!;
          radnja(() => uKorpu(r.id), { tekst: `„${r.naslov}“ je premješteno u korpu.`, vrati: r.id });
        }}
        onZatvori={() => setZaBrisanje(null)}
      />

      {/* obavijest s mogućnošću poništavanja */}
      <div aria-live="polite" className="fixed inset-x-4 bottom-4 z-40 flex justify-center">
        {obavijest && (
          <div className="flex w-full max-w-2xl flex-wrap items-center gap-3 rounded-3xl bg-navy p-4 pl-6 text-lg text-white shadow-2xl">
            <CircleCheck className="h-6 w-6 shrink-0 text-sky" aria-hidden="true" />
            <p className="min-w-0 flex-1">{obavijest.tekst}</p>
            {obavijest.vrati && (
              <button
                type="button"
                onClick={() => {
                  const id = obavijest.vrati!;
                  radnja(() => vratiIzKorpe(id), { tekst: "Vraćeno na stranicu." });
                }}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-4 font-semibold text-navy hover:bg-sky-soft"
              >
                <Undo2 className="h-5 w-5" aria-hidden="true" /> Poništi
              </button>
            )}
            <button
              type="button"
              onClick={() => setObavijest(null)}
              aria-label="Zatvori obavijest"
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl hover:bg-white/10"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
