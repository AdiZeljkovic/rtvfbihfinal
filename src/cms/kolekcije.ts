/**
 * Opis svih vrsta sadržaja kojima urednik upravlja.
 * Iz ovog opisa admin automatski pravi obrasce, a server provjerava podatke.
 * (Dijeli se između servera i preglednika – ovdje nema pristupa bazi.)
 */

export type Polje =
  | { ime: string; vrsta: "tekst"; naziv: string; pomoc?: string; obavezno?: boolean; primjer?: string }
  | { ime: string; vrsta: "dugiTekst"; naziv: string; pomoc?: string; obavezno?: boolean; redova?: number }
  | { ime: string; vrsta: "broj"; naziv: string; pomoc?: string; obavezno?: boolean }
  | { ime: string; vrsta: "datum"; naziv: string; pomoc?: string; obavezno?: boolean; danas?: boolean }
  | { ime: string; vrsta: "izbor"; naziv: string; pomoc?: string; obavezno?: boolean; opcije: string[]; kartice?: boolean; slobodno?: boolean; /** Natpis za prazan izbor u padajućoj listi */ prazno?: string }
  | { ime: string; vrsta: "prekidac"; naziv: string; pomoc?: string }
  | { ime: string; vrsta: "dokument"; naziv: string; pomoc?: string; obavezno?: boolean; nazivIz?: string }
  | { ime: string; vrsta: "dokumenti"; naziv: string; pomoc?: string }
  | { ime: string; vrsta: "slika"; naziv: string; pomoc?: string }
  | { ime: string; vrsta: "blokovi"; naziv: string; pomoc?: string }
  | { ime: string; vrsta: "lista"; naziv: string; pomoc?: string; stavka: string; polja: { ime: string; naziv: string; primjer?: string }[] };

export type Kolekcija = {
  kljuc: string;
  /** Množina, za naslove: „Javne nabavke“ */
  naziv: string;
  /** Jednina, za dugmad: „javnu nabavku“ (Dodaj …) */
  jednina: string;
  opis: string;
  ikona: "nabavke" | "dokumenti" | "obavijesti" | "emisije" | "pitanja" | "tekstovi" | "kontakti" | "frekvencije" | "postavke";
  polja: Polje[];
  /** Polje koje se prikazuje kao naslov u listi */
  naslovPolje: string;
  /** Kratki podnaslov u listi (polja čije se vrijednosti spajaju) */
  podnaslov?: string[];
  /** Filter u listi (npr. po godini) */
  filter?: string;
  /** Gdje se sadržaj vidi na stranici */
  naStranici: (z: Record<string, unknown>) => string;
  /** Nove stavke idu na vrh liste (najnovije prve) */
  noveNaVrh?: boolean;
  /** Može li urednik dodavati nove (ili samo uređivati postojeće) */
  dodavanje?: boolean;
  /** Jedinstveni zapis (podešavanja) – nema liste */
  jedinstven?: boolean;
  /** Grupa na početnoj stranici admina */
  grupa: "cesto" | "sadrzaj" | "institucija" | "podesavanja";
};

/** Prva godina u arhivi javnih nabavki (spisak godina pravi server, da bude uvijek tačan) */
export const PRVA_GODINA_NABAVKI = 2015;

export const VRSTE_NABAVKI = [
  "Plan javnih nabavki",
  "Obavještenja o nabavci",
  "Obavještenja o dodjeli",
  "Odluke o izboru",
  "Odluke o poništenju",
  "Obavještenja o poništenju",
  "Izvještaji o provedenim postupcima",
  "Javni pozivi",
  "Godišnja obavještenja",
  "Objave",
];

export const KATEGORIJE_DOKUMENATA = [
  "Zakoni i statut",
  "Uređivačka načela",
  "Pravilnici",
  "Programski planovi",
  "Izvještaji o radu",
  "Revizorski izvještaji",
  "Upravni odbor",
  "Cjenovnici",
  "Radio",
];

