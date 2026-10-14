import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { Kolekcija } from "@/cms/kolekcije";
import { DOC_DIR, sigurnoIme } from "./putanje";
import { lista } from "./db";

export type Greske = Record<string, string>;

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 70) || "stavka";

/** Svi zapisi kolekcije: objavljeni, u korpi i u arhivi */
const svi = (kolekcija: string) => [...lista(kolekcija, "objavljeno"), ...lista(kolekcija, "korpa"), ...lista(kolekcija, "arhiva")];

const str = (v: unknown) => (typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim());
const postojiDokument = (ime: string) => fs.existsSync(path.join(DOC_DIR, sigurnoIme(ime)));

/** Čisti i provjerava podatke iz obrasca prema opisu kolekcije */
export function provjeri(def: Kolekcija, ulaz: Record<string, unknown>, id: number | null, stari?: Record<string, unknown>) {
  const greske: Greske = {};
  const p: Record<string, unknown> = { ...(stari ?? {}) };

  for (const polje of def.polja) {
    const v = ulaz[polje.ime];
    switch (polje.vrsta) {
      case "tekst":
      case "dugiTekst":
      case "datum": {
        const s = str(v);
        if ("obavezno" in polje && polje.obavezno && !s) greske[polje.ime] = `Upišite: ${polje.naziv.toLowerCase()}.`;
        if (polje.vrsta === "datum" && s && !/^\d{4}-\d{2}-\d{2}$/.test(s)) greske[polje.ime] = "Datum nije ispravan.";
        p[polje.ime] = s;
        break;
      }
      case "broj": {
        const s = str(v);
        const n = Number(s.replace(",", "."));
        if (polje.obavezno && !s) greske[polje.ime] = `Upišite: ${polje.naziv.toLowerCase()}.`;
        else if (s && Number.isNaN(n)) greske[polje.ime] = "Upišite broj.";
        p[polje.ime] = s ? n : "";
        break;
      }
      case "izbor": {
        const s = str(v);
        if (polje.obavezno && !s) greske[polje.ime] = `Odaberite: ${polje.naziv.toLowerCase()}.`;
        p[polje.ime] = s;
        break;
      }
      case "prekidac":
        p[polje.ime] = v === true || v === "true" || v === "on";
        break;
      case "dokument": {
        const s = str(v);
        if (polje.obavezno && !s) greske[polje.ime] = "Dodajte dokument.";
        else if (s && !postojiDokument(s)) greske[polje.ime] = "Dokument nije pronađen. Dodajte ga ponovo.";
        p[polje.ime] = s ? sigurnoIme(s) : "";
        break;
      }
      case "dokumenti": {
        const arr = Array.isArray(v) ? v : [];
        p[polje.ime] = arr
          .map((x) => ({ naziv: str((x as Record<string, unknown>).naziv), dokument: str((x as Record<string, unknown>).dokument), adresa: str((x as Record<string, unknown>).adresa) }))
          .filter((x) => x.dokument || x.adresa)
          .map((x) => ({ ...x, naziv: x.naziv || x.dokument || x.adresa }));
        break;
      }
      case "slika":
        p[polje.ime] = str(v);
        break;
      case "blokovi":
        p[polje.ime] = Array.isArray(v) ? v.filter((b) => b && typeof b === "object" && "t" in (b as object)) : [];
        break;
      case "lista": {
        const arr = Array.isArray(v) ? v : [];
        p[polje.ime] = arr
          .map((x) => Object.fromEntries(polje.polja.map((pp) => [pp.ime, str((x as Record<string, unknown>)[pp.ime])])))
          .filter((x) => Object.values(x).some(Boolean));
        break;
      }
    }
  }

  // ── posebna pravila po kolekciji ──
  if (def.kljuc === "dokumenti" && !p.dokument && !p.adresa) {
    greske.dokument = "Dodajte dokument ili upišite adresu stranice.";
  }
  if (def.kljuc === "jedinice" && str(p.nadredjena)) {
    // jedinica ne smije biti pod samom sobom ni pod svojom podjedinicom (krug)
    const sve = svi("jedinice").filter((z) => z.id !== id);
    const roditelj = new Map(sve.map((z) => [String(z.podaci.naziv), String(z.podaci.nadredjena ?? "")]));
    const ime = str(p.naziv);
    let trenutna = str(p.nadredjena);
    for (let korak = 0; trenutna && korak < 50; korak++) {
      if (trenutna === ime) {
        greske.nadredjena = "Jedinica ne može biti pod samom sobom ni pod svojim odjelom. Odaberite drugu.";
        break;
      }
      trenutna = roditelj.get(trenutna) ?? "";
    }
  }
  if (def.kljuc === "emisije") {
    // provjera i u korpi i arhivi: vraćena emisija ne smije dobiti istu adresu kao nova
    const zauzeti = new Set(svi("emisije").filter((z) => z.id !== id).map((z) => String(z.podaci.slug)));
    let s = str(p.slug) || slug(str(p.naziv));
    if (!stari?.slug || zauzeti.has(s)) {
      const osnova = slug(str(p.naziv));
      s = osnova;
      for (let i = 2; zauzeti.has(s); i++) s = `${osnova}-${i}`;
    }
    p.slug = s;
  }
  if (def.kljuc === "tekstovi" && !str(p.ruta)) {
    const zauzete = new Set(svi("tekstovi").map((z) => String(z.podaci.ruta)));
    let r = `/dokumenti/${slug(str(p.naslov))}`;
    for (let i = 2; zauzete.has(r); i++) r = `/dokumenti/${slug(str(p.naslov))}-${i}`;
    p.ruta = r;
  }

  return { podaci: p, greske };
}
