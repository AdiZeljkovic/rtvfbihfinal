"""Uvoz kompletnog sadržaja stare stranice u novu (JSON + slike + spisak dokumenata)."""
import json, os, re, shutil, sys, unicodedata, urllib.parse, urllib.request, time

T = r"./scripts/uvoz-stare-stranice"
sys.path.insert(0, T)
from sadrzaj import celija
from blokovi import blokovi, doc_href, wbf, cisto

D = r"./scripts/uvoz-stare-stranice/podaci"
OLD = r"../RTV OLD"
NEW = r"."
OUTC = os.path.join(NEW, "src", "content", "arhiva")
OUTI = os.path.join(NEW, "public", "arhiva")
os.makedirs(OUTC, exist_ok=True)
os.makedirs(OUTI, exist_ok=True)
pages = {x["id"]: x for x in json.load(open(os.path.join(D, "pages.json"), encoding="utf-8"))}


def slug(s):
    s = unicodedata.normalize("NFD", s.replace("đ", "d").replace("Đ", "D"))
    s = "".join(c for c in s if not unicodedata.combining(c)).lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")[:70]


# ── nove adrese za stare stranice ─────────────────────────────────────────
GODINE = {450: 2015, 456: 2016, 476: 2017, 494: 2018, 522: 2019, 538: 2020, 557: 2021, 583: 2022, 635: 2023, 662: 2024, 696: 2025, 734: 2026}
TEKSTOVI = [
    # (wbf, ruta, naslov, nadnaslov)
    (25, "/dokumenti/zakon-o-javnom-rtv-sistemu", "Zakon o Javnom radiotelevizijskom sistemu Bosne i Hercegovine", "Opći akti"),
    (206, "/dokumenti/zakon-o-rtvfbih", "Zakon o Javnom servisu Radio-televizije Federacije Bosne i Hercegovine", "Opći akti"),
    (171, "/dokumenti/statut", "Statut Radio-televizije Federacije Bosne i Hercegovine", "Opći akti"),
    (173, "/dokumenti/uredjivacka-nacela", "Uređivačka načela Javnog radiotelevizijskog sistema", "Opći akti · bosanski jezik"),
    (175, "/dokumenti/uredjivacka-nacela-hrvatski", "Uređivačka načela Javnog radiotelevizijskog sustava", "Opći akti · hrvatski jezik"),
    (174, "/dokumenti/uredjivacka-nacela-srpski", "Uređivačka načela Javnog radiotelevizijskog sistema", "Opći akti · srpski jezik"),
    (169, "/dokumenti/izvjestaj-o-radu-2007", "Izvještaj o radu RTVFBiH u 2007. godini i proširena Informacija o stanju u RTVFBiH", "Izvještaji o radu"),
    (713, "/frekvencije/dvb-t2", "DVB-T2/MPEG-4 zemaljska digitalna televizija", "Prijem signala"),
    (29, "/marketing/cjenovnik-teletext", "Cjenovnik oglašavanja na Teletekstu", "Marketing"),
    (30, "/marketing/cjenovnik-web", "Cjenovnik web oglašavanja", "Marketing"),
    (264, "/marketing/izbori-2010-ftv", "Cjenovnik oglašavanja političkih subjekata – Izbori 2010., Federalna televizija", "Marketing · arhiva"),
    (265, "/marketing/izbori-2010-radio", "Cjenovnik oglašavanja političkih subjekata – Izbori 2010., Radio Federacije BiH", "Marketing · arhiva"),
    (21, "/o-nama/historijat", "Historijat Radio-televizije Federacije Bosne i Hercegovine", "O nama · izvorni tekst"),
]
EMISIJE_GRUPE = {
    "Aktuelna sezona": [615, 721, 722, 723, 725, 727, 729, 678, 679, 680],
    "Emisije Federalne televizije": [587, 155, 260, 607, 216, 682, 468, 681, 565, 413, 505, 442, 325, 525],
    "Strani program": [316, 391, 405, 406, 414, 419, 424, 430, 448],
    "Arhiva emisija": [393, 320, 341, 364, 369, 370, 372, 373, 376, 394, 395, 399, 400, 401, 421, 449, 463, 469, 477, 480, 481],
}
LOGO = {155: "U4A1CD09_Dnevnik-2--167x50 - NOVA 1.jpg", 260: "UC49EB4_Dnevnik-3--167x50 - NOVA 1.jpg", 325: "Super Loto.jpg",
        413: "U3FEE3AA_Zelena-panorama--(167x50).jpg", 442: "hajd-logo.jpg", 468: "U54D91_Mreža, politički magazin.jpg",
        505: "Mozaik religija.jpg", 525: "TV BINGO 1.jpg", 565: "U10F8585_Plenum, dijaloška emisija.jpg",
        587: "U152F306_Dnevnik-1--167x50 - NOVA 1.jpg", 607: "Dnevnik D.jpg", 681: "U21D4775_Svijet, vanjskopolitički magazin.jpg",
        682: "U5C624A0_Sport, sportski magazin.jpg", 216: "U3377E3F_Federacija-danas-NOVA-167x50.jpg"}
