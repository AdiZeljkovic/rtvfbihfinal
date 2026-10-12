import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import PrijavaObrazac from "@/components/admin/PrijavaObrazac";
import Pristupacnost from "@/components/admin/Pristupacnost";
import { imaKorisnika, kodZaPostavljanje, prviUrednikPrekoWeba, trenutniKorisnik } from "@/server/auth";

export const metadata: Metadata = { title: "Prijava" };

export default async function PrijavaPage() {
  if (await trenutniKorisnik()) redirect("/admin");
  const prvi = !imaKorisnika();
  const zakljucano = prvi && !prviUrednikPrekoWeba();

  return (
    <div className="grid min-h-svh flex-1 lg:grid-cols-[1fr_1.1fr]">
      <div className="relative hidden overflow-hidden bg-navy text-white lg:sticky lg:top-0 lg:block lg:h-svh">
        <div aria-hidden="true" className="absolute inset-0 bg-[url(/brand/kartice-bg.webp)] bg-cover bg-right opacity-70" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/30" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo light />
          <div>
            <p className="eyebrow text-sky">Uređivanje stranice</p>
            <p className="mt-3 max-w-md font-display text-4xl font-bold leading-tight">
              Objavite nabavku, dokument ili obavijest u nekoliko koraka.
            </p>
          </div>
        </div>
      </div>

      <main id="sadrzaj" className="flex flex-col px-4 py-6 sm:px-10">
        <div className="flex items-center justify-between gap-4">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="ml-auto">
            <Pristupacnost />
          </div>
        </div>
        <div className="mx-auto my-auto w-full max-w-lg py-10">
          <h1 className="font-display text-4xl font-bold text-navy">{prvi ? "Dobro došli!" : "Prijava"}</h1>
          <p className="mt-3 text-xl leading-relaxed text-muted">
            {prvi
              ? "Ovo je prvo pokretanje. Napravite račun urednika – s njim ćete se ubuduće prijavljivati."
              : "Upišite korisničko ime i lozinku. Na ovom računaru ostat ćete prijavljeni 90 dana."}
          </p>
          <div className="mt-8">
            {zakljucano ? (
              <div className="rounded-3xl border-2 border-line bg-white p-6 text-lg leading-relaxed text-ink">
                <p className="font-display text-xl font-semibold text-navy">Prvi urednik se pravi na serveru</p>
                <p className="mt-2">
                  Osoba koja održava server treba pokrenuti komandu <code className="rounded bg-sky-soft px-2 py-0.5">npm run urednik</code>{" "}
                  ili postaviti kod za postavljanje (<code className="rounded bg-sky-soft px-2 py-0.5">CMS_KOD_ZA_POSTAVLJANJE</code>).
                </p>
              </div>
            ) : (
              <PrijavaObrazac prvi={prvi} trebaKod={prvi && kodZaPostavljanje().length > 0} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
