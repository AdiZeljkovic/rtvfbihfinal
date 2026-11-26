/**
 * Telefoni iz slobodnog teksta: „+387 (0)33 464 069, +387 (0)33 461 101 (lokali 2270, 2908)“.
 * Zarez unutar zagrade (lokali) ne dijeli brojeve.
 */
export const rastaviTelefone = (tel: string) =>
  (tel ?? "")
    .split(/\s*[,;]\s*(?![^()]*\))/)
    .map((t) => t.trim())
    .filter(Boolean);

/** „+387 (0)33 461 101 (lokali 2270)“ → „tel:+38733461101“ (bez (0) i bez dodatka u zagradi) */
export const telHref = (t: string) =>
  `tel:${t
    .replace(/\(0\)/, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/[^\d+]/g, "")}`;
