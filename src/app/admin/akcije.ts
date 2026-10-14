"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { kolekcija } from "@/cms/kolekcije";
import { jedan, lista, obrisiTrajno as obrisiZauvijek, pomjeri, postaviStatus, sacuvaj } from "@/server/db";
import { provjeri, type Greske } from "@/server/provjera";
import {
  imaKorisnika,
  ispravanKod,
  noviKorisnik,
  obrisiKorisnika,
  odjavi,
  prijavi,
  promijeniLozinku,
  prviUrednikPrekoWeba,
  trenutniKorisnik,
} from "@/server/auth";

/**
 * Sve radnje iz admina. Svaka provjerava prijavu, a nakon izmjene
 * osvježava cijelu javnu stranicu, pa se promjena odmah vidi.
 */

const osvjezi = () => revalidatePath("/", "layout");

export type Rezultat = { greske?: Greske; poruka?: string; id?: number; istekla?: boolean };

const ISTEKLA: Rezultat = {
  istekla: true,
  poruka: "Vaša prijava je istekla. Ništa nije izgubljeno: prijavite se u novom prozoru, pa se vratite ovdje i ponovo kliknite isto dugme.",
};
const GRESKA = "Nešto nije u redu. Osvježite stranicu (tipka F5) i pokušajte ponovo.";

/**
 * Radnje nad sadržajem: ako prijava istekne, vraća poruku umjesto preusmjeravanja
 * (da urednik ne izgubi upisani tekst), a greške pretvara u razumljivu poruku.
 */
async function radnja(fn: (ime: string) => Rezultat | void): Promise<Rezultat> {
  const k = await trenutniKorisnik();
  if (!k) return ISTEKLA;
  try {
    return fn(k.ime) ?? {};
  } catch (e) {
    console.error("[CMS]", e);
    return { poruka: (e as Error).message === "Zapis nije pronađen." ? "Ta stavka više ne postoji. Možda ju je neko drugi obrisao." : GRESKA };
  }
}

// ── sadržaj ─────────────────────────────────────────────────────────────

export async function sacuvajZapis(kljuc: string, id: number | null, ulaz: Record<string, unknown>): Promise<Rezultat> {
  return radnja((ime) => sacuvajSadrzaj(ime, kljuc, id, ulaz));
}

function sacuvajSadrzaj(korisnik: string, kljuc: string, id: number | null, ulaz: Record<string, unknown>): Rezultat {
  const def = kolekcija(kljuc);
  if (!def) return { poruka: "Nepoznata vrsta sadržaja." };

  let stari: Record<string, unknown> | undefined;
  if (id) {
    const z = jedan(id);
    if (!z || z.kolekcija !== kljuc) return { poruka: "Stavka više ne postoji. Možda ju je neko obrisao." };
    stari = z.podaci;
  } else if (def.jedinstven) {
    // podešavanja imaju samo jedan zapis – ako postoji, uređuje se on
    const postojeci = lista(kljuc)[0];
    if (postojeci) {
      id = postojeci.id;
      stari = postojeci.podaci;
    }
  }

  const { podaci, greske } = provjeri(def, ulaz, id, stari);
  if (Object.keys(greske).length) {
    return { greske, poruka: "Nešto treba ispraviti. Pogledajte polja označena crvenom bojom." };
  }
  const noviId = sacuvaj(kljuc, id, podaci, korisnik);

  // preimenovan sektor: njegovi odjeli ostaju pod njim (veza je po nazivu)
  const staroIme = String(stari?.naziv ?? "");
  if (kljuc === "jedinice" && staroIme && staroIme !== podaci.naziv) {
    for (const dijete of [...lista("jedinice"), ...lista("jedinice", "korpa"), ...lista("jedinice", "arhiva")]) {
      if (dijete.podaci.nadredjena === staroIme) {
        sacuvaj("jedinice", dijete.id, { ...dijete.podaci, nadredjena: podaci.naziv }, korisnik);
      }
    }
  }
  osvjezi();
  return { id: noviId };
}

export async function uKorpu(id: number): Promise<Rezultat> {
  return radnja((ime) => {
    postaviStatus(id, "korpa", ime);
    osvjezi();
  });
}

