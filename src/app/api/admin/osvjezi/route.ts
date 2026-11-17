import { revalidatePath } from "next/cache";
import { ispravanKljucOsvjezavanja } from "@/server/osvjezavanje";

/** Interno: drugo osvježavanje javnih stranica poslije izmjene u adminu (poziva samo server sam sebe) */
export async function POST(req: Request) {
  if (!ispravanKljucOsvjezavanja(req.headers.get("x-osvjezi"))) {
    return new Response("Nije pronađeno.", { status: 404 });
  }
  revalidatePath("/", "layout");
  return new Response(null, { status: 204 });
}
