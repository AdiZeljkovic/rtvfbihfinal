/**
 * Sigurna rezervna kopija baze CMS-a: `npm run backup`
 *
 * Pravi potpunu kopiju (uključujući izmjene koje su još u WAL dnevniku) u
 * podaci/backup/rtvfbih-GGGG-MM-DD-SSMM.db, dok stranica normalno radi.
 * Čuva posljednjih 30 kopija. Dokumente (podaci/doc, podaci/mediji) kopirajte
 * običnim kopiranjem foldera – oni se nikad ne mijenjaju, samo se dodaju novi.
 *
 * Primjer za cron (svaki dan u 3 ujutro):
 *   0 3 * * *  cd /putanja/do/rtvfbih && npm run backup
 */
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const PODACI = path.resolve(process.env.CMS_PODACI ?? path.join(process.cwd(), "podaci"));
const BAZA = path.join(PODACI, "rtvfbih.db");
const FOLDER = path.join(PODACI, "backup");
const ZADRZI = 30;

if (!fs.existsSync(BAZA)) {
  console.error(`Baza nije pronađena: ${BAZA}`);
  process.exit(1);
}
fs.mkdirSync(FOLDER, { recursive: true });

const d = new Date();
const dvije = (n) => String(n).padStart(2, "0");
const ime = `rtvfbih-${d.getFullYear()}-${dvije(d.getMonth() + 1)}-${dvije(d.getDate())}-${dvije(d.getHours())}${dvije(d.getMinutes())}.db`;
const cilj = path.join(FOLDER, ime);

const db = new DatabaseSync(BAZA);
db.exec("PRAGMA busy_timeout = 15000");
db.exec(`VACUUM INTO '${cilj.replace(/'/g, "''")}'`);
db.close();

// provjera kopije
const kopija = new DatabaseSync(cilj, { readOnly: true });
const n = kopija.prepare("SELECT COUNT(*) AS n FROM zapisi").get().n;
const ok = kopija.prepare("PRAGMA integrity_check").get().integrity_check;
kopija.close();
if (ok !== "ok" || n === 0) {
  console.error(`Kopija nije ispravna (${ok}, zapisa: ${n}).`);
  process.exit(1);
}

// stare kopije
const stare = fs
  .readdirSync(FOLDER)
  .filter((f) => /^rtvfbih-.*\.db$/.test(f))
  .sort()
  .reverse()
  .slice(ZADRZI);
for (const f of stare) fs.rmSync(path.join(FOLDER, f));

console.log(`Backup gotov: ${cilj} (${n} zapisa, ${Math.round(fs.statSync(cilj).size / 1024)} KB)`);
