/**
 * Osnovni podaci o javnom servisu – jedno mjesto za izmjene.
 * Napomena: linkovi na društvene mreže označeni s "PROVJERITI" treba
 * potvrditi s redakcijom prije objave.
 */
export const site = {
  name: "Radio-televizija Federacije Bosne i Hercegovine",
  shortName: "RTV FBiH",
  tagline: "Javni radio-televizijski servis Federacije Bosne i Hercegovine",
  url: "https://rtvfbih.ba",
  address: {
    street: "Bulevar Meše Selimovića 12",
    city: "71000 Sarajevo",
    country: "Bosna i Hercegovina",
  },
  phone: "+387 (0)33 461 101",
  phoneHref: "+38733461101",
  emails: {
    direkcija: "direkcija@rtvfbih.ba",
    press: "press@rtvfbih.ba",
    desk: "desk@rtvfbih.ba",
    redakcija: "redakcija@federalna.ba",
  },
  external: {
    federalna: "https://federalna.ba",
    teletext: "http://teletext.rtvfbih.ba",
    radioLive: "https://s2.free-shoutcast.com/stream/18170",
    bhrt: "https://www.bhrt.ba",
    rtrs: "https://www.rtrs.tv",
  },
  social: {
    youtube: "https://www.youtube.com/@federalnatv", // PROVJERITI
    facebook: "https://www.facebook.com/federalna.ba", // PROVJERITI
    instagram: "https://www.instagram.com/federalna.ba", // PROVJERITI
  },
  founded: 2001,
};

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  children?: { label: string; href: string; description?: string }[];
};

export const mainNav: NavItem[] = [
  {
    label: "O nama",
    href: "/o-nama",
    children: [
      { label: "Historijat", href: "/o-nama", description: "Od transformacije RTVBiH do danas" },
      { label: "Upravni odbor", href: "/o-nama/upravni-odbor", description: "Članovi i akti Upravnog odbora" },
      { label: "Organizacija i uredništva", href: "/o-nama/organizacija", description: "Sektori, odjeli i redakcije" },
    ],
  },
  {
    label: "Televizija",
    href: "/televizija",
    children: [
      { label: "Federalna televizija", href: "/televizija", description: "Programske cjeline i programska shema" },
      { label: "Emisije i serije", href: "/televizija/emisije", description: "Emisije, serije i arhiva" },
      { label: "DVB-T2 prijem", href: "/frekvencije/dvb-t2", description: "Zemaljska digitalna televizija" },
    ],
  },
  { label: "Radio", href: "/radio" },
  {
    label: "Dokumenti",
    href: "/dokumenti",
    children: [
      { label: "Opći akti i izvještaji", href: "/dokumenti", description: "Zakoni, statut, pravilnici, revizije" },
      { label: "Javne nabavke", href: "/javne-nabavke", description: "Planovi, obavještenja i odluke" },
      { label: "Obavijesti i konkursi", href: "/obavijesti", description: "Javni konkursi i oglasi" },
      { label: "RTV taksa", href: "/rtv-taksa", description: "Najčešća pitanja o RTV taksi" },
    ],
  },
  { label: "Frekvencije", href: "/frekvencije" },
  { label: "Marketing", href: "/marketing" },
  { label: "Kontakt", href: "/kontakt" },
];

export const footerNav = {
  servisi: [
    { label: "Federalna televizija", href: "/televizija" },
    { label: "Radio Federacije BiH", href: "/radio" },
    { label: "Emisije i serije", href: "/televizija/emisije" },
    { label: "Portal federalna.ba", href: site.external.federalna, external: true },
    { label: "Teletekst", href: site.external.teletext, external: true },
    { label: "Radio uživo", href: site.external.radioLive, external: true },
  ],
  institucija: [
    { label: "Historijat", href: "/o-nama" },
    { label: "Upravni odbor", href: "/o-nama/upravni-odbor" },
    { label: "Organizacija", href: "/o-nama/organizacija" },
    { label: "Opći akti i izvještaji", href: "/dokumenti" },
    { label: "Javne nabavke", href: "/javne-nabavke" },
  ],
  gradjani: [
    { label: "RTV taksa – pitanja i odgovori", href: "/rtv-taksa" },
    { label: "Frekvencije i prijem", href: "/frekvencije" },
    { label: "Marketing i oglašavanje", href: "/marketing" },
    { label: "Obavijesti i konkursi", href: "/obavijesti" },
    { label: "Kontakt", href: "/kontakt" },
  ],
  sistem: [
    { label: "BHRT", href: site.external.bhrt, external: true },
    { label: "RTRS", href: site.external.rtrs, external: true },
  ],
};
