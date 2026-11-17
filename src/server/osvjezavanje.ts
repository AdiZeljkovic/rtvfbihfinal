import "server-only";
import crypto from "node:crypto";

/**
 * Drugo osvježavanje javnih stranica, nekoliko sekundi poslije izmjene u adminu.
 *
 * Ako posjetilac otvori zastarjelu stranicu baš dok urednik čuva, Next je gradi sa starim podacima,
 * a završi tek poslije čuvanja – i zapamti je kao novu. Zato server nakon par sekundi pozove sam sebe
 * (ruta /api/admin/osvjezi) i stranice se osvježe još jednom. Ključ postoji samo u memoriji ovog procesa,
 * pa rutu ne može pozvati niko spolja.
 */
const g = globalThis as unknown as { __rtvKljucOsvjezavanja?: string };
export const kljucOsvjezavanja = () => (g.__rtvKljucOsvjezavanja ??= crypto.randomBytes(32).toString("hex"));

export const ispravanKljucOsvjezavanja = (k: string | null) => {
  const a = Buffer.from(k ?? "");
  const b = Buffer.from(kljucOsvjezavanja());
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

export async function osvjeziPonovoZaTren(ms = 5000) {
  await new Promise((r) => setTimeout(r, ms));
  try {
    await fetch(`http://127.0.0.1:${process.env.PORT || 3000}/api/admin/osvjezi`, {
      method: "POST",
      headers: { "x-osvjezi": kljucOsvjezavanja() },
      cache: "no-store",
    });
  } catch (e) {
    console.error("[CMS] drugo osvježavanje nije uspjelo", e);
  }
}
