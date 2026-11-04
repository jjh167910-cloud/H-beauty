"""v20.7 isolated Soft Eyeshadow variant compiler (research only).

Turns aligned, user-rights-cleared Natural delta atlases into a broad-pigment
eye material. Suppresses transfer of model-specific fine eyelashes and
liner without changing ANY pixels outside the canonical eye atlas mask.
Does NOT generate photorealistic lashes or train a model.
"""
from pathlib import Path
import hashlib,json
import cv2,numpy as np
from PIL import Image
cv2.setNumThreads(1)

def shadow_only(original,regions,sigma=11.0,preservation=.04):
    if original.dtype!=np.uint8 or regions.dtype!=np.uint8 or original.shape!=regions.shape or original.ndim!=3 or original.shape[2]!=3:
        raise ValueError("Requires aligned 8-bit RGB atlas and region map")
    if not(np.isfinite(sigma) and 3<=sigma<=25 and np.isfinite(preservation) and 0<=preservation<=1):
        raise ValueError("Invalid eye material settings")
    alpha=regions[...,0].astype(np.float32)/255
    d=(original.astype(np.float32)-128)*2
    h,w=alpha.shape
    size=(max(1,w//2),max(1,h//2))
    ah=cv2.resize(alpha,size,interpolation=cv2.INTER_AREA)
    dh=cv2.resize(d*alpha[...,None],size,interpolation=cv2.INTER_AREA)
    low_h=cv2.GaussianBlur(dh,(0,0),sigma/2)/np.maximum(cv2.GaussianBlur(ah,(0,0),sigma/2),.03)[...,None]
    low=cv2.resize(low_h,(w,h),interpolation=cv2.INTER_LINEAR)
    mix=(1-preservation)*np.clip(alpha*4,0,1)
    result=np.rint(np.clip((d*(1-mix[...,None])+low*mix[...,None])/2+128,0,255)).astype(np.uint8)
    result[alpha==0]=original[alpha==0]
    return result

def diff_metrics(a,b,reg):
    full_eye=reg[...,0]>15
    base=(a.astype(np.float32)-128)*2
    new=(b.astype(np.float32)-128)*2
    size=(max(1,a.shape[1]//2),max(1,a.shape[0]//2))
    base=cv2.resize(base,size,interpolation=cv2.INTER_AREA)
    new=cv2.resize(new,size,interpolation=cv2.INTER_AREA)
    eye=cv2.resize(full_eye.astype("uint8"),size,interpolation=cv2.INTER_NEAREST)>0
    def hf(arr):
        return np.mean(np.abs((arr-cv2.GaussianBlur(arr,(0,0),1.25))[eye]))
    broad=np.mean(np.abs((cv2.GaussianBlur(base,(0,0),4)-cv2.GaussianBlur(new,(0,0),4))[eye]))
    return {"eye_high_frequency_before":round(float(hf(base)),5),
      "eye_high_frequency_after":round(float(hf(new)),5),
      "large_scale_eye_color_change_rgb":round(float(broad),5),
      "changed_eye_pixels":int(np.any(a!=b,axis=2)[full_eye].sum()),
      "changed_outside_eye_pixels":int(np.any(a!=b,axis=2)[reg[...,0]==0].sum())}

def compile_collection(root:Path,sigma=11,preservation=.04):
    region=np.asarray(Image.open(root/"detail-atlas/regions.png").convert("RGB"),dtype=np.uint8)
    sources=root/"detail-atlas/atlas-natural"
    dst=root/"detail-atlas/atlas-shadow"
    dst.mkdir(exist_ok=True)
    meta={}
    for path in sorted(sources.glob("*.png")):
        src=np.asarray(Image.open(path).convert("RGB"),dtype=np.uint8)
        alt=shadow_only(src,region,sigma,preservation)
        result=dst/path.name
        Image.fromarray(alt).save(result,compress_level=3)
        stat=diff_metrics(src,alt,region)
        stat.update({"sha256":hashlib.sha256(result.read_bytes()).hexdigest(),
          "bytes":result.stat().st_size})
        meta[path.stem]=stat
    if len(meta)!=42:
        raise ValueError(f"Expected 42 atlas images, found {len(meta)}")
    manifest={"schema":"hbeauty.shadow-eyematerial.v207",
      "source":"atlas-natural","algo":"normalized-color-Gaussian-eye-only",
      "sigma":sigma,"preserve_high_frequency":preservation,"files":meta}
    (root/"detail-atlas/shadow-manifest.json").write_text(json.dumps(manifest,indent=2),encoding="utf8")
    return manifest

if __name__=="__main__":
    import argparse
    p=argparse.ArgumentParser()
    p.add_argument("source",type=Path)
    args=p.parse_args()
    m=compile_collection(args.source)
    print("Generated",len(m["files"]),"Soft Eyeshadow variants")
