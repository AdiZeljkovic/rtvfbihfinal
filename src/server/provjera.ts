import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { Kolekcija } from "@/cms/kolekcije";
import { DOC_DIR, sigurnoIme } from "./putanje";
import { lista } from "./db";
import { nadredjenaId } from "@/lib/jedinice";

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

/**
 * Adresa koju je urednik upisao → ispravan link:
 * „info@rtvfbih.ba“ → mailto:, „www.fbih.gov.ba“ → https://, „dokumenti/statut“ → /dokumenti/statut
 */
export function ispraviAdresu(v: string): string {
  const s = v.trim();
  if (!s || /^(https?:|mailto:|tel:)/i.test(s) || s.startsWith("/") || s.startsWith("#")) return s;
  if (/^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(s)) return `mailto:${s}`;
  if (/^(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/|$)/i.test(s)) return `https://${s}`;
  return `/${s}`;
}

type Obj = Record<string, unknown>;
/** Dijelovi teksta bez praznih (prazan pasus, slika bez slike, tabela bez sadržaja) i s ispravnim linkovima */
function ocistiBlokove(v: unknown): Obj[] {
  if (!Array.isArray(v)) return [];
  const out: Obj[] = [];
  for (const b of v as Obj[]) {
    if (!b || typeof b !== "object" || !("t" in b)) continue;
    switch (b.t) {
      case "pasus":
      case "naslov":
        if (str(b.tekst)) out.push(b);
        break;
      case "slika":
        if (str(b.src)) out.push(b);
        break;
      case "tabela": {
        const redovi = (Array.isArray(b.redovi) ? b.redovi : []).filter((r) => Array.isArray(r) && r.some((c) => str(c)));
        if (redovi.length) out.push({ ...b, redovi });
        break;
      }
      case "linkovi": {
        const stavke = (Array.isArray(b.stavke) ? (b.stavke as Obj[]) : [])
          .map((s) => {
            if (s.doc || !s.ruta) return s;
            const a = ispraviAdresu(str(s.ruta));
            return a.startsWith("/") || a.startsWith("#") ? { ...s, ruta: a } : { tekst: s.tekst, href: a };
          })
          .filter((s) => s.doc || str(s.ruta) || str(s.href) || str(s.tekst));
        if (stavke.length || str(b.prefiks)) out.push({ ...b, stavke });
        break;
      }
      default:
        out.push(b);
    }
  }
  return out;
}
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
          .map((x) => ({ naziv: str((x as Record<string, unknown>).naziv), dokument: str((x as Record<string, unknown>).dokument), adresa: ispraviAdresu(str((x as Record<string, unknown>).adresa)) }))
          .filter((x) => x.dokument || x.adresa)
          .map((x) => ({ ...x, naziv: x.naziv || x.dokument || x.adresa }));
        break;
      }
      case "slika":
        p[polje.ime] = str(v);
        break;
      case "blokovi":
        p[polje.ime] = ocistiBlokove(v);
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
  if (def.kljuc === "dokumenti") p.adresa = ispraviAdresu(str(p.adresa));
  // „facebook.com/federalna.ba“ → https://… (inače bi link vodio na nepostojeću stranicu ovog sajta)
  if (def.kljuc === "osnovno") for (const k of ["youtube", "facebook", "instagram"]) if (k in p) p[k] = ispraviAdresu(str(p[k]));
  if (def.kljuc === "dokumenti" && !p.dokument && !p.adresa) {
    greske.dokument = "Dodajte dokument ili upišite adresu stranice.";
  }
  if (def.kljuc === "jedinice" && str(p.nadredjena)) {
    // veza se pamti po broju jedinice (nazivi se ponavljaju); stari upis po nazivu se pretvara
    const sve = svi("jedinice");
    const refs = sve.map((z) => ({ id: z.id, naziv: String(z.podaci.naziv ?? "") }));
    const rod = nadredjenaId(p.nadredjena, refs);
    if (rod === null) {
      greske.nadredjena = "Odabrana jedinica više ne postoji. Odaberite drugu.";
    } else {
      p.nadredjena = `#${rod}`;
      // jedinica ne smije biti pod samom sobom ni pod svojom podjedinicom (krug)
      const roditelj = new Map(sve.map((z) => [z.id, nadredjenaId(z.podaci.nadredjena, refs)]));
      let trenutna: number | null = rod;
      for (let korak = 0; trenutna !== null && korak < 50; korak++) {
        if (id !== null && trenutna === id) {
          greske.nadredjena = "Jedinica ne može biti pod samom sobom ni pod svojim odjelom. Odaberite drugu.";
          break;
        }
        trenutna = roditelj.get(trenutna) ?? null;
      }
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
