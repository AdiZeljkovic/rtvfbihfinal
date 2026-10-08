"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type EmisijaUShemi = { naziv: string; slug: string; termin: string; vrsta: string; opis: string };

/** Iz slobodnog teksta termina izvlači vrijeme (HH:MM) i dan za prikaz u shemi */
function rastavi(e: EmisijaUShemi) {
  const vrijeme = e.termin.match(/\d{1,2}:\d{2}/)?.[0];
  const dan = e.termin.split(/ u |,|\s\d/)[0].trim();
  const dodatak = /uživo/i.test(e.termin) ? "uživo" : undefined;
  return { vrijeme, dan, dodatak };
}

export default function EmisijeLista({ emisije }: { emisije: EmisijaUShemi[] }) {
  const vrste = useMemo(() => Array.from(new Set(emisije.map((e) => e.vrsta).filter(Boolean))), [emisije]);
  const [filter, setFilter] = useState<string | null>(null);

  const prikaz = useMemo(
    () =>
      emisije
        .filter((e) => !filter || e.vrsta === filter)
        .map((e) => ({ e, ...rastavi(e) }))
        .sort((a, b) => (a.vrijeme ?? "99").localeCompare(b.vrijeme ?? "99")),
    [emisije, filter]
  );

  const chip = (aktivan: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
      aktivan ? "bg-navy text-white" : "border border-line bg-white text-navy hover:border-brand hover:text-brand"
    }`;

  return (
    <div>
      <div role="group" aria-label="Filtriraj po vrsti programa" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        <button type="button" aria-pressed={!filter} onClick={() => setFilter(null)} className={`shrink-0 ${chip(!filter)}`}>
          Sve <span className="ml-1 opacity-60">{emisije.length}</span>
        </button>
        {vrste.map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={filter === v}
            onClick={() => setFilter(v)}
            className={`shrink-0 ${chip(filter === v)}`}
          >
            {v}
          </button>
        ))}
      </div>

      <ul className="mt-6 grid gap-3 lg:grid-cols-2">
        {prikaz.map(({ e, vrijeme, dan, dodatak }) => (
          <li
            key={e.naziv}
            className="group relative grid grid-cols-[5.25rem_1fr] items-start gap-4 overflow-hidden rounded-2xl border border-line bg-white px-5 py-5 shadow-[var(--shadow-card)] transition-colors hover:border-brand/40 sm:grid-cols-[6rem_1fr] sm:gap-5 sm:px-6"
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-3 left-0 w-[3px] origin-center scale-y-0 rounded-r bg-brand transition-transform duration-300 group-hover:scale-y-100"
            />
            <div>
              <p className="font-display text-2xl font-bold leading-none tabular-nums text-navy">{vrijeme ?? "—"}</p>
              <p className="mt-1.5 text-[0.68rem] font-semibold uppercase leading-snug tracking-wider text-muted">{dan}</p>
              {dodatak && (
                <p className="mt-1.5 inline-flex items-center gap-1 text-[0.68rem] font-semibold uppercase tracking-wider text-red-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> {dodatak}
                </p>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="font-display text-lg font-semibold text-navy">
                  <Link href={`/televizija/emisije/${e.slug}`} className="after:absolute after:inset-0 hover:text-brand-deep">
                    {e.naziv}
                  </Link>
                </h3>
                <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-brand">{e.vrsta}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted">{e.opis}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
