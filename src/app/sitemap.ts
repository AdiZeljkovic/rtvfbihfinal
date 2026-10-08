import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { emisije, tekstovi } from "@/server/sadrzaj";
import { godineNabavki } from "@/content/javne-nabavke";

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
  const rute = [
    ...osnovne,
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