NAJAVA = {729: "u žensko ime, obrazovni serijal najava.jpg", 727: "nađi pronađi najava.jpg", 725: "znzkvi kviz najava druga sezona.jpg",
          723: "in music plus, muzički program, najava.jpg", 722: "kuglanje, zabavni program najava.jpg", 721: "nedjeljno popodne.jpg",
          679: "U457EC7B_svako-dobro.jpg", 678: "art kvart nova najava.jpg", 615: "jutarnji program nova slika.JPG", 680: "U5A6C7E1_pretežno-vedro.jpg"}

RUTE = {w: r for w, r, _, _ in TEKSTOVI}
RUTE.update({w: f"/javne-nabavke/{g}" for w, g in GODINE.items()})
RUTE.update({447: "/javne-nabavke", 166: "/dokumenti", 191: "/o-nama/upravni-odbor", 31: "/kontakt", 49: "/kontakt", 39: "/rtv-taksa",
             24: "/frekvencije", 210: "/radio#frekvencije", 220: "/marketing#cjenovnici", 221: "/marketing#cjenovnici", 27: "/marketing#kontakti",
             56: "/televizija/emisije#strani-program", 2: "/televizija/emisije", 1: "/televizija", 50: "/televizija",
             26: "/obavijesti", 21: "/o-nama/historijat"})
EMISIJA_SLUG = {}
for grupa, ids in EMISIJE_GRUPE.items():
    for w in ids:
        n = pages[w]["naslov"]
        EMISIJA_SLUG[w] = slug(re.sub(r"^Serija\s*-\s*", "", n))
        RUTE[w] = f"/televizija/emisije/{EMISIJA_SLUG[w]}"

# ── slike ─────────────────────────────────────────────────────────────────
SLIKE = {}


def slika(src):
    if not src:
        return None
    p = urllib.parse.unquote(src.replace("&amp;", "&")).strip()
    p = re.sub(r"^https?://(www\.)?rtvfbih\.ba", "", p)
    p = p.replace("../", "/")
    if not p.startswith("/"):
        p = "/loc/" + p
    if p in SLIKE:
        return SLIKE[p]
    lok = os.path.join(OLD, p.lstrip("/"))
    ime = slug(os.path.splitext(os.path.basename(p))[0]) + os.path.splitext(p)[1].lower()
    cilj = os.path.join(OUTI, ime)
    if not os.path.exists(cilj):
        if os.path.exists(lok):
            shutil.copy2(lok, cilj)
        else:
            try:
                u = "https://rtvfbih.ba" + urllib.parse.quote(p)
                data = urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=30).read()
                time.sleep(0.3)
                # stari server za nepostojeću sliku vraća naslovnu (HTML) – to nije slika
                if not (data[:3] == b"\xff\xd8\xff" or data[:8] == b"\x89PNG\r\n\x1a\n" or data[:4] in (b"GIF8", b"RIFF")):
                    raise ValueError("slika ne postoji na serveru")
                open(cilj, "wb").write(data)
            except Exception as e:
                print("   slika nedostaje:", p, e)
                SLIKE[p] = None
                return None
    SLIKE[p] = "/arhiva/" + ime
    return SLIKE[p]


# ── linkovi ───────────────────────────────────────────────────────────────
DOKUMENTI = set()


def link(h):
    d = doc_href(h)
    if d:
        DOKUMENTI.add(d)
        return {"doc": d}
    w = wbf(h)
    if w is not None:
        return {"ruta": RUTE[w]} if w in RUTE else {}
    h = (h or "").strip()
    if h.startswith(("mailto:", "http://", "https://")) and not re.match(r"https?://(www\.)?rtvfbih\.ba/(loc|doc)", h):
        return {"href": h}
    return {}


