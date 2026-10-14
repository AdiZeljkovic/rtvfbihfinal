import Link from "next/link";
import { ArrowRight, FilePlus, Gavel, Megaphone, Tv } from "lucide-react";
import { KOLEKCIJE, kolekcija, type Kolekcija } from "@/cms/kolekcije";
import { IKONE } from "@/components/admin/ikone";
import { brojPoKolekcijama, nedavnePromjene } from "@/server/db";
import { obaveznaPrijava } from "@/server/auth";
import { vrijemeBs } from "@/server/admin";
import { mnozina } from "@/lib/plural";

const BRZO = [
  { href: "/admin/nabavke/novo", ikona: Gavel, naslov: "Objavi javnu nabavku", opis: "Plan, obavještenje, odluka ili izvještaj" },
  { href: "/admin/dokumenti/novo", ikona: FilePlus, naslov: "Dodaj dokument", opis: "Izvještaj, pravilnik, cjenovnik…" },
  { href: "/admin/obavijesti/novo", ikona: Megaphone, naslov: "Objavi obavijest ili konkurs", opis: "Konkurs, oglas ili obavijest" },
  { href: "/admin/emisije", ikona: Tv, naslov: "Uredi emisije", opis: "Termini, opisi i naslovna" },
];

const GRUPE: { kljuc: Kolekcija["grupa"][]; naslov: string }[] = [
  { kljuc: ["cesto", "sadrzaj"], naslov: "Sadržaj stranice" },
  { kljuc: ["institucija"], naslov: "Institucija i kontakti" },
  { kljuc: ["podesavanja"], naslov: "Osnovni podaci" },
];

const AKCIJE: Record<string, string> = {
  dodavanje: "dodano",
  izmjena: "izmijenjeno",
  "u korpu": "obrisano (u korpi)",
  vraćeno: "vraćeno iz korpe",
  arhivirano: "arhivirano",
  "vraćeno iz arhive": "vraćeno iz arhive",
};

function pozdrav() {
  const sat = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Europe/Sarajevo" }).format(new Date()));
  return sat < 10 ? "Dobro jutro" : sat < 18 ? "Dobar dan" : "Dobro veče";
}

export default async function AdminPocetna() {
  const k = await obaveznaPrijava();
  const brojevi = brojPoKolekcijama();
  const promjene = nedavnePromjene(8);

  return (
    <>
      <h1 className="font-display text-3xl font-bold text-navy sm:text-4xl">
        {pozdrav()}, {k.ime.split(" ")[0]}!
      </h1>
      <p className="mt-2 text-xl text-muted">Šta želite uraditi?</p>

      {/* najčešće radnje – velike kartice */}
      <ul className="mt-7 grid gap-4 sm:grid-cols-2">
        {BRZO.map((b, i) => {
          const Ikona = b.ikona;
          const glavna = i < 3;
          return (
            <li key={b.href}>
              <Link
                href={b.href}
                className={`group relative flex min-h-36 items-center gap-5 overflow-hidden rounded-[1.75rem] p-6 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5 sm:p-7 ${
                  glavna ? "bg-navy text-white" : "admin-kartica border border-line bg-white text-navy"
                }`}
              >
                {glavna && (
                  <span aria-hidden="true" className="absolute inset-0 bg-[url(/brand/kartice-bg.webp)] bg-cover bg-right opacity-35" />
                )}
                <span
                  className={`relative inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${
                    glavna ? "bg-white/15 text-sky" : "bg-sky-soft text-brand-strong"
                  }`}
                >
                  <Ikona className="h-8 w-8" aria-hidden="true" />
                </span>
                <span className="relative min-w-0 flex-1">
                  <span className="block font-display text-2xl font-bold leading-tight">{b.naslov}</span>
                  <span className={`mt-1 block text-lg ${glavna ? "text-white/75" : "text-muted"}`}>{b.opis}</span>
                </span>
                <ArrowRight className="relative h-7 w-7 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>

      {/* sve rubrike */}
      {GRUPE.map((g) => (
        <section key={g.naslov} className="mt-12" aria-labelledby={`g-${g.kljuc[0]}`}>
          <h2 id={`g-${g.kljuc[0]}`} className="font-display text-2xl font-bold text-navy">
            {g.naslov}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {KOLEKCIJE.filter((c) => g.kljuc.includes(c.grupa)).map((c) => {
              const Ikona = IKONE[c.ikona];
              const n = brojevi[c.kljuc] ?? 0;
              return (
                <li key={c.kljuc}>
                  <Link
                    href={`/admin/${c.kljuc}`}
                    className="admin-kartica group flex h-full items-start gap-4 rounded-3xl border border-line bg-white p-5 shadow-[var(--shadow-card)] transition-colors hover:border-brand"
                  >
                    <Ikona className="mt-1 h-7 w-7 shrink-0 text-brand-strong" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block font-display text-lg font-semibold leading-snug text-navy group-hover:text-brand-strong">{c.naziv}</span>
                      <span className="mt-1 block text-base text-muted">
                        {c.jedinstven ? c.opis : `${n} ${mnozina(n, "stavka", "stavke", "stavki")}`}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {/* nedavne promjene */}
      {promjene.length > 0 && (
        <section className="mt-12" aria-labelledby="promjene">
          <h2 id="promjene" className="font-display text-2xl font-bold text-navy">
            Posljednje promjene
          </h2>
          <ul className="admin-kartica mt-4 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-card)]">
            {promjene.map((p) => {
              const def = kolekcija(p.kolekcija);
              const postoji = p.akcija !== "u korpu" && p.zapis_id;
              return (
                <li key={p.id} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
                  <span className="min-w-0 flex-1">
                    {postoji ? (
                      <Link href={`/admin/${p.kolekcija}/${p.zapis_id}`} className="font-semibold text-navy hover:text-brand-strong hover:underline">
                        {p.opis || "(bez naziva)"}
                      </Link>
                    ) : (
                      <span className="font-semibold text-navy">{p.opis || "(bez naziva)"}</span>
                    )}
                    <span className="block text-base text-muted">
                      {def?.naziv} · {AKCIJE[p.akcija] ?? p.akcija}
                      {p.korisnik ? ` · ${p.korisnik}` : ""}
                    </span>
                  </span>
                  <span className="shrink-0 text-base text-muted">{vrijemeBs(p.vrijeme)}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
}
