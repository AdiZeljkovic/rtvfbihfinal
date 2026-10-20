import Link from "next/link";
import { preload } from "react-dom";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import VideoHero, { type VIDEA } from "./VideoHero";

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
  /** Brend animacija u pozadini umjesto teksture – zaglavlje je tada preko cijelog ekrana, kao na naslovnici */
  video?: keyof typeof VIDEA;
  /** Uz video: sidro sekcije na koju vodi „Saznajte više“ (npr. "#cjeline") */
  dalje?: string;
};

/**
 * Tamno zaglavlje podstranice u stilu naslovnice: pozadina klijenta
 * (public/brand/kartice-bg.webp) ili brend animacija, prozirni header preko nje, stakleni brojevi.
 */
export default function PageHero({ eyebrow, title, highlight, lead, crumbs, stats, actions, video, dalje }: Props) {
  // pozadina je najveći element na vrhu (LCP): preglednik je traži odmah, ne tek kad pročita CSS
  // (poster videa traži sam VideoHero)
  if (!video) preload("/brand/kartice-bg.webp", { as: "image", fetchPriority: "high" });
  return (
    <header
      className={`relative -mt-[4.5rem] overflow-hidden bg-navy text-white ${video ? "flex min-h-[100svh] flex-col" : ""}`}
    >
      {video ? (
        <>
          <div aria-hidden="true" className="absolute inset-0">
            <VideoHero
              video={video}
              framed={false}
              className="h-full w-full"
              videoClassName="scale-[1.06] object-[62%_center] lg:object-[68%_center]"
            />
          </div>
          {/* desktop kao naslovnica: tamno slijeva, logo iz animacije vidljiv desno;
              mobilni: tekst ide preko cijele visine, pa je tamni sloj ravnomjerniji */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/65 lg:bg-gradient-to-r lg:from-navy/95 lg:via-navy/60 lg:to-navy/5"
          />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy/90 to-transparent" />
        </>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[url(/brand/kartice-bg.webp)] bg-cover bg-right opacity-70"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/40 lg:bg-gradient-to-r lg:from-navy lg:via-navy/80 lg:to-navy/20"
          />
        </>
      )}

      <div
        className={
          video
            ? // kao naslovnica: sadržaj dolje na mobilnom, po sredini ekrana na desktopu
              "container-x relative flex flex-1 flex-col justify-end pb-24 pt-[7rem] md:pt-[8rem] lg:justify-center lg:pb-28"
            : "container-x relative pb-14 pt-[7.5rem] sm:pb-16 sm:pt-[8.5rem]"
        }
      >
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
          {/* text-sky! – .eyebrow iz globals.css (van Tailwind slojeva) inače pregazi boju: tamnoplava na tamnom (kontrast 3:1) */}
          {eyebrow && <p className="eyebrow fade-up text-sky!">{eyebrow}</p>}
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
      {video && dalje && (
        <a
          href={dalje}
          aria-label="Skrolaj do sadržaja"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-white/60 transition-colors hover:text-white lg:flex"
        >
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em]">Saznajte više</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </a>
      )}
      <div className="relative h-1 w-full bg-gradient-to-r from-brand via-sky to-brand/40" />
    </header>
  );
}
