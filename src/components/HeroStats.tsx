"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { MicIcon, ServicesIcon, TowerIcon, TunerIcon } from "./StatIcons";

type Stat = {
  value: number;
  /** Od koje vrijednosti počinje odbrojavanje */
  from: number;
  suffix?: string;
  label: string;
  caption: string;
  href: string;
  icon: typeof MicIcon;
};

const stats: Stat[] = [
  {
    value: 2001,
    from: 1971,
    suffix: ".",
    label: "Godina osnivanja",
    caption: "Baštinimo tradiciju Radija 202 od 1971.",
    href: "/o-nama",
    icon: MicIcon,
  },
  {
    value: 4,
    from: 0,
    label: "Servisa",
    caption: "Televizija · Radio · Web · Teletekst",
    href: "#servisi",
    icon: ServicesIcon,
  },
  {
    value: 15,
    from: 0,
    label: "FM frekvencija",
    caption: "Radio Federacije BiH",
    href: "/radio#frekvencije",
    icon: TunerIcon,
  },
  {
    value: 9,
    from: 0,
    label: "Digitalnih regija",
    caption: "DVB-T2 · Multipleks A",
    href: "/frekvencije#dvb-t2",
    icon: TowerIcon,
  },
];

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Brojevi se na serveru renderuju s konačnom vrijednošću (radi i bez JS-a),
 * a u browseru se animirano odbrojavaju. Upisuje se direktno u DOM, bez re-rendera.
 * Poštuje prefers-reduced-motion.
 */
export default function HeroStats({ className = "" }: { className?: string }) {
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const duration = 1600;
    const delay = 350; // poklapa se s fade-up animacijom trake
    let raf = 0;
    let start = 0;

    refs.current.forEach((el, i) => {
      if (el) el.textContent = String(stats[i].from);
    });

    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, Math.max(0, (now - start - delay) / duration));
      refs.current.forEach((el, i) => {
        if (!el) return;
        const s = stats[i];
        el.textContent = String(Math.round(s.from + (s.value - s.from) * easeOut(t)));
      });
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`glass relative overflow-hidden rounded-3xl ${className}`}>
      {/* Tanka svjetlosna linija na vrhu trake */}
      <span
        aria-hidden="true"
        className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-sky/80 to-transparent"
      />
      <ul className="grid grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <li
              key={s.label}
              className={`relative ${i % 2 === 1 ? "border-l border-white/10" : ""} ${
                i >= 2 ? "border-t border-white/10 lg:border-t-0" : ""
              } ${i === 2 ? "lg:border-l" : ""}`}
            >
              <Link
                href={s.href}
                className="group flex h-full flex-col p-5 transition-colors hover:bg-white/[0.06] sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-sky transition-colors duration-300 group-hover:text-white" />
                  <ArrowUpRight className="h-4 w-4 -translate-x-1 translate-y-1 text-white/0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-white/70" />
                </div>
                <p className="mt-4 font-display text-4xl font-bold leading-none tracking-tight sm:text-[2.6rem]">
                  <span className="bg-gradient-to-br from-white via-white to-sky bg-clip-text tabular-nums text-transparent">
                    <span
                      ref={(el) => {
                        refs.current[i] = el;
                      }}
                    >
                      {s.value}
                    </span>
                    {s.suffix}
                  </span>
                </p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-white">{s.label}</p>
                <p className="mt-1 text-xs leading-snug text-white/60">{s.caption}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
