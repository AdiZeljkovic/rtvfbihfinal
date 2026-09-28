type LogoProps = {
  className?: string;
  /** Prikaži i tekst pored znaka */
  withWordmark?: boolean;
  /** Svijetla varijanta za tamne pozadine */
  light?: boolean;
  /** Dodatne klase za podnaslov (npr. sakrivanje na užim ekranima) */
  subtitleClassName?: string;
};

/**
 * Znak "F" inspirisan 3D animacijom: zaobljeni kvadrat s dijagonalno
 * odsječenim donjim desnim uglom. Zamijenite pravim logotipom kada bude
 * dostupan u vektorskom formatu (SVG).
 */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="ftv-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5fb3e0" />
          <stop offset="1" stopColor="#1b5fa0" />
        </linearGradient>
      </defs>
      <path
        d="M14 4h36a10 10 0 0 1 10 10v22L38 60H14A10 10 0 0 1 4 50V14A10 10 0 0 1 14 4Z"
        fill="url(#ftv-mark)"
      />
      <path
        d="M19 16h27v8H28v8h15v8H28v14h-9V16Z"
        fill="#ffffff"
      />
    </svg>
  );
}

export default function Logo({
  className = "",
  withWordmark = true,
  light = false,
  subtitleClassName = "",
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark className="h-10 w-10 shrink-0" />
      {withWordmark && (
        <span className="flex flex-col leading-tight">
          <span
            className={`font-display text-[0.95rem] font-bold tracking-tight ${
              light ? "text-white" : "text-navy"
            }`}
          >
            RTV Federacije BiH
          </span>
          <span
            className={`text-[0.7rem] font-medium tracking-wide ${
              light ? "text-white/75" : "text-muted"
            } ${subtitleClassName}`}
          >
            Javni RTV servis Federacije Bosne i Hercegovine
          </span>
        </span>
      )}
    </span>
  );
}
