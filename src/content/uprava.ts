import { site } from "./site";

const legacy = site.external.legacy;

export const upravniOdbor = {
  osnov:
    "Na osnovu Ukaza o proglašenju odluke o imenovanju članova Upravnog odbora Radio-televizije Federacije Bosne i Hercegovine i Odluke o imenovanju članova Upravnog odbora („Službene novine Federacije BiH“ broj 33/25 od 07. 05. 2025. godine) imenovani su članovi Upravnog odbora u sastavu:",
  clanovi: [
    { ime: "Daniela Gogić", uloga: "Predsjedavajuća", napomena: "iz reda srpskog naroda, mandat tri godine" },
    { ime: "Medina Mujić", uloga: "Članica", napomena: "iz reda bošnjačkog naroda, mandat četiri godine" },
    { ime: "Zoran Krešić", uloga: "Član", napomena: "iz reda hrvatskog naroda, mandat jedna godina" },
    { ime: "Adnan Huskić", uloga: "Član", napomena: "iz reda ostalih, mandat dvije godine" },
  ],
  saopstenje: {
    naslov: "Saopštenje za javnost UO RTVFBiH",
    tekst: [
      "Upravni odbor RTV Federacije BiH je na 8. redovnoj sjednici izabrao Bakira Hadžiomerovića za novog generalnog direktora ovog javnog servisa na mandat od pet godina. Sjednica je održana u Mostaru, a članovi UO RTV FBiH bili su jednoglasni u ocjeni kako je Hadžiomerović bio najbolji kandidat na provedenom javnom konkursu. Upravni odbor je bodovao menadžersko iskustvo, poznavanje rada medija, predstavljeni plan rada te dojmove s intervjua.",
      "Hadžiomerović je poznato medijsko ime, radio je dugi niz godina na RTV FBiH, a u međuvremenu je bio i menadžer. Upravni odbor RTV FBiH uvjeren je da će imati uspješnu saradnju s novim generalnim direktorom u vođenju ove kuće i ostvarivanju njezine misije da bude profesionalan i savremen javni servis u službi svih građana BiH.",
    ],
    potpis: "Daniela Gogić, predsjednica UO RTV FBiH",
  },
  dokumenti: [
    { label: "Poslovnik o radu UO RTVFBiH", href: `${legacy}/doc/Poslovnik_o_radu_UORTVFBiH.pdf` },
    {
      label: "Javni konkurs/natječaj za izbor generalnog direktora RTVFBiH",
      href: `${legacy}/doc/Javni%20konkurs%20za%20izbor%20generalnog%20direktora%20RTVFBiH.pdf`,
    },
  ],
};

export type Osoba = { ime: string; uloga?: string; email?: string; tel?: string };
export type Jedinica = {
  naziv: string;
  osobe?: Osoba[];
  email?: string;
  tel?: string;
  pod?: Jedinica[];
};

export const generalniDirektor: Osoba = {
  ime: "Bakir Hadžiomerović",
  uloga: "Generalni direktor RTVFBiH",
  tel: "+387 (0)33 464 070",
};

