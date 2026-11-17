import { Fragment } from "react";

// isto kao telHref u server/sadrzaj.ts (ovdje bez server-only uvoza)
const telHref = (t: string) => `tel:${t.replace(/\(0\)/, "").replace(/[^\d+]/g, "")}`;

/**
 * Jedan ili više telefona („+387 (0)33 461 512, +387 (0)33 462 441“): svaki broj je
 * svoj tel: link i nikad se ne lomi usred broja (na telefonu se samo dodirne).
 */
export function Telefoni({ tel, className = "" }: { tel: string; className?: string }) {
  const brojevi = tel.split(/\s*[,;]\s*/).filter(Boolean);
  return (
    <>
      {brojevi.map((b, i) => (
        <Fragment key={b}>
          {i > 0 && ", "}
          <a href={telHref(b)} className={`whitespace-nowrap ${className}`}>
            {b}
          </a>
        </Fragment>
      ))}
    </>
  );
}

/** E-mail koji se u uskoj koloni lomi iza „@“, a ne usred riječi */
export function Email({ email }: { email: string }) {
  const [ime, domena] = email.split("@");
  if (!domena) return <>{email}</>;
  return (
    <>
      {ime}@<wbr />
      {domena}
    </>
  );
}
