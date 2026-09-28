export type Vrsta =
  | "Informativni"
  | "Zabavni"
  | "Dokumentarni"
  | "Djeca i mladi"
  | "Kultura"
  | "Muzika"
  | "Magazin"
  | "Religija"
  | "Sport";

export type Emisija = {
  naziv: string;
  termin: string;
  vrsta: Vrsta;
  opis: string;
  /** Istaknuto na početnoj stranici */
  istaknuto?: boolean;
};

/** Najave i emisije iz programa Federalne televizije (izvor: rtvfbih.ba, sezona 2025/26) */
export const emisije: Emisija[] = [
  {
    naziv: "Dobro jutro, Bosno i Hercegovino!",
    termin: "Radnim danima 06:45–09:00, vikendom 07:45–10:00",
    vrsta: "Informativni",
    istaknuto: true,
    opis: "Jutarnji program Federalne televizije: vijesti, političke minute, kultura, kulinarska slikovnica i hit jutra. Urednik Ivica Pjanić.",
  },
  {
    naziv: "Dnevnik 2",
    termin: "Svakog dana u 19:30",
    vrsta: "Informativni",
    istaknuto: true,
    opis: "Najgledanija centralna informativna emisija u Bosni i Hercegovini.",
  },
  {
    naziv: "Nedjeljno popodne",
    termin: "Nedjeljom u 16:45",
    vrsta: "Zabavni",
    istaknuto: true,
    opis: "Nakon dvadeset godina kultna emisija vraća se u novoj programskoj shemi. Voditelji Emina Hodžić i Nedim Malkočević.",
  },
  {
    naziv: "Plenum",
    termin: "Ponedjeljak–četvrtak u 21:15",
    vrsta: "Informativni",
    istaknuto: true,
    opis: "Debatna emisija uživo. Dijalog nema alternativu. Urednica Nevzeta Koljenović, voditeljice Jasmina Vilić i Dejana Regoje.",
  },
  {
    naziv: "Znzkvi",
    termin: "Petkom u 18:20, uživo",
    vrsta: "Zabavni",
    istaknuto: true,
    opis: "Popularni TV kviz kolektiva Helem Nejse vraća se na male ekrane s novom sezonom.",
  },
  {
    naziv: "U žensko ime",
    termin: "Nedjeljom u 13:00",
    vrsta: "Magazin",
    istaknuto: true,
    opis: "Obrazovni serijal o ženama, stereotipima i dijalogu. Autorica i voditeljica Razija Čolaković.",
  },
  {
    naziv: "Dnevnik 1",
    termin: "Svakog dana u 12:00",
    vrsta: "Informativni",
    opis: "Podnevni pregled najvažnijih vijesti iz zemlje i svijeta.",
  },
  {
    naziv: "Dnevnik 3",
    termin: "Svake večeri",
    vrsta: "Informativni",
    opis: "Pregled dana i najvažnijih događaja.",
  },
  {
    naziv: "Dnevnik D",
    termin: "Četvrtkom u 18:55",
    vrsta: "Informativni",
    opis: "Intervju jedan na jedan. Voditeljica Nikolina Veljović.",
  },
  {
    naziv: "Mreža",
    termin: "Ponedjeljkom u 20:10",
    vrsta: "Informativni",
    opis: "Politički magazin. Urednica i producentica Elma Kazagić.",
  },
  {
    naziv: "Svijet",
    termin: "Petkom u 18:25",
    vrsta: "Informativni",
    opis: "Vanjskopolitički magazin. Urednica Ana Skopljak.",
  },
  {
    naziv: "Sport",
    termin: "Ponedjeljkom u 18:25",
    vrsta: "Sport",
    opis: "Domaće lige, klubovi, talenti i velikani bh. sporta. Urednik Muhamed Bikić.",
  },
  {
    naziv: "Art Kvart",
    termin: "Utorkom u 18:20",
    vrsta: "Kultura",
    opis: "Magazin iz kulture: knjige, muzika, dizajn, arhitektura, pozorište i film. Urednica Maja Begtašagić.",
  },
  {
    naziv: "Svako dobro",
    termin: "Srijedom u 18:25",
    vrsta: "Magazin",
    opis: "Reportaže diljem Bosne i Hercegovine o zanimljivim, vrijednim i neobičnim ljudima. Autor Ahmed Bradarić.",
  },
  {
    naziv: "Pretežno vedro",
    termin: "Četvrtkom u 17:35",
    vrsta: "Zabavni",
    opis: "Zabavni magazin: putovanja, koncerti, izložbe, filmovi i inovacije.",
  },
  {
    naziv: "Kuglanje",
    termin: "Petkom u 21:20",
    vrsta: "Zabavni",
    opis: "Satirični pogled na sedmicu. Autor koncepta Almir Kurt.",
  },
  {
    naziv: "In Music Puls",
    termin: "Petkom u 22:55",
    vrsta: "Muzika",
    opis: "Muzički TV magazin o bh. sceni i top-lista domaćih izvođača. Voditeljica Sara Ristić.",
  },
  {
    naziv: "Nađi pronađi",
    termin: "Nedjeljom u 10:05",
    vrsta: "Djeca i mladi",
    opis: "TV igra za učenike od V do IX razreda kroz četiri zabavno-edukativne igre. Urednica Vanja Avdić-Čabrić.",
  },
  {
    naziv: "Zelena panorama",
    termin: "Nedjeljom u 12:15",
    vrsta: "Magazin",
    opis: "Emisija o poljoprivredi i selu. Voditelji Šejla Šabanović i Mirhat Mustafić.",
  },
  {
    naziv: "Mozaik religija",
    termin: "Subotom u 11:30",
    vrsta: "Religija",
    opis: "Vjerski život, međureligijski dijalog i reportaže povodom praznika.",
  },
  {
    naziv: "Hayd u Park",
    termin: "Nedjeljom u 11:00",
    vrsta: "Dokumentarni",
    opis: "Serijal o aktivizmu i ljudskim pravima u koprodukciji s Fondacijom za kreativni razvoj.",
  },
  {
    naziv: "TV Bingo Show",
    termin: "Petkom u 20:10",
    vrsta: "Zabavni",
    opis: "Igra Lutrije BiH u saradnji s Federalnom televizijom.",
  },
];

export const produkcija = [
  { naziv: "Informativni program", opis: "Dnevnik, vijesti, aktuelnosti i politički magazini – brza i tačna informacija." },
  { naziv: "Kulturno-zabavni program", opis: "Kvizovi, muzički i zabavni magazini, kulturna događanja." },
  { naziv: "Dokumentarno-savremeni program", opis: "Dokumentarni filmovi i serijali o društvu, ljudima i historiji." },
  { naziv: "Program za djecu i mlade", opis: "Edukativne i zabavne emisije prilagođene najmlađima." },
];