/** Arhiva: stavka se ne vidi na stranici, ali ostaje sačuvana i može se vratiti */
export async function uArhivu(id: number): Promise<Rezultat> {
  return radnja((ime) => {
    postaviStatus(id, "arhiva", ime);
    osvjezi();
  });
}

/** Vraća stavku iz korpe ili arhive na stranicu */
export async function vratiNaStranicu(id: number): Promise<Rezultat> {
  return radnja((ime) => {
    postaviStatus(id, "objavljeno", ime);
    osvjezi();
  });
}

/** Trajno brisanje – samo za stavke koje su već u korpi */
export async function obrisiTrajno(id: number): Promise<Rezultat> {
  return radnja((ime) => obrisiZauvijek(id, ime));
}

export async function pomjeriZapis(id: number, smjer: -1 | 1): Promise<Rezultat> {
  return radnja(() => {
    pomjeri(id, smjer);
    osvjezi();
  });
}

// ── prijava i korisnici ─────────────────────────────────────────────────

export type StanjeObrasca = { greska?: string; uspjeh?: string } | undefined;

const tekst = (fd: FormData, ime: string) => String(fd.get(ime) ?? "");

export async function prijavaAkcija(_: StanjeObrasca, fd: FormData): Promise<StanjeObrasca> {
  const r = await prijavi(tekst(fd, "korisnik"), tekst(fd, "lozinka"));
  if (!r.ok) return { greska: r.poruka };
  redirect("/admin");
}

/** Prvo pokretanje: pravi se prvi urednik (samo dok nema nijednog, a na serveru samo uz kod) */
export async function prviKorisnikAkcija(_: StanjeObrasca, fd: FormData): Promise<StanjeObrasca> {
  if (imaKorisnika()) return { greska: "Urednik je već napravljen. Prijavite se." };
  if (!prviUrednikPrekoWeba()) return { greska: "Prvi urednik se pravi na serveru komandom: npm run urednik" };
  if (!ispravanKod(tekst(fd, "kod"))) return { greska: "Kod za postavljanje nije tačan." };
  const korisnik = tekst(fd, "korisnik");
  const lozinka = tekst(fd, "lozinka");
  if (lozinka !== tekst(fd, "lozinka2")) return { greska: "Lozinke se ne podudaraju. Upišite istu lozinku dva puta." };
  try {
    await noviKorisnik(korisnik, tekst(fd, "ime"), lozinka);
  } catch (e) {
    return { greska: (e as Error).message };
  }
  await prijavi(korisnik, lozinka);
  redirect("/admin");
}

export async function odjavaAkcija() {
  await odjavi();
  redirect("/admin/prijava");
}

export async function dodajKorisnikaAkcija(_: StanjeObrasca, fd: FormData): Promise<StanjeObrasca> {
  if (!(await trenutniKorisnik())) return { greska: ISTEKLA.poruka };
  try {
    await noviKorisnik(tekst(fd, "korisnik"), tekst(fd, "ime"), tekst(fd, "lozinka"));
  } catch (e) {
    return { greska: (e as Error).message };
  }
  revalidatePath("/admin/korisnici");
  return { uspjeh: "Novi urednik je dodan. Pošaljite mu korisničko ime i lozinku." };
}

export async function lozinkaAkcija(_: StanjeObrasca, fd: FormData): Promise<StanjeObrasca> {
  const k = await trenutniKorisnik();
  if (!k) return { greska: ISTEKLA.poruka };
  const nova = tekst(fd, "lozinka");
  if (nova !== tekst(fd, "lozinka2")) return { greska: "Nove lozinke se ne podudaraju. Upišite istu novu lozinku dva puta." };
  try {
    await promijeniLozinku(k.id, tekst(fd, "stara"), nova);
  } catch (e) {
    return { greska: (e as Error).message };
  }
  return { uspjeh: "Lozinka je promijenjena. Na svim drugim računarima trebat će se ponovo prijaviti." };
}

export async function obrisiKorisnikaAkcija(id: number): Promise<Rezultat> {
  const k = await trenutniKorisnik();
  if (!k) return ISTEKLA;
  if (id === k.id) return { poruka: "Ne možete ukloniti sami sebe." };
  obrisiKorisnika(id);
  revalidatePath("/admin/korisnici");
  return {};
}
