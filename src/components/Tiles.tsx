import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type IconType = (p: { className?: string }) => ReactNode;

type LinkProps = { href?: string; external?: boolean };

/** tel: i mailto: linkovi ne otvaraju novi tab */
const noviTab = (href: string) => (/^(tel|mailto):/.test(href) ? {} : { target: "_blank", rel: "noopener" });

function Wrap({
  href,
  external,
  className,
  children,
}: LinkProps & { className: string; children: ReactNode }) {
  if (!href) return <div className={className}>{children}</div>;
  if (external)
    return (
      <a href={href} {...noviTab(href)} className={className}>
        {children}
      </a>
    );
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/**
 * Tamna kartica s pozadinom klijenta (kao „Naši servisi“ na naslovnici).
 */
export function DarkTile({
  icon: Icon,
  title,
  text,
  cta,
  href,
  external,
  className = "",
  children,
}: LinkProps & {
  icon?: IconType;
  title: string;
  text?: string;
  cta?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Wrap
      href={href}
      external={external}
      className={`group relative flex min-h-[15rem] flex-col overflow-hidden rounded-3xl bg-navy p-7 text-white shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 sm:p-8 ${
        href ? "hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]" : ""
      } ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url(/brand/kartice-bg.webp)] bg-cover bg-right opacity-60 transition-transform duration-700 group-hover:scale-105"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/60 to-transparent" />
      <div className="relative flex flex-1 flex-col sm:max-w-md">
        {Icon && <Icon className="h-10 w-10 text-sky transition-colors duration-300 group-hover:text-white" />}
        <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
        {text && <p className="mt-2 flex-1 text-sm leading-relaxed text-white/80">{text}</p>}
        {children}
        {cta && (
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-transform group-hover:translate-x-1">
            {cta}
            {external ? <ArrowUpRight className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </span>
        )}
      </div>
    </Wrap>
  );
}

/**
 * Bijela kartica s linijskom ikonom, opcionalnim krupnim brojem i strelicom u krugu
 * (kao „Transparentno poslovanje“ na naslovnici).
 */
export function IconCard({
  icon: Icon,
  title,
  text,
  value,
  unit,
  href,
  external,
  cta,
  className = "",
  children,
}: LinkProps & {
  icon?: IconType;
  title: string;
  text?: string;
  value?: string | number;
  unit?: string;
  cta?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Wrap
      href={href}
      external={external}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white p-7 shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color] duration-300 ${
        href ? "hover:-translate-y-1 hover:border-brand/40 hover:shadow-[var(--shadow-card-hover)]" : ""
      } ${className}`}
    >
      {href && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky/0 blur-2xl transition-colors duration-500 group-hover:bg-sky/30"
        />
      )}
      {(Icon || href) && (
        <div className="relative flex items-start justify-between">
          {Icon ? <Icon className="h-10 w-10 text-brand-strong" /> : <span />}
          {href && (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-navy transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          )}
        </div>
      )}
      {value !== undefined && (
        <p className="relative mt-6 flex items-baseline gap-2">
          <span className="font-display text-4xl font-bold leading-none tabular-nums text-navy">{value}</span>
          {unit && <span className="text-sm font-medium text-muted">{unit}</span>}
        </p>
      )}
      <h3 className={`relative font-display text-lg font-semibold text-navy ${value !== undefined ? "mt-3" : Icon ? "mt-5" : ""}`}>
        {title}
      </h3>
      {text && <p className="relative mt-1.5 flex-1 text-sm leading-relaxed text-muted">{text}</p>}
      {children && <div className="relative">{children}</div>}
      {cta && (
        <span className="relative mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-strong">
          {cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      )}
    </Wrap>
  );
}

/** Bijelo dugme sa strelicom u krugu (glavni poziv na akciju, kao u heroju naslovnice) */
export function PillButton({ href, external, children }: { href: string; external?: boolean; children: ReactNode }) {
  const cls =
    "group inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-5 pr-1.5 font-display text-[0.95rem] font-semibold text-navy shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] transition-colors hover:bg-sky-soft";
  const inner = (
    <>
      {children}
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-navy text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:bg-brand">
        {external ? <ArrowUpRight className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
      </span>
    </>
  );
  return external ? (
    <a href={href} {...noviTab(href)} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/** Tekstualni link s podvlakom koja se razvuče (kao „O javnom servisu“ na naslovnici) */
export function UnderlineLink({
  href,
  external,
  children,
  dark = true,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
  /** true = na tamnoj pozadini */
  dark?: boolean;
}) {
  const cls = `group inline-flex items-center gap-2 px-1 py-3 font-display text-[0.95rem] font-semibold transition-colors ${
    dark ? "text-white/85 hover:text-white" : "text-navy hover:text-brand-strong"
  }`;
  const inner = (
    <>
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-[0.35] bg-sky transition-transform duration-300 group-hover:scale-x-100" />
      </span>
      {external ? (
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      ) : (
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  );
  return external ? (
    <a href={href} {...noviTab(href)} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
