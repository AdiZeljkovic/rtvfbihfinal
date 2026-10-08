"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { kolekcija } from "@/cms/kolekcije";
import { baza, jedan, lista, pomjeri, postaviStatus, sacuvaj } from "@/server/db";
import { provjeri, type Greske } from "@/server/provjera";
import {
  imaKorisnika,
  noviKorisnik,
  obaveznaPrijava,
  obrisiKorisnika,
  odjavi,
  prijavi,
  promijeniLozinku,
} from "@/server/auth";

/**
 * Sve radnje iz admina. Svaka provjerava prijavu, a nakon izmjene
 * osvježava cijelu javnu stranicu, pa se promjena odmah vidi.
 */

const osvjezi = () => revalidatePath("/", "layout");

export type Rezultat = { greske?: Greske; poruka?: string; id?: number };

// ── sadržaj ─────────────────────────────────────────────────────────────

export async function sacuvajZapis(kljuc: string, id: number | null, ulaz: Record<string, unknown>): Promise<Rezultat> {
  const k = await obaveznaPrijava();
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
    return { greske, poruka: "Nešto nije popunjeno. Pogledajte polja označena crvenom bojom." };
  }
  const noviId = sacuvaj(kljuc, id, podaci, k.ime);
  osvjezi();
  return { id: noviId };
}

export async function uKorpu(id: number) {
  const k = await obaveznaPrijava();
  postaviStatus(id, "korpa", k.ime);
  osvjezi();
}

export async function vratiIzKorpe(id: number) {
  const k = await obaveznaPrijava();
  postaviStatus(id, "objavljeno", k.ime);
  osvjezi();
}

/** Trajno brisanje – samo za stavke koje su već u korpi */
export async function obrisiTrajno(id: number) {
  await obaveznaPrijava();
  const z = jedan(id);
  if (!z || z.status !== "korpa") return;
  baza().prepare("DELETE FROM zapisi WHERE id = ?").run(id);
}

export async function pomjeriZapis(id: number, smjer: -1 | 1) {
  await obaveznaPrijava();
  pomjeri(id, smjer);
  osvjezi();
}

// ── prijava i korisnici ─────────────────────────────────────────────────

export type StanjeObrasca = { greska?: string; uspjeh?: string } | undefined;

export async function prijavaAkcija(_: StanjeObrasca, fd: FormData): Promise<StanjeObrasca> {
  const ok = await prijavi(String(fd.get("korisnik") ?? ""), String(fd.get("lozinka") ?? ""));
  if (!ok) return { greska: "Korisničko ime ili lozinka nisu tačni. Pokušajte ponovo." };
  redirect("/admin");
}

/** Prvo pokretanje: pravi se prvi urednik (samo dok nema nijednog) */
export async function prviKorisnikAkcija(_: StanjeObrasca, fd: FormData): Promise<StanjeObrasca> {
  if (imaKorisnika()) return { greska: "Urednik je već napravljen. Prijavite se." };
  const korisnik = String(fd.get("korisnik") ?? "");
  const lozinka = String(fd.get("lozinka") ?? "");
  if (lozinka !== String(fd.get("lozinka2") ?? "")) return { greska: "Lozinke se ne podudaraju. Upišite istu lozinku dva puta." };
  try {
    noviKorisnik(korisnik, String(fd.get("ime") ?? ""), lozinka);
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
  await obaveznaPrijava();
  try {
    noviKorisnik(String(fd.get("korisnik") ?? ""), String(fd.get("ime") ?? ""), String(fd.get("lozinka") ?? ""));
  } catch (e) {
    return { greska: (e as Error).message };
  }
  revalidatePath("/admin/korisnici");
  return { uspjeh: "Novi urednik je dodan. Pošaljite mu korisničko ime i lozinku." };
}

export async function lozinkaAkcija(_: StanjeObrasca, fd: FormData): Promise<StanjeObrasca> {
  const k = await obaveznaPrijava();
  const nova = String(fd.get("lozinka") ?? "");
  if (nova !== String(fd.get("lozinka2") ?? "")) return { greska: "Lozinke se ne podudaraju. Upišite istu lozinku dva puta." };
  try {
    promijeniLozinku(k.id, nova);
  } catch (e) {
    return { greska: (e as Error).message };
  }
  return { uspjeh: "Lozinka je promijenjena." };
}

export async function obrisiKorisnikaAkcija(id: number) {
  const k = await obaveznaPrijava();
  if (id === k.id) return;
  obrisiKorisnika(id);
  revalidatePath("/admin/korisnici");
}
