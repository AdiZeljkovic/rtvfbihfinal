import { fmFrekvencije } from "@/server/sadrzaj";

/** FM predajnici Radija Federacije BiH – frekvencija krupno, kao na skali prijemnika */
export default function FmLista() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {fmFrekvencije().map((f) => (
        <li
          key={f.lokacija}
          className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-[var(--shadow-card)] transition-colors hover:border-brand/40"
        >
          {/* mini skala */}
          <div aria-hidden="true" className="flex h-3 items-end gap-[5px] opacity-70">
            {Array.from({ length: 22 }, (_, i) => (
              <span key={i} className={`w-px ${i % 5 === 0 ? "h-3 bg-brand/60" : "h-1.5 bg-line"}`} />
            ))}
          </div>
          <p className="mt-4 flex items-baseline gap-2">
            <span className="skala-broj font-display text-4xl font-bold leading-none tabular-nums">{f.mhz}</span>
            <span className="text-sm font-semibold text-muted">MHz</span>
          </p>
          <h3 className="mt-3 font-display text-lg font-semibold text-navy">{f.lokacija}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.pokriva}</p>
        </li>
      ))}
    </ul>
  );
}
