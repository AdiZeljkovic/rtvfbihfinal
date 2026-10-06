"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { timeline } from "@/content/historijat";

/**
 * Historija kao skala starog radio-prijemnika: godine su „frekvencije“ na
 * skali, igla stoji na izabranom događaju, a memorijske tipke biraju događaj.
 *
 * Svih sedam događaja je uvijek u HTML-u (paneli se samo sakrivaju), pa je
 * tekst vidljiv pretraživačima i čitačima ekrana. Sama se vrti samo dok je
 * vidljiva, staje čim je posjetilac dirne, a uz „smanji pokrete“ ne vrti se.
 */

const OD = 1970;
const DO = 2026;
const KORAK_MS = 6000;
const procenat = (g: number) => ((g - OD) / (DO - OD)) * 100;
const GODINE = Array.from({ length: DO - OD + 1 }, (_, i) => OD + i);
/* na uskom ekranu samo svaka druga decenija dobija natpis */
const NATPISI = [
  { g: 1970, uvijek: true },
  { g: 1980, uvijek: false },
  { g: 1990, uvijek: true },
  { g: 2000, uvijek: false },
  { g: 2010, uvijek: true },
  { g: 2020, uvijek: false },
];

export default function HistorijaSkala() {
  const [aktivan, setAktivan] = useState(0);
  const [vidljiva, setVidljiva] = useState(false);
  const [dirnuta, setDirnuta] = useState(false);
  const [pauza, setPauza] = useState(false);
  const korijen = useRef<HTMLDivElement>(null);
  const tipke = useRef<(HTMLButtonElement | null)[]>([]);

  const svira = vidljiva && !dirnuta && !pauza;

  useEffect(() => {
    const el = korijen.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => setVidljiva(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!svira) return;
    const t = window.setTimeout(() => setAktivan((a) => (a + 1) % timeline.length), KORAK_MS);
    return () => window.clearTimeout(t);
  }, [svira, aktivan]);

  const izaberi = (i: number, fokus = false) => {
    setDirnuta(true);
    setAktivan(i);
    if (fokus) tipke.current[i]?.focus();
  };

  const naTipku = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = timeline.length;
    let i = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") i = (aktivan + 1) % n;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") i = (aktivan - 1 + n) % n;
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = n - 1;
    if (i < 0) return;
    e.preventDefault();
    izaberi(i, true);
  };

  /* ── povlačenje igle (miš i prst) ──────────────────────────────────────
     Dok se vuče, igla ide slobodno za pokazivačem, a displej pokazuje
     najbližu „stanicu“; kad se pusti, igla legne na tu stanicu.
     `touch-pan-y` na skali ostavlja vertikalno skrolanje stranice prstu. */
  const traka = useRef<HTMLDivElement>(null);
  const [vuce, setVuce] = useState<number | null>(null);

  const pomjeri = (x: number) => {
    const r = traka.current?.getBoundingClientRect();
    if (!r || r.width === 0) return;
    const g = OD + Math.min(1, Math.max(0, (x - r.left) / r.width)) * (DO - OD);
    setVuce(g);
    const i = timeline.reduce(
      (naj, d, j) => (Math.abs(d.polozaj - g) < Math.abs(timeline[naj].polozaj - g) ? j : naj),
      0
    );
    if (i !== aktivan) {
      setAktivan(i);
      /* kratak „klik“ stanice na telefonima koji to podržavaju */
      try {
        navigator.vibrate?.(5);
      } catch {}
    }
  };

  const t = timeline[aktivan];
  const igla = vuce ?? t.polozaj;

  /* dugme „Tuning“ prati iglu: od -135° do +135° */
  const ugaoTuning = -135 + procenat(igla) * 2.7;

  return (
    <div
      ref={korijen}
      onMouseEnter={() => setPauza(true)}
      onMouseLeave={() => setPauza(false)}
      className="relative min-w-0 pb-3 pt-10"
    >
      {/* ručka */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-2 h-12 w-2/5 -translate-x-1/2 rounded-t-[1.4rem] border-[7px] border-b-0 border-[#1a456f] shadow-[inset_0_2px_0_rgb(255_255_255/0.08)]"
      />
      {/* teleskopska antena */}
      <div
        aria-hidden="true"
        className="absolute right-20 top-[-3.5rem] h-28 w-[3px] origin-bottom rotate-[24deg] rounded-full bg-gradient-to-t from-[#8aa3b8] via-[#dfe9f1] to-[#9fb4c6] sm:right-24"
      >
        <span className="absolute -top-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#dfe9f1] shadow-[0_0_0_2px_rgb(11_37_64/0.15)]" />
        <span className="absolute -bottom-1 left-1/2 h-2.5 w-2 -translate-x-1/2 rounded-sm bg-[#5f7a92]" />
      </div>

      {/* kućište */}
      <div className="radio-kuciste relative overflow-hidden rounded-[2rem] p-4 text-white sm:p-6">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-5">
          {/* displej */}
          <div className="relative min-w-0 rounded-2xl bg-[#06182b] p-5 shadow-[inset_0_2px_14px_rgb(0_0_0/0.55)] ring-1 ring-inset ring-white/10 sm:p-6">
            <span aria-hidden="true" className="radio-staklo pointer-events-none absolute inset-0 rounded-2xl" />
            <div className="flex items-center justify-between gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em]">
              <span className="inline-flex items-center gap-2 text-white/80">
                <span className="skala-lampica" data-svira={svira} />
                U eteru od 1971.
              </span>
              <span className="font-mono tabular-nums text-white/45">
                M{aktivan + 1} / {timeline.length}
              </span>
            </div>

            <div className="mt-4 grid">
              {timeline.map((d, i) => (
                <div
                  key={i}
                  role="tabpanel"
                  id={`skala-panel-${i}`}
                  aria-labelledby={`skala-tipka-${i}`}
                  className={`[grid-area:1/1] transition-[opacity,transform] duration-500 ${
                    i === aktivan ? "opacity-100" : "invisible translate-y-1 opacity-0"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-xs">
                    <span className="uppercase tracking-[0.16em] text-sky">{d.opseg}</span>
                    <span className="text-white/50">{d.datum}</span>
                  </div>
                  <p className="skala-cifre mt-3 font-display text-5xl font-bold leading-none tabular-nums sm:text-6xl">
                    {d.year}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold text-white">{d.title}</h3>
                  <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-white/70">{d.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* zvučnik i dugmad */}
          <div aria-hidden="true" className="hidden flex-col items-center justify-between gap-4 sm:flex">
            <div className="radio-zvucnik h-32 w-32 rounded-full lg:h-36 lg:w-36" />
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1.5">
                <div className="radio-dugme relative h-11 w-11 rounded-full" style={{ transform: "rotate(40deg)" }}>
                  <span className="absolute left-1/2 top-1 h-3 w-0.5 -translate-x-1/2 rounded-full bg-white/80" />
                </div>
                <span className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-white/45">Volume</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="radio-dugme relative h-11 w-11 rounded-full"
                  style={{ transform: `rotate(${ugaoTuning}deg)`, transition: vuce !== null ? "none" : undefined }}
                >
                  <span className="absolute left-1/2 top-1 h-3 w-0.5 -translate-x-1/2 rounded-full bg-[#ff5a5f]" />
                </div>
                <span className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-white/45">Tuning</span>
              </div>
            </div>
          </div>
        </div>

        {/* skala iza stakla */}
        <p
          aria-hidden="true"
          className={`relative mt-5 text-right font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/40 transition-opacity duration-500 ${
            dirnuta ? "opacity-0" : ""
          }`}
        >
          ← povucite iglu →
        </p>
        {/* skala se bira i tipkama ispod (tastatura, čitač ekrana); vučenje je dodatak */}
        <div
          aria-hidden="true"
          onPointerDown={(e) => {
            if (e.pointerType === "mouse" && e.button !== 0) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            setDirnuta(true);
            pomjeri(e.clientX);
          }}
          onPointerMove={(e) => {
            if (vuce !== null) pomjeri(e.clientX);
          }}
          onPointerUp={() => setVuce(null)}
          onPointerCancel={() => setVuce(null)}
          onLostPointerCapture={() => setVuce(null)}
          className={`relative mt-1.5 touch-pan-y select-none overflow-hidden rounded-xl bg-[#06182b] px-5 pb-1 pt-3 shadow-[inset_0_2px_10px_rgb(0_0_0/0.55)] ring-1 ring-inset ring-white/10 sm:px-6 ${
            vuce !== null ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <span aria-hidden="true" className="radio-staklo pointer-events-none absolute inset-0" />
          <div ref={traka} className="relative h-16">
            <span className="absolute inset-x-0 top-7 h-px bg-white/25" />
            {GODINE.map((g) => (
              <span
                key={g}
                className={`absolute top-7 w-px -translate-x-1/2 ${
                  g % 10 === 0 ? "h-3.5 bg-white/70" : g % 5 === 0 ? "h-2.5 bg-white/45" : "h-1.5 bg-white/20"
                }`}
                style={{ left: `${procenat(g)}%` }}
              />
            ))}
            {NATPISI.map(({ g, uvijek }) => (
              <span
                key={g}
                className={`absolute top-12 -translate-x-1/2 font-mono text-[0.65rem] tabular-nums text-white/55 ${
                  uvijek ? "" : "hidden sm:block"
                }`}
                style={{ left: `${procenat(g)}%` }}
              >
                {g}
              </span>
            ))}
            <span
              className="absolute top-12 -translate-x-full font-mono text-[0.65rem] uppercase tracking-wider text-sky"
              style={{ left: "100%" }}
            >
              danas
            </span>
            {timeline.map((d, i) => (
              <span
                key={i}
                className={`absolute top-[1.5rem] h-2 w-2 -translate-x-1/2 rounded-full transition-colors duration-500 ${
                  i === aktivan ? "bg-sky shadow-[0_0_8px_rgb(135_198_221/0.9)]" : "bg-white/45"
                }`}
                style={{ left: `${procenat(d.polozaj)}%` }}
              />
            ))}
            <span
              className="skala-igla absolute -top-1 bottom-5 w-0.5 -translate-x-1/2 rounded-full"
              style={{ left: `${procenat(igla)}%`, transition: vuce !== null ? "none" : undefined }}
            >
              <span
                className={`absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-[0_0_0_4px_rgb(255_90_95/0.25)] transition-transform duration-200 ${
                  vuce !== null ? "scale-125" : ""
                }`}
              />
            </span>
          </div>
        </div>

        {/* memorijske tipke */}
        <div
          role="tablist"
          aria-label="Historija po godinama"
          onKeyDown={naTipku}
          className="relative mt-5 grid grid-cols-4 gap-2 sm:grid-cols-7"
        >
          {timeline.map((d, i) => {
            const on = i === aktivan;
            return (
              <button
                key={i}
                ref={(el) => {
                  tipke.current[i] = el;
                }}
                id={`skala-tipka-${i}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`skala-panel-${i}`}
                tabIndex={on ? 0 : -1}
                onClick={() => izaberi(i)}
                data-on={on}
                className="radio-tipka relative overflow-hidden rounded-lg px-2.5 pb-2.5 pt-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
              >
                <span className="radio-led absolute right-2 top-2 h-1.5 w-1.5 rounded-full" />
                <span className="block font-display text-base font-bold leading-none tabular-nums">{d.year}</span>
                <span
                  className={`mt-1.5 block truncate text-[0.65rem] font-semibold uppercase tracking-wider ${
                    on ? "text-sky" : "text-white/55"
                  }`}
                >
                  {d.kratko}
                </span>
                {on && svira && (
                  <span
                    key={aktivan}
                    className="skala-napredak absolute bottom-0 left-0 h-0.5 bg-sky"
                    style={{ animationDuration: `${KORAK_MS}ms` }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* natpisna pločica */}
        <div
          aria-hidden="true"
          className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-white/35"
        >
          <span>RTV FBiH · Sarajevo</span>
          <span>FM · SV · TV</span>
        </div>
      </div>

      {/* nožice */}
      <span aria-hidden="true" className="absolute bottom-0 left-12 h-3 w-12 rounded-b-lg bg-[#0a2036]" />
      <span aria-hidden="true" className="absolute bottom-0 right-12 h-3 w-12 rounded-b-lg bg-[#0a2036]" />
    </div>
  );
}
