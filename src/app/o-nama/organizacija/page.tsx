import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { organizacija, type Jedinica } from "@/content/uprava";

export const metadata: Metadata = {
  title: "Organizacija i uredništva",
  description: "Sektori, odjeli i redakcije Radio-televizije Federacije BiH s kontakt podacima urednika i rukovodilaca.",
};

function Kontakt({ tel, email }: { tel?: string; email?: string }) {
  if (!tel && !email) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
      {tel && (
        <span className="inline-flex items-center gap-1.5 text-ink">
          <Phone className="h-3.5 w-3.5 text-brand" /> {tel}
        </span>
      )}
      {email && (
        <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 text-brand hover:underline">
          <Mail className="h-3.5 w-3.5" /> {email}
        </a>
      )}
    </div>
  );
}

function JedinicaBlok({ j, level = 0 }: { j: Jedinica; level?: number }) {
  return (
    <div className={level === 0 ? "" : "mt-4 border-l-2 border-sky pl-4 sm:pl-5"}>
      <h3
        className={`font-display font-semibold text-navy ${
          level === 0 ? "text-xl" : level === 1 ? "text-base" : "text-sm"
        }`}
      >
        {j.naziv}
      </h3>
      <Kontakt tel={j.tel} email={j.email} />
      {j.osobe && (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {j.osobe.map((o) => (
            <li key={o.ime + (o.uloga ?? "")} className="rounded-xl bg-sky-mist px-4 py-3">
              <p className="font-semibold text-navy">{o.ime}</p>
              {o.uloga && <p className="text-xs text-muted">{o.uloga}</p>}
              <Kontakt tel={o.tel} email={o.email} />
            </li>
          ))}
        </ul>
      )}
      {j.pod?.map((p) => (
        <JedinicaBlok key={p.naziv} j={p} level={level + 1} />
      ))}
    </div>
  );
}

export default function OrganizacijaPage() {
  return (
    <>
      <PageHero
        eyebrow="O nama"
        title="Organizacija i uredništva"
        lead="Sektori, odjeli i redakcije Radio-televizije Federacije Bosne i Hercegovine s kontaktima urednika i rukovodilaca."
        crumbs={[{ label: "O nama", href: "/o-nama" }, { label: "Organizacija" }]}
      />
      <Section>
        <div className="grid gap-6">
          {organizacija.map((j) => (
            <div key={j.naziv} className="card p-6 sm:p-8">
              <JedinicaBlok j={j} />
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
