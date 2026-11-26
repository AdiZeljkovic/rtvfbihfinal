import { DOC_DIR, sigurnoIme } from "@/server/putanje";
import { posaljiFajl } from "@/server/fajlovi";
import { dokumentObjavljen } from "@/server/db";
import { trenutniKorisnik } from "@/server/auth";

const NEMA = () => new Response("Dokument nije pronađen.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });

/* Dokumenti (PDF, DOC…) iz foldera podaci/doc – i preneseni sa stare stranice i novi iz CMS-a */
export async function GET(req: Request, ctx: RouteContext<"/doc/[...ime]">) {
  const { ime } = await ctx.params;
  // posjetilac vidi samo dokument koji koristi neka objavljena stavka
  if (dokumentObjavljen(sigurnoIme(ime.join("/")))) return posaljiFajl(req, DOC_DIR, ime, "javno");
  // urednik vidi i ostale (prilog u arhivi ili korpi, upravo poslan fajl), ali ih preglednik ne pamti
  if (await trenutniKorisnik()) return posaljiFajl(req, DOC_DIR, ime, "privatno");
  return NEMA();
}
