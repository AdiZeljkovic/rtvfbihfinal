"use client";

import { useEffect } from "react";
import { CircleAlert, House, RotateCcw } from "lucide-react";

/** Neočekivana greška u adminu: jasna poruka i dva jednostavna izlaza */
export default function AdminGreska({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="sadrzaj" className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 text-center">
      <span className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-700">
        <CircleAlert className="h-11 w-11" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-bold text-navy">Nešto nije u redu</h1>
      <p className="mt-3 text-xl leading-relaxed text-muted">
        Stranica se nije mogla prikazati. Vaš sadržaj na stranici nije oštećen. Pokušajte ponovo, a ako se greška ponavlja,
        javite se tehničkoj podršci.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-brand-strong px-7 font-display text-lg font-bold text-white hover:bg-brand-deep"
        >
          <RotateCcw className="h-6 w-6" aria-hidden="true" /> Pokušaj ponovo
        </button>
        {/* namjerno puno učitavanje: poslije greške počinje se ispočetka */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/admin"
          className="inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl border-2 border-line bg-white px-7 font-display text-lg font-semibold text-navy hover:border-navy"
        >
          <House className="h-6 w-6" aria-hidden="true" /> Početna
        </a>
      </div>
      {error.digest && <p className="mt-8 text-sm text-muted">Oznaka greške: {error.digest}</p>}
    </main>
  );
}
