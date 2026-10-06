/*
 * Vlastite linijske ikone za statistike u heroju – tematski vezane za radio i TV.
 * Tanka linija (1.5), bez pozadine, boja preko `currentColor`.
 */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Klasični studijski mikrofon – tradicija radija */
export function MicIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="11" y="3" width="10" height="16" rx="5" />
      <path d="M11 8.5h3.5M11 12h3.5M17.5 8.5H21M17.5 12H21" opacity=".55" />
      <path d="M7 15a9 9 0 0 0 18 0" />
      <path d="M16 24v5M11 29h10" />
    </svg>
  );
}

/** Četiri servisa – pločice, jedna istaknuta */
export function ServicesIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="4" y="4" width="10.5" height="10.5" rx="2.5" fill="currentColor" fillOpacity=".25" />
      <rect x="17.5" y="4" width="10.5" height="10.5" rx="2.5" />
      <rect x="4" y="17.5" width="10.5" height="10.5" rx="2.5" />
      <rect x="17.5" y="17.5" width="10.5" height="10.5" rx="2.5" />
    </svg>
  );
}

/** Skala radio-prijemnika s iglom */
export function TunerIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 22h26" />
      <path d="M5 22v-3M9 22v-5M13 22v-3M17 22v-5M21 22v-3M25 22v-5" opacity=".55" />
      <path d="M19.5 7v20" />
      <circle cx="19.5" cy="7" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Odašiljač sa signalom */
export function TowerIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="16" cy="11" r="1.8" />
      <path d="M16 13l-5 16M16 13l5 16M12.6 23.5h6.8" />
      <path d="M11.6 6.6a6.2 6.2 0 0 0 0 8.8M20.4 6.6a6.2 6.2 0 0 1 0 8.8" />
      <path d="M8.3 3.3a10.8 10.8 0 0 0 0 15.4M23.7 3.3a10.8 10.8 0 0 1 0 15.4" opacity=".55" />
    </svg>
  );
}

/** Televizor s antenom – za dugme Federalne televizije */
export function TvIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="9" width="25" height="17" rx="3" />
      <path d="M11 3.5l5 5.5 5-5.5" />
      <path d="M12 30h8" opacity=".55" />
    </svg>
  );
}

/** Radio-prijemnik sa zvučnikom, skalom i antenom */
export function RadioSetIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8 11 22.5 4" />
      <rect x="3" y="11" width="26" height="16" rx="3" />
      <circle cx="10.5" cy="19" r="4.5" />
      <circle cx="10.5" cy="19" r="1.4" opacity=".55" />
      <path d="M18.5 15.5h6.5M18.5 19h6.5M18.5 22.5h4" opacity=".55" />
    </svg>
  );
}

/** Prozor browsera s redovima teksta – web portal */
export function WebIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="5" width="26" height="22" rx="3" />
      <path d="M3 10.5h26" />
      <circle cx="6.8" cy="7.8" r=".9" fill="currentColor" stroke="none" />
      <circle cx="9.8" cy="7.8" r=".9" fill="currentColor" stroke="none" />
      <rect x="7.5" y="14" width="7" height="8.5" rx="1" fill="currentColor" fillOpacity=".25" />
      <path d="M17.5 14.5h7M17.5 18.2h7M17.5 22h5" opacity=".55" />
    </svg>
  );
}

/** TV ekran sa stranicom teleteksta */
export function TeletextIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="4.5" width="26" height="19" rx="2.5" />
      <rect x="7" y="8.5" width="6" height="2.8" rx=".6" fill="currentColor" stroke="none" />
      <path d="M16 9.9h9" opacity=".55" />
      <path d="M7 14.8h18M7 18.3h13" opacity=".55" />
      <path d="M16 23.5v4M11.5 27.5h9" />
    </svg>
  );
}

/** Svežanj dokumenata – opći akti i izvještaji */
export function DocsIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M10 6.5V5a2 2 0 0 1 2-2h9.5L27 8.5V23a2 2 0 0 1-2 2h-1.5" opacity=".55" />
      <path d="M21.5 3v5.5H27" opacity=".55" />
      <path d="M5 9a2 2 0 0 1 2-2h9.5L22 12.5V27a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" />
      <path d="M16.5 7v5.5H22" />
      <path d="M9 17h9M9 21h9M9 25h5" opacity=".55" />
    </svg>
  );
}

/** Dokument s pečatom – javne nabavke */
export function TenderIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M17 29H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11.5L26 9.5V15" />
      <path d="M19.5 3v6.5H26" />
      <path d="M10 13h8M10 17h6M10 21h4" opacity=".55" />
      <circle cx="23.5" cy="22.5" r="5" />
      <path d="m21.3 22.6 1.6 1.6 3-3.2" />
    </svg>
  );
}

/** Sto za sjednice s članovima – Upravni odbor */
export function BoardIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="9" cy="8" r="2.6" />
      <circle cx="16" cy="6.5" r="2.6" />
      <circle cx="23" cy="8" r="2.6" />
      <path d="M4.5 16.5a4.5 4.5 0 0 1 9 0M11.5 15a4.5 4.5 0 0 1 9 0M18.5 16.5a4.5 4.5 0 0 1 9 0" opacity=".55" />
      <rect x="3" y="19" width="26" height="4" rx="1.5" />
      <path d="M7 23v6M25 23v6" />
    </svg>
  );
}

/** Uplatnica/račun – RTV taksa */
export function ReceiptIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M7 3h18v26l-3-2-3 2-3-2-3 2-3-2-3 2Z" />
      <path d="M11 9h10M11 13h10M11 17h6" opacity=".55" />
      <path d="M11 22.5h4M19 22.5h2" />
    </svg>
  );
}

/** Filmska klapa – dokumentarni program */
export function ClapperIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="4" y="13" width="24" height="15" rx="2" />
      <path d="M4 13 26.5 6.5a1.5 1.5 0 0 0-1.9-1.1L5.1 11a1.5 1.5 0 0 0-1.1 1.9Z" />
      <path d="m10 9.3 3.2 3.7M16.5 7.4l3.2 3.8" opacity=".55" />
      <path d="M9 19h14M9 23h9" opacity=".55" />
    </svg>
  );
}

/** Muzička nota – kulturno-zabavni program */
export function NoteIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 23V7l15-3v16" />
      <path d="M12 11.5 27 8.5" opacity=".55" />
      <circle cx="8.5" cy="23.5" r="3.5" />
      <circle cx="23.5" cy="20.5" r="3.5" />
    </svg>
  );
}

/** Zmaj od papira – program za djecu i mlade */
export function KiteIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M18 3 27 12l-9 9-9-9Z" />
      <path d="M18 3v18M9 12h18" opacity=".55" />
      <path d="M18 21c-1.5 2-4.5 2-5.5 4s-3 3-5.5 3" />
      <path d="m12.5 24.5 1.5 1.5M9 27.3l1.2 1.4" opacity=".55" />
    </svg>
  );
}
