import { site } from "./site";

const legacy = site.external.legacy;
const doc = (path: string) => `${legacy}/doc/${path}`;

export type NabavkaStavka = { label: string; href: string };
export type NabavkaGrupa = { naslov: string; stavke: NabavkaStavka[] };

/** Godine za koje postoje objave; starije godine još uvijek vode na arhivu stare stranice. */
export const godineNabavki: { godina: number; href?: string; legacyId: number }[] = [
  { godina: 2026, legacyId: 734 },
  { godina: 2025, legacyId: 696 },
  { godina: 2024, legacyId: 662 },
  { godina: 2023, legacyId: 635 },
  { godina: 2022, legacyId: 583 },
  { godina: 2021, legacyId: 557 },
  { godina: 2020, legacyId: 538 },
  { godina: 2019, legacyId: 522 },
  { godina: 2018, legacyId: 494 },
  { godina: 2017, legacyId: 476 },
  { godina: 2016, legacyId: 456 },
  { godina: 2015, legacyId: 450 },
];

export const legacyNabavkeUrl = (id: number) => `${legacy}/loc/template.wbsp?wbf_id=${id}`;

export const nabavke2026: NabavkaGrupa[] = [
  {
    naslov: "Plan javnih nabavki",
    stavke: [
      { label: "Plan javnih nabavki za 2026. godinu", href: doc("Odluka%20o%20usvajanju%20Plana%20javnih%20nabavki%202026.%20i%20Plan%20javnih%20nabavki%202026..pdf") },
      { label: "Izmjene i dopune Plana javnih nabavki za 2026. godinu", href: doc("odluka_izmjeni_i_dopuni_plana_javnih_nabavki.pdf") },
    ],
  },
  {
    naslov: "Obavještenja o dodjeli ugovora",
    stavke: [
      { label: "Otvoreni postupak – Računari i prateća oprema, LOT 1", href: doc("odu_26_racunari_prateca_oprema__LOT1_OFFICE_racunari_5.pdf") },
      { label: "Otvoreni postupak – Računari i prateća oprema, LOT 2", href: doc("odu_26_Racunari_prateca_oprema_LOT2_5.pdf") },
      { label: "Konkurentski zahtjev – Softverski programi, LOT 1", href: doc("ODU_Softverski_programi_LOT1_Softverski_programi_4.pdf") },
      { label: "Konkurentski zahtjev – Usluge održavanja web portala", href: doc("ODU_26_Usluge_odrzavanja_WEB_portala_4.pdf") },
      { label: "Otvoreni postupak – Rent-a-car, LOT 1", href: doc("odu_26_Rent_a_car_LOT_1_4.pdf") },
      { label: "Otvoreni postupak – Rent-a-car, LOT 2 (motorna vozila za potrebe IP i RTV takse)", href: doc("ODU_26_Rent_a_Car_LOT2_4.pdf") },
      { label: "Otvoreni postupak – Usluge mjerenja gledanosti", href: doc("ODU_26_Usluge_mjerenja_gledanosti_4.pdf") },
    ],
  },
  {
    naslov: "Obavještenja o nabavci",
    stavke: [
      { label: "Otvoreni postupak – EFP i ENG oprema, LOT 1 (ENG oprema)", href: doc("ON_26_EFP_ENG_oprema_LOT1_5.pdf") },
      { label: "Ispravka obavještenja – EFP i ENG oprema, LOT 1", href: doc("ispravka_ON_26_EFP_ENG_oprema_LOT1_ENG_oprema_2.pdf") },
      { label: "Otvoreni postupak – Kancelarijski materijal", href: doc("ON_26_Kancelarijski_materijal_8.pdf") },
      { label: "Konkurentski postupak – Knjigovezački i štamparski materijal", href: doc("ON_26_Knjigovezacki_stamparski_materijal_5.pdf") },
      { label: "Konkurentski zahtjev – Softverski programi, LOT 1", href: doc("Obavje%C5%A1tenje%20o%20nabavci-Softverski%20programi%20LOT%201%20-%20Softverski%20programi.pdf") },
      { label: "Konkurentski postupak – Usluge održavanja web portala", href: doc("ON_26_USLUGE_ODRZAVANJA_WEB_PORTALA_5.pdf") },
      { label: "Otvoreni postupak – Rent-a-car, LOT 1 (motorno vozilo za potrebe Direkcije)", href: doc("Obavje%C5%A1tenje%20o%20nabavci-Rent-a-car%20LOT%201%20Motorno%20vozilo%20za%20potrebe%20Direkcije%20RTV%20FBiH.pdf") },
      { label: "Otvoreni postupak – Prevozne usluge taksi prevoza", href: doc("Obavje%C5%A1tenje%20o%20nabavci-Prevozne%20usluge%20taksi%20prevoza.pdf") },
    ],
  },
  {
    naslov: "Izvještaji o provedenom postupku",
    stavke: [
      { label: "Računari i prateća oprema, LOT 2 – računarska periferija", href: doc("ipp_26_Racunari_LOT2_Racunarska_periferija.pdf") },
      { label: "Rent-a-car, LOT 1", href: doc("ipp_26_Rent_a%20_car_LOT1.pdf") },
      { label: "Rent-a-car, LOT 2 – motorna vozila za potrebe IP i RTV takse", href: doc("IPP_26_Rent_a_Car_LOT2_3.pdf") },
      { label: "Usluge mjerenja gledanosti", href: doc("IPP_26_Usluge_mjerenja_gledanosti_3.pdf") },
      { label: "EFP i ENG oprema, LOT 1 – ENG oprema", href: doc("Izvje%C5%A1taj%20o%20provedenom%20postupku%20-%20EFP%20i%20ENG%20oprema,%20LOT%201%20-%20ENG%20oprema.pdf") },
      { label: "Kancelarijski materijal", href: doc("Izvje%C5%A1taj%20o%20provedenom%20postupku%20-%20Kancelarijski%20materijal.pdf") },
    ],
  },
];
