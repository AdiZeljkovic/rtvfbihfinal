import "server-only";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { sigurnoIme } from "./putanje";

export const TIPOVI: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xps": "application/vnd.ms-xpsdocument",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export const DOZVOLJENI_DOKUMENTI = [".pdf", ".doc", ".docx", ".xls", ".xlsx"];
export const DOZVOLJENE_SLIKE = [".jpg", ".jpeg", ".png", ".webp"];

/** Šalje fajl iz foldera (streaming), sa zaštitom od ../ u putanji */
export function posaljiFajl(folder: string, dijelovi: string[]) {
  const ime = sigurnoIme(dijelovi.map((d) => decodeURIComponent(d)).join("/"));
  const f = path.join(folder, ime);
  if (!ime || !f.startsWith(folder) || !fs.existsSync(f) || !fs.statSync(f).isFile()) {
    return new Response("Dokument nije pronađen.", { status: 404 });
  }
  const ext = path.extname(f).toLowerCase();
  const stat = fs.statSync(f);
  const stream = Readable.toWeb(fs.createReadStream(f)) as ReadableStream;
  return new Response(stream, {
    headers: {
      "Content-Type": TIPOVI[ext] ?? "application/octet-stream",
      "Content-Length": String(stat.size),
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(ime)}`,
      "Cache-Control": "public, max-age=3600",
      "Last-Modified": stat.mtime.toUTCString(),
    },
  });
}

/** Naziv fajla bez prepisivanja postojećeg: „Plan.pdf“ → „Plan (2).pdf“ */
export function slobodnoIme(folder: string, ime: string) {
  const cisto = sigurnoIme(ime).replace(/[<>:"|?*\x00-\x1f]/g, "").replace(/\s+/g, " ").trim() || "dokument";
  const ext = path.extname(cisto);
  const osnova = cisto.slice(0, cisto.length - ext.length);
  let kandidat = cisto;
  for (let i = 2; fs.existsSync(path.join(folder, kandidat)); i++) kandidat = `${osnova} (${i})${ext}`;
  return kandidat;
}
