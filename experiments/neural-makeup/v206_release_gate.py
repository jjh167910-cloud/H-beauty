"""Reject v20.6 standalone ZIPs with stale geometry or missing offline assets.

Works on a local exported ZIP only. Does not certify visual quality or Android.
"""
from __future__ import annotations
import hashlib,json,re
from pathlib import Path
from zipfile import ZipFile

YUNET="ebafce4e3c118d6554634be5c27ab333b4c047a9a8c3faf1d7cf93101c22f0f0"
MESH478="7d6e82dee82a1dca5fbddb282b3cc74571833a530de317fc22ae325c3358beeb"

def inspect_archive(path:Path)->dict:
 with ZipFile(path) as z:
  names=set(z.namelist());issues=[]
  corrupt=z.testzip()
  if corrupt:issues.append("CRC failed: "+corrupt)
  needed={"sw.js","cpu-tryon.html","cpu-studio-v206.js","v198_geometry.js",
   "cpu478_browser.mjs","models/yunet-2026may.onnx","models/face-mesh-478.onnx",
   "vendor/ort-wasm-simd-threaded.wasm","detail-atlas/neutral.png",
   "detail-atlas/regions.png","detail-atlas/triangles-v202.json","looks.json"}
  issues.extend("Missing: "+n for n in sorted(needed-names))
  if needed-names:return {"ok":False,"issues":issues}
  sw=z.read("sw.js").decode()
  geo=z.read("v198_geometry.js").decode()
  html=z.read("cpu-tryon.html").decode()
  ui=z.read("cpu-studio-v206.js").decode()
  if "const VERSION = '20.6';" not in sw:issues.append("Stale cache version")
  for field in ["ASSETS","CORE"]:
   m=re.search("const "+field+r" = (\[.*?\]);",sw,re.S)
   if not m:issues.append("Missing "+field+" manifest");continue
   missing=[a for a in json.loads(m.group(1)) if a!="./" and a.removeprefix("./") not in names]
   if missing:issues.append(field+" has "+str(len(missing))+" missing resources")
  for requirement in ["p[0]<-width*.05-1.5","p[0]>width*1.05+1.5",
    "p[1]<-height*.05-1.5","p[1]>height*1.05+1.5"]:
   if requirement not in geo:issues.append("Missing 1.5px guard: "+requirement)
  if 'src="./cpu-studio-v206.js"' not in html:issues.append("Wrong studio import")
  if "state.showOriginal;drawCurrent();$('download').disabled=state.showOriginal" not in ui:
   issues.append("Before/after export control not fixed")
  if "detail-atlas-v203.js" not in ui or "v205_landmark_guard.mjs" not in ui:
   issues.append("Natural finish or anatomical protection missing")
  for name,expected in [("models/yunet-2026may.onnx",YUNET),
                        ("models/face-mesh-478.onnx",MESH478)]:
   if hashlib.sha256(z.read(name)).hexdigest()!=expected:
    issues.append("Invalid ONNX SHA256: "+name)
  if any("bisenet" in n.lower() or "faceparse" in n.lower() or "resnet18.onnx" in n.lower() for n in names):
   issues.append("Research-only CelebAMask parser bundled")
  styles={x["id"] for x in json.loads(z.read("looks.json"))}
  originals={Path(n).stem for n in names if n.startswith("detail-atlas/atlas/") and n.endswith(".png")}
  natural={Path(n).stem for n in names if n.startswith("detail-atlas/atlas-natural/") and n.endswith(".png")}
  if len(styles)!=42 or styles!=originals or styles!=natural:
   issues.append("Incomplete or mismatched 42-look collection")
  return {"ok":not issues,"issues":issues,"styles":len(styles),"files":len(names),
          "sha256":hashlib.sha256(path.read_bytes()).hexdigest()}

if __name__=="__main__":
 import argparse
 p=argparse.ArgumentParser()
 p.add_argument("zip",type=Path)
 args=p.parse_args()
 result=inspect_archive(args.zip)
 print(json.dumps(result,indent=2))
 raise SystemExit(0 if result["ok"] else 1)
