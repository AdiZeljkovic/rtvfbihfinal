"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { timeline } from "@/content/historijat";
import { LogoMark } from "./Logo";

/**
 * Historija kao skala starog radio-prijemnika: godine su „frekvencije“ na
 * skali, igla stoji na izabranom događaju, a memorijske tipke biraju događaj.
 *
 * Svi događaji su uvijek u HTML-u (paneli se samo sakrivaju), pa je
 * tekst vidljiv pretraživačima i čitačima ekrana. Sama se vrti samo dok je
 * vidljiva, staje čim je posjetilac dirne, a uz „smanji pokrete“ ne vrti se.
 */

const OD = 1970;
/* godinu iza zadnjeg događaja, da njegova tačka stane na skalu (a ne na ivicu) */
const DO = 2027;
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
  /* MHz skala iznad godina – samo ukras, kao na pravom prijemniku */
  const MHZ = [88, 92, 96, 100, 104, 108];

  return (
    <div
      ref={korijen}
      onMouseEnter={() => setPauza(true)}
      onMouseLeave={() => setPauza(false)}
      className="relative min-w-0 pb-3 pt-12"
    >
      {/* hromirana ručka s kožnom drškom */}
      <div aria-hidden="true" className="absolute left-1/2 top-3 h-[2.6rem] w-[38%] -translate-x-1/2">
        <span className="radio-rucka absolute inset-0 rounded-t-[1.5rem]" />
        <span className="radio-rucka-hvat absolute left-[18%] right-[18%] top-[-3px] h-[13px] rounded-full" />
        <span className="radio-rucka-nosac absolute -bottom-1 left-[-6px] h-3 w-5 rounded-t-md" />
        <span className="radio-rucka-nosac absolute -bottom-1 right-[-6px] h-3 w-5 rounded-t-md" />
      </div>
      {/* teleskopska antena sa zglobovima i ležištem */}
      <div aria-hidden="true" className="absolute right-16 top-12 h-0 w-0 sm:right-24">
        <span className="radio-antena absolute bottom-0 left-[-2px] h-40 w-1 origin-bottom rotate-[22deg] rounded-full">
          <span className="absolute -top-2 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-gradient-to-br from-white to-[#9fb0c0] shadow-[0_1px_2px_rgb(0_0_0/0.3)]" />
          <span className="absolute left-1/2 top-[32%] h-1 w-[7px] -translate-x-1/2 rounded-sm bg-[#8ea0b2]" />
          <span className="absolute left-1/2 top-[62%] h-1 w-[8px] -translate-x-1/2 rounded-sm bg-[#8ea0b2]" />
        </span>
        <span className="radio-antena-lezaj absolute -left-3 -top-2 h-4 w-6 rounded-t-full" />
      </div>

      {/* kućište */}
      <div className="radio-kuciste relative rounded-[2.2rem] p-2.5 sm:p-3.5">
        {/* ventilacioni prorezi na bokovima */}
        {["left-[4px]", "right-[4px]"].map((s) => (
          <span key={s} aria-hidden="true" className={`absolute top-[34%] hidden flex-col gap-[7px] sm:flex ${s}`}>
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className="radio-prorez block h-[3px] w-[6px] rounded-full" />
            ))}
          </span>
        ))}
        {/* metalna prednja ploča */}
        <div className="radio-ploca relative overflow-hidden rounded-[1.7rem] p-4 sm:p-6">
          {/* vijci */}
          {["left-2.5 top-2.5", "right-2.5 top-2.5", "left-2.5 bottom-2.5", "right-2.5 bottom-2.5"].map((p) => (
            <span key={p} aria-hidden="true" className={`radio-vijak absolute h-2.5 w-2.5 rounded-full ${p}`} />
          ))}

          <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-6">
            {/* zvučnik sa značkom */}
            <div aria-hidden="true" className="hidden items-center justify-center sm:flex">
              <div className="relative">
                {/* zvučni talasi dok radio „svira“ */}
                {svira && (
                  <>
                    <span className="radio-talas absolute inset-0 rounded-full" />
                    <span className="radio-talas absolute inset-0 rounded-full [animation-delay:1.1s]" />
                  </>
                )}
                <div
                  data-svira={svira}
                  className="radio-zvucnik relative flex h-44 w-44 items-center justify-center rounded-full lg:h-52 lg:w-52"
                >
                  <span className="radio-znacka inline-flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-3">
                    <LogoMark tone="white" className="h-5 w-5" />
                    <span className="font-display text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#dfe9f1]">
                      RTV FBiH
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="min-w-0">
              {/* LCD displej u hromiranom okviru */}
              <div className="radio-okvir rounded-2xl p-1.5">
                <div className="radio-lcd relative overflow-hidden rounded-xl p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.18em]">
                    <span className="inline-flex items-center gap-2 text-sky/90">
                      <span className="skala-lampica" data-svira={svira} />
                      U eteru od 1971.
                    </span>
                    <span className="inline-flex items-center gap-2.5 tabular-nums text-sky/55">
                      {/* jačina signala – „uhvati“ se iznova za svaku stanicu */}
                      <span key={aktivan} aria-hidden="true" className="radio-signal flex h-3 items-end gap-[2px]">
                        <span className="h-[30%]" />
                        <span className="h-[55%]" />
                        <span className="h-[80%]" />
                        <span className="h-full" />
                      </span>
                      M{aktivan + 1}/{timeline.length}
                    </span>
                  </div>

                  <div className="mt-3 grid">
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
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-[0.7rem] uppercase tracking-[0.14em]">
                          <span className="text-sky">{d.opseg}</span>
                          <span className="text-sky/55">{d.datum}</span>
                        </div>
                        <p className="lcd-cifre relative mt-2 font-mono text-5xl font-bold leading-none tabular-nums sm:text-6xl">
                          <span aria-hidden="true" className="lcd-duh absolute inset-0">
                            8888
                          </span>
                          <span className="relative">{d.year}</span>
                        </p>
                        <h3 className="mt-3 font-display text-lg font-semibold text-white sm:text-xl">{d.title}</h3>
                        <p className="mt-1 max-w-prose text-sm leading-relaxed text-sky/75">{d.text}</p>
                      </div>
                    ))}
                  </div>
                  {/* kratki „šum“ pri promjeni stanice */}
                  <span key={`sum-${aktivan}`} aria-hidden="true" className="lcd-sum pointer-events-none absolute inset-0" />
                  <span aria-hidden="true" className="radio-staklo pointer-events-none absolute inset-0" />
                </div>
              </div>
            </div>

              {/* dugmad – zaseban red, da zvučnik bude centriran samo prema ekranu */}
              <div className="hidden items-end justify-end gap-6 sm:col-start-2 sm:-mt-1 sm:flex">
                {[
                  { naziv: "Volume", ugao: 40, boja: "bg-navy", aktivno: false },
                  { naziv: "Tuning", ugao: ugaoTuning, boja: "bg-[#e5484d]", aktivno: true },
                ].map((k) => {
                  const dugme = (
                    <span className="relative flex h-[4.6rem] w-[4.6rem] items-center justify-center">
                      <span className="radio-dugme-skala absolute inset-0 rounded-full" />
                      <span
                        className="radio-dugme relative block h-14 w-14 rounded-full"
                        style={{
                          transform: `rotate(${k.ugao}deg)`,
                          transition: k.aktivno && vuce !== null ? "none" : undefined,
                        }}
                      >
                        <span className={`absolute left-1/2 top-1.5 h-3.5 w-1 -translate-x-1/2 rounded-full ${k.boja}`} />
                      </span>
                    </span>
                  );
                  const natpis = (
                    <span
                      aria-hidden="true"
                      className="radio-gravura font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em]"
                    >
                      {k.naziv}
                    </span>
                  );
                  return k.aktivno ? (
                    <button
                      key={k.naziv}
                      type="button"
                      onClick={() => izaberi((aktivan + 1) % timeline.length)}
                      aria-label="Sljedeća godina"
                      title="Okrenite na sljedeću godinu"
                      className="radio-dugme-btn group flex flex-col items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                    >
                      {dugme}
                      {natpis}
                    </button>
                  ) : (
                    <div key={k.naziv} aria-hidden="true" className="flex flex-col items-center gap-2">
                      {dugme}
                      {natpis}
                    </div>
                  );
                })}
              </div>
          </div>

          {/* skala iza stakla */}
          <p
            aria-hidden="true"
            className={`radio-gravura relative mt-5 text-right font-mono text-[0.6rem] font-semibold uppercase tracking-[0.18em] transition-opacity duration-500 ${
              dirnuta ? "opacity-0" : ""
            }`}
          >
            ← povucite iglu →
          </p>
          {/* skala se bira i tipkama ispod (tastatura, čitač ekrana); vučenje je dodatak */}
          <div className="radio-okvir mt-1.5 rounded-2xl p-1.5">
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
              className={`radio-skala relative touch-pan-y select-none overflow-hidden rounded-xl px-5 pb-1 pt-2 sm:px-6 ${
                vuce !== null ? "cursor-grabbing" : "cursor-grab"
              }`}
            >
              {/* MHz traka */}
              <div className="relative h-5 font-mono text-[0.6rem] tabular-nums text-white/40">
                {MHZ.map((m, i) => (
                  <span
                    key={m}
                    className="absolute top-0 -translate-x-1/2"
                    style={{ left: `${(i / (MHZ.length - 1)) * 100}%` }}
                  >
                    {m}
                  </span>
                ))}
              </div>

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
                    className={`absolute top-12 -translate-x-1/2 font-mono text-[0.65rem] tabular-nums text-white/60 ${
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
                {/* svjetlo iza igle */}
                <span
                  aria-hidden="true"
                  className="skala-sjaj pointer-events-none absolute -top-8 bottom-0 w-24 -translate-x-1/2"
                  style={{ left: `${procenat(igla)}%`, transition: vuce !== null ? "none" : undefined }}
                />
                <span
                  className="skala-igla absolute -top-6 bottom-5 w-0.5 -translate-x-1/2 rounded-full"
                  style={{ left: `${procenat(igla)}%`, transition: vuce !== null ? "none" : undefined }}
                >
                  <span
                    className={`absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-[0_0_0_4px_rgb(255_90_95/0.25)] transition-transform duration-200 ${
                      vuce !== null ? "scale-125" : ""
                    }`}
                  />
                </span>
              </div>
              <span aria-hidden="true" className="radio-staklo pointer-events-none absolute inset-0" />
            </div>
          </div>

          {/* memorijske tipke boje slonovače */}
          <div
            role="tablist"
            aria-label="Historija po godinama"
            onKeyDown={naTipku}
            /* osam tipki u redu kad je radio širok; na lg je radio u užoj koloni pored teksta – dva reda */
            className="relative mt-5 grid grid-cols-4 gap-2 sm:grid-cols-8 lg:grid-cols-4 xl:grid-cols-8"
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
                  className="radio-tipka relative overflow-hidden rounded-md px-2 pb-2.5 pt-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <span className="radio-led absolute right-2 top-2 h-1.5 w-1.5 rounded-full" />
                  <span className="block font-display text-base font-bold leading-none tabular-nums">{d.year}</span>
                  {/* zbijena slova, da „1 kanal“ i „Portal“ stanu cijeli i s osam tipki u redu */}
                  <span
                    className={`mt-1.5 block truncate text-[0.6rem] font-semibold uppercase ${
                      on ? "text-brand-deep" : "text-navy/50"
                    }`}
                  >
                    {d.kratko}
                  </span>
                  {on && svira && (
                    <span
                      key={aktivan}
                      className="skala-napredak absolute bottom-0 left-0 h-0.5 bg-brand"
                      style={{ animationDuration: `${KORAK_MS}ms` }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* gravirani natpisi */}
          <div
            aria-hidden="true"
            className="radio-gravura mt-5 flex items-center justify-between px-4 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.24em]"
          >
            <span>RTV FBiH · Sarajevo</span>
            <span>FM · SV · TV</span>
          </div>
        </div>
      </div>

      {/* sjena podloge i gumene nožice */}
      <span aria-hidden="true" className="radio-sjena absolute -bottom-3 left-[6%] right-[6%] h-6 rounded-[50%]" />
      <span aria-hidden="true" className="radio-nozica absolute bottom-0 left-12 h-3 w-14 rounded-b-xl" />
      <span aria-hidden="true" className="radio-nozica absolute bottom-0 right-12 h-3 w-14 rounded-b-xl" />
    </div>
  );
}
