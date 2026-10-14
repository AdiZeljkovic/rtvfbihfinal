import "server-only";
import { DatabaseSync } from "node:sqlite";
import { BAZA } from "./putanje";
import { kolekcija as defKolekcije } from "@/cms/kolekcije";
import { pocetniZapisi } from "./pocetni-sadrzaj";

/**
 * Baza CMS-a (SQLite ugrađen u Node.js – ne treba ništa instalirati).
 * Sav sadržaj je u tabeli `zapisi`: jedan red = jedna stavka (nabavka, dokument, emisija…),
 * a polja su u JSON koloni `podaci`. Obrisano ide u korpu (status = 'korpa'), a arhivirano
 * (status = 'arhiva') se ne vidi na stranici, ali ostaje sačuvano i može se vratiti.
 */

export type Zapis = {
  id: number;
  kolekcija: string;
  podaci: Record<string, unknown>;
  redoslijed: number;
  status: "objavljeno" | "korpa" | "arhiva";
  kreirano: string;
  izmijenjeno: string;
  izmijenio: string | null;
};

type Red = { id: number; kolekcija: string; podaci: string; redoslijed: number; status: string; kreirano: string; izmijenjeno: string; izmijenio: string | null };

const g = globalThis as unknown as { __rtvBaza?: DatabaseSync };

