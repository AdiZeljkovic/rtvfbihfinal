import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <section className="bg-gradient-to-b from-sky-soft to-white">
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <LogoMark className="h-16 w-16 opacity-80" />
        <p className="eyebrow mt-6">Greška 404</p>
        <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">Stranica nije pronađena</h1>
        <p className="mt-3 max-w-md text-muted">
          Stranica koju tražite ne postoji ili je premještena. Vratite se na početnu stranicu.
        </p>
        <Link href="/" className="btn btn-primary mt-8">
          <ArrowLeft className="h-4 w-4" /> Početna stranica
        </Link>
      </div>
    </section>
  );
}
