import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import VideoHero from "@/components/VideoHero";
import HeroStats from "@/components/HeroStats";
import { RadioSetIcon, TeletextIcon, TvIcon, WebIcon } from "@/components/StatIcons";
import Section from "@/components/Section";
import Transparentnost from "@/components/Transparentnost";
import MarketingCta from "@/components/MarketingCta";
import { site } from "@/content/site";
import { opisEmisije, programskaShema, rastaviTermin } from "@/server/sadrzaj";
import HistorijaSkala from "@/components/HistorijaSkala";

const servisi = [
  {
    icon: TvIcon,
    naziv: "Federalna televizija",
    opis: "Informativni, dokumentarni, zabavni i dječiji program. Vodeći televizijski medij u Bosni i Hercegovini od 2001. godine.",
    href: "/televizija",
    cta: "O televiziji",
  },
  {
    icon: RadioSetIcon,
    naziv: "Radio Federacije BiH",
    opis: "Brza i tačna informacija, priče o ljudima i muzika – na 15 FM frekvencija širom Federacije i uživo na internetu.",
    href: "/radio",
    cta: "O radiju",
  },
  {
    icon: WebIcon,
    naziv: "federalna.ba",
    opis: "Informativni portal javnog servisa: vijesti iz zemlje i svijeta, politika, ekonomija, sport i kultura.",
    href: site.external.federalna,
    cta: "Otvori portal",
    external: true,
  },
  {
    icon: TeletextIcon,
    naziv: "Teletext",
    opis: "Jedan od najstarijih teletekst servisa u regiji, od Olimpijskih igara 1984. Vijesti, sport i servisne informacije.",
    href: site.external.teletext,
    cta: "Otvori Teletext",
    external: true,
  },
];

