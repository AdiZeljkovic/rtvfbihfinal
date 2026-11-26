import "server-only";
import { cache } from "react";
import { jedinstven as jedinstvenIzBaze, podaci as podaciIzBaze } from "./db";
import { ARHIVSKE_STRANICE, VRSTE_NABAVKI } from "@/cms/kolekcije";
import { sazetak, type Blok, type NabavkaGodina } from "@/content/arhiva";
import { docUrl } from "@/lib/doc";
import { nadredjenaId } from "@/lib/jedinice";
import { site } from "@/content/site";

/**
 * Sadržaj stranice iz baze CMS-a. Javne stranice čitaju samo odavde;
 * nakon svake izmjene u adminu stranice se automatski osvježe.
 *
 * Kolekcija se tokom jednog prikaza stranice čita iz baze samo jednom (React `cache`),
 * pa ne smeta što je više komponenti traži. Vraćene liste se ne smiju mijenjati na mjestu.
 */
const ucitajKolekciju = cache((kolekcija: string) => podaciIzBaze<Record<string, unknown>>(kolekcija));
const podaci = <T,>(kolekcija: string) => ucitajKolekciju(kolekcija) as unknown as (T & { _id: number })[];
const ucitajJedinstven = cache((kolekcija: string) => jedinstvenIzBaze<Record<string, unknown>>(kolekcija));
const jedinstven = <T,>(kolekcija: string) => ucitajJedinstven(kolekcija) as T;

/** Tekst iz obrasca → pasusi (prazan red odvaja pasuse) */
export const pasusi = (s?: string) =>
  (s ?? "")
    .split(/\n\s*\n/)
    .map((x) => x.trim())
    .filter(Boolean);

// ── arhivirane stranice ─────────────────────────────────────────────────
/** Rute cijelih stranica koje je urednik arhivirao (ne prikazuju se, ni linkovi na njih) */
export const arhiviraneRute = cache(function arhiviraneRute(): Set<string> {
  const p = jedinstven<Record<string, unknown>>("stranice") ?? {};
  return new Set(ARHIVSKE_STRANICE.filter((s) => p[s.ime] === true).map((s) => s.ruta));
});
export const rutaArhivirana = (ruta: string) => arhiviraneRute().has(ruta);
/** Linkovi bez onih koji vode na arhivirane stranice (i u podmenijima) */
export function bezArhiviranih<T extends { href: string; children?: { href: string }[] }>(linkovi: T[]): T[] {
  const a = arhiviraneRute();
  return linkovi
    .filter((l) => !a.has(l.href))
    .map((l) => (l.children ? { ...l, children: l.children.filter((c) => !a.has(c.href)) } : l));
}

// ── javne nabavke ───────────────────────────────────────────────────────
type NabavkaZ = { naziv: string; dokument: string; vrsta: string; godina: string; postupak?: string };

