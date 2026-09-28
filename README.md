# RTV FBiH – nova web stranica

Nova korporativna stranica Radio-televizije Federacije Bosne i Hercegovine (zamjena za
rtvfbih.ba/loc). Stranica pokriva sve **osim vijesti** – vijesti ostaju na federalna.ba.

Stack: **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · lucide-react**.
Sve rute su statičke (SSG), pa se stranica može hostati bilo gdje (Vercel, Node server ili
`next build` + reverse proxy).

## Pokretanje

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # produkcijski build
npm start        # pokretanje produkcijskog builda
npm run lint
```

## Struktura

```
src/
  app/                    # rute (App Router)
    page.tsx              # početna (hero s brend animacijom)
    o-nama/               # historijat, upravni-odbor, organizacija
    televizija/  radio/   # servisi
    frekvencije/          # DVB-T2, FM, arhiva analogne mreže
    dokumenti/            # opći akti, izvještaji, revizije
    javne-nabavke/        # 2026 + arhiva po godinama
    obavijesti/  rtv-taksa/  marketing/  kontakt/
    sitemap.ts robots.ts not-found.tsx
  components/             # Header, Footer, Logo, VideoHero, Section, PageHero, DocList, ContactCard
  content/                # SAV SADRŽAJ – uređujte ovdje, bez diranja komponenti
    site.ts               # naziv, adresa, e-mailovi, vanjski linkovi, navigacija
    historijat.ts  uprava.ts  frekvencije.ts  dokumenti.ts
    javne-nabavke.ts  rtv-taksa.ts  program.ts
public/video/             # ftv-intro.mp4 / .webm / poster (brend animacija, 5,5 s petlja)
```

## Dizajn

Paleta je izvedena iz brend animacije (`web_video animacija FTV_2.mp4`):
nebesko plava `#87C6DD`, akcentna plava `#2B8DDE`, tamnoplava `#0B2540`.
Tokeni su u `src/app/globals.css` (`@theme`). Fontovi: Montserrat (naslovi, kao u videu)
i Inter (tekst), učitani preko `next/font`.

Video se reproducira automatski, bez zvuka, u petlji, a uz `prefers-reduced-motion`
prikazuje se statični poster.

## Prije objave – provjeriti

- [ ] **Logotip**: `src/components/Logo.tsx` sadrži SVG znak nacrtan po uzoru na animaciju.
      Zamijeniti službenim vektorskim logotipom.
- [ ] **Društvene mreže**: linkovi u `src/content/site.ts` označeni s `PROVJERITI`.
- [ ] **Dokumenti**: PDF/DOC linkovi trenutno vode na `rtvfbih.ba/doc/...` (stara stranica).
      Kod migracije prebaciti fajlove u `public/doc/` i ažurirati `legacy` u `site.ts`.
- [ ] **Javne nabavke**: starije godine (2015–2025) vode na arhivu stare stranice.
- [ ] **Programska shema**: termini emisija u `src/content/program.ts` preuzeti s najava
      sezone 2025/26 – uskladiti s aktuelnom shemom.
- [ ] **Domena** u `site.url` (koristi se za sitemap, robots i Open Graph).
