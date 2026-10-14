import "server-only";
import { PRVA_GODINA_NABAVKI, kolekcija, type Kolekcija } from "@/cms/kolekcije";
import { baza, lista, type Zapis } from "./db";
import { datumBs, tekucaGodina } from "@/lib/datum";

/** Podaci za listu u adminu (samo ono što lista prikazuje) */
export function redoviKolekcije(def: Kolekcija) {
  return lista(def.kljuc).map((z) => red(def, z));
}

export function red(def: Kolekcija, z: Zapis) {
  const p = z.podaci;
  const tekst = (ime: string) => {
    const v = p[ime];
    const polje = def.polja.find((f) => f.ime === ime);
    if (polje?.vrsta === "datum") return datumBs(String(v ?? ""));
    return v == null ? "" : String(v);
  };
  return {
    id: z.id,
    naslov: tekst(def.naslovPolje).slice(0, 220),
    podnaslov: (def.podnaslov ?? []).map(tekst).filter(Boolean).join(" · "),
    filter: def.filter ? tekst(def.filter) : "",
    naStranici: def.naStranici(p),
  };
}

/** Godine za javne nabavke: od iduće do 2015, plus godine koje već postoje u sadržaju */
export function godineNabavki() {
  const g = tekucaGodina();
  const sve = new Set(Array.from({ length: g + 1 - PRVA_GODINA_NABAVKI + 1 }, (_, i) => g + 1 - i));
  for (const z of lista("nabavke")) if (Number(z.podaci.godina)) sve.add(Number(z.podaci.godina));
  return [...sve].sort((a, b) => b - a).map(String);
}

/** Opcije koje zavise od sadržaja ili datuma (sektori za „Pripada pod“, godine nabavki) */
export function opcijeObrasca(kljuc: string, id?: number): Record<string, string[]> {
  if (kljuc === "nabavke") return { godina: godineNabavki() };
  if (kljuc === "jedinice") {
    return {
      nadredjena: lista("jedinice")
        .filter((z) => z.id !== id)
        .map((z) => String(z.podaci.naziv ?? ""))
        .filter(Boolean),
    };
  }
  return {};
}

/** Vrijednosti filtera redom kojim se pojavljuju u opisu kolekcije (ili u sadržaju) */
export function opcijeFiltera(def: Kolekcija, redovi: { filter: string }[]) {
  const polje = def.polja.find((f) => f.ime === def.filter);
  const prisutne = new Set(redovi.map((r) => r.filter).filter(Boolean));
  const redoslijed = polje?.vrsta === "izbor" ? polje.opcije : [];
  const ostale = [...prisutne].filter((o) => !redoslijed.includes(o));
  // brojevi (godine) od najnovijeg, ostalo abecedno
  ostale.sort((a, b) => (Number(a) && Number(b) ? Number(b) - Number(a) : a.localeCompare(b, "bs")));
  return [...redoslijed.filter((o) => prisutne.has(o)), ...ostale];
}

/** Stavke u korpi ili arhivi, posljednje premještene prve */
export function stavkeSaStatusom(status: Exclude<Zapis["status"], "objavljeno">) {
  const rows = baza()
    .prepare("SELECT * FROM zapisi WHERE status = ? ORDER BY izmijenjeno DESC")
    .all(status) as { id: number; kolekcija: string; podaci: string; izmijenjeno: string; izmijenio: string | null }[];
  return rows.map((r) => {
    const def = kolekcija(r.kolekcija);
    const p = JSON.parse(r.podaci) as Record<string, unknown>;
    return {
      id: r.id,
      vrsta: def?.naziv ?? r.kolekcija,
      naslov: String((def && p[def.naslovPolje]) ?? "(bez naziva)").slice(0, 220),
      kada: r.izmijenjeno,
      ko: r.izmijenio ?? "",
    };
  });
}

/** „2026-10-08 09:15:00“ (UTC iz baze) → „8. oktobra 2026. u 11:15“ (lokalno vrijeme) */
export function vrijemeBs(sqlUtc: string) {
  const d = new Date(sqlUtc.replace(" ", "T") + "Z");
  if (Number.isNaN(d.getTime())) return sqlUtc;
  const lokalno = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Sarajevo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  const [dan, sat] = lokalno.split(" ");
  return `${datumBs(dan)} u ${sat}`;
}
