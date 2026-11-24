import Image from "next/image";

type LogoProps = {
  className?: string;
  /** Prikaži i tekst pored znaka */
  withWordmark?: boolean;
  /** Svijetla varijanta za tamne pozadine */
  light?: boolean;
  /** Jubilarni grb „25“ umjesto znaka „F“ (zaglavlje stranice) */
  jubilej?: boolean;
};

/**
 * Jubilarni grb „25“ (public/brand/grb-25.png, prozirna pozadina). Isti grb stoji i na
 * tamnom i na svijetlom zaglavlju.
 */
function JubilejZnak() {
  return (
    // omjer slike 251:294; u zaglavlju (4,5rem) ostaje zraka iznad i ispod
    <span className="block h-13 w-[2.78rem] shrink-0 sm:h-15 sm:w-[3.2rem]">
      <Image src="/brand/grb-25.png" alt="" width={251} height={294} priority className="h-full w-full object-contain" />
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
        <JubilejZnak />
      ) : (
        <LogoMark className="h-9 w-9 transition-colors sm:h-10 sm:w-10" tone={light ? "white" : "brand"} />
      )}
      {withWordmark && (
        <span
          className={`flex flex-col font-display text-[0.82rem] font-bold sm:text-[0.95rem] leading-[1.15] tracking-tight ${
            light ? "text-white" : "text-navy"
          }`}
        >
          <span>Radio-televizija</span>
          <span>Federacije Bosne i Hercegovine</span>
        </span>
      )}
    </span>
  );
}
