import "server-only";
import { PRVA_GODINA_NABAVKI, kolekcija, type Kolekcija } from "@/cms/kolekcije";
import { baza, jedan, lista, type Zapis } from "./db";
import { datumBs, tekucaGodina } from "@/lib/datum";
import { nadredjenaId, type JedinicaRef } from "@/lib/jedinice";
import type { IzborOpcija } from "@/cms/kolekcije";

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
    if (def.kljuc === "jedinice" && ime === "nadredjena") return nazivJedinice(String(v ?? ""));
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

const refJedinica = (z: Zapis): JedinicaRef => ({ id: z.id, naziv: String(z.podaci.naziv ?? "") });

/**
 * Opcije koje zavise od sadržaja ili datuma (sektori za „Pripada pod“, godine nabavki).
 * „Pripada pod“ pamti broj jedinice; naziv koji se ponavlja dobije u zagradi kome pripada.
 */
export function opcijeObrasca(kljuc: string, id?: number): Record<string, IzborOpcija[]> {
  if (kljuc === "nabavke") return { godina: godineNabavki() };
  if (kljuc === "jedinice") {
    const sve = lista("jedinice");
    const refs = sve.map(refJedinica);
    const koliko = new Map<string, number>();
    refs.forEach((r) => koliko.set(r.naziv, (koliko.get(r.naziv) ?? 0) + 1));
    return {
      nadredjena: sve
        .filter((z) => z.id !== id && String(z.podaci.naziv ?? ""))
        .map((z) => {
          const naziv = String(z.podaci.naziv);
          const rod = nadredjenaId(z.podaci.nadredjena, refs);
          const rodNaziv = refs.find((r) => r.id === rod)?.naziv;
          return { v: `#${z.id}`, natpis: (koliko.get(naziv) ?? 0) > 1 && rodNaziv ? `${naziv} (${rodNaziv})` : naziv };
        }),
    };
  }
  return {};
}

/** Podaci stavke za obrazac: stara veza „Pripada pod“ po nazivu postaje veza po broju jedinice */
export function zaObrazac(kljuc: string, podaci: Record<string, unknown>): Record<string, unknown> {
  if (kljuc !== "jedinice" || !podaci.nadredjena || String(podaci.nadredjena).startsWith("#")) return podaci;
  const rod = nadredjenaId(podaci.nadredjena, lista("jedinice").map(refJedinica));
  return rod ? { ...podaci, nadredjena: `#${rod}` } : podaci;
}

/** Naziv nadređene jedinice za listu u adminu (sačuvana je kao „#broj“) */
function nazivJedinice(v: string) {
  const m = /^#(\d+)$/.exec(v);
  return m ? String(jedan(Number(m[1]))?.podaci.naziv ?? "") : v;
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
