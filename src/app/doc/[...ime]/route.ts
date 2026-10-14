import { DOC_DIR, sigurnoIme } from "@/server/putanje";
import { posaljiFajl } from "@/server/fajlovi";
import { dokumentSamoUArhivi } from "@/server/db";
import { trenutniKorisnik } from "@/server/auth";

/* Dokumenti (PDF, DOC…) iz foldera podaci/doc – i preneseni sa stare stranice i novi iz CMS-a */
export async function GET(req: Request, ctx: RouteContext<"/doc/[...ime]">) {
  const { ime } = await ctx.params;
  // prilog arhivirane stavke vidi samo prijavljeni urednik
  if (dokumentSamoUArhivi(sigurnoIme(ime.join("/"))) && !(await trenutniKorisnik())) {
    return new Response("Dokument nije pronađen.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  return posaljiFajl(req, DOC_DIR, ime);
}
