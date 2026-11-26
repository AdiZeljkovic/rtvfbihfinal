import { Fragment } from "react";
import { CircleAlert, Lightbulb } from "lucide-react";
import { UPUTSTVO, type DioUputstva } from "@/cms/uputstvo";
import SLIKE from "@/cms/uputstvo-slike.json";

/** Boja oznaka na slikama (isti narandžasti krug s brojem kao na snimcima ekrana) */
const OZNAKA = "#E8590C";

/** „Kliknite **Sačuvaj**“ → natpis dugmeta podebljan */
function Tekst({ tekst }: { tekst: string }) {
  return (
    <>
      {tekst.split(/\*\*(.+?)\*\*/g).map((d, i) =>
        i % 2 ? (
          <strong key={i} className="font-semibold text-navy">
            {d}
          </strong>
        ) : (
          <Fragment key={i}>{d}</Fragment>
        )
      )}
    </>
  );
}

export function BrojOznake({ broj, malo = false }: { broj: number; malo?: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{ background: OZNAKA }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white ${malo ? "h-6 w-6 text-sm" : "h-8 w-8 text-base"}`}
    >
      {broj}
    </span>
  );
}

function Dio({ d, stampa }: { d: DioUputstva; stampa: boolean }) {
  switch (d.t) {
    case "p":
      return (
        <p className="uputstvo-blok">
          <Tekst tekst={d.tekst} />
        </p>
      );
    case "koraci":
      return (
        <ol className="uputstvo-blok space-y-3">
          {d.stavke.map((s, i) => (
            <li key={i} className="flex gap-4">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy font-display text-base font-bold text-white">
                {i + 1}
              </span>
              <span className="pt-0.5">
                <Tekst tekst={s} />
              </span>
            </li>
          ))}
        </ol>
      );
    case "lista":
      return (
        <ul className="uputstvo-blok list-disc space-y-2 pl-8 marker:text-brand-strong">
          {d.stavke.map((s, i) => (
            <li key={i}>
              <Tekst tekst={s} />
            </li>
          ))}
        </ul>
      );
    case "slika": {
      const s = (SLIKE as Record<string, { w: number; h: number }>)[d.id];
      return (
        <figure className="uputstvo-blok uputstvo-slika">
          {/* klik otvara sliku u punoj veličini (na telefonu se može zumirati) */}
          <a href={`/uputstvo/${d.id}.webp`} target="_blank" rel="noopener" className="block" aria-label={`${d.opis} – otvori sliku u punoj veličini`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- statični snimci ekrana, poznatih dimenzija */}
            <img
              src={`/uputstvo/${d.id}.webp`}
              alt={d.opis}
              width={s?.w}
              height={s?.h}
              loading={stampa ? "eager" : "lazy"}
              className="h-auto w-full rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]"
            />
          </a>
          {!stampa && <span className="mt-2 block text-sm text-muted">Kliknite na sliku da je otvorite u punoj veličini.</span>}
          <figcaption className="mt-3">
            <span className="block text-base font-semibold text-muted">Slika: {d.opis}</span>
            {d.oznake && (
              <ol className="mt-3 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {d.oznake.map((o, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <BrojOznake broj={i + 1} malo />
                    <span className="leading-snug">{o}</span>
                  </li>
                ))}
              </ol>
            )}
          </figcaption>
        </figure>
      );
    }
    case "savjet":
    case "pazi": {
      const savjet = d.t === "savjet";
      const Ikona = savjet ? Lightbulb : CircleAlert;
      return (
        <div
          className={`uputstvo-blok flex gap-4 rounded-2xl border-2 p-5 ${savjet ? "border-sky bg-sky-mist" : "border-amber-500 bg-amber-50"}`}
        >
          <Ikona className={`mt-0.5 h-7 w-7 shrink-0 ${savjet ? "text-brand-strong" : "text-amber-700"}`} aria-hidden="true" />
          <p>
            <strong className="font-semibold text-navy">{savjet ? "Savjet: " : "Pažnja: "}</strong>
            <Tekst tekst={d.tekst} />
          </p>
        </div>
      );
    }
    case "tabela":
      return (
        <div className="uputstvo-blok overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full border-collapse text-left">
            <thead className="bg-sky-mist">
              <tr>
                {d.zaglavlje.map((z) => (
                  <th key={z} scope="col" className="px-5 py-3 font-display font-semibold text-navy">
                    {z}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {d.redovi.map(([a, b]) => (
                <tr key={a} className="align-top">
                  <th scope="row" className="w-2/5 px-5 py-3 font-semibold text-navy">
                    <Tekst tekst={a} />
                  </th>
                  <td className="px-5 py-3">
                    <Tekst tekst={b} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

/** Sva poglavlja uputstva. `stampa` = verzija za PDF (bez linkova „na vrh“, slike odmah) */
export default function UputstvoSadrzaj({ stampa = false }: { stampa?: boolean }) {
  return (
    <div className="uputstvo text-lg leading-relaxed text-ink">
      {UPUTSTVO.map((p, i) => (
        <section key={p.id} id={p.id} aria-labelledby={`n-${p.id}`} className="uputstvo-poglavlje scroll-mt-6">
          <p className="font-display text-base font-semibold uppercase tracking-[0.12em] text-brand-strong">Poglavlje {i + 1}</p>
          <h2 id={`n-${p.id}`} className="mt-1 font-display text-3xl font-bold leading-tight text-navy">
            {p.naslov}
          </h2>
          <p className="mt-2 text-xl text-muted">{p.ukratko}</p>
          <div className="mt-6 space-y-6">
            {p.dijelovi.map((d, j) => (
              <Dio key={j} d={d} stampa={stampa} />
            ))}
          </div>
          {!stampa && (
            <p className="mt-8">
              <a href="#sadrzaj-uputstva" className="text-base font-semibold text-brand-strong hover:underline">
                ↑ Nazad na sadržaj
              </a>
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
