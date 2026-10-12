"use client";

import { useEffect, useRef } from "react";

/**
 * Jednostavan prozor za potvrdu (npr. „Da li sigurno želite obrisati?“).
 * Koristi ugrađeni <dialog>, pa radi s tastaturom (Esc zatvara) i čitačem ekrana.
 */
export default function Potvrda({
  otvoreno,
  naslov,
  tekst,
  potvrdi,
  odustani = "Ne, vrati se",
  opasno = false,
  onPotvrdi,
  onZatvori,
}: {
  otvoreno: boolean;
  naslov: string;
  tekst?: React.ReactNode;
  potvrdi: string;
  odustani?: string;
  opasno?: boolean;
  onPotvrdi: () => void;
  onZatvori: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (otvoreno && !d.open) d.showModal();
    if (!otvoreno && d.open) d.close();
  }, [otvoreno]);

  return (
    <dialog
      ref={ref}
      onClose={onZatvori}
      aria-labelledby="potvrda-naslov"
      className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-3xl bg-white p-0 text-ink shadow-2xl backdrop:bg-navy/60"
    >
      <div className="p-7 sm:p-8">
        <h2 id="potvrda-naslov" className="font-display text-2xl font-bold text-navy">
          {naslov}
        </h2>
        {tekst && <div className="mt-3 text-lg leading-relaxed text-muted">{tekst}</div>}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            autoFocus
            onClick={onZatvori}
            className="min-h-14 rounded-2xl border-2 border-line bg-white px-6 font-display text-lg font-semibold text-navy hover:border-navy"
          >
            {odustani}
          </button>
          <button
            type="button"
            onClick={() => {
              onPotvrdi();
              onZatvori();
            }}
            className={`min-h-14 rounded-2xl px-6 font-display text-lg font-semibold text-white ${
              opasno ? "bg-red-700 hover:bg-red-800" : "bg-brand-strong hover:bg-brand-deep"
            }`}
          >
            {potvrdi}
          </button>
        </div>
      </div>
    </dialog>
  );
}
