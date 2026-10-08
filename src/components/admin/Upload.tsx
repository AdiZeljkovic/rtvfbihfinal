"use client";

import { useRef, useState } from "react";
import { CircleAlert, ExternalLink, ImagePlus, RotateCcw, Trash2, Upload as UploadIkona } from "lucide-react";
import FileTypeIcon from "@/components/FileTypeIcon";

export type Poslano = { ime: string; adresa: string; velicina: number };
type Vrsta = "dokument" | "slika";

/** Šalje fajl na server i javlja napredak (0–100) */
export function posalji(fajl: File, vrsta: Vrsta, napredak: (p: number) => void): Promise<Poslano> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/admin/upload?vrsta=${vrsta}`);
    xhr.upload.onprogress = (e) => e.lengthComputable && napredak(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      let odg: Partial<Poslano> & { greska?: string } = {};
      try {
        odg = JSON.parse(xhr.responseText);
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && odg.ime) resolve(odg as Poslano);
      else reject(new Error(odg.greska ?? "Slanje nije uspjelo. Pokušajte ponovo."));
    };
    xhr.onerror = () => reject(new Error("Nema veze sa serverom. Provjerite internet i pokušajte ponovo."));
    const fd = new FormData();
    fd.append("fajl", fajl);
    xhr.send(fd);
  });
}

/** „Plan_javnih-nabavki 2026 (2).pdf“ → „Plan javnih nabavki 2026“ */
export function nazivIzFajla(ime: string) {
  const s = ime
    .replace(/\.[a-z0-9]{2,5}$/i, "")
    .replace(/\s*\(\d+\)$/, "")
    .replace(/[_]+/g, " ")
    .replace(/(?<=\S)-(?=\S)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const formatFajla = (ime: string) => ime.split(".").pop()?.toUpperCase() ?? "";
const velicinaTekst = (b: number) => (b > 1048576 ? `${(b / 1048576).toFixed(1).replace(".", ",")} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

/**
 * Polje za odabir fajla: veliko dugme + prevlačenje mišem, traka napretka,
 * jasne poruke o greškama. `vise` dozvoljava odabir više fajlova odjednom.
 */
