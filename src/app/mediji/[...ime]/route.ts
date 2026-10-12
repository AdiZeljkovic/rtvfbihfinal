import { MEDIJI_DIR } from "@/server/putanje";
import { posaljiFajl } from "@/server/fajlovi";

/* Slike koje urednik doda kroz CMS (folder podaci/mediji) */
export async function GET(req: Request, ctx: RouteContext<"/mediji/[...ime]">) {
  const { ime } = await ctx.params;
  return posaljiFajl(req, MEDIJI_DIR, ime);
}
