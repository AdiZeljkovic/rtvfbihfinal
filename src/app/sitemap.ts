import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { arhiviraneRute, emisije, tekstovi } from "@/server/sadrzaj";
import { godineNabavki } from "@/content/javne-nabavke";

/* Sitemap se slaže pri svakom zahtjevu iz baze – inače ostane onakav kakav je bio u buildu
   (bez baze), pa nabraja i arhivirane stranice */
export const dynamic = "force-dynamic";

const osnovne = [
  "",
  "/o-nama",
  "/o-nama/upravni-odbor",
  "/o-nama/organizacija",
  "/televizija",
  "/televizija/emisije",
  "/radio",
  "/frekvencije",
  "/dokumenti",
  "/javne-nabavke",
  "/obavijesti",
  "/rtv-taksa",
  "/marketing",
  "/kontakt",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const arhivirane = arhiviraneRute();
  const rute = [
    ...osnovne.filter((r) => !arhivirane.has(r)),
    ...tekstovi().map((t) => t.ruta),
    ...godineNabavki().slice(1).map((g) => `/javne-nabavke/${g}`),
    ...emisije().map((e) => `/televizija/emisije/${e.slug}`),
  ];
  return rute.map((r) => ({
    url: `${site.url}${r}`,
    lastModified: now,
    changeFrequency: r === "" || r === "/javne-nabavke" ? "weekly" : "monthly",
    priority: r === "" ? 1 : osnovne.includes(r) ? 0.7 : 0.5,
  }));
}
