#!/usr/bin/env python3
"""Render a side-by-side font specimen so fonts are chosen by eye, not by name.

Usage:
  python3 font_specimen.py --text "Brand Name" --ui "Book · Settings · 980" \
      --font "Estedad=node_modules/@fontsource-variable/estedad/files/estedad-arabic-wght-normal.woff2" \
      --font "Vazirmatn=node_modules/@fontsource-variable/vazirmatn/files/vazirmatn-arabic-wght-normal.woff2" \
      [--rtl] [--out /tmp/specimen]

Writes specimen.html and, if Playwright + Chromium are available (run from a
project with `playwright` installed), specimen.png. For each font it shows the
brand text at a light and a bold weight plus a UI line, so you can spot missing
glyphs, wrong digit forms and weak light weights.
"""
import argparse
import os
import shutil
import subprocess
import sys
import tempfile

parser = argparse.ArgumentParser()
parser.add_argument("--text", required=True, help="Brand name or display string")
parser.add_argument("--ui", default="", help="A line of real UI copy, ideally with digits")
parser.add_argument("--font", action="append", required=True, help="Label=path/to/font.woff2 (repeatable)")
parser.add_argument("--rtl", action="store_true", help="Render right-to-left")
parser.add_argument("--out", default="specimen")
args = parser.parse_args()

os.makedirs(args.out, exist_ok=True)
faces, rows = [], []
for index, spec in enumerate(args.font):
    label, _, path = spec.partition("=")
    path = os.path.abspath(path)
    if not os.path.exists(path):
        sys.exit(f"Font file not found: {path}")
    family = f"F{index}"
    faces.append(f"@font-face{{font-family:{family};src:url('file://{path}');font-weight:100 900}}")
    rows.append(
        f"<div class=r><small>{label}</small>"
        f"<span style='font-family:{family};font-weight:250'>{args.text}</span>"
        f"<span style='font-family:{family};font-weight:700'>{args.text}</span>"
        f"<p style='font-family:{family}'>{args.ui}</p></div>"
    )

direction = "rtl" if args.rtl else "ltr"
html = f"""<!doctype html><html dir={direction}><meta charset=utf-8><style>{''.join(faces)}
body{{margin:24px;background:#f6f1ea;color:#1a1410}}
.r{{display:grid;grid-template-columns:110px 1fr 1fr 1.5fr;align-items:center;gap:20px;border-bottom:1px solid #ddd;padding:8px 0}}
span{{font-size:44px;line-height:1.6}} small{{font:12px system-ui;color:#666}} p{{font-size:17px;margin:0;line-height:1.8}}
</style>{''.join(rows)}</html>"""
html_path = os.path.join(args.out, "specimen.html")
with open(html_path, "w", encoding="utf-8") as handle:
    handle.write(html)
print(f"wrote {html_path}")

# Screenshot with Playwright if it is available in the current project.
script = """
const { createRequire } = require('node:module');
const req = createRequire(process.cwd() + '/noop.js');
const { chromium } = req('playwright');
const fs = require('node:fs');
(async () => {
  const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
  const b = await chromium.launch(exe ? { executablePath: exe } : {});
  const p = await b.newPage({ viewport: { width: 1300, height: 600 } });
  await p.goto('file://' + process.argv[2]); await p.waitForTimeout(800);
  await p.screenshot({ path: process.argv[3], fullPage: true });
  await b.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
"""
if shutil.which("node"):
    with tempfile.NamedTemporaryFile("w", suffix=".cjs", delete=False) as handle:
        handle.write(script)
    png_path = os.path.join(args.out, "specimen.png")
    result = subprocess.run(["node", handle.name, os.path.abspath(html_path), os.path.abspath(png_path)], capture_output=True, text=True)
    os.unlink(handle.name)
    if result.returncode == 0:
        print(f"wrote {png_path}")
    else:
        print("could not screenshot (open specimen.html in a browser instead):", result.stderr.strip()[:200])
