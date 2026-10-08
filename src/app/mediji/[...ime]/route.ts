import { MEDIJI_DIR } from "@/server/putanje";
import { posaljiFajl } from "@/server/fajlovi";

/* Slike koje urednik doda kroz CMS (folder podaci/mediji) */
export async function GET(_req: Request, ctx: RouteContext<"/mediji/[...ime]">) {
  const { ime } = await ctx.params;
  return posaljiFajl(MEDIJI_DIR, ime);
}
