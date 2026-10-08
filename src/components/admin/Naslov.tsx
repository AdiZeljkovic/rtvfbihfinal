import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** Naslov stranice u adminu s jasnim putem nazad */
export default function Naslov({
  naslov,
  opis,
  nazad,
  children,
}: {
  naslov: string;
  opis?: React.ReactNode;
  nazad?: { href: string; tekst: string };
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      {nazad && (
        <Link
          href={nazad.href}
          className="-ml-3 mb-3 inline-flex min-h-12 items-center gap-2 rounded-xl px-3 text-lg font-semibold text-brand hover:bg-white"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" /> {nazad.tekst}
        </Link>
      )}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <h1 className="break-words font-display text-3xl font-bold leading-tight text-navy sm:text-4xl">{naslov}</h1>
          {opis && <p className="mt-2 max-w-3xl text-xl leading-relaxed text-muted">{opis}</p>}
        </div>
        {children && <div className="shrink-0">{children}</div>}
      </div>
    </div>
  );
}
