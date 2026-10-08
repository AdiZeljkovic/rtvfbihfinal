/**
 * Sadržaj prenesen sa stare stranice (rtvfbih.ba/loc).
 * JSON fajlove generiše skripta za uvoz; ovdje su samo tipovi i pomoćne funkcije.
 */
import tekstoviJson from "./tekstovi.json";
import nabavkeJson from "./nabavke.json";
import faqJson from "./faq.json";
import emisijeJson from "./emisije.json";

/** Link u uvezenom sadržaju: dokument, stranica nove stranice ili vanjska adresa */
export type ArhivaLink = { tekst: string; doc?: string; ruta?: string; href?: string };

export type Blok =
  | { t: "naslov"; tekst: string }
  | { t: "pasus"; tekst: string }
  | { t: "linkovi"; prefiks: string; stavke: ArhivaLink[] }
  | { t: "tabela"; redovi: string[][] }
  | { t: "slika"; src: string; ruta?: string; doc?: string };

export type ArhivaTekst = {
  wbf: number;
  ruta: string;
  naslov: string;
  nadnaslov: string;
  blokovi: Blok[];
};

export type NabavkaStavka = { tekst: string; doc: string; grupa?: string };
export type NabavkaSekcija = { naslov: string; stavke: NabavkaStavka[]; napomene?: string[] };
export type NabavkaGodina = { godina: number; wbf: number; sekcije: NabavkaSekcija[] };

export type Pitanje = { pitanje: string; odgovor: string[] };

export type Emisija = {
  slug: string;
  wbf: number;
  grupa: "Aktuelna sezona" | "Emisije Federalne televizije" | "Strani program" | "Arhiva emisija";
  naslov: string;
  serija: boolean;
  slika: string | null;
  logo: string | null;
  blokovi: Blok[];
};

export const tekstovi = tekstoviJson as unknown as Record<string, ArhivaTekst>;
export const nabavke = (Object.values(nabavkeJson) as unknown as NabavkaGodina[]).sort((a, b) => b.godina - a.godina);
export const faq = faqJson as Pitanje[];
export const emisije = emisijeJson as unknown as Emisija[];

/** Tekst za datu rutu, npr. "/dokumenti/statut" */
export const tekstZaRutu = (ruta: string) => tekstovi[ruta];
/** Svi slugovi tekstova pod datom rubrikom, npr. "dokumenti" → ["statut", …] */
export const slugoviRubrike = (rubrika: string) =>
  Object.keys(tekstovi)
    .filter((r) => r.startsWith(`/${rubrika}/`))
    .map((r) => r.slice(rubrika.length + 2));

export const brojDokumenataGodine = (g: NabavkaGodina) => g.sekcije.reduce((n, s) => n + s.stavke.length, 0);

/** Kratki opis iz prvih pasusa (za meta opis i kartice) */
export const sazetak = (bl: Blok[], max = 180) => {
  const t = bl
    .filter((b): b is { t: "pasus"; tekst: string } => b.t === "pasus")
    .map((b) => b.tekst)
    .join(" ");
  return t.length > max ? t.slice(0, max).replace(/\s+\S*$/, "") + "…" : t;
};
