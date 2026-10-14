import type { Metadata } from "next";
import Link from "next/link";
import { Settings } from "lucide-react";
import Naslov from "@/components/admin/Naslov";
import KorpaLista from "@/components/admin/KorpaLista";
import { stavkeSaStatusom, vrijemeBs } from "@/server/admin";
import { obaveznaPrijava } from "@/server/auth";

export const metadata: Metadata = { title: "Arhiva" };

export default async function ArhivaPage() {
  await obaveznaPrijava();
  const stavke = stavkeSaStatusom("arhiva").map((s) => ({ ...s, kada: vrijemeBs(s.kada) }));
  return (
    <>
      <Naslov
        naslov="Arhiva"
        opis="Arhivirane stavke su sačuvane, ali se ne vide na stranici (ni njihovi dokumenti). Možete ih vratiti jednim klikom."
        nazad={{ href: "/admin", tekst: "Početna" }}
      />
      <KorpaLista stavke={stavke} arhiva />
      <p className="mt-8 text-lg text-muted">
        Cijele stranice (npr. RTV taksa) arhiviraju se u{" "}
        <Link href="/admin/stranice" className="inline-flex items-center gap-1.5 font-semibold text-brand-strong underline">
          <Settings className="h-5 w-5" aria-hidden="true" /> Arhivirane stranice
        </Link>
        .
      </p>
    </>
  );
}
