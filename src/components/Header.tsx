"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, ExternalLink, Menu, Radio, X } from "lucide-react";
import Logo from "./Logo";
import { mainNav, site } from "@/content/site";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Header() {
  const pathname = usePathname();
  // Meni pamti putanju na kojoj je otvoren – promjenom rute automatski se zatvara
  const [menu, setMenu] = useState<{ open: boolean; sub: string | null; path: string }>({
    open: false,
    sub: null,
    path: "",
  });
  const open = menu.open && menu.path === pathname;
  const openSub = open ? menu.sub : null;
  const setOpen = (fn: (v: boolean) => boolean) =>
    setMenu((m) => ({ open: fn(m.open && m.path === pathname), sub: null, path: pathname }));
  const setOpenSub = (fn: (v: string | null) => string | null) =>
    setMenu((m) => ({ ...m, sub: fn(m.path === pathname ? m.sub : null), path: pathname }));
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      {/* Gornja traka */}
      <div className="hidden bg-navy text-white/85 md:block">
        <div className="container-x flex h-9 items-center justify-between text-xs">
          <p className="font-medium tracking-wide">{site.tagline}</p>
          <nav aria-label="Servisi" className="flex items-center gap-5">
            <a href={site.external.federalna} target="_blank" rel="noopener" className="hover:text-white">
              federalna.ba
            </a>
            <a href={site.external.teletext} target="_blank" rel="noopener" className="hover:text-white">
              Teletext
            </a>
            <a href={site.external.bhrt} target="_blank" rel="noopener" className="hover:text-white">
              BHRT
            </a>
            <a href={site.external.rtrs} target="_blank" rel="noopener" className="hover:text-white">
              RTRS
            </a>
            <a
              href={site.external.radioLive}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-semibold text-white hover:bg-brand"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              Radio uživo
            </a>
          </nav>
        </div>
      </div>

      {/* Glavna navigacija */}
      <div
        className={`border-b border-line bg-white/90 backdrop-blur-md transition-shadow ${
          scrolled ? "shadow-[0_6px_24px_-12px_rgba(11,37,64,0.25)]" : ""
        }`}
      >
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-6">
          <Link href="/" aria-label="Početna stranica" className="shrink-0">
            <Logo subtitleClassName="hidden xl:block" />
          </Link>

          <nav aria-label="Glavna navigacija" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                if (!item.children) {
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`whitespace-nowrap rounded-full px-3 py-2 font-display text-[0.9rem] font-semibold transition-colors ${
                          active ? "bg-sky-soft text-brand-deep" : "text-navy hover:bg-sky-mist hover:text-brand"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={item.href} className="group relative">
                    <Link
                      href={item.href}
                      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 font-display text-[0.9rem] font-semibold transition-colors ${
                        active ? "bg-sky-soft text-brand-deep" : "text-navy hover:bg-sky-mist hover:text-brand"
                      }`}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4 opacity-60 transition-transform group-hover:rotate-180" />
                    </Link>
                    <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <ul className="w-72 rounded-2xl border border-line bg-white p-2 shadow-[0_18px_40px_-16px_rgba(11,37,64,0.35)]">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              className="block rounded-xl px-3 py-2.5 hover:bg-sky-mist"
                            >
                              <span className="block font-display text-sm font-semibold text-navy">
                                {c.label}
                              </span>
                              {c.description && (
                                <span className="mt-0.5 block text-xs text-muted">{c.description}</span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <a
              href={site.external.federalna}
              target="_blank"
              rel="noopener"
              className="btn btn-primary whitespace-nowrap !py-2.5"
            >
              Vijesti na federalna.ba
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-navy lg:hidden"
            aria-expanded={open}
            aria-controls="mobilni-meni"
            aria-label={open ? "Zatvori meni" : "Otvori meni"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobilni meni */}
      <div
        id="mobilni-meni"
        className={`fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto bg-white transition-[opacity,transform] duration-300 lg:hidden ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        aria-hidden={!open}
      >
        <nav aria-label="Mobilna navigacija" className="container-x py-4">
          <ul className="divide-y divide-line">
            {mainNav.map((item) => (
              <li key={item.href}>
                {!item.children ? (
                  <Link
                    href={item.href}
                    className="block py-4 font-display text-lg font-semibold text-navy"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-4 font-display text-lg font-semibold text-navy"
                      aria-expanded={openSub === item.href}
                      onClick={() => setOpenSub((v) => (v === item.href ? null : item.href))}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${openSub === item.href ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openSub === item.href && (
                      <ul className="mb-3 space-y-1 rounded-xl bg-sky-mist p-2">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} className="block rounded-lg px-3 py-2.5 text-navy">
                              <span className="block font-semibold">{c.label}</span>
                              {c.description && (
                                <span className="block text-xs text-muted">{c.description}</span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <a href={site.external.federalna} target="_blank" rel="noopener" className="btn btn-primary justify-center">
              Vijesti na federalna.ba <ExternalLink className="h-4 w-4" />
            </a>
            <a href={site.external.radioLive} target="_blank" rel="noopener" className="btn btn-ghost justify-center">
              <Radio className="h-4 w-4" /> Radio uživo
            </a>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              <a href={site.external.teletext} target="_blank" rel="noopener">Teletext</a>
              <a href={site.external.bhrt} target="_blank" rel="noopener">BHRT</a>
              <a href={site.external.rtrs} target="_blank" rel="noopener">RTRS</a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
