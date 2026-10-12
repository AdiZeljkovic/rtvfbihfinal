import "server-only";
import crypto from "node:crypto";
import { promisify } from "node:util";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { baza } from "./db";

/**
 * Prijava urednika. Lozinke se čuvaju kao scrypt hash (nikad u izvornom obliku).
 * Prijava traje 90 dana na istom računaru, da urednik ne mora stalno upisivati podatke.
 */
const KOLACIC = "rtv_sesija";
const TRAJANJE_DANA = 90;

export type Korisnik = { id: number; korisnik: string; ime: string };

// scrypt u pozadini – ne zaustavlja server dok računa (sinhrona verzija bi kočila i posjetioce)
const scrypt = promisify(crypto.scrypt) as (lozinka: string, sol: string, duzina: number) => Promise<Buffer>;

async function hash(lozinka: string) {
  const sol = crypto.randomBytes(16).toString("hex");
  const h = (await scrypt(lozinka, sol, 64)).toString("hex");
  return `${sol}:${h}`;
}

async function provjeriHash(lozinka: string, sacuvano: string) {
  const [sol, h] = sacuvano.split(":");
  if (!sol || !h) return false;
  const pokusaj = await scrypt(lozinka, sol, 64);
  const ocekivano = Buffer.from(h, "hex");
  return ocekivano.length === pokusaj.length && crypto.timingSafeEqual(ocekivano, pokusaj);
}

/** Lažni hash: za nepostojeće korisničko ime računa se jednako dugo, pa se ne može pogoditi koja imena postoje */
const LAZNI_HASH = `${"0".repeat(32)}:${"0".repeat(128)}`;

// ── ograničenje pokušaja prijave ─────────────────────────────────────────
// Po IP adresi: najviše 10 pogrešnih pokušaja u 15 minuta.
// Po korisničkom imenu: nakon 5 pogrešnih, najviše jedan pokušaj svakih 30 sekundi
// (pogađanje lozinke postaje beskorisno, a pravi urednik nikad nije zaključan dugo).
const PROZOR_MS = 15 * 60 * 1000;
const MAKS_PO_IP = 10;
const SPORO_NAKON = 5;
const RAZMAK_MS = 30 * 1000;

type Brojac = { n: number; od: number; zadnji: number };
const g = globalThis as unknown as { __rtvPokusaji?: Map<string, Brojac> };
const pokusaji = (g.__rtvPokusaji ??= new Map());

function brojac(kljuc: string, sad: number) {
  const b = pokusaji.get(kljuc);
  if (!b || sad - b.od > PROZOR_MS) return { n: 0, od: sad, zadnji: 0 };
  return b;
}

async function ipAdresa() {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "lokalno").trim();
}

export type IshodPrijave = { ok: true } | { ok: false; poruka: string };

// ── korisnici ────────────────────────────────────────────────────────────

export const imaKorisnika = () =>
  (baza().prepare("SELECT COUNT(*) AS n FROM korisnici").get() as { n: number }).n > 0;

export async function noviKorisnik(korisnik: string, ime: string, lozinka: string) {
  const k = korisnik.trim().toLowerCase();
  if (k.length < 3) throw new Error("Korisničko ime mora imati barem 3 slova.");
  if (lozinka.length < 8) throw new Error("Lozinka mora imati barem 8 znakova.");
  const postoji = baza().prepare("SELECT id FROM korisnici WHERE korisnik = ?").get(k);
  if (postoji) throw new Error("To korisničko ime već postoji.");
  baza().prepare("INSERT INTO korisnici (korisnik, ime, lozinka) VALUES (?, ?, ?)").run(k, ime.trim() || k, await hash(lozinka));
}

