// Snimci ekrana za uputstvo urednicima: public/uputstvo/<id>.webp + src/cms/uputstvo-slike.json (dimenzije).
// Pokreće se protiv lokalne kopije stranice s kopijom baze (NIKAD protiv produkcije – skripta čuva primjere i briše):
//   CMS_PODACI=<kopija> npx next start -p 3106
//   PLAYWRIGHT_CORE=<putanja do playwright-core> UPUTSTVO_KORISNIK=... UPUTSTVO_LOZINKA=... node scripts/uputstvo/slike.mjs
// Brojevi na slikama idu redom kao `oznake` u src/cms/uputstvo.ts.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE ?? "playwright-core");
const sharp = require("sharp");

const BASE = process.env.UPUTSTVO_ADRESA ?? "http://localhost:3106";
if (!/localhost|127\.0\.0\.1/.test(BASE)) throw new Error("Samo lokalna kopija (skripta mijenja sadržaj).");
const KORISNIK = process.env.UPUTSTVO_KORISNIK, LOZINKA = process.env.UPUTSTVO_LOZINKA;
const KORIJEN = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")), "../..");
const IZLAZ = path.join(KORIJEN, "public", "uputstvo");
const DIMENZIJE = path.join(KORIJEN, "src", "cms", "uputstvo-slike.json");
const PRIMJERI = fs.mkdtempSync(path.join(os.tmpdir(), "uputstvo-"));
const SAMO = process.env.SAMO ? process.env.SAMO.split(",") : null;
fs.mkdirSync(IZLAZ, { recursive: true });

const BOJA = "#E8590C";
const SIRINA = 1280;
const dims = fs.existsSync(DIMENZIJE) ? JSON.parse(fs.readFileSync(DIMENZIJE, "utf8")) : {};

const pdf = (ime) => {
  const f = path.join(PRIMJERI, ime);
  fs.writeFileSync(f, "%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n");
  return f;
};

async function prijavi(ctx) {
  const p = await ctx.newPage();
  p.on("dialog", (d) => d.accept());
  await p.goto(BASE + "/admin/prijava");
  await p.fill("input[name=korisnik]", KORISNIK);
  await p.fill("input[name=lozinka]", LOZINKA);
  await Promise.all([p.waitForURL("**/admin"), p.locator("button[type=submit]").click()]);
  return p;
}

/**
 * Snimak: `oznake` = lista lokatora (ili lista lista – jedan okvir oko više elemenata),
 * `kadar` = lokator dijela stranice koji ulazi u sliku ili "ekran" (vidljivi dio).
 */
