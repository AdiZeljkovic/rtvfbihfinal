import Link from "next/link";
import type { ArhivaLink, Blok } from "@/content/arhiva";
import { docUrl } from "@/lib/doc";
import DocList from "./DocList";

/** Adresa linka iz uvezenog sadržaja */
/** Vanjska adresa upisana bez https:// (npr. www.fbih.gov.ba) dobije ga, da link radi */
const saProtokolom = (h: string) => (h && !/^([a-z]+:|\/|#)/i.test(h) ? `https://${h}` : h);

export const hrefLinka = (l: { doc?: string; ruta?: string; href?: string }) =>
  l.doc ? docUrl(l.doc) : (l.ruta ?? saProtokolom(l.href ?? ""));

/* „Član 12.“, „POGLAVLJE II“, „I – OPĆE ODREDBE“… su naslovi odjeljaka */
const jeClan = (t: string) => /^(član|članak|clan)\s+\d+/i.test(t);

function InlineLink({ l }: { l: ArhivaLink }) {
  const href = hrefLinka(l);
  const tekst = l.tekst || l.doc || href;
  if (!href) return <>{tekst}</>;
  if (l.ruta) {
    return (
      <Link href={href} className="font-medium text-brand-strong underline-offset-4 hover:underline">
        {tekst}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener" className="font-medium text-brand-strong underline-offset-4 hover:underline">
      {tekst}
    </a>
  );
}

/**
 * Prikaz sadržaja prenesenog sa stare stranice: naslovi, pasusi, tabele,
 * slike i linkovi (dokumenti se prikazuju kao lista s ikonama formata).
 */
export default function ArhivaBlokovi({ blokovi }: { blokovi: Blok[] }) {
  const out: React.ReactNode[] = [];
  let dokumenti: { label: string; href: string }[] = [];

  const ispisiDokumente = (k: string) => {
    if (dokumenti.length) {
      out.push(
        <div key={`d-${k}`} className="not-prose my-6">
          <DocList items={dokumenti} />
        </div>
      );
      dokumenti = [];
    }
  };

  blokovi.forEach((b, i) => {
    // uzastopni linkovi koji su samo dokumenti → jedna lista
    if (b.t === "linkovi" && b.stavke.every((s) => s.doc) && !b.prefiks) {
      b.stavke.forEach((s) => dokumenti.push({ label: s.tekst || s.doc!, href: docUrl(s.doc!) }));
      return;
    }
    ispisiDokumente(String(i));

    switch (b.t) {
      case "naslov":
        out.push(
          jeClan(b.tekst) ? (
            <h3 key={i} className="mt-10 font-display text-base font-bold uppercase tracking-wide text-brand-deep">
              {b.tekst}
            </h3>
          ) : (
            <h2 key={i} className="mt-10 font-display text-xl font-bold text-navy">
              {b.tekst}
            </h2>
          )
        );
        break;
      case "pasus":
        out.push(
          <p key={i} className="mt-3 leading-relaxed text-ink">
            {b.tekst}
          </p>
        );
        break;
      case "linkovi":
        out.push(
          <p key={i} className="mt-3 leading-relaxed text-ink">
            {b.prefiks && <span className="mr-1.5">{b.prefiks}</span>}
            {b.stavke.map((s, j) => (
              <span key={j}>
                {j > 0 && " · "}
                <InlineLink l={s} />
              </span>
            ))}
          </p>
        );
        break;
      case "tabela":
        out.push(
          <div key={i} className="not-prose my-6 overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full text-sm">
              <tbody>
                {b.redovi.map((r, j) => (
                  <tr key={j} className={`border-t border-line first:border-t-0 ${j === 0 ? "bg-sky-mist font-semibold text-navy" : ""}`}>
                    {r.map((c, k) => (
                      <td key={k} className="px-4 py-2.5 align-top">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        break;
      case "slika": {
        // eslint-disable-next-line @next/next/no-img-element
        const img = <img src={b.src} alt="" loading="lazy" className="h-auto max-w-full rounded-2xl" />;
        out.push(
          <figure key={i} className="not-prose my-6">
            {b.ruta ? <Link href={b.ruta}>{img}</Link> : b.doc ? <a href={docUrl(b.doc)}>{img}</a> : img}
          </figure>
        );
        break;
      }
    }
  });
  ispisiDokumente("kraj");

  return <div className="arhiva-tekst">{out}</div>;
}