/** Promjena lozinke: traži trenutnu lozinku i odjavljuje sve druge uređaje */
export async function promijeniLozinku(id: number, stara: string, nova: string) {
  const red = baza().prepare("SELECT lozinka FROM korisnici WHERE id = ?").get(id) as { lozinka: string } | undefined;
  if (!red || !(await provjeriHash(stara, red.lozinka))) throw new Error("Trenutna lozinka nije tačna.");
  if (nova.length < 8) throw new Error("Nova lozinka mora imati barem 8 znakova.");
  baza().prepare("UPDATE korisnici SET lozinka = ? WHERE id = ?").run(await hash(nova), id);
  const token = (await cookies()).get(KOLACIC)?.value ?? "";
  baza().prepare("DELETE FROM sesije WHERE korisnik_id = ? AND token != ?").run(id, token);
}

export function korisnici(): Korisnik[] {
  return baza().prepare("SELECT id, korisnik, ime FROM korisnici ORDER BY ime").all() as Korisnik[];
}

export function obrisiKorisnika(id: number) {
  baza().prepare("DELETE FROM sesije WHERE korisnik_id = ?").run(id);
  baza().prepare("DELETE FROM korisnici WHERE id = ?").run(id);
}

// ── prijava ─────────────────────────────────────────────────────────────

/** Provjera podataka i otvaranje sesije (postavlja kolačić) */
export async function prijavi(korisnik: string, lozinka: string): Promise<IshodPrijave> {
  const ime = korisnik.trim().toLowerCase();
  const sad = Date.now();
  const kIp = `ip:${await ipAdresa()}`;
  const kIme = `ime:${ime}`;
  const bIp = brojac(kIp, sad);
  const bIme = brojac(kIme, sad);

  if (bIp.n >= MAKS_PO_IP) {
    return { ok: false, poruka: "Previše neuspješnih pokušaja. Sačekajte 15 minuta pa pokušajte ponovo." };
  }
  if (bIme.n >= SPORO_NAKON && sad - bIme.zadnji < RAZMAK_MS) {
    return { ok: false, poruka: "Previše neuspješnih pokušaja. Sačekajte pola minute pa pokušajte ponovo." };
  }

  const red = baza().prepare("SELECT id, lozinka FROM korisnici WHERE korisnik = ?").get(ime) as
    | { id: number; lozinka: string }
    | undefined;
  const tacno = await provjeriHash(lozinka, red?.lozinka ?? LAZNI_HASH);
  if (!red || !tacno) {
    pokusaji.set(kIp, { ...bIp, n: bIp.n + 1, zadnji: sad });
    pokusaji.set(kIme, { ...bIme, n: bIme.n + 1, zadnji: sad });
    return { ok: false, poruka: "Korisničko ime ili lozinka nisu tačni. Pokušajte ponovo." };
  }
  pokusaji.delete(kIme);

  const token = crypto.randomBytes(32).toString("hex");
  const istice = new Date(sad + TRAJANJE_DANA * 864e5);
  const db = baza();
  db.prepare("DELETE FROM sesije WHERE istice < ?").run(new Date(sad).toISOString());
  db.prepare("INSERT INTO sesije (token, korisnik_id, istice) VALUES (?, ?, ?)").run(token, red.id, istice.toISOString());
  (await cookies()).set(KOLACIC, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: istice,
  });
  return { ok: true };
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

// ── prvo pokretanje ─────────────────────────────────────────────────────

/**
 * Prvi urednik se preko weba može napraviti samo uz kod iz varijable CMS_KOD_ZA_POSTAVLJANJE
 * (na produkcijskom serveru), da ga ne bi napravio neko ko prvi otvori stranicu.
 * Bez koda: komanda `npm run urednik` na serveru. U razvoju (npm run dev) kod nije potreban.
 */
export const kodZaPostavljanje = () => process.env.CMS_KOD_ZA_POSTAVLJANJE?.trim() ?? "";
export const prviUrednikPrekoWeba = () => process.env.NODE_ENV !== "production" || kodZaPostavljanje().length > 0;

export function ispravanKod(kod: string) {
  const ocekivano = kodZaPostavljanje();
  if (!ocekivano) return process.env.NODE_ENV !== "production";
  const a = Buffer.from(kod.trim());
  const b = Buffer.from(ocekivano);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
