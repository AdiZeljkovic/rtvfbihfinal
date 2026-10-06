import { Mail, Phone, Printer } from "lucide-react";

type Props = {
  ime: string;
  uloga?: string;
  tel?: string;
  fax?: string;
  email?: string;
  className?: string;
  /** Tamna varijanta (istaknuta osoba) */
  dark?: boolean;
};

const inicijali = (ime: string) =>
  ime
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((d) => d[0])
    .join("")
    .toUpperCase();

/** Kontakt osobe s inicijalima u tankom krugu (bez punjene pozadine) */
export default function ContactCard({ ime, uloga, tel, fax, email, className = "", dark = false }: Props) {
  return (
    <div
      className={`rounded-3xl p-6 ${
        dark
          ? "bg-navy text-white shadow-[var(--shadow-card)]"
          : "border border-line bg-white shadow-[var(--shadow-card)]"
      } ${className}`}
    >
      <div className="flex items-center gap-4">
        <span
          className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold tracking-wide ring-1 ${
            dark ? "text-sky ring-white/25" : "text-brand ring-line"
          }`}
        >
          {inicijali(ime)}
        </span>
        <div className="min-w-0">
          <p className={`font-display font-semibold ${dark ? "text-white" : "text-navy"}`}>{ime}</p>
          {uloga && <p className={`text-sm ${dark ? "text-white/65" : "text-muted"}`}>{uloga}</p>}
        </div>
      </div>
      {(tel || fax || email) && (
        <ul className={`mt-5 space-y-2 border-t pt-4 text-sm ${dark ? "border-white/10" : "border-line"}`}>
          {tel && (
            <li className={`flex items-start gap-2.5 ${dark ? "text-white/85" : "text-ink"}`}>
              <Phone className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-sky" : "text-brand"}`} />
              <span>{tel}</span>
            </li>
          )}
          {fax && (
            <li className={`flex items-start gap-2.5 ${dark ? "text-white/70" : "text-muted"}`}>
              <Printer className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-sky" : "text-brand"}`} />
              <span>fax: {fax}</span>
            </li>
          )}
          {email && (
            <li className="flex items-start gap-2.5">
              <Mail className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-sky" : "text-brand"}`} />
              <a
                href={`mailto:${email}`}
                className={`break-all hover:underline ${dark ? "text-white" : "text-brand"}`}
              >
                {email}
              </a>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
