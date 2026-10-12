import path from "node:path";
import { trenutniKorisnik } from "@/server/auth";
import { DOC_DIR, MEDIJI_DIR } from "@/server/putanje";
import { DOZVOLJENE_SLIKE, DOZVOLJENI_DOKUMENTI, upisiNovi } from "@/server/fajlovi";

const MAKS_MB = 60;

/** Upload dokumenta ili slike iz admina. Vraća sačuvano ime fajla i adresu. */
export async function POST(req: Request) {
  if (!(await trenutniKorisnik())) {
    return Response.json({ greska: "Prijava je istekla. Prijavite se ponovo u novom prozoru." }, { status: 401 });
  }
  // prevelik fajl se odbija prije nego što se primi cijeli
  if (Number(req.headers.get("content-length") ?? 0) > (MAKS_MB + 1) * 1024 * 1024) {
    return Response.json({ greska: `Fajl je prevelik. Najviše ${MAKS_MB} MB.` }, { status: 413 });
  }
  const vrsta = new URL(req.url).searchParams.get("vrsta") === "slika" ? "slika" : "dokument";
  let forma: FormData;
  try {
    forma = await req.formData();
  } catch {
    return Response.json({ greska: "Slanje je prekinuto. Pokušajte ponovo." }, { status: 400 });
  }
  const fajl = forma.get("fajl");
  if (!(fajl instanceof File) || fajl.size === 0) {
    return Response.json({ greska: "Fajl nije odabran ili je prazan." }, { status: 400 });
  }
  const ext = path.extname(fajl.name).toLowerCase();
  const dozvoljeno = vrsta === "slika" ? DOZVOLJENE_SLIKE : DOZVOLJENI_DOKUMENTI;
  if (!dozvoljeno.includes(ext)) {
    return Response.json(
      { greska: vrsta === "slika" ? "Odaberite sliku (JPG, PNG ili WEBP)." : "Odaberite PDF, Word ili Excel dokument." },
      { status: 400 }
    );
  }
  if (fajl.size > MAKS_MB * 1024 * 1024) {
    return Response.json({ greska: `Fajl je prevelik. Najviše ${MAKS_MB} MB.` }, { status: 413 });
  }
  const folder = vrsta === "slika" ? MEDIJI_DIR : DOC_DIR;
  const ime = upisiNovi(folder, fajl.name, Buffer.from(await fajl.arrayBuffer()));
  return Response.json({
    ime,
    adresa: vrsta === "slika" ? `/mediji/${encodeURIComponent(ime)}` : `/doc/${encodeURIComponent(ime)}`,
    velicina: fajl.size,
  });
}
