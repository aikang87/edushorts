#!/usr/bin/env python3
"""ep*/script.md 의 대본 표를 읽어 전체 대본 하나(scripts.txt)로 합친다. 사용: python3 tools/build_scripts.py"""
import glob, os, re

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = ["VSCODE와 Docker로 만드는 생성형AI - 전체 대본", "=" * 44, ""]
for path in sorted(glob.glob(os.path.join(root, "ep*", "script.md"))):
    lines = open(path, encoding="utf-8").read().splitlines()
    title = next(l[2:].strip() for l in lines if l.startswith("# "))
    out += [f"[{title}]", ""]
    for l in lines:
        c = [x.strip() for x in l.strip().strip("|").split("|")]
        if len(c) >= 4 and re.fullmatch(r"\d+", c[0]):
            out.append(f"{c[1]}  {c[3]}")
    out.append("")
open(os.path.join(root, "scripts.txt"), "w", encoding="utf-8").write("\n".join(out))
print("scripts.txt 생성:", len(glob.glob(os.path.join(root, "ep*", "script.md"))), "개 회차")
