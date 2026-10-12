import "server-only";
import path from "node:path";
import sharp from "sharp";
import { MEDIJI_DIR } from "./putanje";

/**
 * Širina i visina slike sa stranice (public/… ili podaci/mediji), da next/image
 * može rezervisati prostor i poslati sliku u pravoj veličini. Null ako se ne može pročitati.
 */
export async function dimenzije(src: string): Promise<{ width: number; height: number } | null> {
  try {
    const ime = decodeURIComponent(src.split("?")[0]);
    const fajl = ime.startsWith("/mediji/")
      ? path.join(MEDIJI_DIR, path.basename(ime))
      : path.join(process.cwd(), "public", path.normalize(ime).replace(/^([/\\])+/, ""));
    if (!fajl.startsWith(MEDIJI_DIR) && !fajl.startsWith(path.join(process.cwd(), "public"))) return null;
    const m = await sharp(fajl).metadata();
    return m.width && m.height ? { width: m.width, height: m.height } : null;
  } catch {
    return null;
  }
}