/** Nabavke grupisane po godini i vrsti (računa se jednom po prikazu stranice) */
export const nabavkePoGodinama = cache(function nabavkePoGodinama(): NabavkaGodina[] {
  const sve = podaci<NabavkaZ>("nabavke");
  const godine = [...new Set(sve.map((n) => Number(n.godina)))].sort((a, b) => b - a);
  return godine.map((g) => {
    const odGodine = sve.filter((n) => Number(n.godina) === g);
    const vrste = [...new Set(odGodine.map((n) => n.vrsta))].sort((a, b) => {
      const ia = VRSTE_NABAVKI.indexOf(a);
      const ib = VRSTE_NABAVKI.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    return {
      godina: g,
      wbf: 0,
      sekcije: vrste.map((v) => ({
        naslov: v,
        stavke: odGodine
          .filter((n) => n.vrsta === v)
          .map((n) => ({ tekst: n.naziv, doc: n.dokument, ...(n.postupak ? { grupa: n.postupak } : {}) })),
      })),
    };
  });
});

/** Posljednja objavljena nabavka (nove idu na vrh liste) iz najnovije godine */
export function najnovijaNabavka() {
  const sve = podaci<NabavkaZ>("nabavke");
  const max = Math.max(...sve.map((n) => Number(n.godina)));
  return sve.find((n) => Number(n.godina) === max);
}

// ── dokumenti ───────────────────────────────────────────────────────────
type DokumentZ = { naziv: string; dokument?: string; adresa?: string; kategorija: string };
export type DokStavka = { label: string; href: string };

export function dokumenti(kategorija: string): DokStavka[] {
  return podaci<DokumentZ>("dokumenti")
    .filter((d) => d.kategorija === kategorija)
    .map((d) => ({ label: d.naziv, href: d.dokument ? docUrl(d.dokument) : d.adresa || "#" }));
}

// ── obavijesti i konkursi ───────────────────────────────────────────────
export type Obavijest = {
  _id: number;
  naslov: string;
  datum: string;
  tekst: string;
  rok?: string;
  dokumenti: { naziv: string; dokument?: string; adresa?: string }[];
};
export const obavijesti = () => podaci<Omit<Obavijest, "_id">>("obavijesti") as Obavijest[];

// ── emisije ─────────────────────────────────────────────────────────────
export type EmisijaCms = {
  _id: number;
  naziv: string;
  slug: string;
  grupa: "Aktuelna sezona" | "Emisije Federalne televizije" | "Strani program" | "Arhiva emisija";
  vrsta: string;
  termin: string;
  opis: string;
  slika: string;
  logo: string;
  naslovna: boolean;
  glavna: boolean;
  serija: boolean;
  tekst: Blok[];
};
export const emisije = () => podaci<Omit<EmisijaCms, "_id">>("emisije") as EmisijaCms[];
export const emisijaPoSlugu = (slug: string) => emisije().find((e) => e.slug === slug);
/** Emisije s upisanim terminom čine programsku shemu (emisija premještena u grupu „Arhiva emisija“ nije u shemi) */
export const programskaShema = () => emisije().filter((e) => e.termin && e.grupa !== "Arhiva emisija");
/** Kratki opis: upisani opis ili početak teksta o emisiji */
export const opisEmisije = (e: EmisijaCms, max = 160) => e.opis || sazetak(e.tekst ?? [], max);

/** Vrijeme i dan iz slobodnog teksta termina, npr. „Petkom u 18:20“ ili „Petkom u 18.20“ */
export { rastaviTermin } from "@/lib/termin";

// ── RTV taksa ───────────────────────────────────────────────────────────
export const pitanja = () =>
  podaci<{ pitanje: string; odgovor: string }>("pitanja").map((p) => ({
    pitanje: p.pitanje,
    odgovor: pasusi(p.odgovor),
  }));

// ── duži tekstovi ───────────────────────────────────────────────────────
export type TekstCms = { _id: number; naslov: string; nadnaslov: string; ruta: string; sadrzaj: Blok[] };
export const tekstovi = () => podaci<Omit<TekstCms, "_id">>("tekstovi") as TekstCms[];
export const tekstZaRutu = (ruta: string) => tekstovi().find((t) => t.ruta === ruta);
export const slugoviRubrike = (rubrika: string) =>
  tekstovi()
    .filter((t) => t.ruta.startsWith(`/${rubrika}/`))
    .map((t) => t.ruta.slice(rubrika.length + 2));

// ── Upravni odbor ───────────────────────────────────────────────────────
export const clanoviUO = () => podaci<{ ime: string; uloga: string; predstavnik: string; mandat: string }>("upravni-odbor");
export const saopstenjeUO = () =>
  jedinstven<{ osnov: string; naslov: string; tekst: string; potpis: string }>("uo-saopstenje");

// ── organizacija ────────────────────────────────────────────────────────
export type OsobaCms = { ime: string; uloga: string; telefon: string; email: string };
export type JedinicaCms = {
  id: number;
  naziv: string;
  telefon: string;
  email: string;
  osobe: OsobaCms[];
  /** Natpis kartice na stranici Kontakt (prazno = nije na Kontaktu) */
  kontaktNaziv: string;
  /** Druga stranica na kojoj se jedinica prikazuje: „Radio“ ili „RTV taksa“ */
  prikazNa: string;
  pod: JedinicaCms[];
};
type JedinicaZ = { naziv: string; nadredjena: string; telefon: string; email: string; osobe: OsobaCms[]; kontaktNaziv?: string; prikazNa?: string };

export const organizacija = cache(function organizacija(): JedinicaCms[] {
  const sve = podaci<JedinicaZ>("jedinice");
  const refs = sve.map((j) => ({ id: j._id, naziv: j.naziv }));
  // jedinica čija nadređena ne postoji (npr. arhivirana) prikazuje se kao glavna, ne nestaje
  const nad = (j: (typeof sve)[number]) => {
    const r = nadredjenaId(j.nadredjena, refs);
    return r !== j._id ? r : null;
  };
  const cvor = (j: (typeof sve)[number], pod: JedinicaCms[]): JedinicaCms => ({
    id: j._id,
    naziv: j.naziv,
    telefon: j.telefon ?? "",
    email: j.email ?? "",
    osobe: j.osobe ?? [],
    kontaktNaziv: (j.kontaktNaziv ?? "").trim(),
    prikazNa: j.prikazNa ?? "",
    pod,
  });
  const iskoristene = new Set<number>();
  const gradi = (roditelj: number | null): JedinicaCms[] =>
    sve
      .filter((j) => nad(j) === roditelj && !iskoristene.has(j._id))
      .map((j) => {
        iskoristene.add(j._id); // zaštita od kruga (A pod B, B pod A)
        return cvor(j, gradi(j._id));
      });
  const stablo = gradi(null);
  // jedinice zarobljene u krugu ipak se prikažu
  const ostale = sve.filter((j) => !iskoristene.has(j._id));
  return ostale.length ? [...stablo, ...ostale.map((j) => cvor(j, []))] : stablo;
});

/** Sve jedinice (bez stabla), redom kao na stranici Organizacija */
function sveJedinice(): JedinicaCms[] {
  const out: JedinicaCms[] = [];
  const idi = (l: JedinicaCms[]) => l.forEach((j) => (out.push(j), idi(j.pod)));
  idi(organizacija());
  return out;
}

/** Jedinica označena za prikaz na drugoj stranici (Radio, RTV taksa) */
export const jedinicaZa = (stranica: "Radio" | "RTV taksa") => sveJedinice().find((j) => j.prikazNa === stranica);

/** Kartice „Direktni kontakti“ na stranici Kontakt: jedinice kojima je upisan natpis kartice */
export const kontaktKartice = () => sveJedinice().filter((j) => j.kontaktNaziv);

/** Telefon i e-mail jedinice, a ako ih nema – prve osobe koja ih ima */
export const kontaktJedinice = (j: JedinicaCms) => ({
  telefon: j.telefon || j.osobe.find((o) => o.telefon)?.telefon || "",
  email: j.email || j.osobe.find((o) => o.email)?.email || "",
});

// ── marketing ───────────────────────────────────────────────────────────
export type KontaktCms = { _id: number; ime: string; odjel: string; uloga: string; telefon: string; fax: string; email: string };
export const marketingKontakti = () => podaci<Omit<KontaktCms, "_id">>("marketing") as KontaktCms[];
/** Kontakti po odjelima, rukovodstvo prvo */
export function marketingOdjeli() {
  const sve = marketingKontakti();
  const rukovodstvo = sve.filter((k) => k.odjel === "Rukovodstvo");
  const odjeli = [...new Set(sve.filter((k) => k.odjel !== "Rukovodstvo").map((k) => k.odjel || "Ostalo"))].map((naziv) => ({
    naziv,
    osobe: sve.filter((k) => (k.odjel || "Ostalo") === naziv),
  }));
  return { rukovodstvo, odjeli, ukupno: sve.length };
}
/** Prepoznavanje kanala po nazivu dokumenta u kategoriji „Cjenovnici“ (cjenovnici za izbore se ne računaju) */
const KANALI_OGLASAVANJA = {
  tv: /CPP|Federalna TV|televizij/i,
  radio: /radio/i,
  portal: /portal|web/i,
  teletekst: /teletekst/i,
} as const;
export type KanalOglasavanja = keyof typeof KANALI_OGLASAVANJA;
/** Najveća godina upisana u naziv („… 2027.“), ili 0 */
const godinaNaziva = (s: string) => Math.max(0, ...Array.from(s.matchAll(/\b(?:19|20)\d{2}\b/g), (m) => Number(m[0])));
const redovniCjenovnici = () => dokumenti("Cjenovnici").filter((c) => !/izbor/i.test(c.label));

/**
 * Važeći cjenovnik kanala: među cjenovnicima tog kanala onaj s najnovijom godinom u nazivu
 * (ista godina → prvi na listi). Kad urednik doda cjenovnik za novu godinu, kartice same vode na njega.
 */
export function cjenovnikKanala(kanal: KanalOglasavanja): { href: string; godina: number | null } | null {
  let najbolji: DokStavka | undefined;
  for (const c of redovniCjenovnici().filter((c) => KANALI_OGLASAVANJA[kanal].test(c.label))) {
    if (!najbolji || godinaNaziva(c.label) > godinaNaziva(najbolji.label)) najbolji = c;
  }
  return najbolji ? { href: najbolji.href, godina: godinaNaziva(najbolji.label) || null } : null;
}
/** Godina važećih cjenovnika (najnovija u nazivima), za natpise „Cjenovnici 2026.“; null ako nije upisana */
export const godinaCjenovnika = () => Math.max(0, ...redovniCjenovnici().map((c) => godinaNaziva(c.label))) || null;

// ── frekvencije ─────────────────────────────────────────────────────────
export const fmFrekvencije = () => podaci<{ lokacija: string; mhz: string; pokriva: string }>("fm");
export const dvbRegije = () => podaci<{ naziv: string; kanal: number; podrucje: string }>("dvb");

// ── osnovni podaci ──────────────────────────────────────────────────────
export type Osnovno = {
  adresa: string;
  grad: string;
  telefon: string;
  emailDirekcija: string;
  emailPress: string;
  generalniDirektor: string;
  telefonDirektor: string;
  youtube: string;
  facebook: string;
  instagram: string;
};
const ZADANO: Osnovno = {
  adresa: site.address.street,
  grad: site.address.city,
  telefon: site.phone,
  emailDirekcija: site.emails.direkcija,
  emailPress: site.emails.press,
  generalniDirektor: "",
  telefonDirektor: "",
  youtube: site.social.youtube,
  facebook: site.social.facebook,
  instagram: site.social.instagram,
};
/** Mreže: urednik ih može i ukloniti (prazno polje = mreža se ne prikazuje) */
const MREZE = new Set(["youtube", "facebook", "instagram"]);
/** Osnovni podaci (adresa, telefoni, mreže); prazna polja uzimaju zadanu vrijednost, osim sačuvanih praznih mreža */
export function osnovno(): Osnovno {
  const o = jedinstven<Partial<Osnovno>>("osnovno") ?? {};
  return Object.fromEntries(
    Object.entries(ZADANO).map(([k, v]) => {
      const upisano = o[k as keyof Osnovno] as string | undefined;
      return [k, MREZE.has(k) && typeof upisano === "string" ? upisano : upisano || v];
    })
  ) as Osnovno;
}
export { telHref } from "@/lib/telefon";

/** Kontakt za mobilni meni zaglavlja (isti podaci kao u podnožju) */
export function kontaktZaglavlja() {
  const o = osnovno();
  return { telefon: o.telefon, email: o.emailDirekcija, youtube: o.youtube, facebook: o.facebook, instagram: o.instagram };
}
