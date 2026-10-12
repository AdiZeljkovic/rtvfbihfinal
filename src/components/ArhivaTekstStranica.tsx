import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageHero from "./PageHero";
import Section from "./Section";
import ArhivaBlokovi from "./ArhivaBlokovi";
import type { ArhivaTekst } from "@/content/arhiva";

type Props = {
  tekst: ArhivaTekst;
  /** Breadcrumb roditelj, npr. { label: "Dokumenti", href: "/dokumenti" } */
  roditelj: { label: string; href: string };
};

/** Stranica za dugi tekst prenesen sa stare stranice (zakoni, statut, cjenovnici…) */
export default function ArhivaTekstStranica({ tekst, roditelj }: Props) {
  const clanova = tekst.blokovi.filter((b) => b.t === "naslov" && /^(član|članak)\s+\d+/i.test(b.tekst)).length;

  return (
    <>
      <PageHero
        eyebrow={tekst.nadnaslov}
        title={tekst.naslov}
        crumbs={[roditelj, { label: tekst.naslov.length > 48 ? tekst.naslov.slice(0, 46) + "…" : tekst.naslov }]}
        stats={clanova > 2 ? [{ value: clanova, label: "članova" }] : undefined}
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <ArhivaBlokovi blokovi={tekst.blokovi} />
          <div className="mt-14 border-t border-line pt-6">
            <Link href={roditelj.href} className="inline-flex items-center gap-2 font-semibold text-brand-strong hover:underline">
              <ArrowLeft className="h-4 w-4" /> Nazad: {roditelj.label}
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
