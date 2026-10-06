type LogoProps = {
  className?: string;
  /** Prikaži i tekst pored znaka */
  withWordmark?: boolean;
  /** Svijetla varijanta za tamne pozadine */
  light?: boolean;
};

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

export default function Logo({ className = "", withWordmark = true, light = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark className="h-9 w-9 transition-colors sm:h-10 sm:w-10" tone={light ? "white" : "brand"} />
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
