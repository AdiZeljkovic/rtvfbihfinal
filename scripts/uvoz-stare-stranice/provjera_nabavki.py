import json, os, urllib.parse

D = r"./scripts/uvoz-stare-stranice/podaci"
N = r"./src/content/arhiva/nabavke.json"
live = json.load(open(os.path.join(D, "live.json"), encoding="utf-8"))
nab = json.load(open(N, encoding="utf-8"))
GOD = {450: 2015, 456: 2016, 476: 2017, 494: 2018, 522: 2019, 538: 2020, 557: 2021, 583: 2022, 635: 2023, 662: 2024, 696: 2025, 734: 2026}
ime = lambda d: urllib.parse.unquote(d.split("/doc/")[-1].replace("&amp;", "&")).strip().lower()
uk = 0
for u, v in live.items():
    g = GOD.get(v.get("wbf_id"))
    if not g:
        continue
    zivo = {ime(d) for d in v["docs"]}
    novo = {s["doc"].lower() for sek in nab[str(g)]["sekcije"] for s in sek["stavke"]}
    fali = zivo - novo
    uk += len(fali)
    print(g, "živo", len(zivo), "uvezeno", len(novo), "nedostaje", len(fali), sorted(fali)[:3])
print("UKUPNO nedostaje:", uk)
