import pyodbc, json, re, html, os

D = r"./scripts/uvoz-stare-stranice/podaci"
con = pyodbc.connect(r"DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=" + os.path.join(D, "cms.mdb") + ";READONLY=1")
cur = con.cursor()
rows = cur.execute("SELECT id, naslov, sadrzaj, parentID, lng, section FROM pages ORDER BY id").fetchall()


def tekst(s):
    s = s or ""
    s = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", s, flags=re.S | re.I)
    s = re.sub(r"<!--.*?-->", " ", s, flags=re.S)
    s = html.unescape(re.sub(r"<[^>]+>", " ", s))
    return re.sub(r"\s+", " ", s).strip()


out = []
for r in rows:
    raw = r.sadrzaj or ""
    t = tekst(raw)
    linkovi = re.findall(r'href\s*=\s*["\']([^"\']+)["\']', raw, flags=re.I)
    out.append({
        "id": r.id, "naslov": (r.naslov or "").strip(), "parent": r.parentID, "lng": r.lng,
        "section": (r.section or "").strip(), "znakova": len(t),
        "doc_linkova": sum(1 for l in linkovi if "/doc/" in l.lower()),
        "linkova": len(linkovi), "pocetak": t[:160], "tekst": t, "linkovi": linkovi,
    })
json.dump(out, open(os.path.join(D, "pages.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

print(f"{len(out)} stranica")
from collections import Counter
print("sekcije:", Counter(p["section"] for p in out).most_common())
print("prazne (<40 znakova):", sum(1 for p in out if p["znakova"] < 40))
