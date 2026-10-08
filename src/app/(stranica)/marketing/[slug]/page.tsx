import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArhivaTekstStranica from "@/components/ArhivaTekstStranica";
import { sazetak } from "@/content/arhiva";
import { slugoviRubrike, tekstZaRutu } from "@/server/sadrzaj";

/* Duži tekstovi iz CMS-a pod rubrikom „Marketing“ (nove stranice se prikazuju odmah) */
export function generateStaticParams() {
  return slugoviRubrike("marketing").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/marketing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = tekstZaRutu(`/marketing/${slug}`);
  return t ? { title: t.naslov, description: sazetak(t.sadrzaj, 160) } : {};
}

export default async function Page({ params }: PageProps<"/marketing/[slug]">) {
  const { slug } = await params;
  const t = tekstZaRutu(`/marketing/${slug}`);
  if (!t) notFound();
  return (
    <ArhivaTekstStranica
      tekst={{ wbf: 0, ruta: t.ruta, naslov: t.naslov, nadnaslov: t.nadnaslov, blokovi: t.sadrzaj }}
      roditelj={{ label: "Marketing", href: "/marketing" }}
    />
  );
}
