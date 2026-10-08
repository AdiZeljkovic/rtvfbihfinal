import { docUrl } from "@/lib/doc";

const doc = (path: string) => docUrl(decodeURIComponent(path));

export type Dokument = { label: string; href: string; format?: "pdf" | "doc" | "docx" | "xps" | "web" };
export type DokumentGrupa = { naslov: string; opis?: string; stavke: Dokument[] };

export const opciAkti: DokumentGrupa[] = [
  {
    naslov: "Zakoni i statut",
    stavke: [
      { label: "Zakon o Javnom radiotelevizijskom sistemu Bosne i Hercegovine", href: "/dokumenti/zakon-o-javnom-rtv-sistemu", format: "web" },
      { label: "Zakon o Javnom RTV servisu Federacije BiH", href: "/dokumenti/zakon-o-rtvfbih", format: "web" },
      { label: "Statut Radio-televizije Federacije Bosne i Hercegovine", href: doc("U5913288_novo.pdf"), format: "pdf" },
      { label: "Statut Radio-televizije Federacije Bosne i Hercegovine – tekst na stranici", href: "/dokumenti/statut", format: "web" },
    ],
  },
  {
    naslov: "Uređivačka načela / principi Javnog RTV sistema u BiH",
    stavke: [
      { label: "Bosanski jezik", href: "/dokumenti/uredjivacka-nacela", format: "web" },
      { label: "Hrvatski jezik", href: "/dokumenti/uredjivacka-nacela-hrvatski", format: "web" },
      { label: "Srpski jezik", href: "/dokumenti/uredjivacka-nacela-srpski", format: "web" },
    ],
  },
  {
    naslov: "Pravilnici",
    stavke: [
      { label: "Pravilnik o radu RTVFBiH", href: doc("PRAVILNIK%20O%20RADU%20MAJ%202026_compressed.pdf"), format: "pdf" },
      { label: "Pravilnik o radu RTVFBiH – prethodna verzija", href: doc("U5ED5416_novo.pdf"), format: "pdf" },
      { label: "Odluka UO o izmjenama i dopunama Pravilnika o radu (maj 2026.)", href: doc("Odluka%20UO%20izmjena%20i%20dop%20Pr%20o%20radu%20maj%202026.pdf"), format: "pdf" },
      { label: "Pravilnik o plaćama i naknadama radnika RTVFBiH", href: doc("U349185C_novo.pdf"), format: "pdf" },
      { label: "Pravilnik o sistematizaciji radnih mjesta RTVFBiH s prilozima", href: doc("U2EBD8B3_novo.pdf"), format: "pdf" },
      { label: "Prilog 1 – Popis radnih mjesta", href: doc("Prilog%201%20Pravilniku%20o%20sistematizac%20radnih%20mjesta.pdf"), format: "pdf" },
      { label: "Pregled radnih mjesta (opisi poslova)", href: doc("Opis%20poslova%2014.01.2026.(6).docx"), format: "docx" },
      { label: "Pravilnik o unutrašnjoj organizacionoj strukturi", href: doc("U106EAB_novo.pdf"), format: "pdf" },
      { label: "Pregled unutrašnje organizacione strukture RTVFBiH", href: doc("pregled%20unutrasnje%20org%20strukture.pdf"), format: "pdf" },
    ],
  },
];

export const programskiPlanovi: Dokument[] = [
  { label: "Ostvareni programski plan za 2009. godinu", href: doc("Ostvareni%20programski%20plan%20za%202009%20godinu.doc"), format: "doc" },
  { label: "Programski plan za 2010. godinu", href: doc("PROGRAMSKI%20PLAN%20ZA%202010%20GODINU.doc"), format: "doc" },
  { label: "Programski plan za 2011. godinu", href: doc("PROGRAMSKI%20PLAN%202011-%20bosanski%20jezik_3.doc"), format: "doc" },
];

