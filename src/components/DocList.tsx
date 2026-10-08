import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import FileTypeIcon from "./FileTypeIcon";

export type DocItem = {
  label: string;
  href: string;
  format?: string;
  /** Mali natpis iznad naziva (npr. vrsta postupka javne nabavke) */
  nadnaslov?: string;
};

const DOKUMENT = /\.(pdf|docx?|xlsx?|xps)(\?|$)/i;

function formatLabel(href: string, format?: string) {
  if (format) return format.toUpperCase();
  const m = decodeURIComponent(href).toLowerCase().match(DOKUMENT);
  return m ? m[1].toUpperCase() : "WEB";
}

/** Lista dokumenata s pravim ikonama formata (PDF, DOC…), u stilu naslovnice */
export default function DocList({ items }: { items: DocItem[]; compact?: boolean }) {
  return (
    <ul className="overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-card)]">
      {items.map((d, i) => {
        const fmt = formatLabel(d.href, d.format);
        const jeDokument = fmt !== "WEB";
        /* interna stranica nove stranice: isti tab, bez ikone preuzimanja */
        const interna = !jeDokument && d.href.startsWith("/");
        const cls =
          "group relative flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-sky-mist sm:px-6";
        const sadrzaj = (
          <>
            <span
              aria-hidden="true"
              className="absolute inset-y-2.5 left-0 w-[3px] origin-center scale-y-0 rounded-r bg-brand transition-transform duration-300 group-hover:scale-y-100"
            />
            <FileTypeIcon
              format={fmt}
              className="h-10 w-9 shrink-0 drop-shadow-[0_3px_6px_rgba(11,37,64,0.12)] transition-transform duration-300 group-hover:-translate-y-0.5"
            />
            <span className="min-w-0 flex-1">
              {d.nadnaslov && (
                <span className="mb-0.5 block text-[0.68rem] font-semibold uppercase tracking-wider text-muted">
                  {d.nadnaslov}
                </span>
              )}
              <span className="block text-sm font-medium leading-snug text-navy group-hover:text-brand-deep sm:text-[0.95rem]">
                {d.label}
              </span>
            </span>
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-navy transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
              {jeDokument ? (
                <Download className="h-4 w-4" />
              ) : interna ? (
                <ArrowRight className="h-4 w-4" />
              ) : (
                <ArrowUpRight className="h-4 w-4" />
              )}
            </span>
          </>
        );
        return (
          <li key={d.href + d.label + i} className="border-b border-line last:border-b-0">
            {interna ? (
              <Link href={d.href} className={cls}>
                {sadrzaj}
              </Link>
            ) : (
              <a href={d.href} target="_blank" rel="noopener" className={cls}>
                {sadrzaj}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
