import type { NextConfig } from "next";

/** Sigurnosna zaglavlja za sve stranice (HSTS postaviti na reverse proxyju s HTTPS-om) */
const sigurnost = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

/** Slike i video iz public/ nemaju hash u imenu: preglednik ih čuva 7 dana, pa provjeri u pozadini */
const sedamDana = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // optimizuju se samo slike sa stranice (uvezene i iz CMS-a), bez parametara u adresi
    localPatterns: [
      { pathname: "/arhiva/**", search: "" },
      { pathname: "/mediji/**", search: "" },
      { pathname: "/brand/**", search: "" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: sigurnost },
      { source: "/video/:path*", headers: sedamDana },
      { source: "/arhiva/:path*", headers: sedamDana },
      { source: "/brand/:path*", headers: sedamDana },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
