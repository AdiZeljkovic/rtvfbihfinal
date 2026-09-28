import type { Metadata } from "next";
import { UserRound } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import DocList from "@/components/DocList";
import { upravniOdbor, generalniDirektor } from "@/content/uprava";

export const metadata: Metadata = {
  title: "Upravni odbor",
  description: "Članovi Upravnog odbora Radio-televizije Federacije BiH, poslovnik o radu i saopštenja za javnost.",
};

export default function UpravniOdborPage() {
  return (
    <>
      <PageHero
        eyebrow="O nama"
        title="Upravni odbor RTVFBiH"
        lead={upravniOdbor.osnov}
        crumbs={[{ label: "O nama", href: "/o-nama" }, { label: "Upravni odbor" }]}
      />

      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {upravniOdbor.clanovi.map((c) => (
            <div key={c.ime} className="card p-6">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-soft text-brand">
                <UserRound className="h-6 w-6" />
              </span>
              <p className="mt-4 font-display text-lg font-semibold text-navy">{c.ime}</p>
              <p className="text-sm font-medium text-brand">{c.uloga}</p>
              <p className="mt-2 text-xs text-muted">{c.napomena}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_20rem]">
          <article className="rounded-2xl border border-line bg-sky-mist p-6 sm:p-8">
            <p className="eyebrow">{upravniOdbor.saopstenje.naslov}</p>
            <div className="prose-ftv mt-3">
              {upravniOdbor.saopstenje.tekst.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="mt-4 text-sm font-semibold text-navy">{upravniOdbor.saopstenje.potpis}</p>
          </article>

          <div className="space-y-6">
            <div className="card p-6">
              <p className="eyebrow">Generalni direktor</p>
              <p className="mt-2 font-display text-lg font-semibold text-navy">{generalniDirektor.ime}</p>
              <p className="text-sm text-muted">{generalniDirektor.tel}</p>
            </div>
            <div>
              <p className="eyebrow mb-3">Dokumenti</p>
              <DocList items={upravniOdbor.dokumenti} compact />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
