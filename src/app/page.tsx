import Link from "next/link";
import {
  ArrowRight,
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
  },
  {
    icon: Radio,
    naziv: "Radio Federacije BiH",
    opis: "Brza i tačna informacija, priče o ljudima i muzika – na 15 FM frekvencija širom Federacije i uživo na internetu.",
    href: "/radio",
    cta: "O radiju",
  },
  {
    icon: Globe,
    naziv: "federalna.ba",
    opis: "Informativni portal javnog servisa: vijesti iz zemlje i svijeta, politika, ekonomija, sport i kultura.",
    href: site.external.federalna,
    cta: "Otvori portal",
    external: true,
  },
  {
    icon: Waves,
    naziv: "Teletext",
    opis: "Jedan od najstarijih teletekst servisa u regiji, od Olimpijskih igara 1984. Vijesti, sport i servisne informacije.",
    href: site.external.teletext,
    cta: "Otvori Teletext",
    external: true,
  },
];

const transparentnost = [
  { icon: ScrollText, naziv: "Opći akti i izvještaji", opis: "Zakoni, statut, pravilnici, izvještaji o radu i revizorski izvještaji.", href: "/dokumenti" },
  { icon: FileText, naziv: "Javne nabavke", opis: "Planovi nabavki, obavještenja, odluke o izboru i izvještaji o postupcima.", href: "/javne-nabavke" },
  { icon: Users, naziv: "Upravni odbor", opis: "Sastav Upravnog odbora, poslovnik o radu i javna saopštenja.", href: "/o-nama/upravni-odbor" },
  { icon: Receipt, naziv: "RTV taksa", opis: "Odgovori na najčešća pitanja građana o plaćanju RTV takse.", href: "/rtv-taksa" },
];

export default function HomePage() {
  const istaknute = emisije.filter((e) => e.istaknuto).slice(0, 6);

  return (
    <>
      {/* HERO – brend animacija */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-soft via-white to-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-sky/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 bottom-0 h-[24rem] w-[24rem] rounded-full bg-brand/10 blur-3xl"
        />
        <div className="container-x relative grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_1.2fr] lg:gap-14 lg:py-20">
          <div className="max-w-xl">
            <p className="eyebrow fade-up">Javni RTV servis Federacije Bosne i Hercegovine</p>
            <h1 className="fade-up fade-up-1 mt-4 text-4xl font-bold leading-[1.08] text-navy sm:text-5xl lg:text-[3.4rem]">
              Radio-televizija Federacije{" "}
              <span className="bg-gradient-to-r from-brand to-steel bg-clip-text text-transparent">
                Bosne i Hercegovine
              </span>
            </h1>
            <p className="fade-up fade-up-2 mt-5 text-lg leading-relaxed text-muted">
              Federalna televizija, Radio Federacije BiH, portal federalna.ba i Teletext.
              Od 2001. godine u službi građana – profesionalno, nezavisno i odgovorno.
            </p>
            <div className="fade-up fade-up-3 mt-8 flex flex-wrap gap-3">
              <Link href="/televizija" className="btn btn-primary">
                <Tv className="h-4 w-4" /> Federalna televizija
              </Link>
              <a href={site.external.radioLive} target="_blank" rel="noopener" className="btn btn-ghost">
                <Radio className="h-4 w-4" /> Radio uživo
              </a>
              <Link href="/o-nama" className="btn btn-ghost">
                O javnom servisu <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <dl className="fade-up fade-up-3 mt-10 grid grid-cols-3 gap-4 border-t border-line pt-6">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">Od godine</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-navy">2001.</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">Servisa</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-navy">4</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">FM frekvencija</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-navy">15</dd>
              </div>
            </dl>
          </div>

          <div className="relative min-w-0">
            <div
              aria-hidden="true"
              className="absolute -inset-3 -z-10 rounded-[1.75rem] bg-gradient-to-br from-sky/50 via-white to-brand/20 blur-xl"
            />
            <VideoHero className="aspect-video w-full" />
          </div>
        </div>
      </section>

      {/* SERVISI */}
      <Section
        eyebrow="Naši servisi"
        title="Jedan javni servis, četiri načina da nas pratite"
        lead="Televizija, radio, web i teletext – sadržaj za sve generacije, dostupan zemaljski, kablovski i online."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {servisi.map((s) => {
            const Icon = s.icon;
            const inner = (
              <>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-soft text-brand">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-navy">{s.naziv}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.opis}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                  {s.cta}
                  {s.external ? <ExternalLink className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </span>
              </>
            );
            return s.external ? (
              <a key={s.naziv} href={s.href} target="_blank" rel="noopener" className="card flex flex-col p-6">
                {inner}
              </a>
            ) : (
              <Link key={s.naziv} href={s.href} className="card flex flex-col p-6">
                {inner}
              </Link>
            );
          })}
        </div>
      </Section>

      {/* IZ PROGRAMA */}
      <Section
        tone="mist"
        eyebrow="Iz programa Federalne televizije"
        title="Emisije koje gledate"
        lead="Izdvajamo iz aktuelne programske sheme. Kompletan pregled emisija nalazi se na stranici Televizija."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {istaknute.map((e) => (
            <article key={e.naziv} className="card flex flex-col p-6">
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
              <Link key={t.href} href={t.href} className="card group flex flex-col p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-white transition-colors group-hover:bg-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-base font-semibold text-navy">{t.naziv}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.opis}</p>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* HISTORIJA – kratka vremenska linija */}
      <Section
        tone="mist"
        eyebrow="Naša priča"
        title="Više od pola stoljeća tradicije"
        lead="Od Radija Sarajevo 202 i Televizije Sarajevo do savremenog javnog servisa Federacije BiH."
      >
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {timeline.slice(0, 4).map((t, i) => (
            <li key={i} className="relative rounded-2xl border border-line bg-white p-5">
              <span className="font-display text-2xl font-bold text-brand">{t.year}</span>
              <h3 className="mt-2 font-display font-semibold text-navy">{t.title}</h3>
              <p className="mt-1 text-sm text-muted">{t.text}</p>
            </li>
          ))}
        </ol>
        <Link href="/o-nama" className="mt-8 inline-flex items-center gap-1.5 font-semibold text-brand hover:underline">
          Pročitajte cijeli historijat <ArrowRight className="h-4 w-4" />
        </Link>
      </Section>

      {/* MARKETING CTA */}
      <section className="relative overflow-hidden bg-navy py-16 text-white sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand/30 blur-3xl"
        />
        <div className="container-x relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="eyebrow text-sky">Marketing</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Oglašavajte se na javnom servisu</h2>
            <p className="mt-3 max-w-xl text-white/75">
              Televizija, radio, portal i teletext u jednom paketu. Cjenovnici usluga oglašavanja
              i sponzorstva za 2026. godinu, opšti uslovi i kontakti Odjela prodaje.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/marketing" className="btn btn-light">
              <Megaphone className="h-4 w-4" /> Cjenovnici i kontakti
            </Link>
            <Link href="/kontakt" className="btn border border-white/30 text-white hover:bg-white/10">
              Kontaktirajte nas
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
