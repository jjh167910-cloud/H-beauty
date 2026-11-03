"""Reproducible v20.3 natural eye-makeup atlas authoring (research only).
Requires numpy, opencv-python-headless, Pillow. Original source images, legal
rights, and 42 aligned RGB delta atlases must be provided explicitly.
Does NOT train a neural model or certify cosmetic photorealism.
"""
from __future__ import annotations
import argparse, hashlib, json
from pathlib import Path
import cv2
import numpy as np
from PIL import Image

def naturalize(delta_image: np.ndarray, rgb_masks: np.ndarray) -> np.ndarray:
    if delta_image.dtype != np.uint8 or rgb_masks.dtype != np.uint8 or \
       delta_image.ndim != 3 or delta_image.shape[-1] != 3 or \
       delta_image.shape != rgb_masks.shape:
        raise ValueError("Expected matched uint8 H×W×3 RGB data and cosmetic masks")
    eye = rgb_masks[...,0].astype(np.float32)/255
    lip = rgb_masks[...,1].astype(np.float32)/255
    cheek = rgb_masks[...,2].astype(np.float32)/255
    weight=eye*(1-.65*lip)*(1-.5*cheek)
    d=(delta_image.astype(np.float32)-128)*2
    sigma=2.6
    smoothed=cv2.GaussianBlur(d*eye[...,None],(0,0),sigma) / \
        np.maximum(cv2.GaussianBlur(eye,(0,0),sigma),.035)[...,None]
    residual=d-smoothed
    y=.2126*residual[...,0]+.7152*residual[...,1]+.0722*residual[...,2]
    dark=np.clip((-y-1.5)/16,0,1)
    retention=.63*(1-dark)+.26*dark
    new=d-weight[...,None]*(1-retention[...,None])*residual
    out=np.rint(np.clip(new/2+128,0,255)).astype(np.uint8)
    out[weight<.001]=delta_image[weight<.001]
    assert np.array_equal(out[eye==0],delta_image[eye==0])
    return out

def build(root: Path, destination: Path) -> dict:
    image_dir=root/"atlas"
    region=np.asarray(Image.open(root/"regions.png").convert("RGB"),dtype=np.uint8)
    if not image_dir.is_dir(): raise FileNotFoundError(image_dir)
    destination.mkdir(parents=True,exist_ok=True)
    files={}
    for source in sorted(image_dir.glob("*.png")):
        if not source.stem.replace("-","").isalnum():raise ValueError("Invalid style id")
        arr=np.asarray(Image.open(source).convert("RGB"),dtype=np.uint8)
        out=naturalize(arr,region)
        target=destination/(source.name)
        Image.fromarray(out).save(target,optimize=True)
        files[source.stem]={"sha256":hashlib.sha256(target.read_bytes()).hexdigest(),
            "bytes":target.stat().st_size,"changed_pixels":int(np.any(arr!=out,axis=2).sum())}
    if not files: raise ValueError("No cosmetics atlases in source directory")
    return {"schema":"hbeauty.cosmetic.natural.v20.3","source":"existing aligned delta atlases",
        "neural_model":False,"files":files}

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--source-atlas",type=Path,required=True)
    parser.add_argument("--destination",type=Path,required=True)
    args=parser.parse_args()
    manifest=build(args.source_atlas,args.destination)
    (args.destination.parent/"natural-manifest.json").write_text(
        json.dumps(manifest,indent=2,ensure_ascii=False),encoding="utf8")
    print("Generated",len(manifest["files"]),"offline natural variants")
