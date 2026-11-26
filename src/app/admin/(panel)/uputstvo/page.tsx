import type { Metadata } from "next";
import { Download } from "lucide-react";
import Naslov from "@/components/admin/Naslov";
import UputstvoSadrzaj from "@/components/admin/UputstvoSadrzaj";
import { PDF_UPUTSTVA, UPUTSTVO } from "@/cms/uputstvo";
import { obaveznaPrijava } from "@/server/auth";

export const metadata: Metadata = { title: "Uputstvo" };

/** Uputstvo za urednike: sadržaj s poglavljima, pa sva poglavlja jedno ispod drugog */
export default async function UputstvoPage() {
  await obaveznaPrijava();
  return (
    <>
      <Naslov
        naslov="Uputstvo za urednike"
        opis="Sve što možete raditi u adminu, korak po korak i na slikama. Brojevi na slikama odgovaraju objašnjenjima ispod slike."
        nazad={{ href: "/admin", tekst: "Početna" }}
      >
        <a
          href={PDF_UPUTSTVA}
          download
          className="inline-flex min-h-14 items-center gap-3 rounded-2xl bg-navy px-6 font-display text-lg font-semibold text-white hover:bg-brand-deep"
        >
          <Download className="h-6 w-6" aria-hidden="true" /> Preuzmi kao PDF
        </a>
      </Naslov>

      <nav id="sadrzaj-uputstva" aria-label="Poglavlja uputstva" className="scroll-mt-6">
        <h2 className="font-display text-2xl font-bold text-navy">Sadržaj</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {UPUTSTVO.map((p, i) => (
            <li key={p.id}>
              <a
                href={`#${p.id}`}
                className="admin-kartica group flex h-full items-start gap-4 rounded-3xl border border-line bg-white p-5 shadow-[var(--shadow-card)] transition-colors hover:border-brand"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-soft font-display text-lg font-bold text-brand-strong">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-lg font-semibold leading-snug text-navy group-hover:text-brand-strong">{p.naslov}</span>
                  <span className="mt-1 block text-base leading-snug text-muted">{p.ukratko}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-14 space-y-16">
        <UputstvoSadrzaj />
      </div>
    </>
  );
}
