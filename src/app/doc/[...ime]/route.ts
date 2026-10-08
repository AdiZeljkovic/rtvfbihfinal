import { DOC_DIR } from "@/server/putanje";
import { posaljiFajl } from "@/server/fajlovi";

/* Dokumenti (PDF, DOC…) iz foldera podaci/doc – i preneseni sa stare stranice i novi iz CMS-a */
export async function GET(_req: Request, ctx: RouteContext<"/doc/[...ime]">) {
  const { ime } = await ctx.params;
  return posaljiFajl(DOC_DIR, ime);
}
