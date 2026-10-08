import type { Metadata } from "next";
import Naslov from "@/components/admin/Naslov";
import KorpaLista from "@/components/admin/KorpaLista";
import { korpa, vrijemeBs } from "@/server/admin";

export const metadata: Metadata = { title: "Korpa" };

export default function KorpaPage() {
  const stavke = korpa().map((s) => ({ ...s, kada: vrijemeBs(s.kada) }));
  return (
    <>
      <Naslov
        naslov="Korpa"
        opis="Obrisane stavke. Ne vide se na stranici, ali ih možete vratiti jednim klikom."
        nazad={{ href: "/admin", tekst: "Početna" }}
      />
      <KorpaLista stavke={stavke} />
    </>
  );
}