async function snimi(p, id, { oznake = [], kadar = "main", visina = null, margina = 28 }) {
  if (SAMO && !SAMO.includes(id)) return;
  // cijela stranica u jednom „ekranu“: ljepljiva traka s dugmadima ostaje na dnu obrasca
  if (kadar !== "ekran") {
    const h = visina ?? Math.min(4000, await p.evaluate(() => document.documentElement.scrollHeight));
    await p.setViewportSize({ width: SIRINA, height: Math.max(800, h) });
    await p.evaluate(() => window.scrollTo(0, 0));
  }
  await p.waitForTimeout(500);
  const okviri = [];
  for (const o of oznake) {
    const lista = Array.isArray(o) ? o : [o];
    const b = [];
    for (const l of lista) {
      const x = await l.first().boundingBox().catch(() => null);
      if (x) b.push(x);
    }
    if (!b.length) {
      console.log(`  ! ${id}: oznaka ${okviri.length + 1} nije nađena`);
      okviri.push(null);
      continue;
    }
    const x1 = Math.min(...b.map((v) => v.x)), y1 = Math.min(...b.map((v) => v.y));
    const x2 = Math.max(...b.map((v) => v.x + v.width)), y2 = Math.max(...b.map((v) => v.y + v.height));
    okviri.push({ x: x1, y: y1, width: x2 - x1, height: y2 - y1 });
  }
  await p.evaluate(
    ({ okviri, boja }) => {
      // otvoren <dialog> je iznad svega ostalog: oznake idu u njega, fiksno prema ekranu
      const dlg = document.querySelector("dialog[open]");
      const roditelj = dlg ?? document.body;
      const sx = dlg ? 0 : window.scrollX, sy = dlg ? 0 : window.scrollY;
      const pozicija = dlg ? "fixed" : "absolute";
      okviri.forEach((b, i) => {
        if (!b) return;
        const o = document.createElement("div");
        o.className = "uputstvo-oznaka";
        Object.assign(o.style, {
          position: "absolute", left: `${b.x + sx - 7}px`, top: `${b.y + sy - 7}px`, width: `${b.width + 14}px`, height: `${b.height + 14}px`,
          border: `3px solid ${boja}`, borderRadius: "14px", boxShadow: "0 0 0 3px rgba(255,255,255,.9)", zIndex: 2147483646, pointerEvents: "none",
        });
        const n = document.createElement("div");
        n.className = "uputstvo-oznaka";
        n.textContent = String(i + 1);
        Object.assign(n.style, {
          position: "absolute", left: `${Math.max(4, b.x + sx - 22)}px`, top: `${Math.max(4, b.y + sy - 22)}px`, width: "34px", height: "34px",
          borderRadius: "50%", background: boja, color: "#fff", font: "700 18px/34px system-ui, sans-serif", textAlign: "center",
          boxShadow: "0 0 0 3px #fff, 0 4px 10px rgba(0,0,0,.25)", zIndex: 2147483647, pointerEvents: "none",
        });
        o.style.position = pozicija;
        n.style.position = pozicija;
        roditelj.append(o, n);
      });
    },
    { okviri, boja: BOJA }
  );
  let clip;
  if (kadar === "ekran") {
    const v = p.viewportSize();
    clip = { x: 0, y: 0, width: v.width, height: v.height };
  } else {
    const k = typeof kadar === "string" ? p.locator(kadar) : kadar;
    const b = await k.first().boundingBox();
    const sve = [b, ...okviri.filter(Boolean)];
    const x1 = Math.max(0, Math.min(...sve.map((v) => v.x)) - margina);
    const y1 = Math.max(0, Math.min(...sve.map((v) => v.y)) - margina);
    const x2 = Math.min(SIRINA, Math.max(...sve.map((v) => v.x + v.width)) + margina);
    const y2 = Math.max(...sve.map((v) => v.y + v.height)) + margina;
    clip = { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
  }
  const png = await p.screenshot({ clip, animations: "disabled" });
  await p.evaluate(() => document.querySelectorAll(".uputstvo-oznaka").forEach((e) => e.remove()));
  const izlaz = path.join(IZLAZ, `${id}.webp`);
  const info = await sharp(png).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(izlaz);
  dims[id] = { w: info.width, h: info.height };
  console.log(`  ${id}: ${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB`);
  await p.setViewportSize({ width: SIRINA, height: 800 });
}

const polje = (p, ime) => p.locator(`#p-${ime}`);
const dugme = (p, tekst) => p.locator("main button, main a").filter({ hasText: tekst });

(async () => {
  // jezik preglednika određuje izgled datuma (26.11.2026., ne 11/26/2026)
  const b = await chromium.launch({ args: ["--lang=hr-HR"] });
  const nov = () => b.newContext({ viewport: { width: SIRINA, height: 800 }, deviceScaleFactor: 2, locale: "bs-BA" });

  // ── prijava (bez prijave) ──
  {
    const ctx = await nov();
    const p = await ctx.newPage();
    await p.goto(BASE + "/admin/prijava");
    await snimi(p, "prijava", {
      kadar: "body",
      oznake: [
        p.locator("input[name=korisnik]"),
        p.locator("input[name=lozinka]"),
        p.locator("main button").filter({ hasText: "Prikaži" }),
        p.locator("button[type=submit]"),
        [p.locator("button").filter({ hasText: /^A$/ }), p.locator("button").filter({ hasText: /^A\+\+$/ })],
        p.locator("button[aria-label*='ontrast'], button[title*='ontrast']"),
      ],
      visina: 800,
    });
    await ctx.close();
  }

  const ctx = await nov();
  const p = await prijavi(ctx);

  // ── početna ──
  await p.goto(BASE + "/admin");
  const nav = (t) => p.locator("header nav a, header nav button").filter({ hasText: t });
  await snimi(p, "pocetna-vrh", {
    kadar: p.locator("main ul").first(),
    oznake: [nav("Početna"), nav("Arhiva"), nav("Korpa"), nav("Urednici i lozinka"), nav("Pogledaj stranicu"), nav("Uputstvo"), nav("Odjava"), p.locator("main ul").first()],
  });
  const sekcija = (t) => p.locator("main section").filter({ has: p.locator("h2", { hasText: t }) });
  await snimi(p, "pocetna-rubrike", {
    kadar: sekcija("Sadržaj stranice"),
    oznake: [sekcija("Sadržaj stranice"), sekcija("Institucija i kontakti"), sekcija("Osnovni podaci"), sekcija("Posljednje promjene")],
  });

  // ── obrazac i greška ──
  await p.goto(BASE + "/admin/obavijesti/novo");
  await snimi(p, "obrazac", {
    kadar: "main",
    oznake: [
      polje(p, "naslov").getByText("1", { exact: true }),
      polje(p, "naslov").getByText("obavezno"),
      polje(p, "tekst").getByText("Prazan red pravi novi pasus."),
      p.locator("main button[type=submit]"),
      dugme(p, "Odustani"),
    ],
  });
  await p.goto(BASE + "/admin/nabavke/novo");
  await p.locator("main button[type=submit]").click();
  await p.waitForTimeout(800);
  await snimi(p, "greska-polja", {
    kadar: polje(p, "dokument"),
    oznake: [p.locator("main [role=alert]").first(), p.locator("main [role=alert] a").first(), polje(p, "dokument")],
  });

  // ── nabavka ──
  await p.goto(BASE + "/admin/nabavke/novo");
  await p.locator("input[type=file]").first().setInputFiles(pdf("Obavještenje o nabavci – kancelarijski materijal.pdf"));
  await p.waitForTimeout(1500);
  const radio = (ime, t) => polje(p, ime).locator("label").filter({ hasText: new RegExp(`^\\s*${t}\\s*$`) }).first().click();
  await radio("vrsta", "Obavještenja o nabavci");
  await radio("godina", "2026");
  await p.fill("input[name=postupak]", "Otvoreni postupak");
  await snimi(p, "nabavka", {
    kadar: "main",
    oznake: [polje(p, "dokument"), polje(p, "naziv"), polje(p, "vrsta"), polje(p, "godina"), polje(p, "postupak"), p.locator("main button[type=submit]")],
  });

  // ── dokument ──
  await p.goto(BASE + "/admin/dokumenti/novo");
  await p.locator("input[type=file]").first().setInputFiles(pdf("Izvještaj o radu za 2025. godinu.pdf"));
  await p.waitForTimeout(1500);
  await radio("kategorija", "Izvještaji o radu");
  await snimi(p, "dokument", { kadar: "main", oznake: [polje(p, "dokument"), polje(p, "naziv"), polje(p, "kategorija"), polje(p, "adresa")] });

  // ── obavijest s prilozima → poslije čuvanja ──
  await p.goto(BASE + "/admin/obavijesti/novo");
  await p.fill("input[name=naslov]", "Javni konkurs za prijem u radni odnos – novinar/novinarka");
  await p.fill("textarea[name=tekst]", "Radio-televizija Federacije BiH raspisuje javni konkurs za prijem u radni odnos na neodređeno vrijeme.\n\nPrijave se dostavljaju poštom ili lično, uz dokumente navedene u tekstu konkursa.");
  await polje(p, "dokumenti").locator("input[type=file]").first().setInputFiles([pdf("Tekst javnog konkursa.pdf"), pdf("Obrazac prijave.pdf")]);
  await p.waitForTimeout(2500);
  await polje(p, "rok").locator("input").first().fill("2026-12-15");
  await p.locator("main h1").click(); // fokus van polja (bez označenog dijela datuma)
  const prilozi = polje(p, "dokumenti");
  await snimi(p, "obavijest", {
    kadar: "main",
    oznake: [
      polje(p, "naslov"),
      polje(p, "datum"),
      polje(p, "tekst"),
      prilozi.locator("ul, ol").first(),
      [prilozi.locator("button").filter({ hasText: /Dodaj još|Odaberi/ }).first(), prilozi.getByText(/prevucite/).first()],
      polje(p, "rok"),
    ],
  });
  await p.locator("main button[type=submit]").click();
  await p.waitForURL("**/admin/gotovo**");
  await p.waitForTimeout(600);
  await snimi(p, "gotovo", {
    kadar: "main",
    oznake: [p.locator("main h1"), dugme(p, "Pogledaj na stranici"), dugme(p, "Dodaj još"), dugme(p, "Nazad na listu")],
  });

  // ── emisija (postojeća) ──
  await p.goto(BASE + "/admin/emisije");
  const href = await p.locator("main").getByRole("link", { name: /^Uredi\s*:\s*Dnevnik 2$/ }).first().getAttribute("href");
  await p.goto(BASE + href);
  await snimi(p, "emisija-1", {
    kadar: polje(p, "naziv"),
    oznake: [polje(p, "naziv"), polje(p, "grupa"), polje(p, "vrsta"), polje(p, "termin"), polje(p, "opis")],
  });
  await snimi(p, "emisija-2", {
    kadar: polje(p, "slika"),
    oznake: [polje(p, "slika"), polje(p, "logo"), polje(p, "naslovna"), polje(p, "glavna"), polje(p, "serija"), polje(p, "tekst")],
  });

  // ── duži tekst ──
  await p.goto(BASE + "/admin/tekstovi/novo");
  await p.fill("input[name=naslov]", "Upute za prijem programa");
  await dugme(p, "Tekst (pasus)").first().click();
  await p.locator("main textarea").last().fill("Program Federalne televizije možete pratiti putem zemaljske digitalne mreže DVB-T2, kablovskih operatera i satelita.");
  await dugme(p, "Podnaslov").first().click();
  await p.waitForTimeout(400);
  const blokovi = polje(p, "sadrzaj");
  await snimi(p, "tekst-dijelovi", {
    kadar: blokovi,
    oznake: [
      blokovi.locator("button").filter({ hasText: "Tabela" }).locator("xpath=.."),
      [blokovi.locator("button").filter({ hasText: "Gore" }).first(), blokovi.locator("button").filter({ hasText: "Dolje" }).first()],
      blokovi.locator("button").filter({ hasText: "Ukloni" }).first(),
      blokovi.locator("textarea").first(),
    ],
  });

  // ── organizacija ──
  await p.goto(BASE + "/admin/jedinice");
  const rtv = await p.locator("main").getByRole("link", { name: /^Uredi\s*:\s*Odjel RTV takse$/ }).first().getAttribute("href");
  await p.goto(BASE + rtv);
  await snimi(p, "organizacija", {
    kadar: "main form",
    oznake: ["naziv", "nadredjena", "telefon", "email", "osobe", "kontaktNaziv", "prikazNa"].map((i) => polje(p, i)),
  });

  // ── lista, redoslijed ──
  await p.goto(BASE + "/admin/nabavke");
  const prvi = p.locator("main li").filter({ has: p.getByRole("link", { name: /^Uredi\s*:/ }) }).first();
  await snimi(p, "lista", {
    kadar: p.locator("main li").filter({ has: p.getByRole("link", { name: /^Uredi\s*:/ }) }).nth(2),
    oznake: [
      dugme(p, /^\s*Dodaj javnu nabavku/),
      p.locator("main input[type=search], main input[name=pretraga], main input").first(),
      p.locator("main").getByText("Godina", { exact: true }).locator("xpath=.."),
      prvi.getByRole("link", { name: /^Uredi\s*:/ }),
      prvi.getByRole("link", { name: /^Pogledaj na stranici\s*:/ }),
      prvi.getByRole("button", { name: /^Arhiviraj\s*:/ }),
      prvi.getByRole("button", { name: /^Obriši\s*:/ }),
    ],
    visina: 1400,
  });
  await p.goto(BASE + "/admin/fm");
  const drugi = p.locator("main li").filter({ has: p.getByRole("button", { name: /^Pomjeri gore\s*:/ }) }).first();
  await snimi(p, "redoslijed", {
    kadar: p.locator("main li").filter({ has: p.getByRole("link", { name: /^Uredi\s*:/ }) }).nth(3),
    oznake: [[drugi.getByRole("button", { name: /^Pomjeri gore\s*:/ }), drugi.getByRole("button", { name: /^Pomjeri dolje\s*:/ })]],
    visina: 1200,
  });

  // ── brisanje i korpa ──
  await p.goto(BASE + "/admin/fm");
  const zadnja = p.locator("main li").filter({ has: p.getByRole("button", { name: /^Obriši\s*:/ }) }).last();
  const imeZadnje = (await zadnja.getByRole("button", { name: /^Obriši\s*:/ }).textContent()).replace(/^\s*Obriši:?\s*/, "").trim();
  await zadnja.getByRole("button", { name: /^Obriši\s*:/ }).click();
  await p.waitForTimeout(500);
  const dlg = p.locator("[role=dialog]:visible, [role=alertdialog]:visible, dialog[open]").first();
  await snimi(p, "brisanje-potvrda", {
    kadar: "ekran",
    oznake: [dlg.locator("h2, h3, [id$=naslov]").first(), dlg.locator("button").filter({ hasText: /^Da/ }), dlg.locator("button").filter({ hasText: /^Ne/ })],
  });
  await dlg.locator("button").filter({ hasText: /^Da/ }).click();
  await p.waitForTimeout(1200);
  await p.goto(BASE + "/admin/korpa");
  await snimi(p, "korpa", {
    kadar: "main",
    oznake: [p.locator("main button").filter({ hasText: "Vrati" }).first(), p.locator("main button").filter({ hasText: "Obriši zauvijek" }).first()],
  });
  await p.locator("main button").filter({ hasText: "Vrati" }).first().click();
  await p.waitForTimeout(400);
  const d2 = p.locator("[role=dialog]:visible, dialog[open]");
  if (await d2.count()) await d2.first().locator("button").filter({ hasText: /^Da|Vrati/ }).last().click();
  await p.waitForTimeout(1000);

  // ── osnovni podaci, arhivirane stranice, urednici ──
  await p.goto(BASE + "/admin/osnovno");
  await snimi(p, "osnovno", {
    kadar: "main form",
    oznake: [
      [polje(p, "adresa"), polje(p, "grad"), polje(p, "telefon")],
      [polje(p, "emailDirekcija"), polje(p, "emailPress")],
      [polje(p, "generalniDirektor"), polje(p, "telefonDirektor")],
      [polje(p, "youtube"), polje(p, "facebook"), polje(p, "instagram")],
    ],
  });
  await p.goto(BASE + "/admin/stranice");
  await snimi(p, "stranice", { kadar: "main", oznake: [polje(p, "rtvTaksa")] });
  await p.goto(BASE + "/admin/korisnici");
  await snimi(p, "urednici", {
    kadar: "main",
    oznake: [p.locator("section[aria-labelledby=lozinka]"), p.locator("section[aria-labelledby=urednici]"), p.locator("section[aria-labelledby=novi]")],
  });

  // ── problemi: dva urednika, istekla prijava ──
  await p.goto(BASE + "/admin/fm");
  const fmHref = await p.locator("main").getByRole("link", { name: /^Uredi\s*:/ }).first().getAttribute("href");
  const ctxB = await nov();
  const pB = await prijavi(ctxB);
  await p.goto(BASE + fmHref);
  await pB.goto(BASE + fmHref);
  const staro = await pB.inputValue("input[name=pokriva], textarea[name=pokriva]");
  await pB.fill("textarea[name=pokriva]", staro + " ");
  await pB.locator("main button[type=submit]").click();
  await pB.waitForURL("**/admin/gotovo**");
  await p.fill("input[name=mhz]", await p.inputValue("input[name=mhz]"));
  await p.locator("textarea[name=pokriva]").fill(staro);
  await p.locator("main button[type=submit]").click();
  await p.waitForTimeout(1200);
  const alert = p.locator("main [role=alert]").first();
  await alert.scrollIntoViewIfNeeded();
  await snimi(p, "sukob", {
    kadar: alert,
    oznake: [alert.locator("p").first(), alert.locator("a").filter({ hasText: "Otvori najnoviju" }), alert.locator("button").filter({ hasText: "Ipak sačuvaj" })],
    visina: 800,
  });
  await alert.locator("button").filter({ hasText: "Ipak sačuvaj" }).click();
  await p.waitForURL("**/admin/gotovo**");
  await ctxB.close();

  const ctxC = await nov();
  const pC = await prijavi(ctxC);
  await pC.goto(BASE + fmHref);
  await ctxC.clearCookies();
  await pC.locator("main button[type=submit]").click();
  await pC.waitForTimeout(1200);
  const alertC = pC.locator("main [role=alert]").first();
  await snimi(pC, "istekla", { kadar: alertC, oznake: [alertC], visina: 800 });
  await ctxC.close();

  fs.writeFileSync(DIMENZIJE, JSON.stringify(dims, null, 2) + "\n");
  console.log("dimenzije →", path.relative(KORIJEN, DIMENZIJE));
  await b.close();
})();
