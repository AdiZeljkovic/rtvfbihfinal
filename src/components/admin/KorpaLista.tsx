"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CircleCheck, Trash2, Undo2 } from "lucide-react";
import { obrisiTrajno, vratiIzKorpe } from "@/app/admin/akcije";
import Potvrda from "./Potvrda";

type Stavka = { id: number; vrsta: string; naslov: string; kada: string; ko: string };

export default function KorpaLista({ stavke }: { stavke: Stavka[] }) {
  const router = useRouter();
  const [radi, start] = useTransition();
  const [zaBrisanje, setZaBrisanje] = useState<Stavka | null>(null);
  const [poruka, setPoruka] = useState("");

  const radnja = (fn: () => Promise<void>, tekst: string) =>
    start(async () => {
      await fn();
      setPoruka(tekst);
      router.refresh();
    });

  return (
    <>
      <p aria-live="polite" className={poruka ? "mb-5 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-lg font-semibold text-emerald-900" : "sr-only"}>
        {poruka && <CircleCheck className="h-6 w-6 shrink-0" aria-hidden="true" />}
        {poruka}
      </p>
      {stavke.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-line bg-white p-12 text-center">
          <Trash2 className="mx-auto h-12 w-12 text-sky" aria-hidden="true" />
          <p className="mt-4 font-display text-2xl font-semibold text-navy">Korpa je prazna.</p>
          <p className="mt-1 text-lg text-muted">Ovdje se pojavi sve što obrišete, pa to možete vratiti.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {stavke.map((s) => (
            <li key={s.id} className="admin-kartica flex flex-col gap-3 rounded-3xl border border-line bg-white p-4 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:p-5">
              <div className="min-w-0 flex-1">
                <p className="break-words font-display text-lg font-semibold text-navy">{s.naslov}</p>
                <p className="text-base text-muted">
                  {s.vrsta} · obrisano {s.kada}
                  {s.ko ? ` (${s.ko})` : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={radi}
                  onClick={() => radnja(() => vratiIzKorpe(s.id), `„${s.naslov}“ je vraćeno na stranicu.`)}
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-navy px-4 font-semibold text-white hover:bg-brand-deep"
                >
                  <Undo2 className="h-5 w-5" aria-hidden="true" /> Vrati na stranicu
                  <span className="sr-only">: {s.naslov}</span>
                </button>
                <button
                  type="button"
                  disabled={radi}
                  onClick={() => setZaBrisanje(s)}
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl px-3 font-semibold text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" aria-hidden="true" /> Obriši zauvijek
                  <span className="sr-only">: {s.naslov}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Potvrda
        otvoreno={Boolean(zaBrisanje)}
        naslov="Obrisati zauvijek?"
        tekst={
          <>
            <strong className="text-navy">{zaBrisanje?.naslov}</strong>
            <br />
            Ovo se ne može poništiti.
          </>
        }
        potvrdi="Da, obriši zauvijek"
        opasno
        onPotvrdi={() => {
          const s = zaBrisanje!;
          radnja(() => obrisiTrajno(s.id), `„${s.naslov}“ je obrisano zauvijek.`);
        }}
        onZatvori={() => setZaBrisanje(null)}
      />
    </>
  );
}
