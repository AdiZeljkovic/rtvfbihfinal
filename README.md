# RTV FBiH – nova web stranica

Nova korporativna stranica Radio-televizije Federacije Bosne i Hercegovine (zamjena za
rtvfbih.ba/loc). Stranica pokriva sve **osim vijesti** – vijesti ostaju na federalna.ba.

Stack: **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · lucide-react**,
uz ugrađeni CMS (admin na `/admin`) i SQLite bazu ugrađenu u Node.js (`node:sqlite`).

## Pokretanje

Potreban je **Node.js 24** (zbog ugrađenog `node:sqlite`).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # produkcijski build
npm start        # pokretanje produkcijskog builda
npm run lint
```

## CMS – uređivanje sadržaja

Admin je na **`/admin`**. Pri prvom otvaranju (dok nema nijednog urednika) prikazuje se
obrazac za pravljenje prvog računa; poslije toga se novi urednici dodaju u
*Urednici i lozinka*. Prijava traje 90 dana na istom računaru.

Admin je napravljen da bude što jednostavniji i pristupačan:

- krupan tekst, s izborom veličine (A / A+ / A++) i načinom **visokog kontrasta**
  (pamti se na računaru);
- velika dugmad (najmanje 48 px), sve radi tastaturom i s čitačem ekrana
  (oznake, opisi polja, poruke o greškama sa skokom na polje, `aria-live` obavijesti);
- na početnoj su velike kartice za najčešće radnje: *Objavi javnu nabavku*,
  *Dodaj dokument*, *Objavi obavijest ili konkurs*, *Uredi emisije*;
- dokument se doda klikom ili prevlačenjem, uz traku napretka, a **naziv se upiše sam**
  iz imena fajla;
- izbori (vrsta, godina, kategorija) su velike kartice umjesto padajućih lista;
- nakon čuvanja: ekran „Objavljeno!“ s dugmadima *Pogledaj na stranici* i *Dodaj još*;
- obrisano ide u **korpu** (odmah ima i dugme *Poništi*) i može se vratiti;
- upozorenje ako se stranica zatvori s nesačuvanim promjenama.

Izmjene su na javnoj stranici vidljive odmah (`revalidatePath` nakon svakog čuvanja).

### Gdje su podaci

Sve što CMS mijenja nalazi se u folderu **`podaci/`** (nije u gitu):

```
podaci/
  rtvfbih.db     # baza (sadržaj, historija izmjena, urednici, sesije)
  doc/           # dokumenti (PDF, Word, Excel) – služe se na /doc/<ime>
  mediji/        # slike iz admina – služe se na /mediji/<ime>
```

Pri prvom pokretanju prazna baza se automatski napuni postojećim sadržajem iz
`src/content/` (to je samo početno stanje – poslije se sve uređuje u adminu).
**Folder `podaci/` treba redovno praviti rezervnu kopiju (backup).**

Varijable okruženja (nisu obavezne):

| Varijabla | Značenje |
| --- | --- |
| `CMS_PODACI` | putanja do foldera s podacima (zadano `./podaci`) |
| `NEXT_PUBLIC_DOC_BASE` | adresa s koje se služe dokumenti, ako nisu na istom serveru (zadano `/doc`) |

### Hosting

CMS piše u lokalne fajlove, pa stranica treba **vlastiti Node.js server** (VPS ili server
RTV-a) s trajnim diskom: `npm run build` pa `npm start` (npr. preko PM2 ili systemd),
iza Nginx/Apache reverse proxyja s HTTPS-om. Za upload velikih dokumenata u proxyju
dozvoliti tijelo zahtjeva do 60 MB (`client_max_body_size 60m;`).
Serverless hosting (npr. Vercel) nije pogodan bez vanjske baze i skladišta fajlova.

### Kako je napravljen

```
src/cms/kolekcije.ts      # opis svih vrsta sadržaja → iz njega se prave obrasci u adminu
src/server/db.ts          # baza: zapisi, korpa, redoslijed, historija
src/server/auth.ts        # urednici (scrypt), sesije (kolačić rtv_sesija)
src/server/provjera.ts    # provjera podataka iz obrazaca
src/server/sadrzaj.ts     # javne stranice čitaju sadržaj samo odavde
src/server/pocetni-sadrzaj.ts  # početno punjenje baze
src/app/admin/            # admin (prijava, početna, liste, obrasci, korpa, urednici)
src/app/admin/akcije.ts   # server akcije (čuvanje, brisanje, prijava…)
src/app/api/admin/upload  # upload dokumenata i slika
src/components/admin/     # polja obrazaca, upload, uređivač teksta po dijelovima
```

Nova vrsta sadržaja dodaje se opisom u `src/cms/kolekcije.ts` (polja, naziv, gdje se vidi)
i funkcijom u `src/server/sadrzaj.ts` koju koristi javna stranica.

## Struktura javnog dijela

```
src/
  app/(stranica)/         # javne rute (zaglavlje i podnožje u layout.tsx)
    page.tsx              # početna (hero s brend animacijom)
    o-nama/  televizija/  radio/  frekvencije/  dokumenti/
    javne-nabavke/  obavijesti/  rtv-taksa/  marketing/  kontakt/
  app/doc/  app/mediji/   # služenje dokumenata i slika iz podaci/
  components/             # Header, Footer, Logo, VideoHero, Section, PageHero, DocList…
  content/                # statični tekstovi (historijat, arhiva analogne mreže…) i početni sadržaj
public/video/             # ftv-intro.mp4 / .webm / poster (brend animacija, 5,5 s petlja)
scripts/uvoz-stare-stranice/  # skripte kojima je prenesen sadržaj sa stare stranice
```

## Dizajn

Paleta je izvedena iz brend animacije (`web_video animacija FTV_2.mp4`):
nebesko plava `#87C6DD`, akcentna plava `#2B8DDE`, tamnoplava `#0B2540`.
Tokeni su u `src/app/globals.css` (`@theme`). Fontovi: Montserrat (naslovi, kao u videu)
i Inter (tekst), učitani preko `next/font`.

Video se reproducira automatski, bez zvuka, u petlji, a uz `prefers-reduced-motion`
prikazuje se statični poster.

## Prije objave – provjeriti

- [ ] **Društvene mreže**: provjeriti adrese u adminu → *Osnovni podaci*.
- [ ] **Programska shema**: termini emisija preuzeti s najava sezone 2025/26 – uskladiti
      u adminu → *Emisije i serije*.
- [ ] **Domena** u `site.url` (`src/content/site.ts`; koristi se za sitemap, robots i Open Graph).
- [ ] **Backup** foldera `podaci/` na serveru.
