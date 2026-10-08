"use client";

import { Contrast } from "lucide-react";
import { usePostavke } from "./AdminOkvir";

const OZNAKE = [
  { tekst: "A", opis: "Normalna veličina teksta", klasa: "text-sm" },
  { tekst: "A+", opis: "Veći tekst", klasa: "text-base" },
  { tekst: "A++", opis: "Najveći tekst", klasa: "text-lg" },
];

/** Veličina teksta i visoki kontrast – uvijek vidljivo u zaglavlju admina */
export default function Pristupacnost({ tamno = false }: { tamno?: boolean }) {
  const { velicina, kontrast, postaviVelicinu, postaviKontrast } = usePostavke();
  const dugme = (aktivno: boolean) =>
    `inline-flex h-11 min-w-11 items-center justify-center rounded-xl px-2.5 font-display font-bold transition-colors ${
      aktivno
        ? tamno
          ? "bg-white text-navy"
          : "bg-navy text-white"
        : tamno
          ? "text-white hover:bg-white/10"
          : "text-navy hover:bg-sky-soft"
    }`;

  return (
    <div className="flex items-center gap-1.5">
      <div role="group" aria-label="Veličina teksta" className={`flex items-center gap-1 rounded-2xl p-1 ${tamno ? "bg-white/10" : "bg-white ring-1 ring-line"}`}>
        {OZNAKE.map((o, i) => (
          <button
            key={o.tekst}
            type="button"
            aria-pressed={velicina === i}
            aria-label={o.opis}
            title={o.opis}
            onClick={() => postaviVelicinu(i)}
            className={`${dugme(velicina === i)} ${o.klasa}`}
          >
            {o.tekst}
          </button>
        ))}
      </div>
      <button
        type="button"
        aria-pressed={kontrast}
        onClick={() => postaviKontrast(!kontrast)}
        title="Jači kontrast boja"
        className={`${dugme(kontrast)} gap-2 px-3.5 text-sm ${tamno && !kontrast ? "bg-white/10" : ""} ${!tamno && !kontrast ? "bg-white ring-1 ring-line" : ""}`}
      >
        <Contrast className="h-5 w-5" aria-hidden="true" />
        <span className="hidden sm:inline">Kontrast</span>
      </button>
    </div>
  );
}
