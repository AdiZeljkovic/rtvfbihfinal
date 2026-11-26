/**
 * Uputstvo za urednike: isti tekst se prikazuje u adminu (/admin/uputstvo) i od njega se pravi PDF.
 * Slike su u public/uputstvo/<id>.webp; brojevi na slici odgovaraju redoslijedu u `oznake`.
 * U tekstu **ovako** označava natpis dugmeta ili polja kako ga urednik vidi na ekranu.
 */

export type DioUputstva =
  | { t: "p"; tekst: string }
  | { t: "koraci"; stavke: string[] }
  | { t: "lista"; stavke: string[] }
  | { t: "slika"; id: string; opis: string; oznake?: string[] }
  | { t: "savjet"; tekst: string }
  | { t: "pazi"; tekst: string }
  | { t: "tabela"; zaglavlje: [string, string]; redovi: [string, string][] };

export type Poglavlje = { id: string; naslov: string; ukratko: string; dijelovi: DioUputstva[] };

export const UPUTSTVO: Poglavlje[] = [
  {
    id: "pocetak",
    naslov: "Prije početka",
    ukratko: "Šta je admin i jedno pravilo koje treba zapamtiti.",
    dijelovi: [
      { t: "p", tekst: "Admin je dio stranice rtvfbih.ba u kojem sami objavljujete i mijenjate sadržaj: javne nabavke, dokumente, konkurse, emisije, kontakte i ostalo. Ne treba vam nikakav program, samo preglednik (Chrome, Edge, Firefox ili Safari) i vaš korisnički račun." },
      { t: "p", tekst: "Admin se otvara na adresi **rtvfbih.ba/admin**. Radi i na telefonu, ali je na računaru preglednije." },
      { t: "pazi", tekst: "Sve što sačuvate odmah se vidi na javnoj stranici. Nema posebnog odobravanja. Zato prije čuvanja još jednom pogledajte naslov, godinu i dokument." },
      { t: "savjet", tekst: "Ne možete ništa trajno pokvariti. Obrisano ide u korpu i vraća se jednim klikom, a za svaku izmjenu ostaje zapis ko ju je i kada napravio." },
    ],
  },
  {
    id: "prijava",
    naslov: "Prijava i odjava",
    ukratko: "Kako ući u admin, povećati slova i izaći.",
    dijelovi: [
      { t: "slika", id: "prijava", opis: "Ekran za prijavu", oznake: ["Korisničko ime", "Lozinka", "Prikaži lozinku (da provjerite šta ste upisali)", "Dugme Prijavi se", "Veća slova (A+ i A++)", "Jači kontrast"] },
      { t: "koraci", stavke: ["Otvorite **rtvfbih.ba/admin**.", "Upišite korisničko ime i lozinku.", "Kliknite **Prijavi se**."] },
      { t: "p", tekst: "Na tom računaru ostajete prijavljeni 90 dana. Ako koristite tuđi ili zajednički računar, kad završite kliknite **Odjava** u gornjem meniju." },
      { t: "savjet", tekst: "Ako su vam slova sitna, kliknite **A+** ili **A++**. Dugme **Kontrast** pojačava razliku između slova i pozadine. Admin to zapamti na vašem računaru." },
      { t: "pazi", tekst: "Ako pet puta zaredom upišete pogrešnu lozinku, prijava se zaključa na pola minute. Sačekajte i pokušajte ponovo. Ako ste lozinku zaboravili, pogledajte poglavlje „Urednici i lozinka“." },
    ],
  },
  {
    id: "pocetna",
    naslov: "Početna stranica admina",
    ukratko: "Gdje je šta: meni, najčešće radnje i sve rubrike.",
    dijelovi: [
      { t: "slika", id: "pocetna-vrh", opis: "Vrh početne stranice", oznake: ["Početna – odavde uvijek krećete", "Arhiva – sklonjene stavke", "Korpa – obrisane stavke", "Urednici i lozinka", "Pogledaj stranicu – otvara javnu stranicu u novoj kartici", "Uputstvo – ovo uputstvo", "Odjava", "Najčešće radnje – jedan klik do praznog obrasca"] },
      { t: "p", tekst: "Gornji meni je isti na svakom ekranu admina. Ako se izgubite, kliknite **Početna**." },
      { t: "slika", id: "pocetna-rubrike", opis: "Niže na početnoj stranici", oznake: ["Sadržaj stranice – nabavke, dokumenti, konkursi, emisije, tekstovi", "Institucija i kontakti – Upravni odbor, organizacija, marketing, frekvencije", "Osnovni podaci – adresa, telefoni, mreže", "Posljednje promjene – ko je šta i kada promijenio"] },
      { t: "p", tekst: "Kartica pokazuje koliko stavki ima u rubrici. Klik na karticu otvara listu stavki." },
    ],
  },
  {
    id: "obrazac",
    naslov: "Kako se popunjava obrazac",
    ukratko: "Pravila koja važe za svaki obrazac u adminu.",
    dijelovi: [
      { t: "p", tekst: "Bilo šta da dodajete ili mijenjate, obrazac izgleda isto: polja su numerisana redom, a ispod naziva polja piše kratko objašnjenje." },
      { t: "slika", id: "obrazac", opis: "Obrazac za obavijest", oznake: ["Redni broj polja", "„obavezno“ – bez ovoga se ne može sačuvati", "Objašnjenje i primjer", "Sačuvaj i objavi – uvijek dolje na ekranu", "Odustani – izlaz bez čuvanja"] },
      { t: "koraci", stavke: ["Popunite polja redom, odozgo prema dolje.", "Polja na kojima ne piše „obavezno“ možete ostaviti prazna.", "Kliknite **Sačuvaj i objavi** (kod nove stavke) ili **Sačuvaj promjene** (kod izmjene)."] },
      { t: "slika", id: "gotovo", opis: "Poslije čuvanja", oznake: ["Potvrda da je sačuvano", "Pogledaj na stranici – provjerite kako izgleda", "Dodaj još – sljedeća stavka iste vrste", "Nazad na listu"] },
      { t: "savjet", tekst: "Tipka Enter u polju ne objavljuje. Objavljuje se samo klikom na dugme za čuvanje." },
      { t: "p", tekst: "Ako odete s obrasca prije čuvanja (klik na meni, zatvaranje kartice), admin vas pita da li zaista želite otići, da ne izgubite upisano." },
      { t: "slika", id: "greska-polja", opis: "Kad nešto nedostaje", oznake: ["Crveni okvir na vrhu nabraja šta treba ispraviti", "Klik na naziv vodi do tog polja", "Polje s greškom je označeno crveno"] },
    ],
  },
  {
    id: "nabavke",
    naslov: "Objava javne nabavke",
    ukratko: "Plan, obavještenje, odluka ili izvještaj – za manje od minute.",
    dijelovi: [
      { t: "koraci", stavke: ["Na početnoj kliknite **Objavi javnu nabavku**.", "Kliknite **Odaberi dokument sa računara** i odaberite PDF. Možete ga i mišem prevući u isti okvir.", "Sačekajte da traka napretka dođe do kraja. **Naziv dokumenta** se upiše sam iz imena fajla – po potrebi ga ispravite.", "Kliknite **Vrstu objave** (npr. „Odluke o izboru“) i **Godinu**.", "Ako želite, upišite **Postupak** (npr. broj postupka ili „Otvoreni postupak“).", "Kliknite **Sačuvaj i objavi**."] },
      { t: "slika", id: "nabavka", opis: "Popunjen obrazac javne nabavke", oznake: ["Dodani dokument: Otvori (pogledajte ga), Zamijeni, Ukloni", "Naziv – upisan sam, može se mijenjati", "Vrsta objave", "Godina", "Postupak (nije obavezno) – prikazuje se sitno iznad naziva", "Sačuvaj i objavi"] },
      { t: "p", tekst: "Nova nabavka se pojavi na vrhu svoje godine i vrste na stranici **Javne nabavke**, a najnovija i na naslovnoj stranici." },
      { t: "savjet", tekst: "Kad imate više dokumenata, poslije čuvanja kliknite **Dodaj još javnu nabavku** – otvara se novi prazan obrazac." },
      { t: "pazi", tekst: "Ako je dokument već objavljen, nemojte ga objavljivati ponovo. Pretražite listu (poglavlje „Pronalaženje, izmjena i redoslijed“) i, ako treba, zamijenite dokument u postojećoj stavci." },
    ],
  },
  {
    id: "dokumenti",
    naslov: "Dodavanje dokumenta",
    ukratko: "Izvještaji, pravilnici, planovi, cjenovnici i dokumenti Upravnog odbora.",
    dijelovi: [
      { t: "koraci", stavke: ["Na početnoj kliknite **Dodaj dokument**.", "Dodajte fajl (PDF, Word ili Excel) – naziv se upiše sam.", "Pod **Gdje ga prikazati** kliknite rubriku: npr. „Izvještaji o radu“, „Cjenovnici“ ili „Upravni odbor“.", "Kliknite **Sačuvaj i objavi**."] },
      { t: "slika", id: "dokument", opis: "Novi dokument", oznake: ["Dokument", "Naziv koji posjetioci vide", "Rubrika u kojoj se prikazuje", "Umjesto fajla: adresa stranice (rijetko treba)"] },
      { t: "tabela", zaglavlje: ["Rubrika", "Gdje se dokument vidi"], redovi: [["Zakoni i statut, Uređivačka načela, Pravilnici, Programski planovi, Izvještaji o radu, Revizorski izvještaji", "Stranica Dokumenti"], ["Upravni odbor", "Stranica O nama → Upravni odbor"], ["Cjenovnici", "Stranica Marketing (i kartice kanala oglašavanja)"], ["Radio", "Stranica Radio"]] },
      { t: "savjet", tekst: "Cjenovnici: u naziv upišite godinu, npr. „Cjenovnik usluga oglašavanja – Radio Federacije BiH 2027.“ Kartice „Televizija, Radio, Portal, Teletekst“ same vode na cjenovnik s najnovijom godinom, a natpis „Cjenovnici 2027.“ se promijeni sam." },
    ],
  },
  {
    id: "obavijesti",
    naslov: "Obavijest, konkurs ili oglas za posao",
    ukratko: "Objava s jednim ili više priloga i rokom za prijave.",
    dijelovi: [
      { t: "koraci", stavke: ["Na početnoj kliknite **Objavi obavijest ili konkurs**.", "Upišite **Naslov**. **Datum objave** je već današnji.", "Ako treba, upišite kratak **Tekst obavijesti**. Prazan red pravi novi pasus.", "Pod **Prilozi** dodajte dokumente. Možete odabrati više fajlova odjednom (držite Ctrl dok klikate).", "Ako konkurs ima rok, odaberite **Rok za prijave**.", "Kliknite **Sačuvaj i objavi**."] },
      { t: "slika", id: "obavijest", opis: "Konkurs s dva priloga", oznake: ["Naslov", "Datum objave", "Tekst (nije obavezno)", "Dodani prilozi – naziv priloga se može ispraviti", "Dodavanje još priloga", "Rok za prijave"] },
      { t: "p", tekst: "Na stranici piše „Prijave do …“, a kad rok prođe, sama se promijeni u „Rok istekao“. Ništa ne morate brisati." },
      { t: "savjet", tekst: "Više oglasa istog dana možete objaviti kao jednu obavijest s više priloga. Odjednom se može dodati do 100 fajlova; svaki može imati najviše 60 MB." },
    ],
  },
  {
    id: "emisije",
    naslov: "Emisije i serije",
    ukratko: "Termini, opisi, slike i šta se vidi na naslovnoj stranici.",
    dijelovi: [
      { t: "p", tekst: "Na početnoj kliknite **Uredi emisije**. Otvara se lista svih emisija; klik na **Uredi** otvara emisiju, a **Dodaj emisiju** pravi novu." },
      { t: "slika", id: "emisija-1", opis: "Gornji dio obrasca emisije", oznake: ["Naziv emisije", "Gdje pripada (grupa na stranici Emisije i serije)", "Vrsta programa", "Termin emitovanja", "Kratak opis za kartice i programsku shemu"] },
      { t: "p", tekst: "**Termin** upišite kako ga gledaoci čitaju, npr. „Petkom u 18:20“ ili „Radnim danima u 19.30“. Emisija s terminom se sama pojavi u programskoj shemi na stranici Televizija, poredana po vremenu." },
      { t: "slika", id: "emisija-2", opis: "Donji dio obrasca emisije", oznake: ["Slika (najava) – JPG, PNG ili WEBP", "Logo emisije (nije obavezno)", "Prikaži na naslovnoj stranici", "Glavna emisija – velika kartica na naslovnoj", "Ovo je serija", "Opširni opis za stranicu emisije"] },
      { t: "p", tekst: "Prekidači **DA / NE**: klik mijenja stanje. Tamno dugme s natpisom DA znači uključeno." },
      { t: "pazi", tekst: "Dvije različite stvari: grupa **Arhiva emisija** ostavlja stranicu emisije vidljivom u arhivskom dijelu (bez termina u shemi). Dugme **Arhiviraj** na listi potpuno sklanja emisiju sa stranice." },
    ],
  },
  {
    id: "tekstovi",
    naslov: "Duži tekstovi",
    ukratko: "Pravilnici, statut, upute i drugi tekstovi s naslovima, slikama i tabelama.",
    dijelovi: [
      { t: "p", tekst: "Duži tekst se slaže od dijelova: pasus, podnaslov, lista dokumenata i linkova, slika ili tabela. Dodajete ih redom, a možete ih pomjerati i brisati." },
      { t: "slika", id: "tekst-dijelovi", opis: "Tekst s dva dijela", oznake: ["Dugmad za dodavanje novog dijela", "Gore / Dolje – pomjeranje dijela", "Ukloni dio", "Polje za tekst pasusa"] },
      { t: "koraci", stavke: ["Otvorite **Duži tekstovi** i kliknite **Dodaj tekst**.", "Upišite **Naslov**.", "Kliknite **Tekst (pasus)** i upišite tekst. Za sljedeći pasus kliknite ponovo.", "Za međunaslov kliknite **Podnaslov**, za PDF-ove **Dokumenti i linkovi**.", "Kliknite **Sačuvaj i objavi**."] },
      { t: "savjet", tekst: "Novi tekst dobije svoju adresu. Poslije čuvanja dugme **Pogledaj na stranici** pokazuje gdje je. Ako ga treba i u listi na stranici Dokumenti, dodajte ga kao dokument s tom adresom (poglavlje „Dodavanje dokumenta“, polje „adresa stranice“)." },
    ],
  },
  {
    id: "pitanja",
    naslov: "RTV taksa – pitanja i odgovori",
    ukratko: "Pitanja građana na stranici RTV taksa.",
    dijelovi: [
      { t: "koraci", stavke: ["Otvorite **RTV taksa – pitanja** i kliknite **Dodaj pitanje** (ili **Uredi** kod postojećeg).", "Upišite **Pitanje** i **Odgovor**. Prazan red u odgovoru pravi novi pasus.", "Kliknite **Sačuvaj i objavi**."] },
      { t: "p", tekst: "Redoslijed pitanja na stranici mijenjate strelicama na listi (poglavlje „Pronalaženje, izmjena i redoslijed“). Telefoni i rukovodilac u okviru „Imate pitanje o taksi?“ uređuju se u Organizaciji, kod **Odjela RTV takse**." },
    ],
  },
  {
    id: "organizacija",
    naslov: "Organizacija i kontakti",
    ukratko: "Sektori, odjeli, redakcije i osobe – i kontakti na stranicama Kontakt, Radio i RTV taksa.",
    dijelovi: [
      { t: "p", tekst: "Ovdje je cijela organizacija sa stranice **O nama → Organizacija**. Iz istih podataka se pune i kontakti na stranicama **Kontakt**, **Radio** i **RTV taksa** – zato kontakt mijenjate samo na jednom mjestu." },
      { t: "slika", id: "organizacija", opis: "Odjel RTV takse", oznake: ["Naziv", "Pripada pod – sektor ili odjel iznad", "Telefon (više brojeva odvojite zarezom)", "E-mail", "Osobe – ime, uloga, telefon, e-mail", "Kartica na stranici Kontakt", "Prikazuje se i na stranici Radio ili RTV taksa"] },
      { t: "koraci", stavke: ["Promjena osobe: otvorite jedinicu, u listi **Osobe** ispravite ime ili dodajte novu osobu, pa sačuvajte.", "Nova redakcija ili odjel: kliknite **Dodaj sektor ili odjel**, upišite naziv i pod **Pripada pod** odaberite kome pripada.", "Ako se dva odjela isto zovu, u listi **Pripada pod** u zagradi piše kome pripadaju."] },
      { t: "tabela", zaglavlje: ["Polje", "Šta radi"], redovi: [["Kartica na stranici Kontakt", "Ako upišete kratak naziv (npr. „Marketing“), jedinica se pojavi među „Direktnim kontaktima“ na stranici Kontakt, s telefonom i e-mailom. Prazno = nije na stranici Kontakt."], ["Prikazuje se i na stranici: Radio", "Prva osoba je odgovorna urednica, a odjeli ispod su redakcije na stranici Radio."], ["Prikazuje se i na stranici: RTV taksa", "Telefoni i prva osoba se prikazuju u okviru za pitanja na stranici RTV taksa."]] },
      { t: "pazi", tekst: "Za Radio i za RTV taksu označite samo po jednu jedinicu." },
    ],
  },
  {
    id: "ostalo",
    naslov: "Upravni odbor, marketing i frekvencije",
    ukratko: "Manje rubrike koje se rijetko mijenjaju.",
    dijelovi: [
      { t: "tabela", zaglavlje: ["Rubrika u adminu", "Šta se uređuje"], redovi: [["Upravni odbor – članovi", "Ime, uloga, koga predstavlja i mandat svakog člana."], ["Upravni odbor – saopštenje", "Uvodni tekst, naslov, tekst i potpis saopštenja na stranici Upravni odbor. Novo saopštenje zamjenjuje staro."], ["Marketing – kontakti", "Osobe Sektora marketinga i odjela prodaje sa stranice Marketing."], ["FM frekvencije", "Predajnici Radija Federacije BiH: lokacija, frekvencija i područje."], ["DVB-T2 regije", "Digitalne regije i kanali na stranici Frekvencije."]] },
      { t: "p", tekst: "Sve ove rubrike rade isto kao ostale: **Uredi** mijenja stavku, **Dodaj** pravi novu, strelice mijenjaju redoslijed." },
    ],
  },
  {
    id: "osnovno",
    naslov: "Osnovni podaci i arhivirane stranice",
    ukratko: "Adresa, telefoni, generalni direktor, društvene mreže i privremeno sklanjanje cijele stranice.",
    dijelovi: [
      { t: "slika", id: "osnovno", opis: "Osnovni podaci", oznake: ["Adresa i glavni telefon (podnožje, Kontakt, meni na telefonu)", "E-mail adrese", "Generalni direktor i njegov telefon (Kontakt i O nama)", "Društvene mreže (ikone u podnožju)"] },
      { t: "savjet", tekst: "Mrežu koju ne želite prikazati samo obrišite iz polja i sačuvajte – ikona nestaje. Adresu možete upisati i bez „https://“." },
      { t: "p", tekst: "**Arhivirane stranice** služe da cijelu stranicu privremeno sklonite (trenutno je moguće za stranicu RTV taksa). Uključite prekidač i sačuvajte: stranica i svi linkovi na nju nestaju, a sadržaj ostaje sačuvan. Isključite prekidač da se vrati." },
      { t: "slika", id: "stranice", opis: "Arhivirane stranice", oznake: ["Prekidač: DA = stranica se ne prikazuje"] },
    ],
  },
  {
    id: "liste",
    naslov: "Pronalaženje, izmjena i redoslijed",
    ukratko: "Pretraga, filter, uređivanje postojeće stavke i pomjeranje gore-dolje.",
    dijelovi: [
      { t: "slika", id: "lista", opis: "Lista javnih nabavki", oznake: ["Dodaj novu stavku", "Pretraga – upišite dio naziva", "Filter (npr. godina)", "Uredi", "Pogledaj na stranici", "Arhiviraj – skloni sa stranice", "Obriši – u korpu"] },
      { t: "koraci", stavke: ["Upišite dio naziva u **Pretragu** – lista se suzi dok kucate.", "Kliknite **Uredi**, ispravite i kliknite **Sačuvaj promjene**."] },
      { t: "slika", id: "redoslijed", opis: "Strelice za redoslijed", oznake: ["Pomjeri gore / Pomjeri dolje"] },
      { t: "p", tekst: "Redoslijed na listi je isti kao na stranici. Strelice se vide samo kad je pretraga prazna i filter na „Sve“." },
      { t: "pazi", tekst: "Ako dok mijenjate stavku neko drugi sačuva istu stavku, admin vas upozori prije čuvanja (poglavlje „Kad nešto ne ide“)." },
    ],
  },
  {
    id: "brisanje",
    naslov: "Arhiva, korpa i brisanje",
    ukratko: "Kako skloniti stavku i kako je vratiti.",
    dijelovi: [
      { t: "tabela", zaglavlje: ["Dugme", "Šta se dešava"], redovi: [["Arhiviraj", "Stavka nestaje sa stranice, ali ostaje u meniju Arhiva. Koristite za ono što je zastarjelo, a treba ga sačuvati."], ["Obriši", "Stavka ide u Korpu i nestaje sa stranice. Iz korpe se vraća jednim klikom."], ["Obriši zauvijek (u korpi)", "Stavka se trajno briše. Ovo se ne može vratiti."]] },
      { t: "slika", id: "brisanje-potvrda", opis: "Admin uvijek pita prije brisanja", oznake: ["Šta se briše", "Da, obriši", "Ne, vrati se"] },
      { t: "savjet", tekst: "Odmah poslije brisanja ili arhiviranja na listi se pojavi dugme **Poništi** – jedan klik i stavka je vraćena." },
      { t: "slika", id: "korpa", opis: "Korpa", oznake: ["Vrati na stranicu", "Obriši zauvijek"] },
      { t: "p", tekst: "Arhiva izgleda isto kao korpa: dugme **Vrati na stranicu** vraća stavku tamo gdje je bila." },
      { t: "savjet", tekst: "Dokumenti arhiviranih i obrisanih stavki više se ne mogu otvoriti ni preko direktnog linka. Ako ste greškom objavili pogrešan dokument, dovoljno ga je obrisati ili zamijeniti." },
    ],
  },
  {
    id: "urednici",
    naslov: "Urednici i lozinka",
    ukratko: "Promjena lozinke i ko sve može uređivati stranicu.",
    dijelovi: [
      { t: "slika", id: "urednici", opis: "Urednici i lozinka", oznake: ["Promjena vlastite lozinke", "Ko može uređivati stranicu", "Dodavanje novog urednika"] },
      { t: "koraci", stavke: ["Nova lozinka: upišite trenutnu, pa dva puta novu (najmanje 8 znakova) i kliknite **Promijeni lozinku**.", "Novi kolega: upišite ime i prezime, korisničko ime i početnu lozinku, kliknite **Dodaj urednika** i lozinku mu predajte lično. Neka je odmah promijeni.", "Kolega koji više ne uređuje: kliknite **Ukloni** pored njegovog imena."] },
      { t: "pazi", tekst: "Zaboravljena lozinka: kolega koji je prijavljen može vas ukloniti i ponovo dodati s novom lozinkom. Ako niko nije prijavljen, javite se tehničkoj podršci." },
      { t: "savjet", tekst: "Svako ima svoj račun. Ne dijelite lozinku – tako se u „Posljednjim promjenama“ vidi ko je šta uradio." },
    ],
  },
  {
    id: "problemi",
    naslov: "Kad nešto ne ide",
    ukratko: "Poruke koje se mogu pojaviti i šta tada uraditi.",
    dijelovi: [
      { t: "slika", id: "sukob", opis: "Neko drugi je u međuvremenu sačuvao istu stavku", oznake: ["Ko je i kada sačuvao", "Otvori najnoviju verziju (u novoj kartici)", "Ipak sačuvaj moje izmjene"] },
      { t: "p", tekst: "Pogledajte najnoviju verziju. Ako je vaša tačna, kliknite **Ipak sačuvaj moje izmjene**. Ako nije, osvježite stranicu i unesite svoju izmjenu ponovo." },
      { t: "slika", id: "istekla", opis: "Prijava je istekla dok ste radili", oznake: ["Prijavite se u novom prozoru, vratite se i ponovo kliknite isto dugme – ništa nije izgubljeno"] },
      { t: "tabela", zaglavlje: ["Poruka ili problem", "Šta uraditi"], redovi: [["„Fajl je prevelik. Najviše 60 MB.“", "Smanjite PDF (npr. „Save as – Reduced size PDF“) ili ga podijelite na dva dijela."], ["„Odaberite PDF, Word ili Excel dokument.“", "Fajl je druge vrste (npr. slika ili ZIP). Sačuvajte ga kao PDF."], ["Izmjena se ne vidi na stranici", "Osvježite stranicu u pregledniku (tipka F5). Ako se ni poslije minute ne vidi, javite se podršci."], ["Ne mogu naći stavku", "Provjerite filter (npr. godinu) i pretragu, pa Arhivu i Korpu."], ["„Nešto nije u redu. Osvježite stranicu…“", "Pritisnite F5 i pokušajte ponovo. Ako se ponovi, javite se podršci i recite šta ste radili."]] },
    ],
  },
  {
    id: "mapa",
    naslov: "Gdje se šta vidi na stranici",
    ukratko: "Koja rubrika admina puni koju stranicu.",
    dijelovi: [
      { t: "tabela", zaglavlje: ["Rubrika u adminu", "Stranica"], redovi: [["Javne nabavke", "Javne nabavke (po godinama) i naslovna (najnovija)"], ["Obavijesti i konkursi", "Obavijesti i konkursi"], ["Dokumenti", "Dokumenti, Upravni odbor, Marketing (cjenovnici), Radio"], ["Emisije i serije", "Televizija, Emisije i serije, stranica svake emisije, naslovna"], ["RTV taksa – pitanja", "RTV taksa"], ["Duži tekstovi", "Svaki tekst na svojoj adresi (Pogledaj na stranici)"], ["Upravni odbor – članovi i saopštenje", "O nama → Upravni odbor"], ["Organizacija i kontakti", "O nama → Organizacija, Kontakt, Radio, RTV taksa"], ["Marketing – kontakti", "Marketing i naslovna"], ["FM frekvencije", "Radio i Frekvencije"], ["DVB-T2 regije", "Frekvencije i Televizija"], ["Osnovni podaci", "Podnožje svih stranica, Kontakt, O nama, meni na telefonu"]] },
    ],
  },
  {
    id: "ne-moze",
    naslov: "Šta se ne mijenja u adminu",
    ukratko: "Dijelovi stranice koje mijenja tehnička podrška.",
    dijelovi: [
      { t: "p", tekst: "Neki dijelovi su dio izgleda stranice i ne mijenjaju se kroz admin. Za njih se javite tehničkoj podršci:" },
      { t: "lista", stavke: ["glavni meni i podnožje (nazivi i redoslijed linkova),", "veliki naslovi, uvodni tekstovi i brojke na vrhu stranica,", "historijat na stranici O nama,", "izgled stranice, boje i logo,", "nove rubrike za dokumente i nove vrste sadržaja."] },
      { t: "savjet", tekst: "Kad niste sigurni gdje se nešto mijenja, otvorite tu stranicu, pogledajte tabelu „Gdje se šta vidi na stranici“ ili pitajte podršku – brže je nego tražiti." },
    ],
  },
];

/** Rubrika admina → poglavlje uputstva (link „Uputstvo za ovaj dio“) */
export const POGLAVLJE_KOLEKCIJE: Record<string, string> = {
  nabavke: "nabavke",
  dokumenti: "dokumenti",
  obavijesti: "obavijesti",
  emisije: "emisije",
  tekstovi: "tekstovi",
  pitanja: "pitanja",
  jedinice: "organizacija",
  "upravni-odbor": "ostalo",
  "uo-saopstenje": "ostalo",
  marketing: "ostalo",
  fm: "ostalo",
  dvb: "ostalo",
  osnovno: "osnovno",
  stranice: "osnovno",
};

export const PDF_UPUTSTVA = "/uputstvo/Uputstvo-za-urednike-RTVFBiH.pdf";
