import hashlib,importlib.util,json
from pathlib import Path
from zipfile import ZipFile

SOURCE=Path(__file__).resolve().parents[1]/"v206_release_gate.py"
S=importlib.util.spec_from_file_location("v206_gate",SOURCE)
QA=importlib.util.module_from_spec(S);S.loader.exec_module(QA)

def test_v206_bundle_guard_rejects_stale_geometry(tmp_path,monkeypatch):
 a=b"mock-yunet-model";b=b"mock-face-mesh-model"
 monkeypatch.setattr(QA,"YUNET",hashlib.sha256(a).hexdigest())
 monkeypatch.setattr(QA,"MESH478",hashlib.sha256(b).hexdigest())
 data={
 "cpu-tryon.html":'<script type="module" src="./cpu-studio-v206.js"></script>',
 "cpu-studio-v206.js":"detail-atlas-v203.js v205_landmark_guard.mjs state.showOriginal;drawCurrent();$('download').disabled=state.showOriginal",
 "v198_geometry.js":"p[0]<-width*.05-1.5||p[0]>width*1.05+1.5||p[1]<-height*.05-1.5||p[1]>height*1.05+1.5",
 "sw.js":"const VERSION = '20.6';const ASSETS = [\"./cpu-tryon.html\"];const CORE = [\"./\"];",
 "cpu478_browser.mjs":"source","models/yunet-2026may.onnx":a,"models/face-mesh-478.onnx":b,
 "vendor/ort-wasm-simd-threaded.wasm":b"wasm","detail-atlas/neutral.png":b"png",
 "detail-atlas/regions.png":b"png","detail-atlas/triangles-v202.json":"[]",
 "looks.json":json.dumps([{"id":f"look-{i}"} for i in range(42)])
 }
 for i in range(42):
  data[f"detail-atlas/atlas/look-{i}.png"]=b"png"
  data[f"detail-atlas/atlas-natural/look-{i}.png"]=b"png"
 def pack(path,patch=None):
  with ZipFile(path,"w") as z:
   for name,content in data.items():
    z.writestr(name,patch if name=="v198_geometry.js" and patch is not None else content)
 good=tmp_path/"good.zip";pack(good)
 assert QA.inspect_archive(good)["ok"]
 bad=tmp_path/"bad.zip";pack(bad,"p[0]>width*1.05")
 result=QA.inspect_archive(bad)
 assert not result["ok"]
 assert any("1.5px guard" in issue for issue in result["issues"])
