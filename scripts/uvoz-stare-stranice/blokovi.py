"""Pretvara ćeliju sa sadržajem stare stranice u čiste blokove (naslov, pasus, linkovi, tabela, slika)."""
import re, urllib.parse
from bs4 import NavigableString, Tag

BLOK = {"p", "div", "li", "tr", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "center", "blockquote"}
CIR2LAT = str.maketrans({
    "а": "a", "е": "e", "о": "o", "с": "c", "р": "p", "х": "x", "у": "y", "і": "i", "ј": "j", "к": "k", "м": "m", "т": "t", "н": "n", "в": "v",
    "А": "A", "Е": "E", "О": "O", "С": "C", "Р": "P", "Х": "X", "У": "Y", "І": "I", "Ј": "J", "К": "K", "М": "M", "Т": "T", "Н": "H", "В": "B",
})


def popravi_pismo(t):
    """U latiničnom tekstu zamijeni ćirilične slova-blizance latiničnim."""
    cir = sum(1 for ch in t if "Ѐ" <= ch <= "ӿ")
    slova = sum(1 for ch in t if ch.isalpha()) or 1
    return t.translate(CIR2LAT) if cir / slova < 0.25 else t


def cisto(t):
    t = t.replace("\xa0", " ").replace("​", "")
    t = re.sub(r"[ \t\r\n]+", " ", t)
    return t.strip()


def doc_href(h):
    """Vraća naziv dokumenta iz /doc/ linka ili None."""
    h = (h or "").strip().replace("&amp;", "&")
    if "/doc/" not in h.lower():
        return None
    ime = urllib.parse.unquote(re.split(r"/doc/", h, flags=re.I)[-1]).strip()
    return ime or None


def wbf(h):
    m = re.search(r"wbf_id=(\d+)", h or "", flags=re.I)
    return int(m.group(1)) if m else None


class Linija:
    def __init__(self):
        self.runs = []  # ("t", tekst, bold) | ("a", tekst, href, bold) | ("img", src)

    def tekst(self):
        return cisto("".join(r[1] for r in self.runs if r[0] in ("t", "a")))

    def prazna(self):
        return not self.tekst() and not any(r[0] == "img" for r in self.runs)


def je_bold(el):
    for p in [el] + list(el.parents):
        if not isinstance(p, Tag):
            continue
        if p.name in ("b", "strong", "h1", "h2", "h3", "h4"):
            return True
        st = (p.get("style") or "").lower().replace(" ", "")
        if "font-weight:bold" in st or "font-weight:700" in st:
            return True
        if p.name == "td" and p.get("width") == "482":
            break
    return False


def linije(cell):
    out = [Linija()]

    def nova():
        if not out[-1].prazna() or out[-1].runs:
            out.append(Linija())

    def hod(el, link=None):
        for ch in el.children:
            if isinstance(ch, NavigableString):
                if type(ch).__name__ in ("Comment", "ProcessingInstruction", "Declaration"):
                    continue
                s = str(ch)
                if not s.strip() and not s:
                    continue
                if link:
                    out[-1].runs.append(("a", s, link, je_bold(ch.parent)))
                else:
                    out[-1].runs.append(("t", s, je_bold(ch.parent)))
                continue
            if not isinstance(ch, Tag):
                continue
            n = ch.name.lower()
            if n in ("script", "style") or ":" in n:
                if ":" in n:
                    hod(ch, link)
                continue
            if n == "br":
                nova(); continue
            if n == "img":
                src = ch.get("src") or ""
                if "dot.gif" not in src and "grey.gif" not in src:
                    out[-1].runs.append(("img", src, link))
                continue
            if n == "table":
                nova(); out.append(("tabela", ch)); out.append(Linija()); continue
            if n == "a":
                h = ch.get("href")
                hod(ch, h or link); continue
            if n in BLOK:
                nova(); hod(ch, link); nova()
            else:
                hod(ch, link)

    hod(cell)
    return [l for l in out if isinstance(l, tuple) or not l.prazna()]


def tabela(t):
    redovi = []
    for tr in t.find_all("tr"):
        celije = [popravi_pismo(cisto(td.get_text(" "))) for td in tr.find_all(["td", "th"], recursive=False)]
        if any(celije):
            redovi.append(celije)
    return redovi


def blokovi(cells):
    out = []
    for cell in cells:
        for l in linije(cell):
            if isinstance(l, tuple):
                r = tabela(l[1])
                if r:
                    out.append({"t": "tabela", "redovi": r})
                continue
            txt = popravi_pismo(l.tekst())
            linkovi = [r for r in l.runs if r[0] == "a"]
            slike = [r for r in l.runs if r[0] == "img"]
            for s in slike:
                out.append({"t": "slika", "src": s[1], "href": s[2]})
            if linkovi:
                # spoji uzastopne dijelove istog linka
                items, cur = [], None
                for r in linkovi:
                    if cur and cur["href"] == r[2]:
                        cur["tekst"] += r[1]
                    else:
                        cur = {"href": r[2], "tekst": r[1]}
                        items.append(cur)
                pred = cisto("".join(r[1] for r in l.runs[: l.runs.index(linkovi[0])] if r[0] == "t"))
                out.append({
                    "t": "linkovi",
                    "prefiks": popravi_pismo(pred),
                    # linkove bez teksta zadržavamo samo ako vode na dokument (opis = naziv fajla)
                    "stavke": [{"tekst": popravi_pismo(cisto(i["tekst"])), "href": i["href"]} for i in items
                               if cisto(i["tekst"]) or doc_href(i["href"])],
                    "tekst": txt,
                })
                continue
            if not txt:
                continue
            tekst_runs = [r for r in l.runs if r[0] == "t" and cisto(r[1])]
            bold = bool(tekst_runs) and all(r[2] for r in tekst_runs)
            out.append({"t": "naslov" if bold and len(txt) < 160 else "pasus", "tekst": txt})
    # spoji linije link-bloka koje su nastale prelomom unutar istog linka (<br> u <a>)
    spojeno = []
    for b in out:
        if (b["t"] == "linkovi" and spojeno and spojeno[-1]["t"] == "linkovi" and not b["prefiks"]
                and len(b["stavke"]) == 1 and spojeno[-1]["stavke"]
                and spojeno[-1]["stavke"][-1]["href"] == b["stavke"][0]["href"]):
            spojeno[-1]["stavke"][-1]["tekst"] += " " + b["stavke"][0]["tekst"]
            continue
        spojeno.append(b)
    return spojeno
