export const historijat = {
  uvod: [
    "Radio-televizija Federacije Bosne i Hercegovine nastala je kao jedan segment transformacijom nekadašnje Radio-televizije Bosne i Hercegovine. Nakon potpisivanja protokola o transformaciji od strane članova Predsjedništva BiH, predstavnika sindikata RTVBiH i OHR-a, pristupilo se dugotrajnom i složenom procesu.",
    "Prvi generalni direktor RTVFBiH bio je Jasmin Duraković. Aktuelni generalni direktor RTVFBiH je Bakir Hadžiomerović.",
  ],
  radio: [
    "Zbog jednostavnijeg procesa, prvo je transformiran radijski program. Nakon kratkog perioda pripreme sheme i selekcije kadrova, 7. 5. 2001. godine, tačno u 06.00 sati prestao je program Radija Bosne i Hercegovine, a svoje emitovanje započeli su Radio Federacije Bosne i Hercegovine i BH Radio 1.",
    "Radio Federacije Bosne i Hercegovine svoje emitiranje programa nastavio je preko FM predajnika bivšeg Radija Bosne i Hercegovine (9 predajnika), dok je BHR1 počeo koristiti FM mrežu bivšeg Radija Fern, kao i ST predajnik u Donjim Moštrama. Prvi glavni i odgovorni urednik Radija Federacije Bosne i Hercegovine bio je Esad Cerović.",
    "Prvi novinar-voditelj čiji se glas čuo u programu Radija Federacije Bosne i Hercegovine bila je Jasna Primorac, koja je vodila kontakt-blok sve do 8 sati.",
    "Federalni radio i dalje je medij kojem se može vjerovati. Osnovni zadatak je brza i tačna informacija, ali akcenat se stavlja na priče o životnim problemima običnih ljudi. Slijedeći višedecenijsku tradiciju Radio-Sarajeva, nastojimo povezivati ljude, kulture i zajednice te uporno ukazivati na negativnosti i zloupotrebe.",
  ],
  radioRedakcije: [
    "Vijesti i aktuelnosti",
    "Kontakt program",
    "Program iz kulture",
    "Sportski program",
    "Dječiji program",
    "Dokumentarno-dramski program",
    "Obrazovni program",
    "Muzički program",
    "Marketing",
    "Program „Sarajevo 202“",
  ],
  televizija: [
    "Prvi televizijski dnevnik, s kojim je zvanično i počela raditi FTV, emitovan je 27. 10. 2001. godine. Urednik specijalnog i prvog TV dnevnika u 19.30 bio je Amarildo Gutić. Emisija je trajala 35 minuta. Urednica Informativnog programa bila je Marija Topić-Crnoja.",
    "Federalni televizijski program odvijao se na dva televizijska kanala (FTV1 i FTV2). Od aprila 2003. godine televizijski program je sveden na jedan.",
    "Federalna televizija nametnula se kao vodeći televizijski medij u Bosni i Hercegovini, najutjecajniji i najgledaniji. Istraživanja gledanosti potvrđivala su primat FTV-a u svim vrstama programa – od informativnog, preko sportskog, do filmskog programa.",
    "Televizija Federacije Bosne i Hercegovine slijedi kontinuitet filmske produkcije nekadašnje Televizije Sarajevo, u čijoj su produkciji ili koprodukciji nastali filmovi koji se svrstavaju u red najuspješnijih filmskih projekata u historiji nekadašnje Jugoslavije: „Žena s krajolikom“ Ivice Matića, „Sjećaš li se Doli Bel“ i „Otac na službenom putu“ Emira Kusturice, „Ovo malo duše“ Ademira Kenovića, „Aleksa Šantić“ Aleksandra Jevđevića i „Stanica običnih vozova“ Nenada Dizdarevića.",
  ],
  radio202: [
    "„Dobar dan, dragi slušaoci! Radio Sarajevo, program 202, počinje svoju prvu emisiju.“ Tačno u 14:30, 1. 7. 1971. na srednjem valu od 202 metra zvanično je počelo emitiranje programa Sarajevo 202. Početak programa najavio je glavni urednik Ante Štrelov, čime je Sarajevo 202 postalo 25. lokalna radiostanica u BiH.",
    "Za razliku od ostalih, 202 je bila zamišljena da zabavi, informira i stvori novu ulogu radioslušalaca: slušalac je postao neposredni kreator, a ne samo pasivni objekt u programu. Gotovo sve emisije bile su koncipirane tako da se slušaoci mogu neposredno uključiti telefonom ili razgovorom s reporterom na ulici.",
    "Radio Sarajevo 202 u aprilu 1986. počeo se emitirati u stereo tehnici iz novih prostorija u RTV domu. U novembru 2003. Radio počinje emitirati program 24 sata, uz prijenose koncerata „Uživo na 202“ i talk show „Centralni zatvor“. Radio je dobitnik Šestoaprilske nagrade Grada Sarajeva.",
  ],
  teletekst: [
    "Teletekst Federalne televizije jedan je od najstarijih u regiji i datira od Olimpijskih igara u Sarajevu 1984. godine. Nakon dužeg prekida ponovo je počeo raditi u oktobru 1998. godine, a poslije transformacije 2001. nastavio je rad u okviru Federalne televizije. Ista redakcija radi teletekst i za Televiziju Bosne i Hercegovine.",
    "Redakcija teleteksta, odnosno tadašnji Sektor online, 2006. godine uradila je i prvu web stranicu RTVFBiH. Od oktobra 2011. godine radi portal federalna.ba.",
  ],
};

