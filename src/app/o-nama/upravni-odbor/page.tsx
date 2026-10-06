import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import DocList from "@/components/DocList";
import ContactCard from "@/components/ContactCard";
import { upravniOdbor, generalniDirektor } from "@/content/uprava";

export const metadata: Metadata = {
  title: "Upravni odbor",
  description: "Članovi Upravnog odbora Radio-televizije Federacije BiH, poslovnik o radu i saopštenja za javnost.",
};

const inicijali = (ime: string) =>
  ime
    .split(/\s+/)
    .map((d) => d[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function UpravniOdborPage() {
  return (
    <>
      <PageHero
        eyebrow="O nama"
        title="Upravni"
        highlight="odbor"
        lead={upravniOdbor.osnov}
        crumbs={[{ label: "O nama", href: "/o-nama" }, { label: "Upravni odbor" }]}
        stats={[
          { value: upravniOdbor.clanovi.length, label: "člana Upravnog odbora" },
          { value: "2025.", label: "imenovanje, Sl. novine FBiH 33/25" },
          { value: "5 god.", label: "mandat generalnog direktora" },
        ]}
      />

      <Section eyebrow="Sastav" title="Članovi Upravnog odbora">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {upravniOdbor.clanovi.map((c, i) => {
            const [narod, mandat] = c.napomena.split(", ");
            const prvi = i === 0;
            return (
              <li
                key={c.ime}
                className={`relative flex flex-col overflow-hidden rounded-3xl p-7 shadow-[var(--shadow-card)] ${
                  prvi ? "bg-navy text-white" : "border border-line bg-white"
                }`}
              >
                {prvi && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[url(/brand/kartice-bg.jpg)] bg-cover bg-right opacity-40"
                  />
                )}
                <span
                  className={`relative inline-flex h-14 w-14 items-center justify-center rounded-full font-display text-base font-bold ring-1 ${
                    prvi ? "text-sky ring-white/30" : "text-brand ring-line"
                  }`}
                >
                  {inicijali(c.ime)}
                </span>
                <p className={`relative mt-6 text-xs font-semibold uppercase tracking-[0.14em] ${prvi ? "text-sky" : "text-brand"}`}>
                  {c.uloga}
                </p>
                <p className={`relative mt-1 font-display text-xl font-semibold ${prvi ? "text-white" : "text-navy"}`}>{c.ime}</p>
                <dl className={`relative mt-5 space-y-1.5 border-t pt-4 text-sm ${prvi ? "border-white/15" : "border-line"}`}>
                  <div className="flex justify-between gap-3">
                    <dt className={prvi ? "text-white/55" : "text-muted"}>Predstavnik</dt>
                    <dd className={`text-right ${prvi ? "text-white/90" : "text-navy"}`}>{narod?.replace("iz reda ", "")}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className={prvi ? "text-white/55" : "text-muted"}>Mandat</dt>
                    <dd className={`text-right ${prvi ? "text-white/90" : "text-navy"}`}>{mandat?.replace("mandat ", "")}</dd>
                  </div>
                </dl>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section tone="mist">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Saopštenje */}
          <article className="relative overflow-hidden rounded-3xl bg-navy p-8 text-white shadow-[var(--shadow-card)] sm:p-10">
            <div aria-hidden="true" className="absolute inset-0 bg-[url(/brand/kartice-bg.jpg)] bg-cover bg-right opacity-40" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/50" />
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-2 -top-12 select-none font-display text-[10rem] leading-none text-white/[0.07]"
              >
                “
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky">
                {upravniOdbor.saopstenje.naslov}
              </p>
              <div className="mt-4 space-y-4 leading-relaxed text-white/85">
                {upravniOdbor.saopstenje.tekst.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <p className="mt-6 border-t border-white/15 pt-4 font-display font-semibold">
                {upravniOdbor.saopstenje.potpis}
              </p>
            </div>
          </article>

          <div className="space-y-6">
            <ContactCard ime={generalniDirektor.ime} uloga={generalniDirektor.uloga} tel={generalniDirektor.tel} />
            <div>
              <p className="eyebrow mb-4">Dokumenti</p>
              <DocList items={upravniOdbor.dokumenti} />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
