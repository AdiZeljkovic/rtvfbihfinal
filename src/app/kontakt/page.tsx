import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { site } from "@/content/site";
import { generalniDirektor } from "@/content/uprava";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Adresa, telefoni i e-mail adrese Radio-televizije Federacije Bosne i Hercegovine.",
};

const kontakti = [
  { naziv: "Direkcija RTVFBiH", tel: site.phone, email: site.emails.direkcija },
  { naziv: "Generalni direktor", opis: generalniDirektor.ime, tel: generalniDirektor.tel },
  { naziv: "Odnosi s javnošću", tel: "+387 (0)33 461 539", email: site.emails.press },
  { naziv: "Redakcija federalna.ba", email: site.emails.redakcija, email2: site.emails.desk },
  { naziv: "Marketing", tel: "+387 (0)33 461 512", email: "adnan.bilal@rtvfbih.ba", href: "/marketing" },
  { naziv: "RTV taksa", tel: "+387 (0)33 464 069", email: "denis.hajdarevic@rtvfbih.ba", href: "/rtv-taksa" },
  { naziv: "Pravni poslovi", tel: "+387 (0)33 455 131", email: "ps@rtvfbih.ba" },
  { naziv: "Ljudski resursi", email: "ljudski.potencijali@rtvfbih.ba", href: "/obavijesti" },
];

export default function KontaktPage() {
  const mapQuery = encodeURIComponent(`${site.address.street}, ${site.address.city}`);
  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title="Kontaktirajte nas"
        lead="Radio-televizija Federacije Bosne i Hercegovine nalazi se u RTV domu u Sarajevu. Za uredništva i redakcije pogledajte stranicu Organizacija."
        crumbs={[{ label: "Kontakt" }]}
      />

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="card p-6 sm:p-8">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-soft text-brand">
              <Building2 className="h-6 w-6" />
            </span>
            <h2 className="mt-5 font-display text-xl font-bold text-navy">{site.name}</h2>
            <address className="mt-5 space-y-3 text-[0.95rem] not-italic">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.city}, {site.address.country}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-brand" />
                <a href={`tel:${site.phoneHref}`} className="hover:text-brand">
                  {site.phone}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-brand" />
                <a href={`mailto:${site.emails.direkcija}`} className="text-brand hover:underline">
                  {site.emails.direkcija}
                </a>
              </p>
            </address>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noopener"
              className="btn btn-ghost mt-6"
            >
              Otvori na mapi <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line bg-sky-mist">
            <iframe
              title="Mapa – RTV dom Sarajevo"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed&hl=bs`}
              className="h-full min-h-[22rem] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </Section>

      <Section tone="mist" eyebrow="Službe" title="Direktni kontakti">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {kontakti.map((k) => (
            <div key={k.naziv} className="card flex flex-col p-5">
              <p className="font-display font-semibold text-navy">{k.naziv}</p>
              {k.opis && <p className="text-sm text-muted">{k.opis}</p>}
              <ul className="mt-3 flex-1 space-y-1.5 text-sm">
                {k.tel && (
                  <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-brand" /> {k.tel}</li>
                )}
                {k.email && (
                  <li className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-brand" />
                    <a href={`mailto:${k.email}`} className="break-all text-brand hover:underline">{k.email}</a>
                  </li>
                )}
                {k.email2 && (
                  <li className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-brand" />
                    <a href={`mailto:${k.email2}`} className="break-all text-brand hover:underline">{k.email2}</a>
                  </li>
                )}
              </ul>
              {k.href && (
                <Link href={k.href} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
                  Više <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
        <Link href="/o-nama/organizacija" className="mt-8 inline-flex items-center gap-1.5 font-semibold text-brand hover:underline">
          Sva uredništva i redakcije <ArrowRight className="h-4 w-4" />
        </Link>
      </Section>
    </>
  );
}
