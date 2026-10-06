import { TowerIcon } from "./StatIcons";
import { dvbt2Regije } from "@/content/frekvencije";

/** Devet DVB-T2 digitalnih regija Multipleksa A, s kanalom krupno */
export default function DvbRegije() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {dvbt2Regije.map((r) => (
        <li
          key={r.naziv}
          className="flex gap-5 rounded-3xl border border-line bg-white p-6 shadow-[var(--shadow-card)] transition-colors hover:border-brand/40"
        >
          <div className="shrink-0 text-center">
            <TowerIcon className="mx-auto h-8 w-8 text-brand" />
            <p className="mt-2 font-display text-3xl font-bold leading-none tabular-nums">
              <span className="skala-broj">{r.kanal}</span>
            </p>
            <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-wider text-muted">kanal</p>
          </div>
          <div className="min-w-0 border-l border-line pl-5">
            <h3 className="font-display text-lg font-semibold text-navy">{r.naziv}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">{r.podrucje}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
