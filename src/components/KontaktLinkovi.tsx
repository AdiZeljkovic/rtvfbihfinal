import { Fragment } from "react";
import { rastaviTelefone, telHref } from "@/lib/telefon";

/**
 * Jedan ili više telefona („+387 (0)33 461 512, +387 (0)33 462 441“): svaki broj je
 * svoj tel: link i nikad se ne lomi usred broja (na telefonu se samo dodirne).
 */
export function Telefoni({ tel, className = "" }: { tel: string; className?: string }) {
  const brojevi = rastaviTelefone(tel);
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
