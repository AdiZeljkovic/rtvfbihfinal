// PDF uputstva za urednike iz stranice /admin/uputstvo-pdf → public/uputstvo/Uputstvo-za-urednike-RTVFBiH.pdf
//   PLAYWRIGHT_CORE=... FONTSOURCE=<folder s node_modules/@fontsource/{inter,montserrat}> \
//   UPUTSTVO_KORISNIK=... UPUTSTVO_LOZINKA=... node scripts/uputstvo/pdf.mjs
//
// Fontovi stranice su promjenljivi (variable); Chrome ih u PDF ugrađuje kao Type3, a takve neki preglednici
// PDF-a prikazuju kao tačkice. Zato se za PDF koriste statične verzije istih fontova (paketi @fontsource/inter
// i @fontsource/montserrat, `npm i` u bilo kojem privremenom folderu). Slike se za PDF smanjuju prije štampe
// (JPEG), pa PDF ne treba naknadno obrađivati.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE ?? "playwright-core");
const sharp = require("sharp");
const BASE = process.env.UPUTSTVO_ADRESA ?? "http://localhost:3106";
const KORIJEN = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")), "../..");
const IZLAZ = path.join(KORIJEN, "public", "uputstvo", "Uputstvo-za-urednike-RTVFBiH.pdf");
const FONTSOURCE = path.join(process.env.FONTSOURCE ?? KORIJEN, "node_modules", "@fontsource");
if (!fs.existsSync(path.join(FONTSOURCE, "inter")) || !fs.existsSync(path.join(FONTSOURCE, "montserrat"))) {
  throw new Error("Nema statičnih fontova: postavite FONTSOURCE (folder u kojem je urađeno npm i @fontsource/inter @fontsource/montserrat).");
}

// @font-face za težine koje stranica koristi, s putanjama koje skripta sama služi (/__pdf-font/…)
const css = ["inter", "montserrat"]
  .flatMap((f) => ["400", "500", "600", "700"].map((w) => [f, w]))
  .map(([f, w]) =>
    fs
      .readFileSync(path.join(FONTSOURCE, f, `${w}.css`), "utf8")
      .replace(/font-family: '([^']+)'/g, "font-family: 'PDF $1'")
      .replace(/url\(\.\/files\/([^)]+)\)/g, `url(/__pdf-font/${f}/$1)`)
  )
  .join("\n");
const zamjena = `
  html, body, .admin, .uputstvo-pdf { --font-inter: 'PDF Inter' !important; --font-montserrat: 'PDF Montserrat' !important; }
`;

const b = await chromium.launch({ args: ["--lang=hr-HR"] });
const p = await b.newPage();
await p.route("**/__pdf-font/**", (r) => {
  const [, f, ime] = new URL(r.request().url()).pathname.match(/__pdf-font\/([^/]+)\/(.+)$/);
  const fajl = path.join(FONTSOURCE, f, "files", path.basename(ime));
  r.fulfill({ status: 200, contentType: ime.endsWith(".woff2") ? "font/woff2" : "font/woff", body: fs.readFileSync(fajl) });
});
// snimci ekrana za PDF: 1200 px širine, JPEG (dovoljno za A4, a PDF ostaje mali)
await p.route("**/uputstvo/*.webp", async (r) => {
  const orig = await r.fetch();
  const body = await sharp(await orig.body()).resize({ width: 1200, withoutEnlargement: true }).flatten({ background: "#ffffff" }).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  r.fulfill({ status: 200, contentType: "image/jpeg", body });
});

await p.goto(BASE + "/admin/prijava");
await p.fill("input[name=korisnik]", process.env.UPUTSTVO_KORISNIK);
await p.fill("input[name=lozinka]", process.env.UPUTSTVO_LOZINKA);
await Promise.all([p.waitForURL("**/admin"), p.locator("button[type=submit]").click()]);
await p.goto(BASE + "/admin/uputstvo-pdf", { waitUntil: "networkidle" });
await p.addStyleTag({ content: css + zamjena });
const fontovi = await p.evaluate(async () => {
  const tezine = ["400", "500", "600", "700"];
  await Promise.all(tezine.flatMap((w) => [document.fonts.load(`${w} 16px "PDF Inter"`, "čćšđž"), document.fonts.load(`${w} 16px "PDF Montserrat"`, "čćšđž")]));
  await document.fonts.ready;
  await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => (i.onload = i.onerror = r)))));
  return [...document.fonts].filter((f) => f.status === "loaded" && f.family.includes("PDF")).length;
});
console.log("učitanih statičnih fontova:", fontovi);
await p.emulateMedia({ media: "print" });
await p.pdf({
  path: IZLAZ,
  format: "A4",
  printBackground: true,
  margin: { top: "16mm", right: "15mm", bottom: "18mm", left: "15mm" },
  displayHeaderFooter: true,
  headerTemplate: "<span></span>",
  footerTemplate:
    '<div style="width:100%;font:9px Arial,sans-serif;color:#6b7a90;padding:0 15mm;display:flex;justify-content:space-between">' +
    "<span>RTV FBiH · Uputstvo za urednike</span><span>strana <span class=pageNumber></span> od <span class=totalPages></span></span></div>",
});
console.log("PDF →", path.relative(KORIJEN, IZLAZ), Math.round(fs.statSync(IZLAZ).size / 1024), "KB");
await b.close();