export function ZonaZaFajl({
  vrsta,
  vise = false,
  oznaka,
  opisId,
  onPoslano,
  kompaktno = false,
}: {
  vrsta: Vrsta;
  vise?: boolean;
  oznaka: string;
  opisId?: string;
  onPoslano: (p: Poslano, izvorno: string) => void;
  kompaktno?: boolean;
}) {
  const ulaz = useRef<HTMLInputElement>(null);
  const [nadZonom, setNadZonom] = useState(false);
  const [slanje, setSlanje] = useState<{ ime: string; p: number } | null>(null);
  const [greska, setGreska] = useState("");

  async function obradi(fajlovi: FileList | null) {
    if (!fajlovi?.length) return;
    setGreska("");
    for (const f of Array.from(fajlovi).slice(0, vise ? 20 : 1)) {
      setSlanje({ ime: f.name, p: 0 });
      try {
        const r = await posalji(f, vrsta, (p) => setSlanje({ ime: f.name, p }));
        onPoslano(r, f.name);
      } catch (e) {
        setGreska(`${f.name}: ${(e as Error).message}`);
      }
    }
    setSlanje(null);
    if (ulaz.current) ulaz.current.value = "";
  }

  const prihvata = vrsta === "slika" ? ".jpg,.jpeg,.png,.webp" : ".pdf,.doc,.docx,.xls,.xlsx";
  const Ikona = vrsta === "slika" ? ImagePlus : UploadIkona;

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setNadZonom(true);
        }}
        onDragLeave={() => setNadZonom(false)}
        onDrop={(e) => {
          e.preventDefault();
          setNadZonom(false);
          obradi(e.dataTransfer.files);
        }}
        className={`rounded-3xl border-[3px] border-dashed text-center transition-colors ${
          kompaktno ? "p-4" : "p-6 sm:p-8"
        } ${nadZonom ? "border-brand bg-sky-soft" : "border-line bg-white"}`}
      >
        <input
          ref={ulaz}
          type="file"
          accept={prihvata}
          multiple={vise}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => obradi(e.target.files)}
        />
        {slanje ? (
          <div aria-live="polite">
            <p className="font-display text-lg font-semibold text-navy">Šaljem: {slanje.ime}</p>
            <div
              role="progressbar"
              aria-label="Napredak slanja"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={slanje.p}
              className="mx-auto mt-4 h-4 max-w-md overflow-hidden rounded-full bg-sky-soft"
            >
              <div className="h-full rounded-full bg-brand transition-[width]" style={{ width: `${slanje.p}%` }} />
            </div>
            <p className="mt-2 text-lg font-semibold tabular-nums text-brand">{slanje.p}%</p>
          </div>
        ) : (
          <>
            <button
              type="button"
              aria-describedby={opisId}
              onClick={() => ulaz.current?.click()}
              className="inline-flex min-h-14 items-center gap-3 rounded-2xl bg-navy px-6 py-3 font-display text-lg font-semibold text-white hover:bg-brand-deep"
            >
              <Ikona className="h-6 w-6" aria-hidden="true" />
              {oznaka}
            </button>
            {!kompaktno && (
              <p className="mt-3 text-base text-muted">
                ili ga mišem prevucite ovdje
                {vise ? " (može i više odjednom)" : ""}
                <br />
                <span className="text-sm">
                  {vrsta === "slika" ? "JPG, PNG ili WEBP" : "PDF, Word ili Excel"} · najviše 60 MB
                </span>
              </p>
            )}
          </>
        )}
      </div>
      {greska && (
        <p role="alert" className="mt-3 flex items-start gap-2 rounded-2xl bg-red-50 p-4 text-base font-medium text-red-800">
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /> {greska}
        </p>
      )}
    </div>
  );
}

/** Kartica već dodanog dokumenta: otvori / zamijeni / ukloni */
export function KarticaDokumenta({
  ime,
  onZamijeni,
  onUkloni,
}: {
  ime: string;
  onZamijeni?: (p: Poslano, izvorno: string) => void;
  onUkloni?: () => void;
}) {
  const [mijenja, setMijenja] = useState(false);
  if (mijenja && onZamijeni) {
    return (
      <div>
        <ZonaZaFajl
          vrsta="dokument"
          oznaka="Odaberi novi dokument"
          onPoslano={(p, iz) => {
            onZamijeni(p, iz);
            setMijenja(false);
          }}
        />
        <button type="button" onClick={() => setMijenja(false)} className="mt-2 min-h-12 px-2 font-semibold text-brand underline">
          Odustani od zamjene
        </button>
      </div>
    );
  }
  return (
    <div className="admin-kartica flex flex-wrap items-center gap-4 rounded-3xl border border-line bg-white p-4 sm:p-5">
      <FileTypeIcon format={formatFajla(ime)} className="h-12 w-10 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="break-words font-semibold text-navy">{ime}</p>
        <p className="text-sm text-muted">Dokument je dodan</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={`/doc/${encodeURIComponent(ime)}`}
          target="_blank"
          rel="noopener"
          className="inline-flex min-h-12 items-center gap-2 rounded-xl px-3 font-semibold text-brand hover:bg-sky-soft"
        >
          <ExternalLink className="h-5 w-5" aria-hidden="true" /> Otvori
        </a>
        {onZamijeni && (
          <button
            type="button"
            onClick={() => setMijenja(true)}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl px-3 font-semibold text-navy hover:bg-sky-soft"
          >
            <RotateCcw className="h-5 w-5" aria-hidden="true" /> Zamijeni
          </button>
        )}
        {onUkloni && (
          <button
            type="button"
            onClick={onUkloni}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl px-3 font-semibold text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5" aria-hidden="true" /> Ukloni
          </button>
        )}
      </div>
    </div>
  );
}

export { velicinaTekst };