export const organizacija: Jedinica[] = [
  {
    naziv: "Direkcija RTVFBiH",
    tel: "+387 (0)33 461 101",
    email: "direkcija@rtvfbih.ba",
    osobe: [generalniDirektor],
  },
  {
    naziv: "Sektor za programe RTVFBiH",
    osobe: [{ ime: "Ivan Pavković", uloga: "izvršni direktor za programe", email: "ivan.pavkovic@rtvfbih.ba" }],
    pod: [
      {
        naziv: "Odjel multimedije",
        email: "redakcija@federalna.ba",
        osobe: [
          { ime: "Haris Suljić", uloga: "v.d. urednika" },
          { ime: "Adnan Jašarspahić", uloga: "tehnički urednik" },
        ],
      },
      {
        naziv: "Odjel za TV program",
        tel: "+387 (0)33 461 101",
        osobe: [{ ime: "Željko Tica", uloga: "urednik TV programa", email: "zeljko.tica@rtvfbih.ba" }],
        pod: [
          { naziv: "Redakcija informativnog programa", tel: "+387 (0)33 461 561", osobe: [{ ime: "Mirza Huskić", uloga: "urednik redakcije" }] },
          { naziv: "Redakcija zabavnog programa", tel: "+387 (0)33 455 155", osobe: [{ ime: "Jasmina Jokić Hajrić", uloga: "urednica redakcije", email: "jasmina.jokic@rtvfbih.ba" }] },
          { naziv: "Redakcija dokumentarnog programa", tel: "+387 (0)33 461 516", osobe: [{ ime: "Namik Kabil", uloga: "urednik redakcije", email: "namik.kabil@rtvfbih.ba" }] },
          { naziv: "Redakcija programa za djecu i mlade", tel: "+387 (0)33 461 521", osobe: [{ ime: "Vanja Avdić-Čabrić", uloga: "urednica redakcije" }] },
        ],
      },
      {
        naziv: "Odjel za radijski program",
        tel: "+387 (0)33 455 102",
        osobe: [{ ime: "Jara Orozović", uloga: "odgovorna urednica radijskog programa", email: "jara.orozovic@rtvfbih.ba" }],
        pod: [
          { naziv: "Redakcija informativnog programa", email: "radiof2@rtvfbih.ba" },
          { naziv: "Redakcija zabavno-edukativnog programa", tel: "+387 (0)33 455 135", osobe: [{ ime: "Ljiljana Simić", uloga: "urednica redakcije", email: "ljiljana.simic@rtvfbih.ba" }] },
          { naziv: "Redakcija dokumentarno-dramskog programa", tel: "+387 (0)33 455 152", osobe: [{ ime: "Selma Dizdar-Cerović", uloga: "urednica redakcije", email: "selmadc@rtvfbih.ba" }] },
          { naziv: "Redakcija muzičkog programa", tel: "+387 (0)33 453 230", email: "muzicka.rf@rtvfbih.ba" },
        ],
      },
      {
        naziv: "Odjel proizvodnje i produkcije programa",
        tel: "+387 (0)33 458 769",
        osobe: [{ ime: "Haris Zvizdić", uloga: "glavni producent RTVFBiH", email: "haris.zvizdic@rtvfbih.ba" }],
        pod: [
          {
            naziv: "Odsjek za produkciju programa",
            osobe: [
              { ime: "Ahmed Humkić", uloga: "zamjenik glavnog producenta", email: "ahmed.humkic@rtvfbih.ba" },
              { ime: "Nedim Karalić", uloga: "zamjenik glavnog producenta", email: "nedim.karalic@rtvfbih.ba" },
            ],
          },
          { naziv: "Odsjek za produkcijski razvoj", osobe: [{ ime: "Elvir Radeljaš", uloga: "rukovodilac", email: "elvir.radeljas@rtvfbih.ba" }] },
          { naziv: "Odsjek za jezike", osobe: [{ ime: "Jasna Primorac", uloga: "rukovoditeljica", email: "jasna.primorac@rtvfbih.ba" }] },
        ],
      },
    ],
  },
  {
    naziv: "Sektor marketinga RTVFBiH",
    osobe: [{ ime: "Adnan Bilal", uloga: "izvršni direktor", email: "adnan.bilal@rtvfbih.ba" }],
    pod: [
      {
        naziv: "Odjel za komunikaciju i promociju programa",
        tel: "+387 (0)33 461 539",
        email: "press@rtvfbih.ba",
        osobe: [{ ime: "Adesa Kulenović", uloga: "rukovoditeljica", email: "ada.kulenovic@rtvfbih.ba" }],
      },
    ],
  },
  {
    naziv: "Sektor ekonomsko-finansijskih poslova",
    tel: "+387 (0)33 461 518",
    osobe: [{ ime: "Džemal Vatreš", uloga: "izvršni direktor", email: "dzemal.vatres@rtvfbih.ba" }],
    pod: [
      { naziv: "Odjel RTV takse", tel: "+387 (0)33 464 069", osobe: [{ ime: "Denis Hajdarević", uloga: "rukovodilac", email: "denis.hajdarevic@rtvfbih.ba" }] },
    ],
  },
  {
    naziv: "Sektor pravnih poslova",
    tel: "+387 (0)33 455 131",
    email: "ps@rtvfbih.ba",
    osobe: [{ ime: "Melisa Jaramaz Belenji", uloga: "izvršna direktorica" }],
    pod: [
      { naziv: "Odjel za ljudske resurse", email: "ljudski.potencijali@rtvfbih.ba", osobe: [{ ime: "Marinko Jozić", uloga: "rukovodilac" }] },
    ],
  },
];

export const marketingKontakti = {
  direktor: {
    ime: "Adnan Bilal",
    uloga: "izvršni direktor Sektora marketinga",
    tel: "+387 (0)33 461 512, +387 (0)33 462 441",
    fax: "+387 (0)33 455 157",
    email: "adnan.bilal@rtvfbih.ba",
  },
  prodaja: [
    { ime: "Edina Herić", tel: "+387 (0)33 462 062, +387 (0)33 461 512", fax: "+387 (0)33 461 514", email: "edina.heric@rtvfbih.ba" },
    { ime: "Dalida Selimović", tel: "+387 (0)33 461 513, +387 (0)33 523 025", fax: "+387 (0)33 461 514", email: "dalida.selimovic@rtvfbih.ba" },
    { ime: "Indira Sofić", tel: "+387 (0)33 462 047, +387 (0)33 523 025", fax: "+387 (0)33 455 157", email: "indira.sofic@rtvfbih.ba" },
    { ime: "Adnan Balić", tel: "+387 (0)33 461 513, +387 (0)33 523 025", fax: "+387 (0)33 455 157", email: "adnan.balic@rtvfbih.ba" },
  ],
  plan: [
    { ime: "Admir Numić", uloga: "Odjel plana i realizacije", tel: "+387 (0)33 462 463", fax: "+387 (0)33 455 157", email: "admir.numic@rtvfbih.ba" },
  ],
  cjenovnici: [
    { label: "CPP cjenovnik usluga oglašavanja s opštim uslovima – Federalna TV 2026.", href: `${legacy}/doc/Marketing_CCP%20Cjenovnik_2026.pdf` },
    { label: "Cjenovnik usluga oglašavanja i sponzorstva s opštim uslovima – Federalna TV 2026.", href: `${legacy}/doc/CJENOVNIK.pdf` },
    { label: "Cjenovnik za opšte izbore 2026. – Federalna televizija", href: `${legacy}/doc/Cjenovnik%20za%20op%C5%A1te%20izbore%20za%202026.%20godinu%20za%20TV.pdf` },
    { label: "Cjenovnik usluga oglašavanja – Radio Federacije BiH 2026.", href: `${legacy}/doc/Marketing_Cjenovnik%20Radio%20FBiH_2026.pdf` },
    { label: "Cjenovnik za opšte izbore 2026. – Federalni radio", href: `${legacy}/doc/Cjenovnik%20za%20op%C5%A1te%20izbore%20za%202026.%20godinu%20za%20Federalni%20Radio.pdf` },
    { label: "Cjenovnik usluga oglašavanja – web portal 2026.", href: `${legacy}/doc/Marketing_Cjenovnik%20za%20portal_2026.pdf` },
    { label: "Cjenovnik oglašavanja na Teletekstu", href: `${legacy}/loc/template.wbsp?wbf_id=29&section=mark` },
  ],
};
