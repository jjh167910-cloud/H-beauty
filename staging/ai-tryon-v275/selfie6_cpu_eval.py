#!/usr/bin/env python3
"""Research-only six-class SelfieMulticlass CPU inference gate.

Produces derived masks and a machine-readable JSON report, not model weights.
GitHub runner results must not be represented as physical Android benchmarks.
"""
import argparse
import hashlib
import json
import time
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps
from ai_edge_litert.interpreter import Interpreter

EXPECTED_SHA256 = "d2cd8f253fb44f135900753d0124c5228285165cf2a8f8100fbe958ad7bc55df"
CLASSES = ["background", "hair", "body_skin", "face_skin", "clothing", "accessories"]
COLORS = np.array([[32, 38, 44], [202, 90, 132], [222, 180, 124],
                   [56, 176, 148], [83, 123, 210], [245, 208, 82]], dtype=np.uint8)


def input_image(img_path: Path, width: int, height: int) -> np.ndarray:
    with Image.open(img_path) as source:
        rgb = ImageOps.exif_transpose(source).convert("RGB")
    fitted = ImageOps.contain(rgb, (width, height), method=Image.Resampling.BILINEAR)
    canvas = Image.new("RGB", (width, height), (0, 0, 0))
    canvas.paste(fitted, ((width - fitted.width) // 2, (height - fitted.height) // 2))
    return np.asarray(canvas, dtype=np.uint8)


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--model", type=Path, required=True)
    p.add_argument("--image", type=Path, required=True)
    p.add_argument("--out", type=Path, required=True)
    args = p.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    binary = args.model.read_bytes()
    actual_hash = hashlib.sha256(binary).hexdigest()
    match = actual_hash == EXPECTED_SHA256
    report = {"source_image": args.image.name, "model_source": "official Google MediaPipe SelfieMulticlass 256x256 float32 latest URL", "model_size_bytes": len(binary), "actual_sha256": actual_hash, "expected_v275_sha256": EXPECTED_SHA256, "same_model_as_v275": match, "class_names": CLASSES}
    (args.out / "model-sha256.txt").write_text(actual_hash + "\n")
    interpreter = Interpreter(model_path=str(args.model), num_threads=2)
    interpreter.allocate_tensors()
    in_d = interpreter.get_input_details()[0]
    out_d = interpreter.get_output_details()
    report["input"] = {"shape": list(map(int, in_d["shape"])), "dtype": str(in_d["dtype"])}
    report["outputs"] = [{"shape": list(map(int, x["shape"])), "dtype": str(x["dtype"])} for x in out_d]
    shape = list(map(int, in_d["shape"]))
    if len(shape) != 4 or shape[0] != 1:
        raise RuntimeError(f"Unexpected model input: {shape}")
    nchw = shape[1] == 3
    height, width = (shape[2], shape[3]) if nchw else (shape[1], shape[2])
    if (height, width) != (256, 256):
        raise RuntimeError(f"Unexpected spatial size: {(height, width)}")
    rgb = input_image(args.image, width, height)
    report["normalization_sweep"] = []
    for mode in ("unit_0_1", "signed_minus1_1", "raw_0_255"):
        f = rgb.astype(np.float32)
        if mode == "unit_0_1":
            f /= 255.0
        elif mode == "signed_minus1_1":
            f = f / 127.5 - 1.0
        if nchw:
            f = np.transpose(f, (2, 0, 1))
        value = f[np.newaxis, ...]
        dtype = in_d["dtype"]
        if dtype not in (np.float32, np.float16):
            if mode != "raw_0_255":
                continue
        interpreter.set_tensor(in_d["index"], value.astype(dtype))
        started = time.perf_counter()
        interpreter.invoke()
        elapsed_ms = round((time.perf_counter() - started) * 1000, 2)
        candidates = []
        for o in out_d:
            result = np.squeeze(interpreter.get_tensor(o["index"]))
            if result.ndim == 3 and result.shape[-1] == len(CLASSES):
                candidates.append(result)
            elif result.ndim == 3 and result.shape[0] == len(CLASSES):
                candidates.append(np.moveaxis(result, 0, -1))
        if not candidates:
            raise RuntimeError(f"No valid six-channel output from {[x['shape'] for x in out_d]}")
        out = candidates[0]
        assert np.isfinite(out).all(), "Model output has NaN/Inf"
        labels = np.argmax(out, axis=-1).astype(np.uint8)
        if labels.shape != (height, width):
            raise RuntimeError(f"Unexpected class map: {labels.shape}")
        cls_counts = dict(zip(CLASSES, (int((labels == i).sum()) for i in range(len(CLASSES)))))
        class_rgb = COLORS[labels]
        overlay = (0.54 * rgb.astype(np.float32) + 0.46 * class_rgb.astype(np.float32)).clip(0, 255).astype(np.uint8)
        Image.fromarray(class_rgb).save(args.out / f"{mode}_class_mask.png")
        Image.fromarray(overlay).save(args.out / f"{mode}_overlay.png")
        report["normalization_sweep"].append({"mode": mode, "cpu_inference_ms_runner_only": elapsed_ms, "class_counts": cls_counts,
                                               "observed_classes": [c for c, count in cls_counts.items() if count > 0],
                                               "output_min": float(out.min()), "output_max": float(out.max())})
    (args.out / "selfie6_cpu_report.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, ensure_ascii=False))
    if not match:
        print("BLOCKED: official latest model hash differs from embedded v27.5 model")
        return 2
    if not report["normalization_sweep"]:
        print("BLOCKED: no real CPU inference produced")
        return 3
    if max(len(x["observed_classes"]) for x in report["normalization_sweep"]) < 2:
        print("BLOCKED: class map degenerate for all tested normalizations")
        return 4
    print("PASS: exact bundled six-class model executed on CPU with nondegenerate masks")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