VELIKA = {"LOT", "EFP", "ENG", "IP", "IPP", "RTV", "FTV", "TV", "PDV", "ODU", "CPP", "MZ", "SBB", "HD", "TTX", "JN", "II", "III", "IV", "VI",
          "RAK", "BH", "BHRT", "RTRS", "IT", "USB", "UPS", "LED", "PC", "OB", "SNG", "DSNG", "IPTV", "WEB", "R&S", "N&N", "VII", "VIII", "IX", "XI", "XII"}


def recenica(t):
    """VELIKA SLOVA → rečenica, uz očuvane skraćenice (samo za tekst koji je pretežno velikim slovima)."""
    slova = [c for c in t if c.isalpha()]
    if not slova or sum(c.isupper() for c in slova) / len(slova) < 0.75:
        return t
    rijeci = []
    for w in t.split(" "):
        gola = re.sub(r"[^\w&]", "", w)
        rijeci.append(w if gola.upper() in VELIKA else w.lower())
    s = " ".join(rijeci)
    s = re.sub(r"\bfbih\b", "FBiH", s, flags=re.I)
    s = re.sub(r"\bbih\b", "BiH", s, flags=re.I)
    s = re.sub(r"\brtvfbih\b", "RTVFBiH", s, flags=re.I)
    s = re.sub(r"\bjanuar|februar|mart|april|maj|juni|juli|august|septembar|oktobar|novembar|decembar\b", lambda m: m.group(0), s)
    m = re.search(r"[a-zčćšžđ]", s)
    if m:
        s = s[: m.start()] + s[m.start()].upper() + s[m.start() + 1 :]
    return s


def prevedi(bl):
    out = []
    for b in bl:
        if b["t"] == "linkovi":
            st = []
            for s in b["stavke"]:
                l = link(s["href"])
                if l:
                    st.append({"tekst": s["tekst"], **l})
                elif s["tekst"]:
                    st.append({"tekst": s["tekst"]})
            if st:
                out.append({"t": "linkovi", "prefiks": b["prefiks"], "stavke": st})
        elif b["t"] == "slika":
            src = slika(b["src"])
            if src:
                x = {"t": "slika", "src": src}
                if b.get("href"):
                    l = link(b["href"])
                    if l.get("ruta"):
                        x["ruta"] = l["ruta"]
                    elif l.get("doc"):
                        x["doc"] = l["doc"]
                out.append(x)
        else:
            out.append(b)
    return out


# ── 1. tekstovi ───────────────────────────────────────────────────────────
tekstovi = {}
for w, ruta, naslov, nad in TEKSTOVI:
    bl = prevedi(blokovi(celija(w)))
    # izbaci početni naslov koji samo ponavlja ime stranice
    while bl and bl[0]["t"] in ("naslov", "pasus") and len(bl[0]["tekst"]) < 120 and slug(bl[0]["tekst"])[:20] in slug(naslov):
        bl.pop(0)
    tekstovi[ruta] = {"wbf": w, "ruta": ruta, "naslov": naslov, "nadnaslov": nad, "blokovi": bl}
    print(f"tekst {w:>4} {ruta:<45} {len(bl)} blokova")

# ── 2. javne nabavke ──────────────────────────────────────────────────────
def stavka_liste(b):
    """Red je stavka nabrajanja: „1.“ / „-“ ispred linka ili na početku teksta linka."""
    p = (b.get("prefiks") or "").strip()
    prvi = b["stavke"][0]["tekst"] if b.get("stavke") else ""
    return bool(re.match(r"^(\d+\.?|[-–•])$", p) or re.match(r"^(\d+\.|[-–•])\s", prvi))



