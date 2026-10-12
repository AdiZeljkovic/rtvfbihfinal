/**
 * Pravi urednika (ili mijenja lozinku postojećem) iz komandne linije na serveru:
 *   npm run urednik
 * Koristi se za prvog urednika na produkciji, ili kad se zaboravi lozinka.
 */
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { DatabaseSync } from "node:sqlite";

const PODACI = path.resolve(process.env.CMS_PODACI ?? path.join(process.cwd(), "podaci"));
const BAZA = path.join(PODACI, "rtvfbih.db");
if (!fs.existsSync(BAZA)) {
  console.error(`Baza nije pronađena: ${BAZA}\nPokrenite stranicu jednom (npm start) da se baza napravi.`);
  process.exit(1);
}

const rl = readline.createInterface({ input: stdin, output: stdout });
const korisnik = (await rl.question("Korisničko ime: ")).trim().toLowerCase();
if (korisnik.length < 3) {
  console.error("Korisničko ime mora imati barem 3 slova.");
  process.exit(1);
}
const db = new DatabaseSync(BAZA);
db.exec("PRAGMA busy_timeout = 15000");
const postoji = db.prepare("SELECT id FROM korisnici WHERE korisnik = ?").get(korisnik);
const ime = postoji ? "" : (await rl.question("Ime i prezime: ")).trim();
const lozinka = await rl.question(postoji ? "Nova lozinka (najmanje 8 znakova): " : "Lozinka (najmanje 8 znakova): ");
const ponovo = await rl.question("Ponovite lozinku: ");
rl.close();

if (lozinka.length < 8) {
  console.error("Lozinka mora imati barem 8 znakova.");
  process.exit(1);
}
if (lozinka !== ponovo) {
  console.error("Lozinke se ne podudaraju.");
  process.exit(1);
}

// isti format kao u src/server/auth.ts: "sol:hash" (scrypt, 64 bajta)
const sol = crypto.randomBytes(16).toString("hex");
const hash = `${sol}:${crypto.scryptSync(lozinka, sol, 64).toString("hex")}`;

if (postoji) {
  db.prepare("UPDATE korisnici SET lozinka = ? WHERE id = ?").run(hash, postoji.id);
  db.prepare("DELETE FROM sesije WHERE korisnik_id = ?").run(postoji.id);
  console.log(`Lozinka za „${korisnik}“ je promijenjena (svi uređaji su odjavljeni).`);
} else {
  db.prepare("INSERT INTO korisnici (korisnik, ime, lozinka) VALUES (?, ?, ?)").run(korisnik, ime || korisnik, hash);
  console.log(`Urednik „${korisnik}“ je napravljen. Prijava: /admin/prijava`);
}
db.close();
