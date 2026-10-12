import "server-only";
import { cache } from "react";
import { jedinstven as jedinstvenIzBaze, podaci as podaciIzBaze } from "./db";
import { VRSTE_NABAVKI } from "@/cms/kolekcije";
import { sazetak, type Blok, type NabavkaGodina } from "@/content/arhiva";
import { docUrl } from "@/lib/doc";
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
/** Emisije s upisanim terminom čine programsku shemu */
export const programskaShema = () => emisije().filter((e) => e.termin);
/** Kratki opis: upisani opis ili početak teksta o emisiji */
export const opisEmisije = (e: EmisijaCms, max = 160) => e.opis || sazetak(e.tekst ?? [], max);

/** Vrijeme (HH:MM) i dan iz slobodnog teksta termina, npr. „Petkom u 18:20“ */
export function rastaviTermin(termin: string) {
  const vrijeme = termin.match(/\d{1,2}:\d{2}/)?.[0];
  const dan = termin.split(/ u |,|\s\d/)[0].trim();
  return { vrijeme, dan, uzivo: /uživo/i.test(termin) };
}

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
export type JedinicaCms = { naziv: string; telefon: string; email: string; osobe: OsobaCms[]; pod: JedinicaCms[] };

export function organizacija(): JedinicaCms[] {
  const sve = podaci<{ naziv: string; nadredjena: string; telefon: string; email: string; osobe: OsobaCms[] }>("jedinice");
  const nazivi = new Set(sve.map((j) => j.naziv));
  // jedinica čija nadređena ne postoji (npr. greškom upisana) prikazuje se kao glavna, ne nestaje
  const nad = (j: (typeof sve)[number]) => (j.nadredjena && nazivi.has(j.nadredjena) && j.nadredjena !== j.naziv ? j.nadredjena : "");
  const iskoristene = new Set<number>();
  const gradi = (roditelj: string): JedinicaCms[] =>
    sve
      .filter((j) => nad(j) === roditelj && !iskoristene.has(j._id))
      .map((j) => {
        iskoristene.add(j._id); // zaštita od kruga (A pod B, B pod A)
        return { naziv: j.naziv, telefon: j.telefon, email: j.email, osobe: j.osobe ?? [], pod: gradi(j.naziv) };
      });
  const stablo = gradi("");
  // jedinice zarobljene u krugu ipak se prikažu
  const ostale = sve.filter((j) => !iskoristene.has(j._id));
  return ostale.length
    ? [...stablo, ...ostale.map((j) => ({ naziv: j.naziv, telefon: j.telefon, email: j.email, osobe: j.osobe ?? [], pod: [] }))]
    : stablo;
}

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
/** Cjenovnik po dijelu naziva (za kartice kanala oglašavanja) */
export const cjenovnik = (dio: string, zamjena: string) =>
  dokumenti("Cjenovnici").find((c) => c.label.includes(dio))?.href ?? zamjena;

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
/** Osnovni podaci (adresa, telefoni, mreže); prazna polja uzimaju zadanu vrijednost */
export function osnovno(): Osnovno {
  const o = jedinstven<Partial<Osnovno>>("osnovno") ?? {};
  return Object.fromEntries(
    Object.entries(ZADANO).map(([k, v]) => [k, (o[k as keyof Osnovno] as string) || v])
  ) as Osnovno;
}
export const telHref = (t: string) => `tel:${t.replace(/\(0\)/, "").replace(/[^\d+]/g, "")}`;
