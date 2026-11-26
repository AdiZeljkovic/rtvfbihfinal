// PDF uputstva za urednike iz stranice /admin/uputstvo-pdf → public/uputstvo/Uputstvo-za-urednike-RTVFBiH.pdf
//   PLAYWRIGHT_CORE=... UPUTSTVO_KORISNIK=... UPUTSTVO_LOZINKA=... node scripts/uputstvo/pdf.mjs
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE ?? "playwright-core");
const BASE = process.env.UPUTSTVO_ADRESA ?? "http://localhost:3106";
const KORIJEN = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")), "../..");
const IZLAZ = path.join(KORIJEN, "public", "uputstvo", "Uputstvo-za-urednike-RTVFBiH.pdf");

const b = await chromium.launch({ args: ["--lang=hr-HR"] });
const p = await b.newPage();
await p.goto(BASE + "/admin/prijava");
await p.fill("input[name=korisnik]", process.env.UPUTSTVO_KORISNIK);
await p.fill("input[name=lozinka]", process.env.UPUTSTVO_LOZINKA);
await Promise.all([p.waitForURL("**/admin"), p.locator("button[type=submit]").click()]);
await p.goto(BASE + "/admin/uputstvo-pdf", { waitUntil: "networkidle" });
await p.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => (i.onload = i.onerror = r)))));
});
await p.emulateMedia({ media: "print" });
await p.pdf({
  path: IZLAZ,
  format: "A4",
  printBackground: true,
  margin: { top: "16mm", right: "15mm", bottom: "18mm", left: "15mm" },
  displayHeaderFooter: true,
  headerTemplate: "<span></span>",
  footerTemplate:
    '<div style="width:100%;font:9px system-ui,sans-serif;color:#6b7a90;padding:0 15mm;display:flex;justify-content:space-between">' +
    "<span>RTV FBiH · Uputstvo za urednike</span><span>strana <span class=pageNumber></span> od <span class=totalPages></span></span></div>",
});
console.log("PDF →", path.relative(KORIJEN, IZLAZ));
// Smanjenje (slike JPEG 80 %, do 200 dpi) radi se posebno, npr. PyMuPDF:
//   python -c "import pymupdf,sys; d=pymupdf.open(sys.argv[1]); d.rewrite_images(dpi_threshold=200, dpi_target=200, quality=80); d.ez_save(sys.argv[2])" ulaz.pdf izlaz.pdf
await b.close();
