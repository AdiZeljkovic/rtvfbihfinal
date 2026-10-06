/**
 * Ikona fajla s obojenom trakom formata (PDF crveno, DOC plavo…),
 * kao klasične ikone dokumenata u operativnim sistemima.
 */

const boje: Record<string, string> = {
  PDF: "#E5322D",
  DOC: "#2B6CDE",
  DOCX: "#2B6CDE",
  XLS: "#1D8A4E",
  XLSX: "#1D8A4E",
  XPS: "#6B7A8C",
  WEB: "#2B8DDE",
};

type Props = {
  format: string;
  className?: string;
  /** Svijetla varijanta lista za tamne pozadine */
  onDark?: boolean;
};

export default function FileTypeIcon({ format, className = "h-10 w-9", onDark = false }: Props) {
  const f = format.toUpperCase();
  const boja = boje[f] ?? boje.WEB;
  const label = f.length > 4 ? f.slice(0, 4) : f;

  return (
    <svg viewBox="0 0 32 38" className={className} role="img" aria-label={`${f} dokument`}>
      {/* List papira */}
      <path
        d="M7 1.5h14.5L29 9v25.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-31a2 2 0 0 1 2-2Z"
        fill={onDark ? "#F4F8FB" : "#FFFFFF"}
        stroke={onDark ? "none" : "#D7E6EF"}
        strokeWidth="1"
      />
      {/* Presavijeni ugao */}
      <path d="M21.5 1.5V7a2 2 0 0 0 2 2H29Z" fill={onDark ? "#C9DCE8" : "#E6EFF5"} />
      {/* Redovi teksta */}
      <path d="M10 28.5h14M10 31.5h9" stroke="#B9CCD9" strokeWidth="1.2" strokeLinecap="round" />
      {/* Traka formata */}
      <rect x="1" y="13" width="23" height="11" rx="2" fill={boja} />
      <text
        x="12.5"
        y="21.2"
        textAnchor="middle"
        fontSize={label.length > 3 ? 6.4 : 7.4}
        fontWeight="800"
        fontFamily="Inter, Arial, sans-serif"
        letterSpacing=".3"
        fill="#FFFFFF"
      >
        {label}
      </text>
    </svg>
  );
}
