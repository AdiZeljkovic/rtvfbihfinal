import type { Metadata } from "next";
import Naslov from "@/components/admin/Naslov";
import { NoviKorisnik, ObrisiKorisnika, PromjenaLozinke } from "@/components/admin/KorisniciObrasci";
import { korisnici, obaveznaPrijava } from "@/server/auth";

export const metadata: Metadata = { title: "Urednici i lozinka" };

const kartica = "admin-kartica rounded-[1.75rem] border border-line bg-white p-6 shadow-[var(--shadow-card)] sm:p-8";

export default async function KorisniciPage() {
  const ja = await obaveznaPrijava();
  const svi = korisnici();

  return (
    <>
      <Naslov naslov="Urednici i lozinka" nazad={{ href: "/admin", tekst: "Početna" }} />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className={kartica} aria-labelledby="lozinka">
          <h2 id="lozinka" className="font-display text-2xl font-bold text-navy">
            Moja lozinka
          </h2>
          <p className="mb-6 mt-1 text-lg text-muted">
            Prijavljeni ste kao <strong className="text-navy">{ja.korisnik}</strong>.
          </p>
          <PromjenaLozinke />
        </section>

        <div className="space-y-6">
          <section className={kartica} aria-labelledby="urednici">
            <h2 id="urednici" className="font-display text-2xl font-bold text-navy">
              Ko može uređivati stranicu
            </h2>
            <ul className="mt-4 divide-y divide-line">
              {svi.map((k) => (
                <li key={k.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <span>
                    <span className="block font-semibold text-navy">{k.ime}</span>
                    <span className="block text-base text-muted">
                      {k.korisnik}
                      {k.id === ja.id ? " · to ste vi" : ""}
                    </span>
                  </span>
                  {k.id !== ja.id && <ObrisiKorisnika id={k.id} ime={k.ime} />}
                </li>
              ))}
            </ul>
          </section>
          <section className={kartica} aria-labelledby="novi">
            <h2 id="novi" className="mb-6 font-display text-2xl font-bold text-navy">
              Dodaj urednika
            </h2>
            <NoviKorisnik />
          </section>
        </div>
      </div>
    </>
  );
}
