import "server-only";
/**
 * Početni sadržaj baze – uzima se iz postojećih fajlova sadržaja stranice
 * (uključujući sve preneseno sa stare stranice). Koristi se samo jednom,
 * kad je baza prazna; nakon toga sadržajem upravlja urednik kroz CMS.
 */
import { faq, nabavke, emisije as arhivaEmisije, tekstovi } from "@/content/arhiva";
import { izvjestajiORadu, opciAkti, programskiPlanovi, revizorskiIzvjestaji } from "@/content/dokumenti";
import { generalniDirektor, marketingKontakti, organizacija, upravniOdbor, type Jedinica } from "@/content/uprava";
import { emisije as programEmisije } from "@/content/program";
import { dvbt2Regije, radioFM } from "@/content/frekvencije";
import { site } from "@/content/site";
import { VRSTE_NABAVKI } from "@/cms/kolekcije";

type P = Record<string, unknown>;

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** href iz postojećeg sadržaja → { dokument } ili { adresa } */
function izHref(href: string): P {
  if (href.startsWith("/doc/")) return { dokument: decodeURIComponent(href.slice(5)) };
  return { adresa: href };
}

/** Vrsta objave javne nabavke: postojeći naslovi sekcija se svode na standardne nazive */
function vrstaNabavke(naslov: string) {
  const n = naslov.toLowerCase();
  const nadji = (t: string) => VRSTE_NABAVKI.find((v) => v.toLowerCase().startsWith(t));
  if (n.startsWith("plan")) return nadji("plan")!;
  if (n.includes("godišnj")) return nadji("godišnja")!;
  if (n.includes("javni poziv") || n.includes("javni pozivi")) return nadji("javni")!;
  if (n.includes("poništenju") && n.startsWith("obav")) return nadji("obavještenja o poništenju")!;
  if (n.includes("poništenju")) return nadji("odluke o poništenju")!;
  if (n.includes("dodjeli")) return nadji("obavještenja o dodjeli")!;
  if (n.includes("nabavci")) return nadji("obavještenja o nabavci")!;
  if (n.includes("izboru")) return nadji("odluke o izboru")!;
  if (n.includes("izvješ") || n.includes("izvjes")) return nadji("izvještaji")!;
  return naslov === "Objave" ? "Objave" : naslov;
}

