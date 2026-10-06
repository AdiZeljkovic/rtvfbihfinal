import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import HistorijaSkala from "@/components/HistorijaSkala";
import { IconCard } from "@/components/Tiles";
import { BoardIcon, DocsIcon, MicIcon, RadioSetIcon, ServicesIcon, TeletextIcon, TvIcon } from "@/components/StatIcons";
import { filmovi, historijat } from "@/content/historijat";

export const metadata: Metadata = {
  title: "O nama – Historijat",
  description:
    "Historijat Radio-televizije Federacije Bosne i Hercegovine: transformacija RTVBiH, Radio Federacije BiH, Federalna televizija, Radio 202 i Teletekst.",
};

const poglavlja = [
  { id: "radio", godina: "2001", naslov: "Radio Federacije Bosne i Hercegovine", icon: RadioSetIcon, tekst: historijat.radio },
  { id: "televizija", godina: "2001", naslov: "Televizija Federacije Bosne i Hercegovine", icon: TvIcon, tekst: historijat.televizija },
  { id: "radio-202", godina: "1971", naslov: "Radio Sarajevo 202", icon: MicIcon, tekst: historijat.radio202 },
  { id: "teletekst", godina: "1984", naslov: "Teletekst", icon: TeletextIcon, tekst: historijat.teletekst },
];

export default function ONamaPage() {
  /* stranica je statična: broj se računa pri buildu */
  const godinaUEteru = new Date().getFullYear() - 1971;

  return (
    <>
      <PageHero
        eyebrow="O nama"
        title="Historijat"
        highlight="javnog servisa"
        lead="Radio-televizija Federacije Bosne i Hercegovine nastala je transformacijom nekadašnje Radio-televizije Bosne i Hercegovine, a baštini tradiciju Radio-Sarajeva i Televizije Sarajevo."
        crumbs={[{ label: "O nama" }]}
        stats={[
          { value: godinaUEteru, label: "godina u eteru" },
          { value: "1971.", label: "Radio Sarajevo 202" },
          { value: "1984.", label: "Teletekst" },
          { value: "2001.", label: "RTV Federacije BiH" },
        ]}
      />

      {/* Uvod + radio s vremenskom linijom */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <div>
            <p className="eyebrow">Naša priča</p>
            <h2 className="mt-2 text-balance text-2xl font-bold text-navy sm:text-3xl md:text-[2.1rem]">
              Od transformacije RTVBiH do danas
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink sm:text-lg">
              {historijat.uvod.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <nav aria-label="Poglavlja" className="mt-8 flex flex-wrap gap-2">
              {poglavlja.map((p) => (
                <a
                  key={p.id}
                  href={`#${p.id}`}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-brand hover:text-brand"
                >
                  {p.naslov.replace(" Bosne i Hercegovine", " BiH")}
                </a>
              ))}
            </nav>
          </div>
          <HistorijaSkala />
        </div>
      </Section>

      {/* Poglavlja */}
      <Section tone="mist">
        <div className="space-y-6">
          {poglavlja.map((p) => {
            const Icon = p.icon;
            return (
              <article
                key={p.id}
                id={p.id}
                className="scroll-mt-28 grid gap-8 rounded-3xl border border-line bg-white p-7 shadow-[var(--shadow-card)] sm:p-10 lg:grid-cols-[15rem_1fr] lg:gap-12"
              >
                <header className="lg:sticky lg:top-28 lg:self-start">
                  <Icon className="h-11 w-11 text-brand" />
                  <p className="skala-broj mt-5 font-display text-6xl font-bold leading-none tracking-tight tabular-nums">
                    {p.godina}
                  </p>
                  <h2 className="mt-3 font-display text-xl font-bold leading-snug text-navy">{p.naslov}</h2>
                </header>

                <div>
                  <div className="space-y-4 text-[0.98rem] leading-relaxed text-ink">
                    {p.tekst.map((t, i) => (
                      <p key={i}>{t}</p>
                    ))}
                  </div>

                  {p.id === "radio" && (
                    <div className="mt-8 border-t border-line pt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                        Prve redakcije Radija Federacije BiH
                      </p>
                      <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                        {historijat.radioRedakcije.map((r, i) => (
                          <li key={r} className="flex items-baseline gap-3 text-sm text-navy">
                            <span className="font-mono text-xs tabular-nums text-brand">{String(i + 1).padStart(2, "0")}</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {p.id === "televizija" && (
                    <div className="mt-8 border-t border-line pt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                        Filmsko naslijeđe Televizije Sarajevo
                      </p>
                      <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {filmovi.map((f) => (
                          <li key={f.naziv} className="rounded-2xl bg-navy px-5 py-4 text-white">
                            <p className="font-display font-semibold">„{f.naziv}“</p>
                            <p className="mt-0.5 text-sm text-white/60">{f.autor}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* Dalje */}
      <Section eyebrow="Institucija" title="Upoznajte javni servis">
        <div className="grid gap-5 md:grid-cols-3">
          <IconCard
            icon={BoardIcon}
            title="Upravni odbor"
            text="Sastav Upravnog odbora, poslovnik o radu i javna saopštenja."
            href="/o-nama/upravni-odbor"
            cta="Otvori"
          />
          <IconCard
            icon={ServicesIcon}
            title="Organizacija i uredništva"
            text="Sektori, odjeli i redakcije s kontaktima urednika i rukovodilaca."
            href="/o-nama/organizacija"
            cta="Otvori"
          />
          <IconCard
            icon={DocsIcon}
            title="Opći akti i izvještaji"
            text="Zakoni, statut, pravilnici, izvještaji o radu i revizorski izvještaji."
            href="/dokumenti"
            cta="Otvori"
          />
        </div>
      </Section>
    </>
  );
}
