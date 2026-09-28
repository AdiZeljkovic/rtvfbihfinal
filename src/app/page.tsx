import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ExternalLink,
  FileText,
  Globe,
  Megaphone,
  Radio,
  Receipt,
  ScrollText,
  Tv,
  Users,
  Waves,
} from "lucide-react";
import VideoHero from "@/components/VideoHero";
import Section from "@/components/Section";
import { LogoMark } from "@/components/Logo";
import { site } from "@/content/site";
import { emisije } from "@/content/program";
import { timeline } from "@/content/historijat";

const servisi = [
  {
    icon: Tv,
    naziv: "Federalna televizija",
    opis: "Informativni, dokumentarni, zabavni i dječiji program. Vodeći televizijski medij u Bosni i Hercegovini od 2001. godine.",
    href: "/televizija",
    cta: "O televiziji",
    kadar: "/video/frames/kadar-1.jpg",
  },
  {
    icon: Radio,
    naziv: "Radio Federacije BiH",
    opis: "Brza i tačna informacija, priče o ljudima i muzika – na 15 FM frekvencija širom Federacije i uživo na internetu.",
    href: "/radio",
    cta: "O radiju",
    kadar: "/video/frames/kadar-2.jpg",
  },
  {
    icon: Globe,
    naziv: "federalna.ba",
    opis: "Informativni portal javnog servisa: vijesti iz zemlje i svijeta, politika, ekonomija, sport i kultura.",
    href: site.external.federalna,
    cta: "Otvori portal",
    kadar: "/video/frames/kadar-3.jpg",
    external: true,
  },
  {
    icon: Waves,
    naziv: "Teletext",
    opis: "Jedan od najstarijih teletekst servisa u regiji, od Olimpijskih igara 1984. Vijesti, sport i servisne informacije.",
    href: site.external.teletext,
    cta: "Otvori Teletext",
    kadar: "/video/frames/kadar-4.jpg",
    external: true,
  },
];

const transparentnost = [
  { icon: ScrollText, naziv: "Opći akti i izvještaji", opis: "Zakoni, statut, pravilnici, izvještaji o radu i revizorski izvještaji.", href: "/dokumenti" },
  { icon: FileText, naziv: "Javne nabavke", opis: "Planovi nabavki, obavještenja, odluke o izboru i izvještaji o postupcima.", href: "/javne-nabavke" },
  { icon: Users, naziv: "Upravni odbor", opis: "Sastav Upravnog odbora, poslovnik o radu i javna saopštenja.", href: "/o-nama/upravni-odbor" },
  { icon: Receipt, naziv: "RTV taksa", opis: "Odgovori na najčešća pitanja građana o plaćanju RTV takse.", href: "/rtv-taksa" },
];

const stats = [
  { label: "Od godine", value: "2001." },
  { label: "Servisa", value: "4" },
  { label: "FM frekvencija", value: "15" },
  { label: "Digitalnih regija", value: "9" },
];

