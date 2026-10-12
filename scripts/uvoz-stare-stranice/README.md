# Uvoz sadržaja sa stare stranice (rtvfbih.ba/loc)

Skripte koje su prenijele kompletan sadržaj stare stranice u novu. Pokreću se iz
korijena projekta (`rtvfbih/`), redom. Stara stranica je i dalje aktivna, pa uvoz
treba ponoviti neposredno prije objave nove stranice (javne nabavke se stalno dopunjuju).

Potrebno: Python 3, `pip install beautifulsoup4 lxml pyodbc`, Microsoft Access ODBC
drajver (samo za `mdb_pages.py`) i kopija servera u folderu `../RTV OLD`.

| Korak | Skripta | Šta radi |
|---|---|---|
| 1 | `mdb_pages.py` | Izvlači spisak svih 418 stranica iz baze `cms.mdb` (naslovi, sekcije, linkovi). Bazu prethodno kopirati u `podaci/`. |
| 2 | `crawl.py` | Pretražuje živu stranicu od naslovne i bilježi sve dostupne stranice i dokumente (`podaci/live.json`). |
| 3 | `snimi.py` | Snima HTML svake dostupne stranice u `podaci/html/`. |
| 4 | `izvoz.py` | Pretvara stranice u JSON (`src/content/arhiva/`) i kopira slike u `public/arhiva/`. |
| 5 | `kopiraj_doc.py` | Kopira sve dokumente u `podaci/doc/` (iz kopije servera, a što fali preuzima sa žive stranice). |
| 6 | `provjera_nabavki.py` | Provjerava da je svaki dokument javnih nabavki sa žive stranice uvezen. |

`sadrzaj.py` i `blokovi.py` su pomoćni moduli (izdvajanje sadržaja i pretvaranje u blokove).

Nove adrese za stare stranice (`wbf_id` → ruta) i raspored emisija po grupama su na vrhu `izvoz.py`.

## Dokumenti (~1 GB)

Dokumenti su u folderu `podaci/doc/` (nije u gitu), zajedno s dokumentima koje urednici
dodaju kroz CMS. Na produkciju se kopira cijeli folder `podaci/`; stranica ih služi na
`/doc/…`.
