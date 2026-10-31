#!/usr/bin/env python3
"""Reproducibly reconstruct HB-001 only from a SHA-locked portrait."""
from __future__ import annotations
import hashlib
from pathlib import Path
import sys
from PIL import Image, ImageDraw, ImageFilter, features

SOURCE_SHA = "24ccddb04969216d19e99cc9cd9ba32b5c46b59f1272be0a0a7a5558e5eb6051"
HASHES = {
    "1.webp": "f94145d96dc9c4aca28674b704b7ee61b09564015dbd118d502f060b6d3d5818",
    "1-thumb.webp": "19b999364c0717576da9eb7cdcec3e372b8d90df4104847711f04553dd05cf52",
}
MATTE = (245, 243, 239)

def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def generate(source: Path, root: Path) -> None:
    if digest(source.read_bytes()) != SOURCE_SHA:
        raise RuntimeError("HB-001 source checksum mismatch")
    if features.version("webp") != "1.6.0":
        raise RuntimeError("Unapproved WebP encoder: " + str(features.version("webp")))
    with Image.open(source) as image:
        if image.format != "JPEG" or image.size != (1536, 1536):
            raise RuntimeError("HB-001 source must be the native 1536px approved portrait")
        portrait = image.convert("RGB")
    mask = Image.new("L", portrait.size, 0)
    ImageDraw.Draw(mask).rectangle((20, 20, 1515, 1515), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(12))
    framed = Image.new("RGB", portrait.size, MATTE)
    framed.paste(portrait, (0, 0), mask)
    thumb = framed.resize((560, 560), Image.Resampling.LANCZOS)
    destination = root / "release-overlays" / "hb001"
    destination.mkdir(parents=True, exist_ok=True)
    for name, img in [("1.webp", framed), ("1-thumb.webp", thumb)]:
        path = destination / name
        img.save(path, "WEBP", quality=94, method=6)
        if digest(path.read_bytes()) != HASHES[name]:
            raise RuntimeError("HB-001 output hash mismatch: " + name)
        print("Verified HB-001: " + name + " SHA-256 " + HASHES[name])
    tiny = thumb.resize((96, 96), Image.Resampling.BICUBIC)
    for pt in ((0, 0), (95, 0), (0, 95), (95, 95)):
        if max(abs(a-b) for a,b in zip(tiny.getpixel(pt), MATTE)) > 7:
            raise RuntimeError("HB-001 ivory corner outside tolerance: " + str(pt))
    lock = root / "assets" / "hb001-overlay.sha256"
    lock.parent.mkdir(parents=True, exist_ok=True)
    lock.write_text("".join(HASHES[name] + "  " + name + "\n" for name in HASHES), encoding="utf-8")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Usage: prepare-hb001.py SOURCE_IMAGE REPOSITORY_ROOT")
    generate(Path(sys.argv[1]), Path(sys.argv[2]))
