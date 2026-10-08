import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { baza } from "./db";

/**
 * Prijava urednika. Lozinke se čuvaju kao scrypt hash (nikad u izvornom obliku).
 * Prijava traje 90 dana na istom računaru, da urednik ne mora stalno upisivati podatke.
 */
const KOLACIC = "rtv_sesija";
const TRAJANJE_DANA = 90;

export type Korisnik = { id: number; korisnik: string; ime: string };

function hash(lozinka: string) {
  const sol = crypto.randomBytes(16).toString("hex");
  const h = crypto.scryptSync(lozinka, sol, 64).toString("hex");
  return `${sol}:${h}`;
}

function provjeriHash(lozinka: string, sacuvano: string) {
  const [sol, h] = sacuvano.split(":");
  if (!sol || !h) return false;
  const pokusaj = crypto.scryptSync(lozinka, sol, 64);
  const ocekivano = Buffer.from(h, "hex");
  return ocekivano.length === pokusaj.length && crypto.timingSafeEqual(ocekivano, pokusaj);
}

export const imaKorisnika = () =>
  (baza().prepare("SELECT COUNT(*) AS n FROM korisnici").get() as { n: number }).n > 0;

export function noviKorisnik(korisnik: string, ime: string, lozinka: string) {
  const k = korisnik.trim().toLowerCase();
  if (k.length < 3) throw new Error("Korisničko ime mora imati barem 3 slova.");
  if (lozinka.length < 8) throw new Error("Lozinka mora imati barem 8 znakova.");
  const postoji = baza().prepare("SELECT id FROM korisnici WHERE korisnik = ?").get(k);
  if (postoji) throw new Error("To korisničko ime već postoji.");
  baza().prepare("INSERT INTO korisnici (korisnik, ime, lozinka) VALUES (?, ?, ?)").run(k, ime.trim() || k, hash(lozinka));
}

export function promijeniLozinku(id: number, lozinka: string) {
  if (lozinka.length < 8) throw new Error("Lozinka mora imati barem 8 znakova.");
  baza().prepare("UPDATE korisnici SET lozinka = ? WHERE id = ?").run(hash(lozinka), id);
}

export function korisnici(): Korisnik[] {
  return baza().prepare("SELECT id, korisnik, ime FROM korisnici ORDER BY ime").all() as Korisnik[];
}

export function obrisiKorisnika(id: number) {
  baza().prepare("DELETE FROM sesije WHERE korisnik_id = ?").run(id);
  baza().prepare("DELETE FROM korisnici WHERE id = ?").run(id);
}

/** Provjera podataka i otvaranje sesije (postavlja kolačić) */
export async function prijavi(korisnik: string, lozinka: string): Promise<boolean> {
  const red = baza()
    .prepare("SELECT id, lozinka FROM korisnici WHERE korisnik = ?")
    .get(korisnik.trim().toLowerCase()) as { id: number; lozinka: string } | undefined;
  if (!red || !provjeriHash(lozinka, red.lozinka)) return false;
  const token = crypto.randomBytes(32).toString("hex");
  const istice = new Date(Date.now() + TRAJANJE_DANA * 864e5);
  baza().prepare("INSERT INTO sesije (token, korisnik_id, istice) VALUES (?, ?, ?)").run(token, red.id, istice.toISOString());
  (await cookies()).set(KOLACIC, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: istice,
  });
  return true;
}

export async function odjavi() {
  const c = await cookies();
  const token = c.get(KOLACIC)?.value;
  if (token) baza().prepare("DELETE FROM sesije WHERE token = ?").run(token);
  c.delete(KOLACIC);
}

/** Trenutno prijavljeni urednik ili null */
export async function trenutniKorisnik(): Promise<Korisnik | null> {
  const token = (await cookies()).get(KOLACIC)?.value;
  if (!token) return null;
  const k = baza()
    .prepare(
      "SELECT k.id, k.korisnik, k.ime FROM sesije s JOIN korisnici k ON k.id = s.korisnik_id WHERE s.token = ? AND s.istice > ?"
    )
    .get(token, new Date().toISOString()) as Korisnik | undefined;
  return k ?? null;
}

/** Za stranice i akcije admina: vraća korisnika ili šalje na prijavu */
export async function obaveznaPrijava(): Promise<Korisnik> {
  const k = await trenutniKorisnik();
  if (!k) redirect("/admin/prijava");
  return k;
}
