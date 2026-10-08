import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "./SocialIcons";
import Logo from "./Logo";
import { footerNav, site } from "@/content/site";
import { osnovno, telHref } from "@/server/sadrzaj";

type FooterLink = { label: string; href: string; external?: boolean };

function LinkList({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <div>
      <h3 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-sky">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5 text-sm">
        {items.map((i) =>
          i.external ? (
            <li key={i.href}>
              <a href={i.href} target="_blank" rel="noopener" className="text-white/80 hover:text-white">
                {i.label}
              </a>
            </li>
          ) : (
            <li key={i.href}>
              <Link href={i.href} className="text-white/80 hover:text-white">
                {i.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const o = osnovno();
  return (
    <footer className="bg-navy text-white">
      <div className="h-1 w-full bg-gradient-to-r from-brand via-sky to-brand/40" />
      <div className="container-x grid gap-12 py-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
            Javni radio-televizijski servis Federacije Bosne i Hercegovine. Federalna
            televizija, Radio Federacije BiH, portal federalna.ba i Teletext.
          </p>
          <address className="mt-6 space-y-2.5 text-sm not-italic text-white/80">
            <p className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
              <span>
                {o.adresa}
                <br />
                {o.grad}, {site.address.country}
              </span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-sky" />
              <a href={telHref(o.telefon)} className="hover:text-white">
                {o.telefon}
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-sky" />
              <a href={`mailto:${o.emailDirekcija}`} className="hover:text-white">
                {o.emailDirekcija}
              </a>
            </p>
          </address>
          <div className="mt-6 flex items-center gap-2">
            <a
              href={o.youtube}
              target="_blank"
              rel="noopener"
              aria-label="YouTube"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-brand"
            >
              <YoutubeIcon className="h-5 w-5" />
            </a>
            <a
              href={o.facebook}
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-brand"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a
              href={o.instagram}
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-brand"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <LinkList title="Servisi" items={footerNav.servisi} />
        <LinkList title="Institucija" items={footerNav.institucija} />
        <div className="space-y-10">
          <LinkList title="Za građane" items={footerNav.gradjani} />
          <LinkList title="Javni RTV sistem BiH" items={footerNav.sistem} />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} Radio-televizija Federacije Bosne i Hercegovine. Sva prava zadržana.
          </p>
          <p>
            Preuzimanje sadržaja sa stranice samo uz pismenu dozvolu ili navođenje izvora
            (www.rtvfbih.ba).
          </p>
        </div>
      </div>
    </footer>
  );
}
