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

### Lokalno preko Dockera (Docker Desktop)

Na računaru ne treba Node – sve radi u kontejneru `rtvfbih-dev`:

```bash
docker compose up -d --build    # prvi put (ili nakon izmjene Dockerfile.dev) → http://localhost:3000
docker compose up -d            # kasnije
docker compose logs -f web      # log servera
docker compose stop             # zaustavi (ništa ne ostaje da radi u pozadini)
docker compose exec web npm install <paket>   # novi paket (package.json se ažurira i na disku)
docker compose exec web npm run lint
docker compose exec web npm run urednik       # novi urednik / nova lozinka
```

- Kod i `podaci/` (baza, dokumenti) su direktno s diska, a izmjene se na stranici vide za
  nekoliko sekundi.
- `node_modules` i `.next` su u Docker volumenima (Linux verzije paketa). Ako nešto zapne:
  `docker compose down -v` pa `docker compose up -d --build`. Podaci u `podaci/` ostaju.
- Docker Desktop na Windowsu ne javlja kontejneru izmjene fajlova, pa se one provjeravaju
  periodično (`WATCHPACK_POLLING`). Turbopack to ne podržava pouzdano, zato razvoj u
  Dockeru koristi webpack (`next dev --webpack`). Produkcijski build je isti.

## CMS – uređivanje sadržaja

Admin je na **`/admin`**. Prijava traje 90 dana na istom računaru; novi urednici se
dodaju u *Urednici i lozinka*.

**Prvi urednik** (dok u bazi nema nijednog):

- na serveru: `npm run urednik` (pita korisničko ime, ime i lozinku); ista komanda
  postavlja novu lozinku ako se zaboravi;
- ili preko weba, uz kod iz varijable `CMS_KOD_ZA_POSTAVLJANJE` (obrazac na `/admin/prijava`
  tada traži taj kod). Bez koda produkcijski server ne dozvoljava pravljenje prvog računa
  preko weba, da ga ne bi napravio neko ko prvi otvori stranicu. U razvoju kod nije potreban.

Zaštita prijave: lozinke su scrypt hash; nakon 5 pogrešnih pokušaja za isto korisničko ime
dozvoljen je jedan pokušaj svakih 30 sekundi, a s iste IP adrese najviše 10 pogrešnih u
15 minuta. Promjena lozinke traži trenutnu lozinku i odjavljuje sve druge uređaje.

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
- **Arhiviraj** sklanja stavku sa stranice bez brisanja (meni *Arhiva* → *Vrati na stranicu*);
  dokument koji je prilog samo arhiviranih stavki ne otvara se ni na direktnu adresu `/doc/…`
  (osim prijavljenom uredniku). Cijele stranice (npr. RTV taksa) arhiviraju se u
  *Arhivirane stranice* – stranica tada vraća 404, a linkovi na nju nestaju;
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
`src/content/` (to je samo početno stanje – poslije se sve uređuje u adminu; u logu servera
piše upozorenje kad se to desi).

### Rezervna kopija (backup)

```bash
npm run backup     # → podaci/backup/rtvfbih-GGGG-MM-DD-SSMM.db (čuva posljednjih 30)
```

Komanda pravi potpunu, provjerenu kopiju baze dok stranica radi. **Ne kopirajte samo fajl
`rtvfbih.db`** dok server radi – dio izmjena može biti u `rtvfbih.db-wal`. Preporuka: cron
svaki dan (`0 3 * * * cd /putanja/do/rtvfbih && npm run backup`) i kopiranje cijelog foldera
`podaci/` (s dokumentima) na drugi disk ili server. Vraćanje: zaustaviti server, kopiju
preimenovati u `podaci/rtvfbih.db` (i obrisati stare `-wal`/`-shm` fajlove), pokrenuti server.

### Varijable okruženja (nisu obavezne)

| Varijabla | Značenje |
| --- | --- |
| `CMS_PODACI` | putanja do foldera s podacima (zadano `./podaci`) |
| `CMS_KOD_ZA_POSTAVLJANJE` | kod s kojim se prvi urednik može napraviti preko weba |

### Hosting

CMS piše u lokalne fajlove, pa stranica treba **vlastiti Node.js server** (VPS ili server
RTV-a) s trajnim diskom: `npm run build` pa `npm start` (npr. preko PM2 ili systemd),
iza Nginx/Apache reverse proxyja s HTTPS-om. Za upload velikih dokumenata u proxyju
dozvoliti tijelo zahtjeva do 60 MB (`client_max_body_size 60m;`).
Proxy treba prosljeđivati stvarnu IP adresu posjetioca u `X-Forwarded-For` (ograničenje
pokušaja prijave) i postaviti HSTS zaglavlje. Ostala sigurnosna zaglavlja postavlja sama
aplikacija (`next.config.ts`). Javne stranice se same obnavljaju svakih sat vremena
(i odmah nakon izmjene u adminu).
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
