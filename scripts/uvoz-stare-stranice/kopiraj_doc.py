import json, os, shutil, time, urllib.parse, urllib.request

D = r"./scripts/uvoz-stare-stranice/podaci"
OLDDOC = r"../RTV OLD/doc"
CILJ = r"./podaci/doc"
os.makedirs(CILJ, exist_ok=True)

lokalno = {f.lower(): f for f in os.listdir(OLDDOC)}
docs = json.load(open(os.path.join(D, "dokumenti.json"), encoding="utf-8"))
kopirano = preuzeto = postoji = 0
neuspjeh = []
for ime in docs:
    c = os.path.join(CILJ, ime)
    if os.path.exists(c):
        postoji += 1
        continue
    izvor = lokalno.get(ime.lower())
    if izvor:
        shutil.copy2(os.path.join(OLDDOC, izvor), c)
        kopirano += 1
        continue
    try:
        u = "https://rtvfbih.ba/doc/" + urllib.parse.quote(ime)
        data = urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=60).read()
        if data[:15].lower().startswith(b"<!doctype") or b"<html" in data[:300].lower():
            raise ValueError("server je vratio HTML umjesto dokumenta")
        open(c, "wb").write(data)
        preuzeto += 1
        time.sleep(0.3)
    except Exception as e:
        neuspjeh.append((ime, str(e)[:80]))

ukupno = sum(os.path.getsize(os.path.join(CILJ, f)) for f in os.listdir(CILJ))
print(f"kopirano iz kopije servera: {kopirano}, preuzeto sa žive: {preuzeto}, već postojalo: {postoji}")
print(f"u podaci/doc: {len(os.listdir(CILJ))} fajlova, {ukupno/1024/1024:.0f} MB")
print("neuspjeh:", len(neuspjeh))
for n in neuspjeh:
    print("   ", n)
