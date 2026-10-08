"""Snima HTML svih stranica pronađenih pretragom žive stranice (jednom, s pauzom)."""
import json, os, time, urllib.request

D = r"./scripts/uvoz-stare-stranice/podaci"
OUT = os.path.join(D, "html")
os.makedirs(OUT, exist_ok=True)
live = json.load(open(os.path.join(D, "live.json"), encoding="utf-8"))
UA = {"User-Agent": "Mozilla/5.0 (RTVFBiH migracija - preuzimanje sadrzaja)"}

urls = {}
for u, v in live.items():
    w = v.get("wbf_id") or 0
    urls.setdefault(w, u)  # jedna verzija po stranici
urls[0] = "https://rtvfbih.ba/loc/default.wbsp"

for w, u in sorted(urls.items()):
    f = os.path.join(OUT, f"{w}.html")
    if os.path.exists(f):
        continue
    raw = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=30).read()
    open(f, "wb").write(raw)
    time.sleep(0.3)
print("snimljeno stranica:", len(os.listdir(OUT)))
