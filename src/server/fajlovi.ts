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

const tok = (f: string, opcije?: { start: number; end: number }) =>
  Readable.toWeb(fs.createReadStream(f, opcije)) as ReadableStream;

/**
 * Šalje fajl iz foldera (streaming), sa zaštitom od ../ u putanji.
 * Podržava ETag/304 (preglednik ne preuzima ponovo nepromijenjen fajl)
 * i Range (PDF preglednik može učitati samo dio velikog dokumenta).
 * `dijelovi` su već dekodirani (Next dekodira parametre rute).
 */
export function posaljiFajl(req: Request, folder: string, dijelovi: string[]) {
  const ime = sigurnoIme(dijelovi.join("/"));
  const f = path.join(folder, ime);
  let stat: fs.Stats;
  try {
    stat = fs.statSync(f);
  } catch {
    stat = undefined as never;
  }
  if (!ime || !f.startsWith(folder + path.sep) || !stat?.isFile()) {
    return new Response("Dokument nije pronađen.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  const etag = `"${stat.size.toString(36)}-${Math.floor(stat.mtimeMs).toString(36)}"`;
  const zaglavlja: Record<string, string> = {
    "Content-Type": TIPOVI[path.extname(f).toLowerCase()] ?? "application/octet-stream",
    "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(ime)}`,
    "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    "Last-Modified": stat.mtime.toUTCString(),
    ETag: etag,
    "Accept-Ranges": "bytes",
    "X-Content-Type-Options": "nosniff",
  };

  if (req.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304, headers: zaglavlja });
  }

  const range = req.headers.get("range")?.match(/^bytes=(\d*)-(\d*)$/);
  if (range && (range[1] || range[2])) {
    const vel = stat.size;
    let start = range[1] ? Number(range[1]) : vel - Number(range[2]);
    let end = range[1] && range[2] ? Number(range[2]) : vel - 1;
    start = Math.max(0, start);
    end = Math.min(end, vel - 1);
    if (start > end || start >= vel) {
      return new Response(null, { status: 416, headers: { ...zaglavlja, "Content-Range": `bytes */${vel}` } });
    }
    return new Response(tok(f, { start, end }), {
      status: 206,
      headers: { ...zaglavlja, "Content-Range": `bytes ${start}-${end}/${vel}`, "Content-Length": String(end - start + 1) },
    });
  }

  return new Response(tok(f), { headers: { ...zaglavlja, "Content-Length": String(stat.size) } });
}

/** Čisti naziv fajla iz uploada (bez putanje, znakova koje Windows ne dozvoljava i znaka %) */
export function cistoIme(ime: string) {
  return (
    sigurnoIme(ime)
      .replace(/[<>:"|?*%#\x00-\x1f]/g, "")
      .replace(/\s+/g, " ")
      .trim() || "dokument"
  );
}

/**
 * Upisuje fajl pod slobodnim imenom: „Plan.pdf“ → „Plan (2).pdf“ ako je zauzeto.
 * Upis s 'wx' ne prepisuje postojeći fajl ni kad dva uploada stignu u isto vrijeme.
 */
export function upisiNovi(folder: string, ime: string, sadrzaj: Buffer) {
  const cisto = cistoIme(ime);
  const ext = path.extname(cisto);
  const osnova = cisto.slice(0, cisto.length - ext.length);
  for (let i = 1; i < 1000; i++) {
    const kandidat = i === 1 ? cisto : `${osnova} (${i})${ext}`;
    try {
      fs.writeFileSync(path.join(folder, kandidat), sadrzaj, { flag: "wx" });
      return kandidat;
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "EEXIST") throw e;
    }
  }
  throw new Error("Previše fajlova s istim imenom.");
}
