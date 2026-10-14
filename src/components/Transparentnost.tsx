import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import Section from "./Section";
import FileTypeIcon from "./FileTypeIcon";
import { BoardIcon, DocsIcon, ReceiptIcon, TenderIcon } from "./StatIcons";
import { godineNabavki } from "@/content/javne-nabavke";
import { docUrl } from "@/lib/doc";
import { clanoviUO, dokumenti, najnovijaNabavka, pitanja, rutaArhivirana } from "@/server/sadrzaj";

const AKTI = ["Zakoni i statut", "Uređivačka načela", "Pravilnici", "Programski planovi", "Izvještaji o radu", "Revizorski izvještaji"];

/** Brojevi se računaju iz stvarnog sadržaja, pa se sami ažuriraju */
const oblasti = () => [
  {
    icon: DocsIcon,
    broj: AKTI.reduce((n, k) => n + dokumenti(k).length, 0),
    jedinica: "dokumenata",
    naziv: "Opći akti i izvještaji",
    opis: "Zakoni, statut, pravilnici, izvještaji o radu i revizorski izvještaji.",
    href: "/dokumenti",
  },
  {
    icon: TenderIcon,
    broj: godineNabavki().length,
    jedinica: "godina arhive",
    naziv: "Javne nabavke",
    opis: "Planovi nabavki, obavještenja, odluke o izboru i izvještaji o postupcima.",
    href: "/javne-nabavke",
  },
  {
    icon: BoardIcon,
    broj: clanoviUO().length,
    jedinica: "člana",
    naziv: "Upravni odbor",
    opis: "Sastav Upravnog odbora, poslovnik o radu i javna saopštenja.",
    href: "/o-nama/upravni-odbor",
  },
  {
    icon: ReceiptIcon,
    broj: pitanja().length,
    jedinica: "odgovora",
    naziv: "RTV taksa",
    opis: "Odgovori na najčešća pitanja građana o plaćanju RTV takse.",
    href: "/rtv-taksa",
  },
].filter((o) => !rutaArhivirana(o.href));

/** Prvi dokument u svakoj listi je najnoviji (nove objave idu na vrh) */
function najnovije() {
  const nabavka = najnovijaNabavka();
  return [
    { kategorija: "Izvještaj o radu", ...dokumenti("Izvještaji o radu")[0] },
    { kategorija: "Revizija", ...dokumenti("Revizorski izvještaji")[0] },
    nabavka && { kategorija: "Javne nabavke", label: nabavka.naziv, href: docUrl(nabavka.dokument) },
  ].filter((d): d is { kategorija: string; label: string; href: string } => Boolean(d?.label));
}

const format = (href: string) =>
  decodeURIComponent(href).toLowerCase().match(/\.(pdf|docx?|xps)$/)?.[1]?.toUpperCase() ?? "WEB";

export default function Transparentnost() {
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.4fr] lg:gap-14">
        {/* Lijevo: uvod + najnovije objave */}
        <div className="flex flex-col">
          <p className="eyebrow">Javni servis – javno</p>
          <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl md:text-[2.1rem]">Transparentno poslovanje</h2>
          <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
            Kao javni servis finansiran RTV taksom, objavljujemo akte, izvještaje, revizije i sve
            postupke javnih nabavki.
          </p>

          <div className="mt-8 rounded-3xl bg-navy p-6 text-white sm:p-7 lg:mt-auto">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky">Najnovije objave</p>
              <Link href="/dokumenti" className="text-xs font-semibold text-white/70 hover:text-white">
                Svi dokumenti
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-white/10">
              {najnovije().map((d) => (
                <li key={d.href}>
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener"
                    className="group flex items-center gap-4 py-3.5"
                  >
                    <FileTypeIcon
                      format={format(d.href)}
                      onDark
                      className="h-10 w-9 shrink-0 drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:-translate-y-0.5"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.68rem] font-semibold uppercase tracking-wider text-white/50">
                        {d.kategorija}
                      </span>
                      <span className="mt-0.5 block text-sm font-medium leading-snug text-white/90 group-hover:text-white">
                        {d.label}
                      </span>
                    </span>
                    <Download className="mt-1 h-4 w-4 shrink-0 text-white/40 transition-colors group-hover:text-sky" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Desno: oblasti s brojevima */}
        <div className="grid gap-5 sm:grid-cols-2">
          {oblasti().map((o) => {
            const Icon = o.icon;
            return (
              <Link
                key={o.href}
                href={o.href}
                className="group relative flex flex-col overflow-hidden rounded-3xl sm:odd:last:col-span-2 border border-line bg-white p-7 shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[var(--shadow-card-hover)]"
              >
                {/* Blagi plavi sjaj u uglu na hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky/0 blur-2xl transition-colors duration-500 group-hover:bg-sky/30"
                />
                <div className="relative flex items-start justify-between">
                  <Icon className="h-10 w-10 text-brand-strong" />
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-navy transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <p className="relative mt-7 flex items-baseline gap-2">
                  <span className="font-display text-4xl font-bold leading-none tabular-nums text-navy">{o.broj}</span>
                  <span className="text-sm font-medium text-muted">{o.jedinica}</span>
                </p>
                <h3 className="relative mt-3 font-display text-lg font-semibold text-navy">{o.naziv}</h3>
                <p className="relative mt-1.5 flex-1 text-sm leading-relaxed text-muted">{o.opis}</p>
                <span className="relative mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-strong">
                  Otvori
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
