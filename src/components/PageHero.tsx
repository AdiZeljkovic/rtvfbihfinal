import Link from "next/link";

type Crumb = { label: string; href?: string };

type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
};

/** Zaglavlje podstranice: nebesko-plavi gradijent u duhu brend animacije */
export default function PageHero({ eyebrow, title, lead, crumbs }: Props) {
  return (
    <header className="relative overflow-hidden bg-sky-soft">
      {/* Kadar iz brend animacije kao suptilna pozadina */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[url(/video/ftv-intro-poster.jpg)] bg-cover bg-[70%_center] opacity-40"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/30" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sky/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-brand/10 blur-3xl"
      />
      <div className="container-x relative py-14 sm:py-20">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Navigacija" className="mb-5 text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-brand">
                  Početna
                </Link>
              </li>
              {crumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span aria-hidden="true">/</span>
                  {c.href ? (
                    <Link href={c.href} className="hover:text-brand">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-navy">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl text-3xl font-bold text-navy sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {lead && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {lead}
          </p>
        )}
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-brand via-sky to-brand/40" />
    </header>
  );
}
