import type { Metadata } from "next";
import { LogoMark } from "@/components/Logo";
import UputstvoSadrzaj from "@/components/admin/UputstvoSadrzaj";
import { UPUTSTVO } from "@/cms/uputstvo";
import { obaveznaPrijava } from "@/server/auth";

export const metadata: Metadata = { title: "Uputstvo za urednike (PDF)" };

/**
 * Uputstvo složeno za A4 (iz ove stranice se pravi PDF; vidi scripts/uputstvo/pdf.mjs).
 * Naslovna strana, sadržaj, pa svako poglavlje na novoj strani.
 */
export default async function UputstvoPdfPage() {
  await obaveznaPrijava();
  return (
    <div className="uputstvo-pdf bg-white">
      <style>{`
        @page { size: A4; margin: 16mm 15mm 18mm; }
        html.admin-html { font-size: 78% !important; }
        body { background: #fff !important; }
        .uputstvo-pdf .naslovna { height: 255mm; break-after: page; }
        .uputstvo-pdf .sadrzaj { break-after: page; }
        .uputstvo-pdf .uputstvo-poglavlje { break-before: page; }
        .uputstvo-pdf .uputstvo-poglavlje:first-child { break-before: auto; }
        .uputstvo-pdf .uputstvo-blok { break-inside: avoid; }
        /* visoki obrasci smiju zauzeti skoro cijelu stranu (inače bi bili preuski za čitanje) */
        .uputstvo-pdf .uputstvo-slika img { max-height: 205mm; width: auto; max-width: 100%; margin: 0 auto; display: block; }
        /* slika i objašnjenje brojeva uvijek na istoj strani */
        .uputstvo-pdf .uputstvo-slika { break-inside: avoid; }
        .uputstvo-pdf .uputstvo-slika img, .uputstvo-pdf .shadow-\\[var\\(--shadow-card\\)\\] { box-shadow: none !important; }
      `}</style>

      <section className="naslovna relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-navy p-14 text-white">
        <div aria-hidden="true" className="absolute inset-0 bg-[url(/brand/kartice-bg.webp)] bg-cover bg-right opacity-40" />
        <div className="relative flex items-center gap-4">
          <LogoMark tone="white" className="h-16 w-16" />
          <span className="font-display text-xl font-semibold leading-tight">
            Radio-televizija
            <br />
            Federacije Bosne i Hercegovine
          </span>
        </div>
        <div className="relative">
          <p className="font-display text-xl font-semibold uppercase tracking-[0.16em] text-sky">Uređivanje stranice rtvfbih.ba</p>
          <h1 className="mt-4 font-display text-7xl font-bold leading-[1.05]">Uputstvo za urednike</h1>
          <p className="mt-6 max-w-xl text-2xl leading-relaxed text-white/80">
            Sve što možete raditi u adminu, korak po korak i na slikama.
          </p>
        </div>
        <p className="relative text-lg text-white/70">Adresa admina: rtvfbih.ba/admin · Novembar 2026.</p>
      </section>

      <section className="sadrzaj pt-4">
        <h2 className="font-display text-4xl font-bold text-navy">Sadržaj</h2>
        <ol className="mt-6 divide-y divide-line border-y border-line">
          {UPUTSTVO.map((p, i) => (
            <li key={p.id} className="flex items-baseline gap-4 py-1.5">
              <span className="w-8 shrink-0 font-display text-xl font-bold text-brand-strong">{i + 1}</span>
              <span>
                <span className="block font-display text-lg font-semibold leading-snug text-navy">{p.naslov}</span>
                <span className="block text-base leading-snug text-muted">{p.ukratko}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          Na slikama su narandžasti krugovi s brojevima. Ispod svake slike piše šta koji broj označava. Natpisi dugmadi su u tekstu
          podebljani, tačno kako pišu na ekranu.
        </p>
      </section>

      <UputstvoSadrzaj stampa />
    </div>
  );
}
