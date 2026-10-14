"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronDown, ExternalLink, Mail, Menu, Phone, X } from "lucide-react";
import Logo from "./Logo";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "./SocialIcons";
import { site, type NavItem } from "@/content/site";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/** `nav` dolazi iz layouta (bez arhiviranih stranica) */
export default function Header({ nav }: { nav: NavItem[] }) {
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
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    /* Skrolanje se zaključava na <html>, ne na <body>: overflow na body-ju bi
       od njega napravio novi kontejner za skrolanje i „otkačio“ sticky header. */
    const html = document.documentElement;
    const prije = html.style.overflow;
    html.style.overflow = "hidden";
    panel.current?.scrollTo(0, 0);
    const naEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu((m) => ({ ...m, open: false, sub: null }));
    };
    window.addEventListener("keydown", naEsc);
    return () => {
      html.style.overflow = prije;
      window.removeEventListener("keydown", naEsc);
    };
  }, [open]);

  // Sve stranice počinju tamnim zaglavljem: header je proziran dok se ne skrola,
  // a dok je mobilni meni otvoren taman je kao i sam meni
  const solid = scrolled && !open;

  const navBase = "whitespace-nowrap rounded-full px-2.5 py-2 font-display text-[0.9rem] font-semibold transition-colors";
  const navIdle = solid ? "text-navy hover:bg-sky-mist hover:text-brand-strong" : "text-white/90 hover:bg-white/10 hover:text-white";
  const navActive = solid ? "bg-sky-soft text-brand-deep" : "bg-white/15 text-white";

  return (
    <header className="sticky top-0 z-50 transition-colors duration-300">
      {/* Glavna navigacija */}
      <div
        className={`transition-[background-color,box-shadow,border-color] duration-300 ${
          open
            ? "border-b border-white/10 bg-navy"
            : solid
              ? "border-b border-line bg-white/90 backdrop-blur-md"
              : "border-b border-white/10 bg-transparent"
        } ${scrolled && !open ? "shadow-[0_6px_24px_-12px_rgba(11,37,64,0.25)]" : ""}`}
      >
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-5">
          {/* flex: logo se centrira po visini (inline bi sjeo na baznu liniju i odskočio prema vrhu) */}
          <Link href="/" className="flex shrink-0 items-center">
            <Logo light={!solid} jubilej />
            {/* naziv linka = vidljivi tekst logotipa + odredište (glasovno upravljanje traži vidljive riječi) */}
            <span className="sr-only">, početna stranica</span>
          </Link>

          <nav aria-label="Glavna navigacija" className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {nav.map((item) => {
                const active = isActive(pathname, item.href);
                if (!item.children) {
                  return (
                    <li key={item.href}>
                      <Link href={item.href} className={`${navBase} ${active ? navActive : navIdle}`}>
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={item.href} className="group relative">
                    <Link
                      href={item.href}
                      className={`inline-flex items-center gap-1 ${navBase} ${active ? navActive : navIdle}`}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4 opacity-60 transition-transform group-hover:rotate-180" />
                    </Link>
                    <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <ul className="w-72 rounded-2xl border border-line bg-white p-2 shadow-[0_18px_40px_-16px_rgba(11,37,64,0.35)]">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} className="block rounded-xl px-3 py-2.5 hover:bg-sky-mist">
                              <span className="block font-display text-sm font-semibold text-navy">{c.label}</span>
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

          <div className="hidden items-center gap-2 xl:flex">
            <a
              href={site.external.federalna}
              target="_blank"
              rel="noopener"
              title="Vijesti na federalna.ba"
              className={`btn whitespace-nowrap !py-2.5 ${solid ? "btn-primary" : "btn-light"}`}
            >
              federalna.ba
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors xl:hidden ${
              solid ? "border-line text-navy" : open ? "border-white/30 bg-white text-navy" : "border-white/30 text-white"
            }`}
            aria-expanded={open}
            aria-controls="mobilni-meni"
            aria-label={open ? "Zatvori meni" : "Otvori meni"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobilni meni – tamni panel u stilu naslovnice */}
      <div
        id="mobilni-meni"
        ref={panel}
        data-open={open}
        className={`fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto overscroll-contain bg-navy text-white transition-opacity duration-300 xl:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="relative min-h-full">
          <div aria-hidden="true" className="absolute inset-0 bg-[url(/brand/kartice-bg.webp)] bg-cover bg-right opacity-30" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/90 to-navy" />

          <nav aria-label="Mobilna navigacija" className="container-x relative flex min-h-full flex-col pb-10 pt-4">
            <ol className="border-b border-white/10">
              {nav.map((item, i) => {
                const active = isActive(pathname, item.href);
                const broj = String(i + 1).padStart(2, "0");
                const red = `flex w-full items-center gap-4 py-4 text-left font-display text-2xl font-semibold transition-colors ${
                  active ? "text-sky" : "text-white hover:text-sky"
                }`;
                return (
                  <li
                    key={item.href}
                    className="meni-stavka border-t border-white/10"
                    style={{ animationDelay: `${60 + i * 45}ms` }}
                  >
                    {!item.children ? (
                      <Link href={item.href} className={`group ${red}`} aria-current={active ? "page" : undefined}>
                        <span className="w-6 font-mono text-xs tabular-nums text-sky/70">{broj}</span>
                        <span className="flex-1">{item.label}</span>
                        <ArrowRight className="h-5 w-5 -translate-x-1 text-white/30 transition-all group-hover:translate-x-0 group-hover:text-white" />
                      </Link>
                    ) : (
                      <>
                        <button
                          type="button"
                          className={red}
                          aria-expanded={openSub === item.href}
                          onClick={() => setOpenSub((v) => (v === item.href ? null : item.href))}
                        >
                          <span className="w-6 font-mono text-xs tabular-nums text-sky/70">{broj}</span>
                          <span className="flex-1">{item.label}</span>
                          <span
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] duration-300 ${
                              openSub === item.href
                                ? "rotate-180 border-white bg-white text-navy"
                                : "border-white/25 text-white/80"
                            }`}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </span>
                        </button>
                        <div
                          className={`grid transition-[grid-template-rows] duration-300 ${
                            openSub === item.href ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                          }`}
                        >
                          <ul className="min-h-0 overflow-hidden">
                            <li className="pb-4 pl-10">
                              <ul className="space-y-2">
                                {item.children.map((c) => (
                                  <li key={c.href}>
                                    <Link
                                      href={c.href}
                                      className="glass group flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-white/15"
                                    >
                                      <span className="min-w-0 flex-1">
                                        <span className="block font-display font-semibold text-white">{c.label}</span>
                                        {c.description && (
                                          <span className="mt-0.5 block text-xs text-white/60">{c.description}</span>
                                        )}
                                      </span>
                                      <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition-colors group-hover:text-white" />
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          </ul>
                        </div>
                      </>
                    )}
                  </li>
                );
              })}
            </ol>

            {/* Pozivi na akciju */}
            <div className="meni-stavka mt-8 grid gap-3" style={{ animationDelay: `${60 + nav.length * 45}ms` }}>
              <a
                href={site.external.federalna}
                target="_blank"
                rel="noopener"
                className="group flex items-center justify-between gap-3 rounded-full bg-white py-1.5 pl-6 pr-1.5 font-display font-semibold text-navy"
              >
                Vijesti na federalna.ba
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white transition-colors group-hover:bg-brand">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
              <a
                href={site.external.radioLive}
                target="_blank"
                rel="noopener"
                className="glass flex items-center justify-between gap-3 rounded-full py-3.5 pl-6 pr-5 font-display font-semibold"
              >
                <span className="flex items-center gap-3">
                  <span aria-hidden="true" className="eq flex h-4 items-end gap-[3px]">
                    <span />
                    <span />
                    <span />
                    <span />
                  </span>
                  Radio uživo
                </span>
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-red-400">● Live</span>
              </a>
            </div>

            {/* Kontakt i linkovi */}
            <div
              className="meni-stavka mt-auto pt-10"
              style={{ animationDelay: `${60 + (nav.length + 1) * 45}ms` }}
            >
              <div className="grid gap-2 text-sm text-white/80">
                <a href={`tel:${site.phoneHref}`} className="flex items-center gap-3 hover:text-white">
                  <Phone className="h-4 w-4 text-sky" /> {site.phone}
                </a>
                <a href={`mailto:${site.emails.direkcija}`} className="flex items-center gap-3 hover:text-white">
                  <Mail className="h-4 w-4 text-sky" /> {site.emails.direkcija}
                </a>
              </div>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-white/60">
                  <a href={site.external.teletext} target="_blank" rel="noopener" className="hover:text-white">
                    Teletekst
                  </a>
                  <a href={site.external.bhrt} target="_blank" rel="noopener" className="hover:text-white">
                    BHRT
                  </a>
                  <a href={site.external.rtrs} target="_blank" rel="noopener" className="hover:text-white">
                    RTRS
                  </a>
                </div>
                <div className="flex gap-2">
                  {[
                    { href: site.social.youtube, label: "YouTube", Icon: YoutubeIcon },
                    { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
                    { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
                  ].map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener"
                      aria-label={label}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white hover:bg-white hover:text-navy"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
