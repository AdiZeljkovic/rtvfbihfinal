import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import ArhivaBlokovi from "@/components/ArhivaBlokovi";
import { emisijaPoSlugu, emisije, opisEmisije } from "@/server/sadrzaj";

export function generateStaticParams() {
  return emisije().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/televizija/emisije/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const e = emisijaPoSlugu(slug);
  return e ? { title: e.naziv, description: opisEmisije(e) } : {};
}

export default async function EmisijaPage({ params }: PageProps<"/televizija/emisije/[slug]">) {
  const { slug } = await params;
  const e = emisijaPoSlugu(slug);
  if (!e) notFound();
  const iste = emisije()
    .filter((x) => x.grupa === e.grupa && x.slug !== e.slug)
    .slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow={e.serija ? `${e.grupa} · serija` : e.grupa}
        title={e.naziv}
        crumbs={[
          { label: "Televizija", href: "/televizija" },
          { label: "Emisije i serije", href: "/televizija/emisije" },
          { label: e.naziv.length > 40 ? e.naziv.slice(0, 38) + "…" : e.naziv },
        ]}
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-14">
          <article className="min-w-0">
            {e.slika && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={e.slika} alt={e.naziv} className="mb-8 h-auto w-full rounded-3xl shadow-[var(--shadow-card)]" />
            )}
            {e.tekst?.length ? (
              <ArhivaBlokovi blokovi={e.tekst} />
            ) : e.opis ? (
              <p className="text-lg leading-relaxed text-ink">{e.opis}</p>
            ) : (
              <p className="text-muted">Opis emisije uskoro.</p>
            )}
          </article>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {e.termin && (
              <div className="rounded-3xl bg-navy p-6 text-white">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky">
                  <Clock className="h-4 w-4" /> Termin
                </p>
                <p className="mt-2 font-display text-xl font-semibold">{e.termin}</p>
                {e.vrsta && <p className="mt-1 text-sm text-white/70">{e.vrsta} program</p>}
              </div>
            )}
            {e.logo && (
              <div className="flex items-center justify-center rounded-3xl bg-navy p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.logo} alt={`${e.naziv} – logo emisije`} className="h-auto max-w-full" />
              </div>
            )}
            {iste.length > 0 && (
              <div className="rounded-3xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">{e.grupa}</p>
                <ul className="mt-3 divide-y divide-line">
                  {iste.map((x) => (
                    <li key={x.slug}>
                      <Link href={`/televizija/emisije/${x.slug}`} className="block py-3 font-display font-semibold text-navy hover:text-brand">
                        {x.naziv}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Link href="/televizija/emisije" className="inline-flex items-center gap-2 font-semibold text-brand hover:underline">
              <ArrowLeft className="h-4 w-4" /> Sve emisije i serije
            </Link>
          </aside>
        </div>
      </Section>
    </>
  );
}
