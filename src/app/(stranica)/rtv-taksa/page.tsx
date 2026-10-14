import type { Metadata } from "next";
import { ChevronDown, Mail, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { ReceiptIcon } from "@/components/StatIcons";
import { PillButton } from "@/components/Tiles";
import { rtvTaksaUvod } from "@/content/rtv-taksa";
import { notFound } from "next/navigation";
import { pitanja, rutaArhivirana } from "@/server/sadrzaj";

export const metadata: Metadata = {
  title: "RTV taksa – pitanja i odgovori",
  description: "Najčešća pitanja građana o plaćanju RTV takse i odgovori Odjela RTV takse Radio-televizije Federacije BiH.",
};

export default function RtvTaksaPage() {
  if (rutaArhivirana("/rtv-taksa")) notFound();
  const faq = pitanja();
  const glavniTel = rtvTaksaUvod.kontakt.tel[0];

  return (
    <>
      <PageHero
        eyebrow="Za građane"
        title="RTV taksa –"
        highlight="pitanja i odgovori"
        lead="RTV taksa je zakonska obaveza svakog domaćinstva koje posjeduje radijski ili televizijski prijemnik i osnovni izvor finansiranja nezavisnog javnog servisa."
        crumbs={[{ label: "RTV taksa" }]}
        actions={<PillButton href="#pitanja">Najčešća pitanja</PillButton>}
        stats={[
          { value: "1", label: "taksa po domaćinstvu" },
          { value: faq.length, label: "odgovora na pitanja" },
          { value: "čl. 49", label: "Zakona o RTVFBiH" },
        ]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
          <div>
            {/* citat zakona */}
            <blockquote className="relative overflow-hidden rounded-3xl bg-navy p-8 text-white shadow-[var(--shadow-card)] sm:p-10">
              <div aria-hidden="true" className="absolute inset-0 bg-[url(/brand/kartice-bg.webp)] bg-cover bg-right opacity-35" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/50" />
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2 -top-12 select-none font-display text-[10rem] leading-none text-white/[0.07]"
                >
                  “
                </span>
                <p className="text-xs font-semibold uppercase leading-relaxed tracking-[0.14em] text-sky">{rtvTaksaUvod.zakon}</p>
                <p className="mt-3 font-display text-xl font-medium leading-relaxed sm:text-2xl">{rtvTaksaUvod.citat}</p>
              </div>
            </blockquote>

            {/* pitanja */}
            <div id="pitanja" className="mt-12 scroll-mt-28">
              <p className="eyebrow">Pitanja građana</p>
              <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">Najčešća pitanja</h2>
              <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-card)]">
                {faq.map((f, i) => (
                  <details key={i} className="group border-b border-line last:border-b-0 open:bg-sky-mist/50">
                    <summary className="flex cursor-pointer list-none items-start gap-4 px-6 py-5 marker:content-none sm:px-7">
                      <span className="mt-0.5 font-mono text-sm tabular-nums text-brand-strong">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1 font-display font-semibold leading-snug text-navy">{f.pitanje}</span>
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-navy transition-[transform,background-color,color] duration-300 group-open:rotate-180 group-open:border-brand group-open:bg-brand group-open:text-white">
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </summary>
                    <div className="space-y-3 px-6 pb-6 pl-[3.6rem] text-[0.95rem] leading-relaxed text-ink sm:px-7 sm:pl-[3.85rem]">
                      {f.odgovor.map((p, j) => (
                        <p key={j}>{p}</p>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-line bg-white p-7 shadow-[var(--shadow-card)]">
              <ReceiptIcon className="h-11 w-11 text-brand-strong" />
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-strong">{rtvTaksaUvod.kontakt.odjel}</p>
              <p className="mt-1 font-display text-xl font-semibold text-navy">Imate pitanje o taksi?</p>
              <p className="mt-2 text-sm text-muted">Za nejasnoće u vezi s evidencijom i plaćanjem RTV takse nazovite:</p>
              <a
                href={`tel:${glavniTel.replace(/[^\d+]/g, "")}`}
                className="mt-5 flex items-center gap-3 rounded-2xl bg-navy px-5 py-4 text-white transition-colors hover:bg-brand-deep"
              >
                <Phone className="h-5 w-5 text-sky" />
                <span className="font-display text-lg font-semibold tabular-nums">{glavniTel}</span>
              </a>
              <ul className="mt-4 space-y-1.5 text-sm text-ink">
                {rtvTaksaUvod.kontakt.tel.slice(1).map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-strong" /> {t}
                  </li>
                ))}
              </ul>
              <div className="mt-5 border-t border-line pt-4 text-sm">
                <p className="font-semibold text-navy">Denis Hajdarević</p>
                <p className="text-muted">rukovodilac Odjela RTV takse</p>
                <a href="mailto:denis.hajdarevic@rtvfbih.ba" className="mt-1.5 inline-flex items-center gap-2 text-brand-strong hover:underline">
                  <Mail className="h-3.5 w-3.5" /> denis.hajdarevic@rtvfbih.ba
                </a>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
