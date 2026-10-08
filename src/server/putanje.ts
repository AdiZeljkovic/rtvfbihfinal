import "server-only";
import path from "node:path";
import fs from "node:fs";

/**
 * Gdje CMS čuva podatke. Sve je u jednom folderu (nije u gitu):
 *   podaci/rtvfbih.db  – baza (SQLite)
 *   podaci/doc/        – dokumenti (PDF, DOC…)
 *   podaci/mediji/     – slike koje doda urednik
 * Na serveru se folder može premjestiti varijablom okruženja CMS_PODACI.
 */
export const PODACI = path.resolve(process.env.CMS_PODACI ?? path.join(process.cwd(), "podaci"));
export const BAZA = path.join(PODACI, "rtvfbih.db");
export const DOC_DIR = path.join(PODACI, "doc");
export const MEDIJI_DIR = path.join(PODACI, "mediji");

for (const d of [PODACI, DOC_DIR, MEDIJI_DIR]) {
  fs.mkdirSync(d, { recursive: true });
}

/** Siguran naziv fajla: samo ime, bez putanje (zaštita od ../) */
export const sigurnoIme = (ime: string) => path.basename(ime.replace(/\\/g, "/")).trim();
