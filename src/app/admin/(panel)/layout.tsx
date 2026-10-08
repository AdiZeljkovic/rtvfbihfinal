import Link from "next/link";
import { ExternalLink, House, LogOut, Trash2, Users } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import Pristupacnost from "@/components/admin/Pristupacnost";
import { obaveznaPrijava } from "@/server/auth";
import { odjavaAkcija } from "../akcije";

const veza =
  "inline-flex min-h-12 items-center gap-2 rounded-xl px-3.5 font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white";

/** Okvir prijavljenog urednika: zaglavlje s glavnim radnjama, uvijek na istom mjestu */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const k = await obaveznaPrijava();

  return (
    <>
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6">
          <Link href="/admin" className="flex items-center gap-3 rounded-xl py-1 pr-2">
            <LogoMark tone="white" className="h-10 w-10" />
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold">Uređivanje stranice</span>
              <span className="block text-sm text-white/65">RTV FBiH</span>
            </span>
          </Link>
          <div className="ml-auto">
            <Pristupacnost tamno />
          </div>
        </div>
        <nav aria-label="Admin" className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-2 py-1.5 sm:px-4">
            <Link href="/admin" className={veza}>
              <House className="h-5 w-5" aria-hidden="true" /> Početna
            </Link>
            <Link href="/admin/korpa" className={veza}>
              <Trash2 className="h-5 w-5" aria-hidden="true" /> Korpa
            </Link>
            <Link href="/admin/korisnici" className={veza}>
              <Users className="h-5 w-5" aria-hidden="true" /> Urednici i lozinka
            </Link>
            <a href="/" target="_blank" rel="noopener" className={veza}>
              <ExternalLink className="h-5 w-5" aria-hidden="true" /> Pogledaj stranicu
            </a>
            <form action={odjavaAkcija} className="ml-auto flex items-center gap-2">
              <span className="hidden px-2 text-white/65 md:inline">{k.ime}</span>
              <button type="submit" className={veza}>
                <LogOut className="h-5 w-5" aria-hidden="true" /> Odjava
              </button>
            </form>
          </div>
        </nav>
      </header>
      <main id="sadrzaj" className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
        {children}
      </main>
    </>
  );
}
