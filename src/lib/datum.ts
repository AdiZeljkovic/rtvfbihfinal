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

/** Je li datum (YYYY-MM-DD) prošao, računajući po danu */
export const prosao = (iso?: string) => Boolean(iso) && iso! < new Date().toISOString().slice(0, 10);
