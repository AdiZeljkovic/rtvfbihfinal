import Image from "next/image";

type LogoProps = {
  className?: string;
  /** Prikaži i tekst pored znaka */
  withWordmark?: boolean;
  /** Svijetla varijanta za tamne pozadine */
  light?: boolean;
  /** Jubilarni znak „F25 godina“ umjesto znaka „F“ (zaglavlje stranice) */
  jubilej?: boolean;
};

/**
 * Jubilarni logo „F25 godina“ (public/brand/f25-logo*.png). Original ima bijeli natpis
 * „godina“ za tamnu pozadinu; za svijetlu je natpis tamnoplav. Obje slike su u stranici,
 * pa se pri skrolanju samo pretapaju (bez učitavanja i treptanja).
 */
function JubilejZnak({ light }: { light: boolean }) {
  const slika = "absolute inset-0 h-full w-full transition-opacity duration-300";
  return (
    // omjer slike 354:320; u zaglavlju (4,5rem) ostaje zraka iznad i ispod
    <span className="relative block h-12.5 w-[3.45rem] shrink-0 sm:h-14 sm:w-15.5">
      <Image src="/brand/f25-logo.png" alt="" width={354} height={320} priority className={`${slika} ${light ? "opacity-100" : "opacity-0"}`} />
      <Image src="/brand/f25-logo-svijetli.png" alt="" width={354} height={320} priority className={`${slika} ${light ? "opacity-0" : "opacity-100"}`} />
    </span>
  );
}

type MarkProps = {
  className?: string;
  /** "brand" = plavi gradijent (svijetle pozadine), "white" = bijeli (tamne pozadine) */
  tone?: "brand" | "white";
};

/**
 * Službeni znak „F“ (public/brand/f-logo.png – bijeli znak na prozirnoj pozadini).
 * PNG se koristi kao CSS maska, pa se boja znaka mijenja prema pozadini,
 * a slovo F ostaje prozirno kao u originalu.
 */
export function LogoMark({ className = "h-9 w-9", tone = "brand" }: MarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 ${
        tone === "white" ? "bg-white" : "bg-gradient-to-br from-[#5fb3e0] to-brand-deep"
      } ${className}`}
      style={{
        WebkitMaskImage: "url(/brand/f-logo.png)",
        maskImage: "url(/brand/f-logo.png)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

export default function Logo({ className = "", withWordmark = true, light = false, jubilej = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center ${jubilej ? "gap-3.5" : "gap-3"} ${className}`}>
      {jubilej ? (
        <JubilejZnak light={light} />
      ) : (
        <LogoMark className="h-9 w-9 transition-colors sm:h-10 sm:w-10" tone={light ? "white" : "brand"} />
      )}
      {withWordmark && (
        <span
          className={`flex flex-col font-display text-[0.82rem] font-bold sm:text-[0.95rem] leading-[1.15] tracking-tight ${
            light ? "text-white" : "text-navy"
          } ${
            // znak „F25“ je u gornjih ~70% slike (ispod je „godina“): tekst se poravnava s njim
            jubilej ? "-translate-y-2" : ""
          }`}
        >
          <span>Radio-televizija</span>
          <span>Federacije Bosne i Hercegovine</span>
        </span>
      )}
    </span>
  );
}
