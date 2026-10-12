import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import NabavkeLista from "@/components/NabavkeLista";
import { brojDokumenataGodine, godineNabavki, nabavkeZaGodinu } from "@/content/javne-nabavke";

export function generateStaticParams() {
  return godineNabavki().map((g) => ({ godina: String(g) }));
}

export async function generateMetadata({ params }: PageProps<"/javne-nabavke/[godina]">): Promise<Metadata> {
  const { godina } = await params;
  return {
    title: `Javne nabavke ${godina}.`,
    description: `Plan javnih nabavki, obavještenja, odluke i izvještaji RTVFBiH za ${godina}. godinu.`,
  };
}

export default async function NabavkeGodinePage({ params }: PageProps<"/javne-nabavke/[godina]">) {
  const { godina } = await params;
  const g = nabavkeZaGodinu(Number(godina));
  if (!g) notFound();
  const godine = godineNabavki();
  const i = godine.indexOf(g.godina);
  const novija = godine[i - 1];
  const starija = godine[i + 1];

  return (
    <>
      <PageHero
        eyebrow="Javne nabavke"
        title="Javne nabavke u"
        highlight={`${g.godina}. godini`}
        crumbs={[
          { label: "Dokumenti", href: "/dokumenti" },
          { label: "Javne nabavke", href: "/javne-nabavke" },
          { label: `${g.godina}.` },
        ]}
        stats={[
          { value: brojDokumenataGodine(g), label: "objavljenih dokumenata" },
          { value: g.sekcije.length, label: g.sekcije.length === 1 ? "sekcija" : "sekcija objava" },
        ]}
      />
      <Section>
        <NabavkeLista godina={g} />
        <nav aria-label="Druge godine" className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          {starija ? (
            <Link href={`/javne-nabavke/${starija}`} className="inline-flex items-center gap-2 font-semibold text-brand-strong hover:underline">
              <ArrowLeft className="h-4 w-4" /> {starija}.
            </Link>
          ) : (
            <span />
          )}
          <Link href="/javne-nabavke#arhiva" className="text-sm font-semibold text-muted hover:text-brand-strong">
            Sve godine
          </Link>
          {novija ? (
            <Link
              href={novija === godine[0] ? "/javne-nabavke" : `/javne-nabavke/${novija}`}
              className="inline-flex items-center gap-2 font-semibold text-brand-strong hover:underline"
            >
              {novija}. <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </Section>
    </>
  );
}
