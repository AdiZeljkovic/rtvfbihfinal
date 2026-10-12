/**
 * Adresa dokumenta. Svi dokumenti (preneseni i novi iz CMS-a) su u podaci/doc
 * i služe se s istog servera, pa adresa uvijek počinje s /doc.
 */
export const docUrl = (ime: string) => `/doc/${encodeURIComponent(ime)}`;
