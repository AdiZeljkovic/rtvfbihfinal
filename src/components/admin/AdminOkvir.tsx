"use client";

import { createContext, useContext, useEffect, useState } from "react";

/**
 * Okvir admina: pamti veličinu teksta i kontrast na ovom računaru
 * i primjenjuje ih na cijeli admin.
 */
export const VELICINE = ["112.5%", "125%", "140%"] as const;

type Postavke = {
  velicina: number;
  kontrast: boolean;
  postaviVelicinu: (v: number) => void;
  postaviKontrast: (k: boolean) => void;
};

const Ctx = createContext<Postavke | null>(null);
export const usePostavke = () => useContext(Ctx)!;

const KLJUC = "rtv-admin-postavke";

function procitaj(): { velicina: number; kontrast: boolean } {
  try {
    const p = JSON.parse(localStorage.getItem(KLJUC) ?? "{}");
    return { velicina: Math.min(2, Math.max(0, Number(p.velicina) || 0)), kontrast: Boolean(p.kontrast) };
  } catch {
    return { velicina: 0, kontrast: false };
  }
}

export default function AdminOkvir({ children }: { children: React.ReactNode }) {
  const [p, setP] = useState({ velicina: 0, kontrast: false });

  // postavke se čitaju tek u pregledniku (localStorage)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setP(procitaj());
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("admin-html");
    html.style.setProperty("--admin-velicina", VELICINE[p.velicina]);
    return () => {
      html.classList.remove("admin-html");
      html.style.removeProperty("--admin-velicina");
    };
  }, [p.velicina]);

  const sacuvaj = (n: typeof p) => {
    setP(n);
    try {
      localStorage.setItem(KLJUC, JSON.stringify(n));
    } catch {}
  };

  return (
    <Ctx.Provider
      value={{
        ...p,
        postaviVelicinu: (velicina) => sacuvaj({ ...p, velicina }),
        postaviKontrast: (kontrast) => sacuvaj({ ...p, kontrast }),
      }}
    >
      <div className="admin flex min-h-svh flex-1 flex-col text-ink" data-kontrast={p.kontrast ? "visok" : "obican"}>
        {children}
      </div>
    </Ctx.Provider>
  );
}
