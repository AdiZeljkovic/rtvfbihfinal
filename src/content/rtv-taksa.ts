export type Faq = { pitanje: string; odgovor: string[] };

export const rtvTaksaUvod = {
  zakon: "Zakon o Radio-televiziji Federacije Bosne i Hercegovine („Službene novine Federacije BiH“ 40/02), član 49:",
  citat:
    "Svako domaćinstvo će plaćati RTV taksu/pristojbu samo za po jedan prijemnik, neovisno od ukupnog broja prijemnika u domaćinstvu. Samo jedan član domaćinstva može biti evidentiran kao pretplatnik.",
  kontakt: {
    odjel: "Odjel RTV takse",
    tel: ["+387 (0)33 464 069", "+387 (0)33 455 442", "+387 (0)33 648 027", "+387 (0)33 461 101 (lokali 2270, 2908, 2320, 2104)"],
  },
};

export const rtvTaksaFaq: Faq[] = [
  {
    pitanje: "Živim s roditeljima i imamo dva fiksna telefona na različita imena. Moram li plaćati dvije RTV takse?",
    odgovor: [
      "Ne. Prema članu 49 Zakona o RTVFBiH, jedno domaćinstvo na jednoj adresi plaća jednu RTV taksu, neovisno o broju prijemnika ili telefonskih priključaka.",
      "RTVFBiH je potrebno dostaviti: dopis s obrazloženjem problema, kopiju računa (broj telefona) za fiksnu telefoniju uz koji ćete nastaviti plaćanje RTV takse te kopiju računa (broj telefona) uz koji treba obustaviti daljnje fakturisanje.",
    ],
  },
  {
    pitanje: "Kako se plaća RTV taksa?",
    odgovor: [
      "RTV taksa se plaća putem računa za fiksnu telefoniju koje ispostavljaju BH Telecom i HT Mostar. Za pretplatnike koji nemaju telefonski priključak RTVFBiH je organizovala naplatu putem vlastite službe i ovlaštenih inkasanata.",
    ],
  },
  {
    pitanje: "Moj telefonski broj je pod zabranom pa mi računi za taksu ne dolaze. Šta da radim?",
    odgovor: [
      "Za ovakve slučajeve obratite se Odjelu RTV takse na broj +387 (0)33 464 069 kako bismo ažurirali evidenciju i omogućili redovno plaćanje.",
    ],
  },
  {
    pitanje: "Privremeno ću biti odsutan iz BiH. Mogu li RTV taksu platiti unaprijed?",
    odgovor: [
      "Da. Građani koji žele unaprijed platiti RTV taksu trebaju se javiti na telefone +387 (0)33 455 442, +387 (0)33 464 069, +387 (0)33 648 027 ili +387 (0)33 461 101 (lokali 2270, 2908, 2320, 2104) kako bi se dogovorio način uplate.",
      "Žiro-račun ne oglašavamo jer građani u općoj uplatnici u pravilu ne upišu šifru kupca, pa ih tada nije moguće prepoznati u bazi podataka.",
    ],
  },
  {
    pitanje: "Privremeno niko neće boraviti u mom stanu. Mogu li biti oslobođen plaćanja?",
    odgovor: [
      "RTV taksa je porez za posjedovanje radijskog ili TV prijemnika. Niko ko u svom domaćinstvu posjeduje radijski ili TV prijemnik ne može biti oslobođen plaćanja RTV takse.",
    ],
  },
  {
    pitanje: "Vratio sam stan u posjed, a prethodni stanar nije plaćao RTV taksu. Kako da riješim dug?",
    odgovor: [
      "Potrebno je pismeno se obratiti RTVFBiH i dostaviti kopiju dokumenta iz kojeg je vidljivo kada ste došli u posjed stana. Na osnovu toga dug prethodnog korisnika bit će brisan s vašeg imena.",
    ],
  },
  {
    pitanje: "Šta se dešava s građanima koji ne plaćaju RTV taksu?",
    odgovor: [
      "RTVFBiH je, u skladu sa zakonom, dužna od svih građana koji neredovno plaćaju RTV taksu svoja potraživanja naplatiti putem suda. U tom slučaju, pored iznosa RTV takse, plaćaju se i zatezne kamate i sudski troškovi.",
    ],
  },
  {
    pitanje: "U stanu imam dva fiksna telefonska priključka. Moram li plaćati dvije RTV takse?",
    odgovor: [
      "Ne. Jedno domaćinstvo (fizička osoba) na jednoj adresi plaća jednu RTV taksu. Obavijestite nas koliko telefonskih priključaka imate i na koji broj treba vezati RTV taksu, uz specifikaciju telefonskih brojeva s računa.",
    ],
  },
  {
    pitanje: "Nemam fiksni telefonski priključak. Kako da redovno plaćam RTV taksu?",
    odgovor: [
      "Svako domaćinstvo koje nema fiksni telefonski priključak, a posjeduje radijski ili TV prijemnik, RTV taksu plaća putem naših priznanica ovlaštenim inkasantima.",
    ],
  },
];