nabavke = {}
for w, god in GODINE.items():
    sekcije, sek, grupa = [], None, None
    bl = blokovi(celija(w))
    for i, b in enumerate(bl):
        if b["t"] == "naslov":
            sek = {"naslov": recenica(b["tekst"].rstrip(":").strip()), "stavke": []}
            sekcije.append(sek)
            grupa = None
        elif b["t"] == "pasus":
            sljedeci = bl[i + 1] if i + 1 < len(bl) else None
            # pasus je naziv grupe samo ako ga prate numerisane stavke („1. …“)
            if sljedeci and sljedeci["t"] == "linkovi" and stavka_liste(sljedeci):
                grupa = recenica(b["tekst"].rstrip(":").strip())
            else:
                grupa = None
                if sek is None:
                    sek = {"naslov": "Objave", "stavke": []}
                    sekcije.append(sek)
                sek.setdefault("napomene", []).append(b["tekst"])
        elif b["t"] == "linkovi":
            if not stavka_liste(b):
                grupa = None
            for s in b["stavke"]:
                d = doc_href(s["href"])
                if not d:
                    continue
                DOKUMENTI.add(d)
                if sek is None:
                    sek = {"naslov": "Objave", "stavke": []}
                    sekcije.append(sek)
                tekst = re.sub(r"^\d+\.\s*", "", s["tekst"]).strip(" -–") or d
                x = {"tekst": recenica(tekst), "doc": d}
                if grupa:
                    x["grupa"] = grupa
                sek["stavke"].append(x)
    sekcije = [s for s in sekcije if s["stavke"]]
    nabavke[god] = {"godina": god, "wbf": w, "sekcije": sekcije}
    print(f"nabavke {god}: {len(sekcije)} sekcija, {sum(len(s['stavke']) for s in sekcije)} dokumenata")

# ── 3. FAQ ────────────────────────────────────────────────────────────────
faq, cur = [], None
for b in blokovi(celija(39)):
    if b["t"] in ("naslov", "pasus") and b["tekst"].startswith("›"):
        cur = {"pitanje": b["tekst"].lstrip("› ").strip(), "odgovor": []}
        faq.append(cur)
    elif cur and b["t"] in ("pasus", "naslov"):
        cur["odgovor"].append(b["tekst"])
print("FAQ pitanja:", len(faq))

# ── 4. emisije ────────────────────────────────────────────────────────────
emisije = []
for grupa, ids in EMISIJE_GRUPE.items():
    for w in ids:
        naslov = pages[w]["naslov"].strip()
        bl = prevedi(blokovi(celija(w)) if os.path.exists(os.path.join(D, "html", f"{w}.html")) else [])
        while bl and bl[0]["t"] in ("naslov", "pasus") and slug(bl[0]["tekst"]) and slug(bl[0]["tekst"])[:15] in slug(naslov):
            bl.pop(0)
        naslovna = slika("/uimages/" + NAJAVA[w]) if w in NAJAVA else None
        if not naslovna:
            prva = next((b for b in bl if b["t"] == "slika"), None)
            if prva:
                naslovna = prva["src"]
                bl.remove(prva)
        logo = slika("/uimages/" + LOGO[w]) if w in LOGO else None
        emisije.append({
            "slug": EMISIJA_SLUG[w], "wbf": w, "grupa": grupa,
            "naslov": re.sub(r"^Serija\s*-\s*", "", naslov), "serija": naslov.lower().startswith("serija") or grupa == "Strani program",
            "slika": naslovna, "logo": logo, "blokovi": bl,
        })
print("emisija:", len(emisije))


# ── dokumenti iz sadržaja nove stranice (već postojeći linkovi) ──────────
for f in [os.path.join(dp, fn) for dp, _, fs in os.walk(os.path.join(NEW, "src")) for fn in fs if fn.endswith((".ts", ".tsx"))]:
    s = open(f, encoding="utf-8").read()
    for m in re.findall(r'doc\(\s*"([^"]+)"\s*\)', s) + re.findall(r"\$\{legacy\}/doc/([^`]+)`", s):
        DOKUMENTI.add(urllib.parse.unquote(m).strip())
# dokumenti sa svih živih stranica (npr. opći akti, cjenovnici)
live = json.load(open(os.path.join(D, "live.json"), encoding="utf-8"))
for v in live.values():
    for d in v.get("docs", []):
        DOKUMENTI.add(urllib.parse.unquote(d.split("/doc/")[-1].replace("&amp;", "&")).strip())
DOKUMENTI = {d for d in DOKUMENTI if d and "${" not in d}

for ime, data in [("tekstovi", tekstovi), ("nabavke", nabavke), ("faq", faq), ("emisije", emisije)]:
    json.dump(data, open(os.path.join(OUTC, f"{ime}.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
json.dump(sorted(DOKUMENTI), open(os.path.join(D, "dokumenti.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("dokumenata ukupno za kopiranje:", len(DOKUMENTI))
print("slika kopirano:", sum(1 for v in SLIKE.values() if v))
