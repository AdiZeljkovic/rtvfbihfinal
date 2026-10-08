/**
 * Adresa dokumenata (PDF, DOC…) prenesenih sa stare stranice.
 *
 * Lokalno se fajlovi nalaze u `public/doc` (folder nije u gitu, ~1 GB).
 * U produkciji postavite NEXT_PUBLIC_DOC_BASE na adresu servera ili
 * storage-a gdje je folder postavljen, npr. https://cdn.rtvfbih.ba/doc
 */
const BAZA = (process.env.NEXT_PUBLIC_DOC_BASE ?? "/doc").replace(/\/$/, "");

export const docUrl = (ime: string) => `${BAZA}/${encodeURIComponent(ime)}`;
