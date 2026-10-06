import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { organizacija, type Jedinica, type Osoba } from "@/content/uprava";

export const metadata: Metadata = {
  title: "Organizacija i uredništva",
  description: "Sektori, odjeli i redakcije Radio-televizije Federacije BiH s kontakt podacima urednika i rukovodilaca.",
};

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const inicijali = (ime: string) =>
  ime
    .split(/\s+/)
    .map((d) => d[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const brojJedinica = (j: Jedinica[]): number => j.reduce((n, x) => n + 1 + brojJedinica(x.pod ?? []), 0);
const brojOsoba = (j: Jedinica[]): number =>
  j.reduce((n, x) => n + (x.osobe?.length ?? 0) + brojOsoba(x.pod ?? []), 0);

function Kontakt({ tel, email }: { tel?: string; email?: string }) {
  if (!tel && !email) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
      {tel && (
        <a href={`tel:${tel.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 text-ink hover:text-brand">
          <Phone className="h-3.5 w-3.5 text-brand" /> {tel}
        </a>
      )}
      {email && (
        <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 break-all text-brand hover:underline">
          <Mail className="h-3.5 w-3.5 shrink-0" /> {email}
        </a>
      )}
    </div>
  );
}

function OsobaRed({ o }: { o: Osoba }) {
  return (
    <li className="flex items-start gap-3.5">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold text-brand ring-1 ring-line">
        {inicijali(o.ime)}
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-navy">{o.ime}</p>
        {o.uloga && <p className="text-sm text-muted">{o.uloga}</p>}
        <Kontakt tel={o.tel} email={o.email} />
      </div>
    </li>
  );
}

function Odjel({ j }: { j: Jedinica }) {
  return (
    <div className="mt-8 border-t border-line pt-7">
      <h3 className="font-display text-lg font-semibold text-navy">{j.naziv}</h3>
      <Kontakt tel={j.tel} email={j.email} />
      {j.osobe && (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {j.osobe.map((o) => (
            <OsobaRed key={o.ime} o={o} />
          ))}
        </ul>
      )}
      {j.pod && j.pod.length > 0 && (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {j.pod.map((p) => (
            <li key={p.naziv} className="rounded-2xl bg-sky-mist p-5">
              <p className="font-display text-[0.95rem] font-semibold text-navy">{p.naziv}</p>
              <Kontakt tel={p.tel} email={p.email} />
              {p.osobe && (
                <ul className="mt-4 space-y-3">
                  {p.osobe.map((o) => (
                    <OsobaRed key={o.ime} o={o} />
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function OrganizacijaPage() {
  return (
    <>
      <PageHero
        eyebrow="O nama"
        title="Organizacija i"
        highlight="uredništva"
        lead="Sektori, odjeli i redakcije Radio-televizije Federacije Bosne i Hercegovine s kontaktima urednika i rukovodilaca."
        crumbs={[{ label: "O nama", href: "/o-nama" }, { label: "Organizacija" }]}
        stats={[
          { value: organizacija.length, label: "sektora i direkcija" },
          { value: brojJedinica(organizacija) - organizacija.length, label: "odjela, odsjeka i redakcija" },
          { value: brojOsoba(organizacija), label: "kontakt osoba" },
        ]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[15rem_1fr]">
          <nav aria-label="Sektori" className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow mb-4">Sektori</p>
            <ol className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
              {organizacija.map((s, i) => (
                <li key={s.naziv} className="shrink-0">
                  <a
                    href={`#${slug(s.naziv)}`}
                    className="flex items-baseline gap-3 rounded-full border border-line px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-brand hover:text-brand lg:rounded-xl lg:border-transparent lg:px-3 lg:hover:bg-sky-mist"
                  >
                    <span className="font-mono text-xs tabular-nums text-brand">{String(i + 1).padStart(2, "0")}</span>
                    {s.naziv.replace(" RTVFBiH", "")}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="min-w-0 space-y-6">
            {organizacija.map((s, i) => (
              <article
                key={s.naziv}
                id={slug(s.naziv)}
                className="scroll-mt-28 rounded-3xl border border-line bg-white p-7 shadow-[var(--shadow-card)] sm:p-9"
              >
                <header className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-sm tabular-nums text-brand">{String(i + 1).padStart(2, "0")}</p>
                    <h2 className="mt-1 font-display text-2xl font-bold text-navy">{s.naziv}</h2>
                    <Kontakt tel={s.tel} email={s.email} />
                  </div>
                </header>
                {s.osobe && (
                  <ul className="mt-6 grid gap-4 rounded-2xl bg-navy p-5 text-white sm:grid-cols-2 [&_.text-muted]:text-white/60 [&_.text-navy]:text-white [&_.text-ink]:text-white/85 [&_.text-brand]:text-sky [&_.ring-line]:ring-white/25">
                    {s.osobe.map((o) => (
                      <OsobaRed key={o.ime} o={o} />
                    ))}
                  </ul>
                )}
                {s.pod?.map((p) => (
                  <Odjel key={p.naziv} j={p} />
                ))}
              </article>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