function otvori() {
  const db = new DatabaseSync(BAZA);
  // busy_timeout prvo: više build radnika može otvoriti bazu u isto vrijeme
  db.exec(`
    PRAGMA busy_timeout = 15000;
    PRAGMA journal_mode = WAL;
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
    const db = otvori();
    pocetniSadrzaj(db);
    // konekcija se pamti tek kad je baza spremna (neuspjelo punjenje se ponovi)
    g.__rtvBaza = db;
  }
  return g.__rtvBaza;
}

/**
 * Izmjena u transakciji: sve ili ništa. Ako bilo šta pukne, transakcija se poništi,
 * pa konekcija nikad ne ostane u otvorenoj transakciji.
 */
function transakcija<T>(db: DatabaseSync, fn: () => T, vrsta: "" | "IMMEDIATE" = "IMMEDIATE"): T {
  db.exec(`BEGIN ${vrsta}`);
  try {
    const r = fn();
    db.exec("COMMIT");
    return r;
  } catch (e) {
    if (db.isTransaction) db.exec("ROLLBACK");
    throw e;
  }
}

/**
 * Prepisuje WAL dnevnik u glavni fajl baze. Poslije ovoga je sav sadržaj u `rtvfbih.db`,
 * pa je i kopija samo tog fajla potpuna.
 */
export function zapisiNaDisk() {
  try {
    baza().exec("PRAGMA wal_checkpoint(TRUNCATE)");
  } catch {
    // baza je zauzeta (npr. backup u toku) – pokušat će se pri sljedećoj izmjeni
  }
}

/** Prvo pokretanje: prazna baza se puni postojećim sadržajem stranice (jednom, zaključano). */
function pocetniSadrzaj(db: DatabaseSync) {
  const n = (db.prepare("SELECT COUNT(*) AS n FROM zapisi").get() as { n: number }).n;
  if (n > 0) return;
  transakcija(db, () => {
    const opet = (db.prepare("SELECT COUNT(*) AS n FROM zapisi").get() as { n: number }).n;
    if (opet > 0) return;
    console.warn(
      `[CMS] Baza ${BAZA} je prazna – puni se početnim sadržajem. ` +
        "Ako ste vraćali backup, provjerite da je vraćen cijeli fajl baze."
    );
    const ins = db.prepare("INSERT INTO zapisi (kolekcija, podaci, redoslijed, izmijenio) VALUES (?, ?, ?, 'početni sadržaj')");
    for (const [kol, lista] of Object.entries(pocetniZapisi())) {
      lista.forEach((p, i) => ins.run(kol, JSON.stringify(p), i));
    }
  });
  db.exec("PRAGMA wal_checkpoint(TRUNCATE)");
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
  const rezultat = transakcija(db, () => {
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
  });
  zapisiNaDisk();
  return rezultat;
}

export function postaviStatus(id: number, status: Zapis["status"], korisnik: string) {
  const db = baza();
  const z = transakcija(db, () => {
    const z = jedan(id);
    if (!z) throw new Error("Zapis nije pronađen.");
    if (z.status === status) return z;
    db.prepare("UPDATE zapisi SET status = ?, izmijenjeno = datetime('now'), izmijenio = ? WHERE id = ?").run(status, korisnik, id);
    const akcija =
      status === "korpa" ? "u korpu" : status === "arhiva" ? "arhivirano" : z.status === "arhiva" ? "vraćeno iz arhive" : "vraćeno";
    zabiljezi(id, z.kolekcija, akcija, naslovZapisa(z.kolekcija, z.podaci), null, korisnik);
    return z;
  });
  zapisiNaDisk();
  return z;
}

/** Trajno brisanje – samo za stavke koje su već u korpi */
export function obrisiTrajno(id: number, korisnik: string) {
  const db = baza();
  transakcija(db, () => {
    const z = jedan(id);
    if (!z || z.status !== "korpa") return;
    db.prepare("DELETE FROM zapisi WHERE id = ?").run(id);
    zabiljezi(id, z.kolekcija, "trajno obrisano", naslovZapisa(z.kolekcija, z.podaci), z.podaci, korisnik);
  });
  zapisiNaDisk();
}

/**
 * Pomjeri objavljeni zapis gore/dolje: zamjenjuje mjesto sa susjedom.
 * Mijenjaju se samo dva reda (osim ako imaju isti redoslijed – tada se lista jednom renumeriše).
 */
export function pomjeri(id: number, smjer: -1 | 1) {
  const db = baza();
  transakcija(db, () => {
    const z = jedan(id);
    if (!z || z.status !== "objavljeno") return;
    let svi = lista(z.kolekcija);
    const i = svi.findIndex((x) => x.id === id);
    const j = i + smjer;
    if (i < 0 || j < 0 || j >= svi.length) return;
    const upd = db.prepare("UPDATE zapisi SET redoslijed = ? WHERE id = ?");
    if (svi[i].redoslijed === svi[j].redoslijed) {
      svi.forEach((x, k) => upd.run(k, x.id));
      svi = svi.map((x, k) => ({ ...x, redoslijed: k }));
    }
    upd.run(svi[j].redoslijed, svi[i].id);
    upd.run(svi[i].redoslijed, svi[j].id);
  });
  zapisiNaDisk();
}

/**
 * Dokument koji je prilog samo arhiviranih stavki (nijedna objavljena ga ne koristi).
 * Takav se ne služi posjetiocima ni na direktnu adresu /doc/….
 */
export function dokumentSamoUArhivi(ime: string) {
  // ime se u JSON-u traži tačno kako je upisano ("…"), a % i _ nisu džokeri
  const uzorak = `%${JSON.stringify(ime).replace(/[\\%_]/g, "\\$&")}%`;
  const ima = (status: Zapis["status"]) =>
    Boolean(baza().prepare("SELECT 1 FROM zapisi WHERE status = ? AND podaci LIKE ? ESCAPE '\\' LIMIT 1").get(status, uzorak));
  return ima("arhiva") && !ima("objavljeno");
}

export type Promjena ={ id: number; zapis_id: number | null; kolekcija: string; akcija: string; opis: string; korisnik: string; vrijeme: string };

export function nedavnePromjene(n = 8): Promjena[] {
  return baza()
    .prepare("SELECT id, zapis_id, kolekcija, akcija, opis, korisnik, vrijeme FROM historija ORDER BY id DESC LIMIT ?")
    .all(n) as Promjena[];
}
