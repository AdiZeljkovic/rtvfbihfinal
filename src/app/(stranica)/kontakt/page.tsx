import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Email, Telefoni } from "@/components/KontaktLinkovi";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { IconCard, PillButton, UnderlineLink } from "@/components/Tiles";
import { BoardIcon, DocsIcon, MicIcon, ReceiptIcon, ServicesIcon, TenderIcon } from "@/components/StatIcons";
import { site } from "@/content/site";
import { kontaktJedinice, kontaktKartice, osnovno, rutaArhivirana, telHref } from "@/server/sadrzaj";
import { rastaviTelefone } from "@/lib/telefon";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Adresa, telefoni i e-mail adrese Radio-televizije Federacije Bosne i Hercegovine.",
};

type Kontakt = { icon: (p: { className?: string }) => React.ReactNode; naziv: string; opis?: string; tel?: string; email?: string; email2?: string; href?: string };

/** Ikona i stranica službe prema nazivu kartice (naziv i kontakte urednik upisuje u Organizaciji) */
const VRSTE: { uzorak: RegExp; icon: Kontakt["icon"]; href?: string }[] = [
  { uzorak: /marketing|oglaš/i, icon: ServicesIcon, href: "/marketing" },
  { uzorak: /taks/i, icon: ReceiptIcon, href: "/rtv-taksa" },
  { uzorak: /javnost|medij|press|komunikac/i, icon: MicIcon },
  { uzorak: /prav/i, icon: DocsIcon },
  { uzorak: /ljud|kadrov|zapošlj|konkurs/i, icon: TenderIcon, href: "/obavijesti" },
];

export default function KontaktPage() {
  const o = osnovno();
  const kontakti: Kontakt[] = [
    { icon: BoardIcon, naziv: "Generalni direktor", opis: o.generalniDirektor, tel: o.telefonDirektor, email: o.emailDirekcija },
    // ostale kartice: jedinice iz Organizacije kojima je upisana „Kartica na stranici Kontakt“
    ...kontaktKartice().map((j): Kontakt => {
      const k = kontaktJedinice(j);
      const vrsta = VRSTE.find((v) => v.uzorak.test(j.kontaktNaziv)) ?? VRSTE.find((v) => v.uzorak.test(j.naziv));
      // kontakt ostaje i kad je stranica službe arhivirana, samo bez linka
      const href = vrsta?.href && !rutaArhivirana(vrsta.href) ? vrsta.href : undefined;
      return { icon: vrsta?.icon ?? ServicesIcon, naziv: j.kontaktNaziv, tel: rastaviTelefone(k.telefon)[0], email: k.email, href };
    }),
  ];
  const mapQuery = encodeURIComponent(`${o.adresa}, ${o.grad}`);
  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title="Kontaktirajte"
        highlight="nas"
        lead="Radio-televizija Federacije Bosne i Hercegovine nalazi se u RTV domu u Sarajevu. Za uredništva i redakcije pogledajte stranicu Organizacija."
        crumbs={[{ label: "Kontakt" }]}
        actions={
          <>
            <PillButton href={telHref(o.telefon)} external>
              {o.telefon}
            </PillButton>
            <UnderlineLink href={`mailto:${o.emailDirekcija}`} external>
              {o.emailDirekcija}
            </UnderlineLink>
          </>
        }
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="relative overflow-hidden rounded-3xl bg-navy p-8 text-white shadow-[var(--shadow-card)] sm:p-10">
            <div aria-hidden="true" className="absolute inset-0 bg-[url(/brand/kartice-bg.webp)] bg-cover bg-right opacity-45" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/40" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky">RTV dom Sarajevo</p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug">{site.name}</h2>
              <address className="mt-7 space-y-4 not-italic">
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-sky" />
                  <span>
                    {o.adresa}
                    <br />
                    {o.grad}, {site.address.country}
                  </span>
                </p>
                <a href={telHref(o.telefon)} className="flex items-center gap-3 hover:text-sky">
                  <Phone className="h-5 w-5 shrink-0 text-sky" /> {o.telefon}
                </a>
                <a href={`mailto:${o.emailDirekcija}`} className="flex items-center gap-3 hover:text-sky">
                  <Mail className="h-5 w-5 shrink-0 text-sky" /> {o.emailDirekcija}
                </a>
              </address>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-5 pr-1.5 font-display text-[0.95rem] font-semibold text-navy transition-colors hover:bg-sky-soft"
              >
                Otvori na mapi
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-navy text-white transition-colors group-hover:bg-brand">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-line bg-sky-mist shadow-[var(--shadow-card)]">
            <iframe
              title="Mapa – RTV dom Sarajevo"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed&hl=bs`}
              className="h-full min-h-[24rem] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </Section>

      <Section
        tone="mist"
        eyebrow="Službe"
        title="Direktni kontakti"
        actions={
          <UnderlineLink href="/o-nama/organizacija" dark={false}>
            Sva uredništva i redakcije
          </UnderlineLink>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Kartica nije link: telefon i e-mail se moraju moći dodirnuti (poziv / pošta),
              a stranica službe ima svoj link ispod */}
          {kontakti.map((k) => (
            <IconCard key={`${k.naziv}-${k.email}`} icon={k.icon} title={k.naziv} text={k.opis}>
              <ul className="mt-4 space-y-1.5 text-sm">
                {k.tel && (
                  <li className="flex items-center gap-2 text-ink">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-brand-strong" />
                    <span>
                      <Telefoni tel={k.tel} className="hover:text-brand-strong" />
                    </span>
                  </li>
                )}
                {[k.email, k.email2].filter(Boolean).map((m) => (
                  <li key={m} className="flex items-center gap-2 text-brand-strong">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <a href={`mailto:${m}`} className="min-w-0 [overflow-wrap:anywhere] hover:underline">
                      <Email email={m!} />
                    </a>
                  </li>
                ))}
              </ul>
              {k.href && (
                <Link
                  href={k.href}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-strong hover:text-brand-deep"
                >
                  Više o službi <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </IconCard>
          ))}
        </div>
      </Section>
    </>
  );
}
