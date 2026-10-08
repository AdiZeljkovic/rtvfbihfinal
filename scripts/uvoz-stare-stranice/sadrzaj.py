"""Izdvaja ćeliju sa sadržajem iz snimljenih stranica stare stranice."""
import os, re, sys
from bs4 import BeautifulSoup

D = r"./scripts/uvoz-stare-stranice/podaci"


def celija(wid):
    s = open(os.path.join(D, "html", f"{wid}.html"), encoding="cp1250", errors="ignore").read()
    soup = BeautifulSoup(s, "lxml")
    td = soup.find("td", attrs={"width": "482"})
    if not td:
        return None
    tab = td.find("table")
    redovi = tab.find_all("tr", recursive=False)
    # prva dva reda su razmaknice (dot.gif); sadržaj je u ostalima
    sadrzaj = []
    for tr in redovi:
        c = tr.find("td", recursive=False)
        if c is None:
            continue
        if not c.get_text(strip=True) and not c.find(["a", "img"], src=lambda x: x and "dot.gif" not in x):
            if not c.find("a"):
                continue
        sadrzaj.append(c)
    return sadrzaj


if __name__ == "__main__":
    for wid in sys.argv[1:]:
        cs = celija(int(wid))
        print("#####", wid, "ćelija:", len(cs or []))
        for c in cs or []:
            print(str(c)[:1800])
            print("-----")
