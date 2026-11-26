/**
 * Veza „Pripada pod“ u Organizaciji. Nova veza se pamti po broju jedinice („#1514“), jer se nazivi
 * ponavljaju (npr. „Redakcija informativnog programa“ postoji i na TV-u i na Radiju) i mijenjaju.
 * Starije stavke imaju upisan naziv – on i dalje radi (prva jedinica s tim nazivom).
 */
export type JedinicaRef = { id: number; naziv: string };

export function nadredjenaId(nadredjena: unknown, sve: JedinicaRef[]): number | null {
  const s = typeof nadredjena === "string" ? nadredjena.trim() : "";
  if (!s) return null;
  const broj = /^#(\d+)$/.exec(s);
  if (broj) return sve.some((j) => j.id === Number(broj[1])) ? Number(broj[1]) : null;
  return sve.find((j) => j.naziv === s)?.id ?? null;
}
