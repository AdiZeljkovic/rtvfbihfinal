/**
 * Termin emisije je slobodan tekst: „Petkom u 18:20“, „Petkom u 18.20“, „Radnim danima u 9h“, „Nedjeljom, 21:05 (uživo)“.
 * Iz njega se čita vrijeme (uvijek prikazano kao 18:20), dan i oznaka „uživo“; `kljuc` služi za redanje po vremenu.
 */
export function rastaviTermin(termin: string) {
  const t = termin ?? "";
  const m = /(?<![\d.:])([01]?\d|2[0-3])\s*[:.,]\s*([0-5]\d)(?![\d.]\d)/.exec(t) ?? /(?<![\d.:])([01]?\d|2[0-3])\s*h\b/i.exec(t);
  const sat = m ? Number(m[1]) : null;
  const min = m && m[2] ? m[2] : "00";
  const vrijeme = sat === null ? undefined : `${sat}:${min}`;
  const dan = t.split(/ u |,|\s\d/)[0].trim();
  return {
    vrijeme,
    dan,
    uzivo: /uživo/i.test(t),
    kljuc: sat === null ? "99:99" : `${String(sat).padStart(2, "0")}:${min}`,
  };
}