/**
 * Vremenska linija. Uz godinu i opis svaki događaj nosi:
 *  - `kratko`  – natpis na memorijskoj tipki (skala na početnoj),
 *  - `datum`   – tačan datum/čas kad je poznat (iz teksta historijata),
 *  - `opseg`   – „talas“ na kojem se dogodilo, kao natpis na displeju,
 *  - `polozaj` – godina sa decimalom (mjesec), da igla stane na pravo mjesto.
 */
export const timeline = [
  { year: "1971", kratko: "202", datum: "1. 7. 1971. · 14.30", opseg: "SV · 202 m", polozaj: 1971.5, title: "Sarajevo 202", text: "Počinje program Radija Sarajevo 202, 25. lokalne radiostanice u BiH." },
  { year: "1984", kratko: "TTX", datum: "ZOI Sarajevo 1984.", opseg: "Teletekst", polozaj: 1984.1, title: "Teletekst", text: "Teletekst pokrenut uz Zimske olimpijske igre u Sarajevu – jedan od najstarijih u regiji." },
  { year: "2001", kratko: "Radio", datum: "7. 5. 2001. · 06.00", opseg: "FM · 9 predajnika", polozaj: 2001.35, title: "Radio Federacije BiH", text: "7. maja u 06.00 počinje emitovanje Radija Federacije Bosne i Hercegovine." },
  { year: "2001", kratko: "FTV", datum: "27. 10. 2001. · 19.30", opseg: "TV · prvi dnevnik", polozaj: 2001.82, title: "Federalna televizija", text: "27. oktobra emitovan prvi TV dnevnik – zvanični početak rada FTV-a." },
  { year: "2003", kratko: "1 kanal", datum: "april 2003.", opseg: "FTV1 + FTV2", polozaj: 2003.27, title: "Jedan TV kanal", text: "Program FTV1 i FTV2 objedinjen u jedan kanal." },
  { year: "2006", kratko: "Web", datum: "2006.", opseg: "www", polozaj: 2006.5, title: "rtvfbih.ba", text: "Prva web stranica javnog servisa." },
  { year: "2011", kratko: "Portal", datum: "oktobar 2011.", opseg: "federalna.ba", polozaj: 2011.8, title: "federalna.ba", text: "Pokrenut informativni portal federalna.ba." },
  { year: "2026", kratko: "App", datum: "2026.", opseg: "Android · iOS", polozaj: 2026.5, title: "Mobilna aplikacija", text: "Javni servis dobija mobilnu aplikaciju za Android i iOS." },
];

/** Filmovi iz produkcije/koprodukcije Televizije Sarajevo (za stranicu O nama) */
export const filmovi = [
  { naziv: "Žena s krajolikom", autor: "Ivica Matić" },
  { naziv: "Sjećaš li se Doli Bel", autor: "Emir Kusturica" },
  { naziv: "Otac na službenom putu", autor: "Emir Kusturica" },
  { naziv: "Ovo malo duše", autor: "Ademir Kenović" },
  { naziv: "Aleksa Šantić", autor: "Aleksandar Jevđević" },
  { naziv: "Stanica običnih vozova", autor: "Nenad Dizdarević" },
];
