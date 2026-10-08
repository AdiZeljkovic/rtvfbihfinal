import "server-only";
import { brojDokumenataGodine, type NabavkaGodina } from "./arhiva";
import { nabavkePoGodinama } from "@/server/sadrzaj";

/**
 * Javne nabavke po godinama – iz CMS-a (Javne nabavke).
 * Funkcije, jer se sadržaj mijenja kroz admin.
 */
export { brojDokumenataGodine, type NabavkaGodina };

export const nabavke = () => nabavkePoGodinama();
export const godineNabavki = () => nabavke().map((n) => n.godina);
export const tekucaNabavke = () => nabavke()[0];
export const nabavkeZaGodinu = (g: number) => nabavke().find((n) => n.godina === g);
export const ukupnoDokumenataNabavki = () => nabavke().reduce((n, g) => n + brojDokumenataGodine(g), 0);
