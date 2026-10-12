import Link from "next/link";
import { preload } from "react-dom";
import type { ReactNode } from "react";

type Crumb = { label: string; href?: string };
type Stat = { value: string | number; label: string };

type Props = {
  eyebrow?: string;
  title: string;
  /** Dio naslova koji se ispisuje u plavom gradijentu (kao na naslovnici) */
  highlight?: string;
  lead?: string;
  crumbs?: Crumb[];
  /** Staklena traka s brojevima na dnu zaglavlja */
  stats?: Stat[];
  /** Dugmad ispod uvoda */
  actions?: ReactNode;
};

/**
 * Tamno zaglavlje podstranice u stilu naslovnice: pozadina klijenta
 * (public/brand/kartice-bg.webp), prozirni header preko nje, stakleni brojevi.
 */
export default function PageHero({ eyebrow, title, highlight, lead, crumbs, stats, actions }: Props) {
  // pozadina je najveći element na vrhu (LCP): preglednik je traži odmah, ne tek kad pročita CSS
  preload("/brand/kartice-bg.webp", { as: "image", fetchPriority: "high" });
  return (
    <header className="relative -mt-[4.5rem] overflow-hidden bg-navy text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url(/brand/kartice-bg.webp)] bg-cover bg-right opacity-70"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/40 lg:bg-gradient-to-r lg:from-navy lg:via-navy/80 lg:to-navy/20"
      />

      <div className="container-x relative pb-14 pt-[7.5rem] sm:pb-16 sm:pt-[8.5rem]">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Navigacija" className="mb-6 text-sm text-white/60">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-white">
                  Početna
                </Link>
              </li>
              {crumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="text-white/30">
                    /
                  </span>
                  {c.href ? (
                    <Link href={c.href} className="hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-white">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="max-w-3xl">
          {eyebrow && <p className="eyebrow fade-up text-sky">{eyebrow}</p>}
          <h1 className="fade-up fade-up-1 mt-3 text-balance text-4xl font-bold leading-[1.06] sm:text-5xl lg:text-[3.4rem]">
            {title}
            {highlight && (
              <>
                {" "}
                <span className="bg-gradient-to-r from-sky to-white bg-clip-text text-transparent">{highlight}</span>
              </>
            )}
          </h1>
          {lead && (
            <p className="fade-up fade-up-2 mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">{lead}</p>
          )}
          {actions && <div className="fade-up fade-up-3 mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">{actions}</div>}
        </div>

        {stats && stats.length > 0 && (
          <dl
            className={`glass fade-up fade-up-3 relative mt-12 grid grid-cols-2 overflow-hidden rounded-3xl ${
              stats.length >= 4 ? "lg:grid-cols-4" : stats.length === 3 ? "sm:grid-cols-3" : ""
            } lg:max-w-4xl`}
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-sky/80 to-transparent"
            />
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col-reverse px-5 py-5 sm:px-6 ${i > 0 ? "border-l border-white/10" : ""} ${
                  stats.length >= 4 && i === 2 ? "max-lg:border-l-0" : ""
                } ${stats.length >= 4 && i >= 2 ? "max-lg:border-t max-lg:border-white/10" : ""} ${
                  stats.length === 3 && i === 2 ? "max-sm:col-span-2 max-sm:border-l-0 max-sm:border-t max-sm:border-white/10" : ""
                }`}
              >
                <dt className="mt-1.5 text-sm text-white/65">{s.label}</dt>
                <dd className="font-display text-3xl font-bold leading-none tabular-nums sm:text-4xl">
                  <span className="bg-gradient-to-br from-white via-white to-sky bg-clip-text text-transparent">{s.value}</span>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      <div className="relative h-1 w-full bg-gradient-to-r from-brand via-sky to-brand/40" />
    </header>
  );
}
