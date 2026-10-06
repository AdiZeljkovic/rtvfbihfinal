/**
 * Bosanska množina uz broj: 1 dokument, 2–4 dokumenta, 5+ dokumenata
 * (11–14 uvijek kao 5+).
 */
export function mnozina(n: number, jedan: string, dvaDoCetiri: string, pet: string) {
  const d = n % 10;
  const s = n % 100;
  if (d === 1 && s !== 11) return jedan;
  if (d >= 2 && d <= 4 && (s < 12 || s > 14)) return dvaDoCetiri;
  return pet;
}