export const izvjestajiORadu: Dokument[] = [
  { label: "Izvještaj o radu i poslovanju RTVFBiH za 2024. godinu", href: doc("irp_JANUAR_DECEMBAR_%202024._godine.pdf"), format: "pdf" },
  { label: "Izvještaj o radu i poslovanju januar–decembar 2023.", href: doc("Izvjestaj%20o%20radu%20i%20poslovanju%20JANUAR%20-%20DECEMBAR%202023.%20godine%20bosanski%20jezik.pdf"), format: "pdf" },
  { label: "Izvještaj o radu i poslovanju januar–decembar 2022.", href: doc("Izvjestaj%20o%20radu%20i%20poslovanju%20JANUAR%20-%20DECEMBAR%202022.%20godine_bos.doc"), format: "doc" },
  { label: "Izvještaj o radu i poslovanju januar–decembar 2021.", href: doc("Izvjestaj%20o%20radu%20i%20poslovanju%20JANUAR%20-%20DECEMBAR%202021.%20godine.doc"), format: "doc" },
  { label: "Izvještaj o radu i poslovanju januar–decembar 2020.", href: doc("Izvjestaj_o_radu_i_poslovanju_2020.pdf"), format: "pdf" },
  { label: "Izvještaj o radu i poslovanju januar–decembar 2019.", href: doc("Izvjestaj_o_radu_poslovanju_JANUAR_DECEMBAR_2019..pdf"), format: "pdf" },
  { label: "Izvještaj o radu i poslovanju januar–decembar 2018.", href: doc("Izvjestaj_o_radu_poslovanju_JANUAR_DECEMBAR_2018..pdf"), format: "pdf" },
  { label: "Izvještaj o radu i poslovanju januar–decembar 2017.", href: doc("Izvjestaj%20o%20radu%20i%20poslovanju%20JANUAR-DECEMBAR-2017.godine.doc"), format: "doc" },
  { label: "Izvještaj o radu i poslovanju januar–decembar 2016.", href: doc("Izvjestaj%20o%20radu%20i%20poslovanju%20JANUAR%20-%20DECEMBAR%202016.godine.pdf"), format: "pdf" },
  { label: "Izvještaj o radu i poslovanju januar–decembar 2015.", href: doc("U6935EC_Izvjestaj-o-radu-i-poslovanju-JANUAR-DECEMBAR-2015-godine.doc"), format: "doc" },
  { label: "Izvještaj o radu i poslovanju januar–decembar 2014.", href: doc("U42CD99F_Izvjestaj-o-radu-i-poslovanju-JANUAR-DECEMBAR-2014-godine.doc"), format: "doc" },
  { label: "Izvještaj o radu i poslovanju januar–decembar 2013.", href: doc("U49C155_Izvjestaj-o-radu-i-poslovanju-JANUAR-DECEMBAR-2013-godine.doc"), format: "doc" },
  { label: "Izvješće o radu i poslovanju siječanj–prosinac 2012.", href: doc("Izvjesce%202012.doc"), format: "doc" },
  { label: "Izvještaj o radu i poslovanju januar–decembar 2011.", href: doc("Izvjestaj%20o%20radu.doc"), format: "doc" },
  { label: "Izvještaj o radu i poslovanju januar–decembar 2010.", href: doc("Izvjestaj%20o%20radu%20i%20poslovanju%20januar%20-%20decembar%202010.%20godine-bosanska%20verzija_2.doc"), format: "doc" },
  { label: "Izvještaj o radu i poslovanju januar–decembar 2009.", href: doc("Izvjestaj%20o%20radu%20i%20poslovanju%20januar%20-%20decembar%202009.%20godine.doc"), format: "doc" },
  { label: "Izvještaj o radu i poslovanju januar–decembar 2008.", href: doc("Izvjestaj%20o%20radu%20i%20poslovanju%20januar%20-%20decembar%202008%20-%20KONACNI%20uz%20numeraciju.doc"), format: "doc" },
  { label: "Izvještaj o radu RTVFBiH u 2007. godini i proširena Informacija o stanju u RTVFBiH", href: "/dokumenti/izvjestaj-o-radu-2007", format: "web" },
];

export const revizorskiIzvjestaji: Dokument[] = [
  { label: "Revizorski izvještaj za 2024.", href: doc("Izvje%C5%A1taj%20RTVFBiH%202024..pdf"), format: "pdf" },
  { label: "Konačan izvještaj nezavisnog revizora za 2023.", href: doc("U1410577_RTVFBIH%20kona%C4%8Dan%20izvje%C5%A1taj%202023.pdf"), format: "pdf" },
  { label: "Izvještaj neovisne revizije za 2022.", href: doc("Izvje%C5%A1taj%20neovisne%20revizije%20za%202022.pdf"), format: "pdf" },
  { label: "Izvještaj nezavisnog revizora za 2021.", href: doc("Izvje%C5%A1taj%20nezavisnog%20revizora%20za%202021_.pdf"), format: "pdf" },
  { label: "Izvještaj nezavisnog revizora za 2020.", href: doc("Izvje%C5%A1taj%20nezavisnog%20revizora%20FTV%20BiH%20Bosne%20i%20Hercegovine%20za%202020.%20godinu.pdf"), format: "pdf" },
  { label: "Izvještaj nezavisnog revizora za 2019.", href: doc("Izvjestaj_nezavisnog_revizora_FTV_BiH_za_2019.pdf"), format: "pdf" },
  { label: "Izvještaj nezavisnog revizora za 2018.", href: doc("Izvjestaj_nezavisnog_revizora_FTV_BiH_za_2018.pdf"), format: "pdf" },
  { label: "Izvještaj nezavisnog revizora za 2017.", href: doc("Izvje%C5%A1taj%20nezavisnog%20revizora%202017%20-%20RTFBIH.pdf"), format: "pdf" },
  { label: "Izvještaj nezavisnog revizora za 2016.", href: doc("FTV2016FINALPRINT.pdf"), format: "pdf" },
  { label: "Izvještaj nezavisnog revizora za 2015.", href: doc("IZVJE%C5%A0TAJ-U-PDF-FORMATU-31122015.pdf"), format: "pdf" },
  { label: "Izvještaj nezavisnog revizora za 2014.", href: doc("RTVFBIH-FINALNI-IZVJE%C5%A0TAJ-31122014.pdf"), format: "pdf" },
  { label: "Izvještaj nezavisnog revizora za 2013.", href: doc("Izvjestaj%20revizora%20JRTV%20FBIH%2031122013_AM%20_NOVI%20FORMAT.xps"), format: "xps" },
  { label: "Izvještaj nezavisnog revizora za 2012.", href: doc("Izvjestaj%20revizora%20JRTV%20FBIH%2031122012%20-%20NOVI%20FORMAT.xps"), format: "xps" },
  { label: "Izvještaj nezavisnog revizora za 2011.", href: doc("RTV%20FBiH%202011.pdf"), format: "pdf" },
  { label: "Izvještaj neovisne revizije za 2010.", href: doc("izvjestaj%20neovisne%20revizije%20za%202010.pdf"), format: "pdf" },
  { label: "Izvještaj neovisne revizije za 2009.", href: doc("U3C5A8D8_izvjestaje%20neovisne%20revizije%20za%202009.pdf"), format: "pdf" },
  { label: "Izvještaj ovlaštenog revizora za poslovnu 2008. godinu", href: doc("izvjestaj-revizora-za-2008.pdf"), format: "pdf" },
];
