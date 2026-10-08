"""Pretraga žive stare stranice rtvfbih.ba/loc – samo interni .wbsp linkovi, s pauzom."""
import re, html, json, time, os, urllib.request, urllib.parse
from collections import deque

OUT = r"./scripts/uvoz-stare-stranice/podaci/live.json"
BASE = "https://rtvfbih.ba/loc/"
START = BASE + "default.wbsp"
UA = {"User-Agent": "Mozilla/5.0 (RTVFBiH migracija - provjera sadrzaja)"}


def kanon(u):
    p = urllib.parse.urlparse(u)
    if p.netloc and "rtvfbih.ba" not in p.netloc:
        return None
    if not p.path.lower().endswith((".wbsp",)):
        return None
    q = urllib.parse.parse_qs(p.query)
    if "wbf_id" in q:
        wid = q["wbf_id"][0]
        if not wid.isdigit():
            return None
        extra = "&parentID=" + q["parentID"][0] if "parentID" in q else ""
        sec = "&section=" + q["section"][0] if "section" in q else ""
        # TV vodič ima datum – njega ne pratimo po danima
        return f"{BASE}template.wbsp?wbf_id={wid}{sec}{extra}"
    if p.path.lower().endswith("default.wbsp"):
        return START
    return None


def tekst(s):
    s = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", s, flags=re.S | re.I)
    s = html.unescape(re.sub(r"<[^>]+>", " ", s))
    return re.sub(r"\s+", " ", s).strip()


seen, out = set(), {}
q = deque([START])
while q and len(seen) < 450:
    u = q.popleft()
    if u in seen:
        continue
    seen.add(u)
    try:
        raw = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=25).read()
        s = raw.decode("cp1250", errors="ignore")
    except Exception as e:
        out[u] = {"greska": str(e)}
        continue
    linkovi = re.findall(r'href\s*=\s*["\']([^"\']+)["\']', s, flags=re.I)
    docs = sorted({urllib.parse.urljoin(u, l) for l in linkovi if "/doc/" in l.lower()})
    wid = re.search(r"wbf_id=(\d+)", u)
    out[u] = {"wbf_id": int(wid.group(1)) if wid else 0, "docs": docs, "znakova": len(tekst(s))}
    for l in linkovi:
        k = kanon(urllib.parse.urljoin(u, l.replace("&amp;", "&")))
        if k and k not in seen:
            q.append(k)
    time.sleep(0.3)

json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
ids = sorted({v["wbf_id"] for v in out.values() if v.get("wbf_id")})
print("posjećeno URL-ova:", len(out), "| različitih wbf_id:", len(ids))
print("greške:", sum(1 for v in out.values() if "greska" in v))
print(ids)