export function pocetniZapisi(): Record<string, P[]> {
  // ── javne nabavke (najnovija godina prva) ──
  const nab: P[] = [];
  for (const g of nabavke) {
    for (const s of g.sekcije) {
      for (const st of s.stavke) {
        nab.push({ naziv: st.tekst, dokument: st.doc, vrsta: vrstaNabavke(s.naslov), godina: String(g.godina), postupak: st.grupa ?? "" });
      }
    }
  }

  // ── dokumenti ──
  const dok: P[] = [];
  const kat: Record<string, string> = { "Zakoni i statut": "Zakoni i statut", Pravilnici: "Pravilnici" };
  for (const grupa of opciAkti) {
    const k = kat[grupa.naslov] ?? (grupa.naslov.startsWith("Uređivačka") ? "Uređivačka načela" : grupa.naslov);
    grupa.stavke.forEach((s) => dok.push({ naziv: s.label, kategorija: k, ...izHref(s.href) }));
  }
  programskiPlanovi.forEach((s) => dok.push({ naziv: s.label, kategorija: "Programski planovi", ...izHref(s.href) }));
  izvjestajiORadu.forEach((s) => dok.push({ naziv: s.label, kategorija: "Izvještaji o radu", ...izHref(s.href) }));
  revizorskiIzvjestaji.forEach((s) => dok.push({ naziv: s.label, kategorija: "Revizorski izvještaji", ...izHref(s.href) }));
  upravniOdbor.dokumenti
    .filter((d) => !d.label.toLowerCase().includes("konkurs"))
    .forEach((s) => dok.push({ naziv: s.label, kategorija: "Upravni odbor", ...izHref(s.href) }));
  marketingKontakti.cjenovnici.forEach((s) => dok.push({ naziv: s.label, kategorija: "Cjenovnici", ...izHref(s.href) }));
  dok.push({ naziv: "Programska shema Radija Federacije BiH 2016/2017. godine", kategorija: "Radio", dokument: "PROGRAMSKA SHEMA RADIJA FEDERACIJE BiH 2015--2016.doc" });

  // ── obavijesti i konkursi ──
  const obavijesti: P[] = upravniOdbor.dokumenti
    .filter((d) => d.label.toLowerCase().includes("konkurs"))
    .map((d) => ({
      naslov: d.label,
      datum: "2025-05-07",
      tekst: "",
      dokumenti: [{ naziv: d.label, ...izHref(d.href) }],
      rok: "",
    }));

  // ── emisije: programska shema + stranice emisija sa stare stranice ──
  const em: P[] = [];
  const iskoristene = new Set<string>();
  for (const a of arhivaEmisije) {
    const sa = slug(a.naslov);
    const p = programEmisije.find((x) => {
      const sp = slug(x.naziv);
      return sa === sp || sa.startsWith(sp + "-") || sp.startsWith(sa + "-");
    });
    if (p) iskoristene.add(p.naziv);
    const grupa = p && a.grupa === "Aktuelna sezona" ? "Aktuelna sezona" : a.grupa;
    em.push({
      naziv: p?.naziv ?? a.naslov,
      slug: a.slug,
      grupa,
      vrsta: p?.vrsta ?? "",
      termin: p?.termin ?? "",
      opis: p?.opis ?? "",
      slika: a.slika ?? "",
      logo: a.logo ?? "",
      naslovna: Boolean(p?.istaknuto),
      glavna: Boolean(p?.glavna),
      serija: a.serija,
      tekst: a.blokovi,
    });
  }
  // emisije iz programske sheme koje nemaju stranicu na staroj stranici
  for (const p of programEmisije.filter((x) => !iskoristene.has(x.naziv))) {
    em.push({
      naziv: p.naziv,
      slug: slug(p.naziv),
      grupa: "Emisije Federalne televizije",
      vrsta: p.vrsta,
      termin: p.termin,
      opis: p.opis,
      slika: "",
      logo: "",
      naslovna: Boolean(p.istaknuto),
      glavna: Boolean(p.glavna),
      serija: false,
      tekst: [],
    });
  }

  // ── organizacija (stablo → ravna lista s nadređenom jedinicom) ──
  const jed: P[] = [];
  const dodaj = (j: Jedinica, nad: string) => {
    jed.push({ naziv: j.naziv, nadredjena: nad, telefon: j.tel ?? "", email: j.email ?? "", osobe: (j.osobe ?? []).map((o) => ({ ime: o.ime, uloga: o.uloga ?? "", telefon: o.tel ?? "", email: o.email ?? "" })) });
    j.pod?.forEach((x) => dodaj(x, j.naziv));
  };
  organizacija.forEach((j) => dodaj(j, ""));

  // ── marketing kontakti ──
  const mk = marketingKontakti;
  const marketing: P[] = [
    { ime: mk.direktor.ime, odjel: "Rukovodstvo", uloga: mk.direktor.uloga, telefon: mk.direktor.tel, fax: mk.direktor.fax, email: mk.direktor.email },
    ...mk.prodaja.map((o) => ({ ime: o.ime, odjel: "Odjel prodaje", uloga: "", telefon: o.tel, fax: o.fax, email: o.email })),
    ...mk.plan.map((o) => ({ ime: o.ime, odjel: "Odjel plana i realizacije", uloga: o.uloga ?? "", telefon: o.tel, fax: o.fax, email: o.email })),
  ];

  return {
    nabavke: nab,
    dokumenti: dok,
    obavijesti,
    emisije: em,
    pitanja: faq.map((f) => ({ pitanje: f.pitanje, odgovor: f.odgovor.join("\n\n") })),
    tekstovi: Object.values(tekstovi).map((t) => ({ naslov: t.naslov, nadnaslov: t.nadnaslov, ruta: t.ruta, sadrzaj: t.blokovi })),
    "upravni-odbor": upravniOdbor.clanovi.map((c) => {
      const [predstavnik, mandat] = c.napomena.split(", ");
      return { ime: c.ime, uloga: c.uloga, predstavnik: (predstavnik ?? "").replace("iz reda ", ""), mandat: (mandat ?? "").replace("mandat ", "") };
    }),
    jedinice: jed,
    marketing,
    fm: radioFM.map((f) => ({ lokacija: f.lokacija, mhz: f.mhz, pokriva: f.pokriva })),
    dvb: dvbt2Regije.map((r) => ({ naziv: r.naziv, kanal: r.kanal, podrucje: r.podrucje })),
    osnovno: [
      {
        adresa: site.address.street,
        grad: site.address.city,
        telefon: site.phone,
        emailDirekcija: site.emails.direkcija,
        emailPress: site.emails.press,
        generalniDirektor: generalniDirektor.ime,
        telefonDirektor: generalniDirektor.tel ?? "",
        youtube: site.social.youtube,
        facebook: site.social.facebook,
        instagram: site.social.instagram,
      },
    ],
    "uo-saopstenje": [
      {
        osnov: upravniOdbor.osnov,
        naslov: upravniOdbor.saopstenje.naslov,
        tekst: upravniOdbor.saopstenje.tekst.join("\n\n"),
        potpis: upravniOdbor.saopstenje.potpis,
      },
    ],
  };
}
