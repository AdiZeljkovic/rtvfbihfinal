import { Download, ExternalLink, FileText } from "lucide-react";

export type DocItem = { label: string; href: string; format?: string };

function formatLabel(href: string, format?: string) {
  if (format) return format === "web" ? "WEB" : format.toUpperCase();
  const m = href.toLowerCase().match(/\.(pdf|docx?|xlsx?|xps)(\?|$)/);
  return m ? m[1].toUpperCase() : "WEB";
}

export default function DocList({ items, compact = false }: { items: DocItem[]; compact?: boolean }) {
  return (
    <ul className={`divide-y divide-line rounded-2xl border border-line bg-white ${compact ? "" : "shadow-[var(--shadow-card)]"}`}>
      {items.map((d) => {
        const fmt = formatLabel(d.href, d.format);
        const isWeb = fmt === "WEB";
        return (
          <li key={d.href + d.label}>
            <a
              href={d.href}
              target="_blank"
              rel="noopener"
              className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-sky-mist sm:px-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-soft text-brand">
                {isWeb ? <ExternalLink className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium leading-snug text-navy group-hover:text-brand sm:text-[0.95rem]">
                  {d.label}
                </span>
              </span>
              <span className="hidden shrink-0 items-center gap-2 text-xs font-semibold tracking-wide text-muted sm:flex">
                {fmt}
                {!isWeb && <Download className="h-4 w-4 opacity-60 group-hover:opacity-100" />}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
