import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { IconCard, PillButton, UnderlineLink } from "@/components/Tiles";
import { BoardIcon, DocsIcon, MicIcon, ReceiptIcon, ServicesIcon, TenderIcon, WebIcon } from "@/components/StatIcons";
import { site } from "@/content/site";
import { generalniDirektor } from "@/content/uprava";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Adresa, telefoni i e-mail adrese Radio-televizije Federacije Bosne i Hercegovine.",
};

const kontakti = [
  { icon: BoardIcon, naziv: "Generalni direktor", opis: generalniDirektor.ime, tel: generalniDirektor.tel, email: site.emails.direkcija },
  { icon: MicIcon, naziv: "Odnosi s javnošću", tel: "+387 (0)33 461 539", email: site.emails.press },
  { icon: WebIcon, naziv: "Redakcija federalna.ba", email: site.emails.redakcija, email2: site.emails.desk },
  { icon: ServicesIcon, naziv: "Marketing", tel: "+387 (0)33 461 512", email: "adnan.bilal@rtvfbih.ba", href: "/marketing" },
  { icon: ReceiptIcon, naziv: "RTV taksa", tel: "+387 (0)33 464 069", email: "denis.hajdarevic@rtvfbih.ba", href: "/rtv-taksa" },
  { icon: DocsIcon, naziv: "Pravni poslovi", tel: "+387 (0)33 455 131", email: "ps@rtvfbih.ba" },
  { icon: TenderIcon, naziv: "Ljudski resursi", email: "ljudski.potencijali@rtvfbih.ba", href: "/obavijesti" },
];

const tel = (t: string) => t.replace(/[^\d+]/g, "");

export default function KontaktPage() {
  const mapQuery = encodeURIComponent(`${site.address.street}, ${site.address.city}`);
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
            <PillButton href={`tel:${tel(site.phone)}`} external>
              {site.phone}
            </PillButton>
            <UnderlineLink href={`mailto:${site.emails.direkcija}`} external>
              {site.emails.direkcija}
            </UnderlineLink>
          </>
        }
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="relative overflow-hidden rounded-3xl bg-navy p-8 text-white shadow-[var(--shadow-card)] sm:p-10">
            <div aria-hidden="true" className="absolute inset-0 bg-[url(/brand/kartice-bg.jpg)] bg-cover bg-right opacity-45" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/40" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky">RTV dom Sarajevo</p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug">{site.name}</h2>
              <address className="mt-7 space-y-4 not-italic">
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-sky" />
                  <span>
                    {site.address.street}
                    <br />
                    {site.address.city}, {site.address.country}
                  </span>
                </p>
                <a href={`tel:${tel(site.phone)}`} className="flex items-center gap-3 hover:text-sky">
                  <Phone className="h-5 w-5 shrink-0 text-sky" /> {site.phone}
                </a>
                <a href={`mailto:${site.emails.direkcija}`} className="flex items-center gap-3 hover:text-sky">
                  <Mail className="h-5 w-5 shrink-0 text-sky" /> {site.emails.direkcija}
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {kontakti.map((k) => (
            <IconCard key={k.naziv} icon={k.icon} title={k.naziv} text={k.opis} href={k.href}>
              <ul className="mt-4 space-y-1.5 text-sm">
                {k.tel && (
                  <li className="flex items-center gap-2 text-ink">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-brand" /> {k.tel}
                  </li>
                )}
                {k.email && (
                  <li className="flex items-center gap-2 break-all text-brand">
                    <Mail className="h-3.5 w-3.5 shrink-0" /> {k.email}
                  </li>
                )}
                {k.email2 && (
                  <li className="flex items-center gap-2 break-all text-brand">
                    <Mail className="h-3.5 w-3.5 shrink-0" /> {k.email2}
                  </li>
                )}
              </ul>
            </IconCard>
          ))}
        </div>
      </Section>
    </>
  );
}