export default function HomePage() {
  /* stranica je statična: broj se računa pri buildu, pa svaki deploy donese tačan */
  const godinaUEteru = new Date().getFullYear() - 1971;
  const istaknute = programskaShema()
    .filter((e) => e.naslovna)
    .map((e) => ({ ...e, ...rastaviTermin(e.termin), opis: opisEmisije(e) }));
  const glavna = istaknute.find((e) => e.glavna);
  // Ostale emisije poredane po vremenu emitovanja
  const ostale = istaknute
    .filter((e) => e !== glavna)
    .sort((a, b) => (a.vrijeme ?? "").localeCompare(b.vrijeme ?? ""));

  return (
    <>
      {/* HERO – brend animacija preko cijelog ekrana (ide ispod prozirnog headera) */}
      <section className="relative -mt-[4.5rem] flex min-h-[100svh] flex-col overflow-hidden bg-navy text-white">
        <div aria-hidden="true" className="absolute inset-0">
          <VideoHero
            framed={false}
            className="h-full w-full"
            videoClassName="scale-[1.06] object-[62%_center] lg:object-[68%_center]"
          />
        </div>
        {/* Tamni gradijent: odozdo na mobilnom, slijeva na desktopu – tekst čitljiv, logo iz animacije vidljiv */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/25 lg:bg-gradient-to-r lg:from-navy/95 lg:via-navy/55 lg:to-navy/0"
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy to-transparent" />

        <div className="container-x relative flex flex-1 flex-col justify-end pb-24 pt-[7rem] md:pt-[8rem] lg:justify-center lg:pb-28">
          <div className="max-w-2xl">
            <h1 className="fade-up fade-up-1 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-[4rem]">
              Radio-televizija
              <br />
              Federacije{" "}
              <span className="bg-gradient-to-r from-sky to-white bg-clip-text text-transparent">
                Bosne i Hercegovine
              </span>
            </h1>
            <p className="fade-up fade-up-2 mt-6 max-w-xl text-lg leading-relaxed text-white/80">
              Federalna televizija, Radio Federacije BiH, portal federalna.ba i Teletext.
              Od 2001. godine u službi građana – profesionalno, nezavisno i odgovorno.
            </p>
            <div className="fade-up fade-up-3 mt-9 flex flex-wrap items-center gap-x-4 gap-y-3">
              <Link
                href="/televizija"
                className="group inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-5 pr-1.5 font-display text-[0.95rem] font-semibold text-navy shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] transition-colors hover:bg-sky-soft"
              >
                <TvIcon className="h-5 w-5 text-brand-strong" />
                Federalna televizija
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-navy text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:bg-brand">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>

              <a
                href={site.external.radioLive}
                target="_blank"
                rel="noopener"
                className="group inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-5 py-3 font-display text-[0.95rem] font-semibold text-white backdrop-blur-md transition-colors hover:border-white/45 hover:bg-white/20"
              >
                <span aria-hidden="true" className="eq flex h-4 items-end gap-[3px]">
                  <span />
                  <span />
                  <span />
                  <span />
                </span>
                Radio uživo
              </a>

              <Link
                href="/o-nama"
                className="group inline-flex items-center gap-2 px-1 py-3 font-display text-[0.95rem] font-semibold text-white/85 transition-colors hover:text-white"
              >
                <span className="relative">
                  O javnom servisu
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-[0.35] bg-sky transition-transform duration-300 group-hover:scale-x-100" />
                </span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <HeroStats className="fade-up fade-up-3 mt-14 lg:mt-16 lg:max-w-4xl" />
        </div>

        <a
          href="#servisi"
          aria-label="Skrolaj do sadržaja"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-white/60 transition-colors hover:text-white lg:flex"
        >
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em]">Saznajte više</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </a>
      </section>

      {/* SERVISI – tamne kartice s pozadinom klijenta (public/brand/kartice-bg.webp) */}
      <Section
        id="servisi"
        eyebrow="Naši servisi"
        title="Jedan javni servis, četiri načina da nas pratite"
        lead="Televizija, radio, web i teletext – sadržaj za sve generacije, dostupan zemaljski, kablovski i online."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {servisi.map((s) => {
            const Icon = s.icon;
            const cls =
              "group relative flex min-h-[17rem] flex-col overflow-hidden rounded-3xl bg-navy p-7 shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] sm:p-8";
            const inner = (
              <>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[url(/brand/kartice-bg.webp)] bg-cover bg-right transition-transform duration-700 group-hover:scale-105"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/55 to-transparent" />
                <div className="relative flex flex-1 flex-col sm:max-w-sm">
                  <Icon className="h-10 w-10 text-sky transition-colors duration-300 group-hover:text-white" />
                  <h3 className="mt-5 font-display text-xl font-semibold text-white">{s.naziv}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/80">{s.opis}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-transform group-hover:translate-x-1">
                    {s.cta}
                    {s.external ? <ExternalLink className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </span>
                </div>
              </>
            );
            return s.external ? (
              <a key={s.naziv} href={s.href} target="_blank" rel="noopener" className={cls}>
                {inner}
              </a>
            ) : (
              <Link key={s.naziv} href={s.href} className={cls}>
                {inner}
              </Link>
            );
          })}
        </div>
      </Section>

      {/* IZ PROGRAMA – u stilu TV programske sheme */}
      <Section
        tone="mist"
        eyebrow="Iz programa Federalne televizije"
        title="Emisije koje gledate"
        lead="Izdvajamo iz aktuelne programske sheme Federalne televizije."
        actions={
          <>
            <Link href="/televizija#emisije" className="btn btn-primary">
              Sve emisije <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={site.external.teletext} target="_blank" rel="noopener" className="btn btn-ghost bg-white">
              TV program na Teletextu <ExternalLink className="h-4 w-4" />
            </a>
          </>
        }
      >
        <div className="grid gap-5 lg:grid-cols-[1fr_1.35fr]">
          {glavna && (
            <Link
              href={`/televizija/emisije/${glavna.slug}`}
              className="group relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-3xl bg-navy p-7 text-white shadow-[var(--shadow-card)] sm:p-9"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[url(/brand/kartice-bg.webp)] bg-cover bg-right opacity-70 transition-transform duration-700 group-hover:scale-105"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy via-navy/75 to-navy/30" />

              <div className="relative flex justify-end">
                <TvIcon className="h-7 w-7 text-sky" />
              </div>

              <div className="relative mt-10">
                <p className="font-display text-6xl font-bold leading-none tracking-tight tabular-nums sm:text-7xl">
                  <span className="bg-gradient-to-br from-white to-sky bg-clip-text text-transparent">{glavna.vrijeme}</span>
                </p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-sky">{glavna.dan}</p>
                <h3 className="mt-5 font-display text-3xl font-bold">{glavna.naziv}</h3>
                <p className="mt-2 max-w-sm text-white/75">{glavna.opis}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-transform group-hover:translate-x-1">
                  O emisiji <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          )}

          <ol className="overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-card)]">
            {ostale.map((e) => (
              <li key={e.naziv} className="border-b border-line last:border-b-0">
                <Link
                  href={`/televizija/emisije/${e.slug}`}
                  className="group relative grid grid-cols-[4.75rem_1fr_auto] items-center gap-4 px-5 py-5 transition-colors hover:bg-sky-mist sm:grid-cols-[6rem_1fr_auto] sm:gap-6 sm:px-7"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-3 left-0 w-[3px] origin-center scale-y-0 rounded-r bg-brand transition-transform duration-300 group-hover:scale-y-100"
                  />
                  <div>
                    <p className="font-display text-2xl font-bold leading-none tabular-nums text-navy sm:text-[1.7rem]">{e.vrijeme}</p>
                    <p className="mt-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-muted">{e.dan}</p>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="font-display text-base font-semibold text-navy sm:text-lg">{e.naziv}</h3>
                      <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-brand-strong">{e.vrsta}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted sm:line-clamp-1">{e.opis}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 -translate-x-1 text-brand-strong opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* TRANSPARENTNOST */}
      <Transparentnost />

      {/* HISTORIJA – skala radio-prijemnika (HistorijaSkala) */}
      <Section tone="mist">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <div>
            <p className="eyebrow">Naša priča</p>
            <h2 className="mt-2 text-balance text-2xl font-bold text-navy sm:text-3xl md:text-[2.1rem]">
              Više od pola stoljeća tradicije
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
              Od Radija Sarajevo 202 i Televizije Sarajevo do savremenog javnog servisa Federacije BiH.
            </p>
            <div className="mt-8 flex items-end gap-4">
              <span className="skala-broj font-display text-[5.5rem] font-bold leading-[0.8] tracking-tight tabular-nums sm:text-[7rem]">
                {godinaUEteru}
              </span>
              <span className="pb-1 font-display text-sm font-semibold uppercase leading-snug tracking-[0.14em] text-navy">
                godina
                <br />u eteru
              </span>
            </div>
            <p className="mt-4 text-sm text-muted">
              Od prve emisije Radija Sarajevo 202, 1. jula 1971. u 14.30, na srednjem valu od 202 metra.
            </p>
            <Link href="/o-nama" className="btn btn-ghost mt-7">
              Pročitajte cijeli historijat <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <HistorijaSkala />
        </div>
      </Section>

      {/* MARKETING CTA */}
      <MarketingCta />
    </>
  );
}
