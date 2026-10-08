import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArhivaTekstStranica from "@/components/ArhivaTekstStranica";
import { sazetak } from "@/content/arhiva";
import { slugoviRubrike, tekstZaRutu } from "@/server/sadrzaj";

/* Duži tekstovi iz CMS-a pod rubrikom „Dokumenti“ (nove stranice se prikazuju odmah) */
export function generateStaticParams() {
  return slugoviRubrike("dokumenti").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/dokumenti/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = tekstZaRutu(`/dokumenti/${slug}`);
  return t ? { title: t.naslov, description: sazetak(t.sadrzaj, 160) } : {};
}

export default async function Page({ params }: PageProps<"/dokumenti/[slug]">) {
  const { slug } = await params;
  const t = tekstZaRutu(`/dokumenti/${slug}`);
  if (!t) notFound();
  return (
    <ArhivaTekstStranica
      tekst={{ wbf: 0, ruta: t.ruta, naslov: t.naslov, nadnaslov: t.nadnaslov, blokovi: t.sadrzaj }}
      roditelj={{ label: "Dokumenti", href: "/dokumenti" }}
    />
  );
}
