import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail, Phone } from "lucide-react";
import { RadioSetIcon, TeletextIcon, TvIcon, WebIcon } from "./StatIcons";
import { cjenovnik as nadjiCjenovnik, marketingOdjeli, telHref } from "@/server/sadrzaj";

/** Cjenovnik po kanalu – traži se po dijelu naziva među cjenovnicima u CMS-u */
const cjenovnik = (dio: string) => nadjiCjenovnik(dio, "/marketing#cjenovnici");

const kanali = () => [
  { icon: TvIcon, naziv: "Televizija", opis: "Spotovi i sponzorstva", href: cjenovnik("CPP cjenovnik") },
  { icon: RadioSetIcon, naziv: "Radio", opis: "15 FM frekvencija", href: cjenovnik("Radio Federacije BiH 2026") },
  { icon: WebIcon, naziv: "Portal", opis: "Banner oglašavanje", href: cjenovnik("web portal") },
  { icon: TeletextIcon, naziv: "Teletext", opis: "Oglasne stranice", href: cjenovnik("Teletekstu") },
];

export default function MarketingCta() {
  const direktor = marketingOdjeli().rukovodstvo[0];
  const telefon = (direktor?.telefon ?? "").split(",")[0].trim();

  return (
    <section className="relative overflow-hidden bg-navy text-white">
      {/* Pozadina klijenta preko cijele širine, logo desno */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url(/brand/kartice-bg.webp)] bg-cover bg-right opacity-60"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-navy via-navy/90 to-navy/60 lg:bg-gradient-to-r lg:from-navy lg:via-navy/85 lg:to-navy/30"
      />
      <div className="container-x relative">
        <div className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          {/* Lijevo: poruka, dugmad, kontakt */}
          <div>
            <p className="eyebrow text-sky">Marketing</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              Oglašavajte se na
              <br />
              <span className="bg-gradient-to-r from-sky to-white bg-clip-text text-transparent">javnom servisu</span>
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-white/75">
              Televizija, radio, portal i teletext u jednom paketu. Cjenovnici usluga oglašavanja i
              sponzorstva za 2026. godinu, opšti uslovi i kontakti Odjela prodaje.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href="/marketing"
                className="group inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-5 pr-1.5 font-display text-[0.95rem] font-semibold text-navy transition-colors hover:bg-sky-soft"
              >
                Cjenovnici i uslovi
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-navy text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:bg-brand">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <Link
                href="/marketing#kontakti"
                className="group inline-flex items-center gap-2 py-3 font-display text-[0.95rem] font-semibold text-white/85 transition-colors hover:text-white"
              >
                <span className="relative">
                  Odjel prodaje
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-[0.35] bg-sky transition-transform duration-300 group-hover:scale-x-100" />
                </span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {direktor && (
            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/50">Direktan kontakt</p>
              <p className="mt-2 font-display font-semibold">
                {direktor.ime}
                <span className="ml-2 text-sm font-normal text-white/60">Sektor marketinga</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1.5 text-sm">
                <a href={telHref(telefon)} className="inline-flex items-center gap-2 text-white/80 hover:text-white">
                  <Phone className="h-4 w-4 text-sky" /> {telefon}
                </a>
                <a href={`mailto:${direktor.email}`} className="inline-flex items-center gap-2 text-white/80 hover:text-white">
                  <Mail className="h-4 w-4 text-sky" /> {direktor.email}
                </a>
              </div>
            </div>
            )}
          </div>

          {/* Desno: kanali s cjenovnicima */}
          <div className="flex items-center">
            <ul className="grid w-full grid-cols-2 gap-3 sm:gap-4">
              {kanali().map((k) => {
                const Icon = k.icon;
                return (
                  <li key={k.naziv}>
                    <a
                      href={k.href}
                      target="_blank"
                      rel="noopener"
                      className="glass group flex h-full flex-col rounded-2xl p-5 transition-colors hover:border-white/35 hover:bg-white/15"
                    >
                      <div className="flex items-start justify-between">
                        <Icon className="h-8 w-8 text-sky transition-colors group-hover:text-white" />
                        <ArrowUpRight className="h-4 w-4 text-white/40 transition-colors group-hover:text-white" />
                      </div>
                      <p className="mt-6 font-display text-lg font-semibold">{k.naziv}</p>
                      <p className="text-sm text-white/60">{k.opis}</p>
                      <p className="mt-3 text-[0.68rem] font-semibold uppercase tracking-wider text-sky">Cjenovnik 2026.</p>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
