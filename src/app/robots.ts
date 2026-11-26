import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // admin i slike/PDF uputstva za urednike nisu za pretraživače
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/uputstvo/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
