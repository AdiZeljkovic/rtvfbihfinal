import { Mail, Phone, Printer } from "lucide-react";

type Props = {
  ime: string;
  uloga?: string;
  tel?: string;
  fax?: string;
  email?: string;
  className?: string;
};

export default function ContactCard({ ime, uloga, tel, fax, email, className = "" }: Props) {
  return (
    <div className={`card p-5 ${className}`}>
      <p className="font-display font-semibold text-navy">{ime}</p>
      {uloga && <p className="mt-0.5 text-sm text-muted">{uloga}</p>}
      <ul className="mt-3 space-y-1.5 text-sm">
        {tel && (
          <li className="flex items-start gap-2 text-ink">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <span>{tel}</span>
          </li>
        )}
        {fax && (
          <li className="flex items-start gap-2 text-ink">
            <Printer className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <span>fax: {fax}</span>
          </li>
        )}
        {email && (
          <li className="flex items-start gap-2">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <a href={`mailto:${email}`} className="break-all text-brand hover:underline">
              {email}
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
