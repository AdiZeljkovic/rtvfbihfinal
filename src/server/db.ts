import "server-only";
import { DatabaseSync } from "node:sqlite";
import { BAZA } from "./putanje";
import { kolekcija as defKolekcije } from "@/cms/kolekcije";
import { pocetniZapisi } from "./pocetni-sadrzaj";

/**
 * Baza CMS-a (SQLite ugrađen u Node.js – ne treba ništa instalirati).
 * Sav sadržaj je u tabeli `zapisi`: jedan red = jedna stavka (nabavka, dokument, emisija…),
 * a polja su u JSON koloni `podaci`. Obrisano ide u korpu (status = 'korpa').
 */

export type Zapis = {
  id: number;
  kolekcija: string;
  podaci: Record<string, unknown>;
  redoslijed: number;
  status: "objavljeno" | "korpa";
  kreirano: string;
  izmijenjeno: string;
  izmijenio: string | null;
};

type Red = { id: number; kolekcija: string; podaci: string; redoslijed: number; status: string; kreirano: string; izmijenjeno: string; izmijenio: string | null };

const g = globalThis as unknown as { __rtvBaza?: DatabaseSync };

function otvori() {
  const db = new DatabaseSync(BAZA);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 15000;
    CREATE TABLE IF NOT EXISTS zapisi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kolekcija TEXT NOT NULL,
      podaci TEXT NOT NULL,
      redoslijed REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'objavljeno',
      kreirano TEXT NOT NULL DEFAULT (datetime('now')),
      izmijenjeno TEXT NOT NULL DEFAULT (datetime('now')),
      izmijenio TEXT
    );
    CREATE INDEX IF NOT EXISTS zapisi_kolekcija ON zapisi(kolekcija, status, redoslijed);
    CREATE TABLE IF NOT EXISTS historija (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      zapis_id INTEGER,
      kolekcija TEXT NOT NULL,
      akcija TEXT NOT NULL,
      opis TEXT,
      prije TEXT,
      korisnik TEXT,
      vrijeme TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS korisnici (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      korisnik TEXT NOT NULL UNIQUE,
      ime TEXT NOT NULL,
      lozinka TEXT NOT NULL,
      kreirano TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS sesije (
      token TEXT PRIMARY KEY,
      korisnik_id INTEGER NOT NULL,
      istice TEXT NOT NULL
    );
  `);
  return db;
}

export function baza(): DatabaseSync {
  if (!g.__rtvBaza) {
    g.__rtvBaza = otvori();
    pocetniSadrzaj(g.__rtvBaza);
  }
  return g.__rtvBaza;
}

/** Prvo pokretanje: prazna baza se puni postojećim sadržajem stranice (jednom, zaključano). */
function pocetniSadrzaj(db: DatabaseSync) {
  const n = (db.prepare("SELECT COUNT(*) AS n FROM zapisi").get() as { n: number }).n;
  if (n > 0) return;
  db.exec("BEGIN IMMEDIATE");
  try {
    const opet = (db.prepare("SELECT COUNT(*) AS n FROM zapisi").get() as { n: number }).n;
    if (opet === 0) {
      const ins = db.prepare("INSERT INTO zapisi (kolekcija, podaci, redoslijed, izmijenio) VALUES (?, ?, ?, 'početni sadržaj')");
      for (const [kol, lista] of Object.entries(pocetniZapisi())) {
        lista.forEach((p, i) => ins.run(kol, JSON.stringify(p), i));
      }
    }
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}

const uZapis = (r: Red): Zapis => ({ ...r, podaci: JSON.parse(r.podaci), status: r.status as Zapis["status"] });

/** Objavljeni zapisi kolekcije, u redoslijedu prikaza */
export function lista(kolekcija: string, status: Zapis["status"] = "objavljeno"): Zapis[] {
  const rows = baza()
    .prepare("SELECT * FROM zapisi WHERE kolekcija = ? AND status = ? ORDER BY redoslijed, id")
    .all(kolekcija, status) as Red[];
  return rows.map(uZapis);
}

export function podaci<T>(kolekcija: string): (T & { _id: number })[] {
  return lista(kolekcija).map((z) => ({ ...(z.podaci as T), _id: z.id }));
}

export function jedan(id: number): Zapis | undefined {
  const r = baza().prepare("SELECT * FROM zapisi WHERE id = ?").get(id) as Red | undefined;
  return r ? uZapis(r) : undefined;
}

/** Podešavanja (jedinstveni zapis kolekcije) */
export function jedinstven<T>(kolekcija: string): T {
  const z = lista(kolekcija)[0];
  return (z?.podaci ?? {}) as T;
}

export function brojPoKolekcijama(): Record<string, number> {
  const rows = baza().prepare("SELECT kolekcija, COUNT(*) AS n FROM zapisi WHERE status = 'objavljeno' GROUP BY kolekcija").all() as { kolekcija: string; n: number }[];
  return Object.fromEntries(rows.map((r) => [r.kolekcija, r.n]));
}

function zabiljezi(zapisId: number | null, kolekcija: string, akcija: string, opis: string, prije: unknown, korisnik: string) {
  baza()
    .prepare("INSERT INTO historija (zapis_id, kolekcija, akcija, opis, prije, korisnik) VALUES (?, ?, ?, ?, ?, ?)")
    .run(zapisId, kolekcija, akcija, opis, prije ? JSON.stringify(prije) : null, korisnik);
}

const naslovZapisa = (kolekcija: string, p: Record<string, unknown>) => {
  const d = defKolekcije(kolekcija);
  return String((d && p[d.naslovPolje]) ?? "").slice(0, 140);
};

export function sacuvaj(kolekcija: string, id: number | null, p: Record<string, unknown>, korisnik: string): number {
  const db = baza();
  const def = defKolekcije(kolekcija);
  if (id) {
    const prije = jedan(id);
    if (!prije || prije.kolekcija !== kolekcija) throw new Error("Zapis nije pronađen.");
    db.prepare("UPDATE zapisi SET podaci = ?, izmijenjeno = datetime('now'), izmijenio = ? WHERE id = ?").run(JSON.stringify(p), korisnik, id);
    zabiljezi(id, kolekcija, "izmjena", naslovZapisa(kolekcija, p), prije.podaci, korisnik);
    return id;
  }
  const ekstrem = db
    .prepare(`SELECT ${def?.noveNaVrh ? "MIN" : "MAX"}(redoslijed) AS r FROM zapisi WHERE kolekcija = ?`)
    .get(kolekcija) as { r: number | null };
  const red = ekstrem.r === null ? 0 : def?.noveNaVrh ? ekstrem.r - 1 : ekstrem.r + 1;
  const res = db
    .prepare("INSERT INTO zapisi (kolekcija, podaci, redoslijed, izmijenio) VALUES (?, ?, ?, ?)")
    .run(kolekcija, JSON.stringify(p), red, korisnik);
  const noviId = Number(res.lastInsertRowid);
  zabiljezi(noviId, kolekcija, "dodavanje", naslovZapisa(kolekcija, p), null, korisnik);
  return noviId;
}

export function postaviStatus(id: number, status: Zapis["status"], korisnik: string) {
  const z = jedan(id);
  if (!z) throw new Error("Zapis nije pronađen.");
  baza().prepare("UPDATE zapisi SET status = ?, izmijenjeno = datetime('now'), izmijenio = ? WHERE id = ?").run(status, korisnik, id);
  zabiljezi(id, z.kolekcija, status === "korpa" ? "u korpu" : "vraćeno", naslovZapisa(z.kolekcija, z.podaci), null, korisnik);
  return z;
}

/** Pomjeri zapis gore/dolje u listi (zamjena redoslijeda sa susjedom) */
export function pomjeri(id: number, smjer: -1 | 1) {
  const z = jedan(id);
  if (!z) return;
  const svi = lista(z.kolekcija);
  const i = svi.findIndex((x) => x.id === id);
  const j = i + smjer;
  if (j < 0 || j >= svi.length) return;
  const db = baza();
  // normalizuj redoslijed pa zamijeni
  db.exec("BEGIN");
  svi.forEach((x, k) => db.prepare("UPDATE zapisi SET redoslijed = ? WHERE id = ?").run(k, x.id));
  db.prepare("UPDATE zapisi SET redoslijed = ? WHERE id = ?").run(j, svi[i].id);
  db.prepare("UPDATE zapisi SET redoslijed = ? WHERE id = ?").run(i, svi[j].id);
  db.exec("COMMIT");
}

export type Promjena = { id: number; zapis_id: number | null; kolekcija: string; akcija: string; opis: string; korisnik: string; vrijeme: string };

export function nedavnePromjene(n = 8): Promjena[] {
  return baza()
    .prepare("SELECT id, zapis_id, kolekcija, akcija, opis, korisnik, vrijeme FROM historija ORDER BY id DESC LIMIT ?")
    .all(n) as Promjena[];
}
