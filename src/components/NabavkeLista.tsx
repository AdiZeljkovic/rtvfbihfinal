import DocList from "./DocList";
import type { NabavkaGodina } from "@/content/arhiva";
import { docUrl } from "@/lib/doc";
import { mnozina } from "@/lib/plural";

/** Sve objave javnih nabavki jedne godine, po sekcijama (plan, obavještenja, odluke…) */
export default function NabavkeLista({ godina }: { godina: NabavkaGodina }) {
  return (
    <div className="grid gap-12">
      {godina.sekcije.map((s, i) => (
        <section key={s.naslov + i} id={`sekcija-${i + 1}`} className="grid scroll-mt-28 gap-4 lg:grid-cols-[16rem_1fr] lg:gap-10">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-sm tabular-nums text-brand">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-1 font-display text-lg font-semibold text-navy">{s.naslov}</h3>
            <p className="mt-1 text-sm text-muted">
              {s.stavke.length} {mnozina(s.stavke.length, "dokument", "dokumenta", "dokumenata")}
            </p>
          </div>
          <div className="min-w-0">
            {s.napomene?.map((n, j) => (
              <p key={j} className="mb-4 rounded-2xl bg-sky-mist p-5 text-sm leading-relaxed text-ink">
                {n}
              </p>
            ))}
            <DocList
              items={s.stavke.map((st) => ({ label: st.tekst, href: docUrl(st.doc), nadnaslov: st.grupa }))}
            />
          </div>
        </section>
      ))}
    </div>
  );
}
