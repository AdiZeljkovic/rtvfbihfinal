import type { MetadataRoute } from "next";
import { site } from "@/content/site";

const routes = [
  "",
  "/o-nama",
  "/o-nama/upravni-odbor",
  "/o-nama/organizacija",
  "/televizija",
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
  return routes.map((r) => ({
    url: `${site.url}${r}`,
    lastModified: now,
    changeFrequency: r === "" || r === "/javne-nabavke" ? "weekly" : "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
