import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.shortName} – ${site.tagline}`,
    template: `%s | ${site.shortName}`,
  },
  description:
    "Radio-televizija Federacije Bosne i Hercegovine: Federalna televizija, Radio Federacije BiH, federalna.ba i Teletext. Informacije o javnom servisu, programu, frekvencijama, dokumentima i javnim nabavkama.",
  openGraph: {
    type: "website",
    locale: "bs_BA",
    siteName: site.shortName,
    title: `${site.shortName} – ${site.tagline}`,
    description: "Javni radio-televizijski servis Federacije Bosne i Hercegovine.",
    images: [{ url: "/video/ftv-intro-poster.jpg", width: 1920, height: 1080 }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bs"
      className={`${inter.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#sadrzaj"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          Preskoči na sadržaj
        </a>
        {children}
      </body>
    </html>
  );
}
