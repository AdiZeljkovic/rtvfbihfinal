const MJESECI = [
  "januara", "februara", "marta", "aprila", "maja", "juna",
  "jula", "augusta", "septembra", "oktobra", "novembra", "decembra",
];

/** „2025-05-07“ → „7. maja 2025.“ */
export function datumBs(iso?: string) {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso ?? "";
  return `${Number(m[3])}. ${MJESECI[Number(m[2]) - 1]} ${m[1]}.`;
}

/** Današnji datum (YYYY-MM-DD) po sarajevskom vremenu, bez obzira na vremensku zonu servera */
export const danasUSarajevu = () =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Sarajevo" }).format(new Date());

/** Tekuća godina po sarajevskom vremenu */
export const tekucaGodina = () => Number(danasUSarajevu().slice(0, 4));

/** Je li datum (YYYY-MM-DD) prošao, računajući po danu (rok traje cijeli taj dan) */
export const prosao = (iso?: string) => Boolean(iso) && iso! < danasUSarajevu();