export default function HomePage() {
  const istaknute = emisije.filter((e) => e.istaknuto).slice(0, 6);

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
            <p className="fade-up inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-sky" />
              Javni RTV servis Federacije BiH
            </p>
            <h1 className="fade-up fade-up-1 mt-6 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-[4rem]">
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
            <div className="fade-up fade-up-3 mt-9 flex flex-wrap gap-3">
              <Link href="/televizija" className="btn btn-light">
                <Tv className="h-4 w-4" /> Federalna televizija
              </Link>
              <a href={site.external.radioLive} target="_blank" rel="noopener" className="btn btn-glass">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                Radio uživo
              </a>
              <Link href="/o-nama" className="btn btn-glass">
                O javnom servisu <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <dl className="fade-up fade-up-3 mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:mt-20 lg:max-w-3xl">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl px-5 py-4">
                <dt className="text-[0.7rem] font-semibold uppercase tracking-wider text-white/60">{s.label}</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-white">{s.value}</dd>
              </div>
            ))}
          </dl>
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

      {/* SERVISI – tamne kartice s kadrovima iz brend animacije */}
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
                  className="absolute inset-0 bg-cover bg-[70%_center] opacity-60 transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${s.kadar})` }}
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/10" />
                <div className="relative flex flex-1 flex-col sm:max-w-sm">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur">
                    <Icon className="h-6 w-6" />
                  </span>
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

      {/* IZ PROGRAMA – horizontalni scroll na mobilnom, grid na desktopu */}
      <Section
        tone="mist"
        eyebrow="Iz programa Federalne televizije"
        title="Emisije koje gledate"
        lead="Izdvajamo iz aktuelne programske sheme. Kompletan pregled emisija nalazi se na stranici Televizija."
      >
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
          {istaknute.map((e) => (
            <article key={e.naziv} className="card flex min-w-[82%] snap-start flex-col p-6 sm:min-w-[60%] md:min-w-0">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-sky-soft px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-brand-deep">
                  {e.vrsta}
                </span>
                <span className="text-xs font-medium text-muted">{e.termin}</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-navy">{e.naziv}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{e.opis}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/televizija#emisije" className="btn btn-primary">
            Sve emisije <ArrowRight className="h-4 w-4" />
          </Link>
          <a href={site.external.teletext} target="_blank" rel="noopener" className="btn btn-ghost">
            TV program na Teletextu <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </Section>

      {/* TRANSPARENTNOST */}
      <Section
        eyebrow="Javni servis – javno"
        title="Transparentno poslovanje"
        lead="Kao javni servis finansiran RTV taksom, objavljujemo akte, izvještaje, revizije i sve postupke javnih nabavki."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {transparentnost.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.href} href={t.href} className="card group flex flex-col p-7">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-white transition-colors group-hover:bg-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-base font-semibold text-navy">{t.naziv}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{t.opis}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand transition-transform group-hover:translate-x-1">
                  Otvori <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* HISTORIJA – horizontalna vremenska linija */}
      <Section
        tone="mist"
        eyebrow="Naša priča"
        title="Više od pola stoljeća tradicije"
        lead="Od Radija Sarajevo 202 i Televizije Sarajevo do savremenog javnog servisa Federacije BiH."
      >
        <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <span aria-hidden="true" className="absolute left-0 right-0 top-[1.1rem] hidden h-px bg-gradient-to-r from-brand via-sky to-line lg:block" />
          {timeline.slice(0, 4).map((t, i) => (
            <li key={i} className="relative lg:pt-10">
              <span
                aria-hidden="true"
                className="absolute left-0 top-[0.6rem] hidden h-4 w-4 rounded-full border-4 border-sky-mist bg-brand lg:block"
              />
              <div className="rounded-3xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
                <span className="font-display text-3xl font-bold text-brand">{t.year}</span>
                <h3 className="mt-2 font-display font-semibold text-navy">{t.title}</h3>
                <p className="mt-1 text-sm text-muted">{t.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <Link href="/o-nama" className="mt-8 inline-flex items-center gap-1.5 font-semibold text-brand hover:underline">
          Pročitajte cijeli historijat <ArrowRight className="h-4 w-4" />
        </Link>
      </Section>

      {/* MARKETING CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-[#10365f] to-brand-deep py-20 text-white">
        <LogoMark className="pointer-events-none absolute -right-16 -top-16 h-[22rem] w-[22rem] opacity-[0.08]" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-sky/20 blur-3xl" />
        <div className="container-x relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="eyebrow text-sky">Marketing</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Oglašavajte se na javnom servisu</h2>
            <p className="mt-4 max-w-xl text-white/75">
              Televizija, radio, portal i teletext u jednom paketu. Cjenovnici usluga oglašavanja
              i sponzorstva za 2026. godinu, opšti uslovi i kontakti Odjela prodaje.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/marketing" className="btn btn-light">
              <Megaphone className="h-4 w-4" /> Cjenovnici i kontakti
            </Link>
            <Link href="/kontakt" className="btn btn-glass">
              Kontaktirajte nas
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