export const GRUPE_EMISIJA = ["Aktuelna sezona", "Emisije Federalne televizije", "Strani program", "Arhiva emisija"];
export const VRSTE_EMISIJA = ["Informativni", "Zabavni", "Dokumentarni", "Djeca i mladi", "Kultura", "Muzika", "Magazin", "Religija", "Sport"];

/**
 * Cijele stranice koje se mogu arhivirati (podešavanje „Arhivirane stranice“):
 * arhivirana stranica vraća 404, a linkovi na nju nestaju iz menija i ostalih stranica.
 */
export const ARHIVSKE_STRANICE = [{ ime: "rtvTaksa", ruta: "/rtv-taksa", naziv: "RTV taksa – pitanja i odgovori" }];

export const KOLEKCIJE: Kolekcija[] = [
  {
    kljuc: "nabavke",
    naziv: "Javne nabavke",
    jednina: "javnu nabavku",
    opis: "Planovi, obavještenja, odluke i izvještaji o postupcima javnih nabavki.",
    ikona: "nabavke",
    grupa: "cesto",
    noveNaVrh: true,
    dodavanje: true,
    naslovPolje: "naziv",
    podnaslov: ["vrsta", "godina"],
    filter: "godina",
    naStranici: (z) => `/javne-nabavke/${z.godina}`,
    polja: [
      { ime: "dokument", vrsta: "dokument", naziv: "Dokument", obavezno: true, nazivIz: "naziv", pomoc: "Odaberite PDF ili Word dokument sa računara." },
      { ime: "naziv", vrsta: "tekst", naziv: "Naziv dokumenta", obavezno: true, pomoc: "Upisuje se sam iz naziva fajla. Možete ga promijeniti.", primjer: "Obavještenje o nabavci – kancelarijski materijal" },
      { ime: "vrsta", vrsta: "izbor", naziv: "Vrsta objave", obavezno: true, opcije: VRSTE_NABAVKI, kartice: true },
      { ime: "godina", vrsta: "izbor", naziv: "Godina", obavezno: true, opcije: [], kartice: true },
      { ime: "postupak", vrsta: "tekst", naziv: "Postupak (nije obavezno)", pomoc: "Npr. „Otvoreni postupak“ ili „Direktni sporazum“. Prikazuje se sitno iznad naziva." },
    ],
  },
  {
    kljuc: "obavijesti",
    naziv: "Obavijesti i konkursi",
    jednina: "obavijest ili konkurs",
    opis: "Javni konkursi, oglasi za posao i druge obavijesti.",
    ikona: "obavijesti",
    grupa: "cesto",
    noveNaVrh: true,
    dodavanje: true,
    naslovPolje: "naslov",
    podnaslov: ["datum"],
    naStranici: () => "/obavijesti",
    polja: [
      { ime: "naslov", vrsta: "tekst", naziv: "Naslov", obavezno: true, primjer: "Javni konkurs za prijem u radni odnos" },
      { ime: "datum", vrsta: "datum", naziv: "Datum objave", obavezno: true, danas: true },
      { ime: "tekst", vrsta: "dugiTekst", naziv: "Tekst obavijesti (nije obavezno)", redova: 6, pomoc: "Prazan red pravi novi pasus." },
      { ime: "dokumenti", vrsta: "dokumenti", naziv: "Prilozi (dokumenti)", pomoc: "Možete dodati jedan ili više dokumenata." },
      { ime: "rok", vrsta: "datum", naziv: "Rok za prijave (nije obavezno)" },
    ],
  },
  {
    kljuc: "dokumenti",
    naziv: "Dokumenti",
    jednina: "dokument",
    opis: "Zakoni, statut, pravilnici, izvještaji o radu, revizije, cjenovnici.",
    ikona: "dokumenti",
    grupa: "cesto",
    noveNaVrh: true,
    dodavanje: true,
    naslovPolje: "naziv",
    podnaslov: ["kategorija"],
    filter: "kategorija",
    naStranici: (z) => (z.kategorija === "Cjenovnici" ? "/marketing#cjenovnici" : z.kategorija === "Upravni odbor" ? "/o-nama/upravni-odbor" : z.kategorija === "Radio" ? "/radio" : "/dokumenti"),
    polja: [
      { ime: "dokument", vrsta: "dokument", naziv: "Dokument", nazivIz: "naziv", pomoc: "Odaberite PDF ili Word dokument sa računara." },
      { ime: "naziv", vrsta: "tekst", naziv: "Naziv dokumenta", obavezno: true, primjer: "Izvještaj o radu i poslovanju za 2025. godinu" },
      { ime: "kategorija", vrsta: "izbor", naziv: "Gdje ga prikazati", obavezno: true, opcije: KATEGORIJE_DOKUMENATA, kartice: true },
      { ime: "adresa", vrsta: "tekst", naziv: "Ili: adresa stranice (umjesto dokumenta)", pomoc: "Samo ako dokument nije fajl nego stranica, npr. /dokumenti/statut." },
    ],
  },
  {
    kljuc: "emisije",
    naziv: "Emisije i serije",
    jednina: "emisiju",
    opis: "Emisije, termini, najave i opisi na stranici Televizija i na naslovnoj.",
    ikona: "emisije",
    grupa: "sadrzaj",
    dodavanje: true,
    naslovPolje: "naziv",
    podnaslov: ["grupa", "termin"],
    filter: "grupa",
    naStranici: (z) => `/televizija/emisije/${z.slug}`,
    polja: [
      { ime: "naziv", vrsta: "tekst", naziv: "Naziv emisije", obavezno: true, primjer: "Dnevnik 2" },
      { ime: "grupa", vrsta: "izbor", naziv: "Gdje pripada", obavezno: true, opcije: GRUPE_EMISIJA, kartice: true },
      { ime: "vrsta", vrsta: "izbor", naziv: "Vrsta programa", opcije: VRSTE_EMISIJA, kartice: true },
      { ime: "termin", vrsta: "tekst", naziv: "Termin emitovanja", primjer: "Petkom u 18:20", pomoc: "Kako ga gledaoci vide, npr. „Svakog dana u 19:30“." },
      { ime: "opis", vrsta: "dugiTekst", naziv: "Kratak opis", redova: 3, pomoc: "Jedna ili dvije rečenice za kartice i programsku shemu." },
      { ime: "slika", vrsta: "slika", naziv: "Slika (najava)" },
      { ime: "logo", vrsta: "slika", naziv: "Logo emisije (nije obavezno)" },
      { ime: "naslovna", vrsta: "prekidac", naziv: "Prikaži na naslovnoj stranici" },
      { ime: "glavna", vrsta: "prekidac", naziv: "Glavna emisija (velika kartica na naslovnoj)" },
      { ime: "serija", vrsta: "prekidac", naziv: "Ovo je serija" },
      { ime: "tekst", vrsta: "blokovi", naziv: "Opširni opis (stranica emisije)" },
    ],
  },
  {
    kljuc: "pitanja",
    naziv: "RTV taksa – pitanja",
    jednina: "pitanje",
    opis: "Pitanja građana i odgovori o RTV taksi.",
    ikona: "pitanja",
    grupa: "sadrzaj",
    dodavanje: true,
    naslovPolje: "pitanje",
    naStranici: () => "/rtv-taksa",
    polja: [
      { ime: "pitanje", vrsta: "dugiTekst", naziv: "Pitanje", obavezno: true, redova: 2 },
      { ime: "odgovor", vrsta: "dugiTekst", naziv: "Odgovor", obavezno: true, redova: 8, pomoc: "Prazan red pravi novi pasus." },
    ],
  },
  {
    kljuc: "tekstovi",
    naziv: "Duži tekstovi",
    jednina: "tekst",
    opis: "Zakoni, statut, uređivačka načela, cjenovnici, historijat i upute.",
    ikona: "tekstovi",
    grupa: "sadrzaj",
    dodavanje: true,
    naslovPolje: "naslov",
    podnaslov: ["nadnaslov"],
    naStranici: (z) => String(z.ruta ?? "/dokumenti"),
    polja: [
      { ime: "naslov", vrsta: "tekst", naziv: "Naslov", obavezno: true },
      { ime: "nadnaslov", vrsta: "tekst", naziv: "Mali natpis iznad naslova", primjer: "Opći akti" },
      { ime: "sadrzaj", vrsta: "blokovi", naziv: "Tekst" },
    ],
  },
  {
    kljuc: "upravni-odbor",
    naziv: "Upravni odbor – članovi",
    jednina: "člana",
    opis: "Članovi Upravnog odbora.",
    ikona: "kontakti",
    grupa: "institucija",
    dodavanje: true,
    naslovPolje: "ime",
    podnaslov: ["uloga"],
    naStranici: () => "/o-nama/upravni-odbor",
    polja: [
      { ime: "ime", vrsta: "tekst", naziv: "Ime i prezime", obavezno: true },
      { ime: "uloga", vrsta: "tekst", naziv: "Uloga", primjer: "Predsjedavajuća" },
      { ime: "predstavnik", vrsta: "tekst", naziv: "Predstavnik", primjer: "srpskog naroda" },
      { ime: "mandat", vrsta: "tekst", naziv: "Mandat", primjer: "tri godine" },
    ],
  },
  {
    kljuc: "jedinice",
    naziv: "Organizacija i kontakti",
    jednina: "sektor ili odjel",
    opis: "Sektori, odjeli i redakcije s kontaktima (stranica Organizacija).",
    ikona: "kontakti",
    grupa: "institucija",
    dodavanje: true,
    naslovPolje: "naziv",
    podnaslov: ["nadredjena"],
    naStranici: () => "/o-nama/organizacija",
    polja: [
      { ime: "naziv", vrsta: "tekst", naziv: "Naziv", obavezno: true, primjer: "Odjel za radijski program" },
      { ime: "nadredjena", vrsta: "izbor", naziv: "Pripada pod", pomoc: "Odaberite sektor ili odjel kojem pripada.", opcije: [], prazno: "— nije pod drugim (glavni sektor) —" },
      { ime: "telefon", vrsta: "tekst", naziv: "Telefon" },
      { ime: "email", vrsta: "tekst", naziv: "E-mail" },
      {
        ime: "osobe",
        vrsta: "lista",
        naziv: "Osobe",
        stavka: "osobu",
        polja: [
          { ime: "ime", naziv: "Ime i prezime" },
          { ime: "uloga", naziv: "Uloga", primjer: "urednica redakcije" },
          { ime: "telefon", naziv: "Telefon" },
          { ime: "email", naziv: "E-mail" },
        ],
      },
    ],
  },
  {
    kljuc: "marketing",
    naziv: "Marketing – kontakti",
    jednina: "kontakt",
    opis: "Kontakti Sektora marketinga i Odjela prodaje.",
    ikona: "kontakti",
    grupa: "institucija",
    dodavanje: true,
    naslovPolje: "ime",
    podnaslov: ["odjel"],
    naStranici: () => "/marketing#kontakti",
    polja: [
      { ime: "ime", vrsta: "tekst", naziv: "Ime i prezime", obavezno: true },
      { ime: "odjel", vrsta: "izbor", naziv: "Odjel", obavezno: true, opcije: ["Rukovodstvo", "Odjel prodaje", "Odjel plana i realizacije"], kartice: true },
      { ime: "uloga", vrsta: "tekst", naziv: "Uloga" },
      { ime: "telefon", vrsta: "tekst", naziv: "Telefon" },
      { ime: "fax", vrsta: "tekst", naziv: "Fax" },
      { ime: "email", vrsta: "tekst", naziv: "E-mail" },
    ],
  },
  {
    kljuc: "fm",
    naziv: "FM frekvencije",
    jednina: "frekvenciju",
    opis: "Predajnici Radija Federacije BiH i područja koja pokrivaju.",
    ikona: "frekvencije",
    grupa: "institucija",
    dodavanje: true,
    naslovPolje: "lokacija",
    podnaslov: ["mhz"],
    naStranici: () => "/radio#frekvencije",
    polja: [
      { ime: "lokacija", vrsta: "tekst", naziv: "Lokacija predajnika", obavezno: true },
      { ime: "mhz", vrsta: "tekst", naziv: "Frekvencija (MHz)", obavezno: true, primjer: "95,7" },
      { ime: "pokriva", vrsta: "dugiTekst", naziv: "Područje koje pokriva", redova: 3 },
    ],
  },
  {
    kljuc: "dvb",
    naziv: "DVB-T2 regije",
    jednina: "regiju",
    opis: "Digitalne regije Multipleksa A i kanali.",
    ikona: "frekvencije",
    grupa: "institucija",
    dodavanje: true,
    naslovPolje: "naziv",
    podnaslov: ["kanal"],
    naStranici: () => "/frekvencije#dvb-t2",
    polja: [
      { ime: "naziv", vrsta: "tekst", naziv: "Naziv regije", obavezno: true },
      { ime: "kanal", vrsta: "broj", naziv: "Kanal", obavezno: true },
      { ime: "podrucje", vrsta: "dugiTekst", naziv: "Mjesta u regiji", redova: 3 },
    ],
  },
  {
    kljuc: "osnovno",
    naziv: "Osnovni podaci",
    jednina: "osnovne podatke",
    opis: "Adresa, telefoni, e-mail adrese, generalni direktor i društvene mreže.",
    ikona: "postavke",
    grupa: "podesavanja",
    jedinstven: true,
    naslovPolje: "adresa",
    naStranici: () => "/kontakt",
    polja: [
      { ime: "adresa", vrsta: "tekst", naziv: "Ulica i broj", obavezno: true },
      { ime: "grad", vrsta: "tekst", naziv: "Poštanski broj i grad", obavezno: true },
      { ime: "telefon", vrsta: "tekst", naziv: "Glavni telefon", obavezno: true },
      { ime: "emailDirekcija", vrsta: "tekst", naziv: "E-mail Direkcije" },
      { ime: "emailPress", vrsta: "tekst", naziv: "E-mail za medije (press)" },
      { ime: "generalniDirektor", vrsta: "tekst", naziv: "Generalni direktor" },
      { ime: "telefonDirektor", vrsta: "tekst", naziv: "Telefon generalnog direktora" },
      { ime: "youtube", vrsta: "tekst", naziv: "YouTube adresa" },
      { ime: "facebook", vrsta: "tekst", naziv: "Facebook adresa" },
      { ime: "instagram", vrsta: "tekst", naziv: "Instagram adresa" },
    ],
  },
  {
    kljuc: "uo-saopstenje",
    naziv: "Upravni odbor – saopštenje",
    jednina: "saopštenje",
    opis: "Uvodni tekst i saopštenje na stranici Upravni odbor.",
    ikona: "postavke",
    grupa: "podesavanja",
    jedinstven: true,
    naslovPolje: "naslov",
    naStranici: () => "/o-nama/upravni-odbor",
    polja: [
      { ime: "osnov", vrsta: "dugiTekst", naziv: "Uvodni tekst (pravni osnov imenovanja)", redova: 4 },
      { ime: "naslov", vrsta: "tekst", naziv: "Naslov saopštenja" },
      { ime: "tekst", vrsta: "dugiTekst", naziv: "Tekst saopštenja", redova: 8, pomoc: "Prazan red pravi novi pasus." },
      { ime: "potpis", vrsta: "tekst", naziv: "Potpis" },
    ],
  },
  {
    kljuc: "stranice",
    naziv: "Arhivirane stranice",
    jednina: "arhivirane stranice",
    opis: "Cijele stranice koje se privremeno ne prikazuju. Isključite prekidač da se stranica vrati.",
    ikona: "postavke",
    grupa: "podesavanja",
    jedinstven: true,
    naslovPolje: "naziv",
    naStranici: () => "/",
    polja: ARHIVSKE_STRANICE.map((s) => ({
      ime: s.ime,
      vrsta: "prekidac" as const,
      naziv: `Arhiviraj stranicu „${s.naziv}“`,
      pomoc: `Uključeno: stranica ${s.ruta} i svi linkovi na nju se ne vide. Sadržaj ostaje sačuvan.`,
    })),
  },
];

export const kolekcija = (k: string) => KOLEKCIJE.find((x) => x.kljuc === k);
