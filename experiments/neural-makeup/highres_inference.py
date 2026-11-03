"""Offline research-only high-resolution tiled inference for a TRAINED appearance ONNX.

The model runs on patches; final image dimensions match the original exactly.
This does not prove that native 2048px neural synthesis or photorealism exists.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps


def tile_starts(length: int, tile: int, overlap: int):
    if length <= tile:
        return [0]
    stride = tile - overlap
    positions = list(range(0, length - tile + 1, stride))
    if positions[-1] != length - tile:
        positions.append(length - tile)
    return positions


def blend_ramp(size: int, starts: list[int], index: int) -> np.ndarray:
    """Nonzero overlap weights: internal boundaries fade, outer edges do not."""
    ramp = np.ones(size, dtype=np.float32)
    start = starts[index]
    if index > 0:
        left = starts[index - 1] + size - start
        if left > 0:
            ramp[:left] *= np.linspace(.01, 1, left, dtype=np.float32)
    if index + 1 < len(starts):
        right = start + size - starts[index + 1]
        if right > 0:
            ramp[-right:] *= np.linspace(1, .01, right, dtype=np.float32)
    return ramp


def resize_reference(rgb: np.ndarray, masks: np.ndarray, tile: int):
    """Resize reference only, preserving the input face's original dimensions."""
    ref_image = Image.fromarray(rgb, 'RGB').resize(
        (tile, tile), Image.Resampling.LANCZOS,
    )
    resized_masks = np.stack([
        np.asarray(
            Image.fromarray(m.astype('float32'), mode='F').resize(
                (tile, tile), Image.Resampling.BILINEAR,
            ), dtype=np.float32,
        ) for m in masks
    ], axis=0).clip(0, 1)
    return np.asarray(ref_image, dtype=np.float32) / 255., resized_masks


def validate_masks(rgb: np.ndarray, masks: np.ndarray, label: str):
    if rgb.ndim != 3 or rgb.shape[2] != 3 or rgb.dtype != np.uint8:
        raise ValueError(f'{label} RGB must be uint8 HxWx3')
    if (masks.ndim != 3 or masks.shape[0] != 4 or
            tuple(masks.shape[1:]) != tuple(rgb.shape[:2])):
        raise ValueError(f'{label} masks must be 4xHxW matching RGB')
    if not np.isfinite(masks).all() or masks.min() < 0 or masks.max() > 1:
        raise ValueError(f'{label} masks must be finite floats in [0,1]')


def run_tiled(session, source: np.ndarray, reference: np.ndarray,
              source_masks: np.ndarray, reference_masks: np.ndarray,
              tile: int = 256, overlap: int = 48, max_pixels: int = 10_000_000):
    """Session has onnxruntime Session.run signature; returns uint8 HWC RGB."""
    validate_masks(source, source_masks, 'source')
    validate_masks(reference, reference_masks, 'reference')
    if tile < 32 or tile % 16 or overlap < 16 or overlap >= tile // 2:
        raise ValueError('tile must be >=32, multiple of16, overlap in [16,tile/2)')
    height, width = source.shape[:2]
    if height * width > max_pixels:
        raise ValueError('image exceeds configured memory/pixel budget')
    if height * width < 32 * 32:
        raise ValueError('image is too small')
    xr = tile_starts(width, tile, overlap)
    yr = tile_starts(height, tile, overlap)
    ref_rgb, ref_mask = resize_reference(reference, reference_masks, tile)
    ref_rgb = ref_rgb.transpose(2, 0, 1)[None].astype(np.float32)
    ref_mask = ref_mask[None].astype(np.float32)
    image = source.astype(np.float32) / 255.
    numerator = np.zeros((height, width, 3), dtype=np.float32)
    denominator = np.zeros((height, width), dtype=np.float32)

    for yi, y in enumerate(yr):
        ry = min(tile, height - y)
        wy = blend_ramp(tile, yr, yi)[:ry]
        for xi, x in enumerate(xr):
            rx = min(tile, width - x)
            wx = blend_ramp(tile, xr, xi)[:rx]
            patch = image[y:y + ry, x:x + rx]
            local_masks = source_masks[:, y:y + ry, x:x + rx].astype(np.float32)
            # Pad at lower and right borders only. Masks pad with zeros to
            # prevent changes in extrapolated regions.
            patch = np.pad(
                patch, ((0, tile - ry), (0, tile - rx), (0, 0)),
                mode='edge',
            )
            local_masks = np.pad(
                local_masks, ((0, 0), (0, tile - ry), (0, tile - rx)),
                mode='constant',
            )
            inputs = {
                'source': patch.transpose(2, 0, 1)[None],
                'reference': ref_rgb,
                'source_regions': local_masks[None],
                'reference_regions': ref_mask,
            }
            result = session.run(['transferred'], inputs)[0]
            if (not isinstance(result, np.ndarray) or
                    result.shape != (1, 3, tile, tile) or
                    not np.isfinite(result).all()):
                raise RuntimeError('neural model returned invalid dimensions or nonfinite pixels')
            prediction = result[0].transpose(1, 2, 0)[:ry, :rx].clip(0, 1)
            weight = wy[:, None] * wx[None, :]
            numerator[y:y + ry, x:x + rx] += prediction * weight[..., None]
            denominator[y:y + ry, x:x + rx] += weight

    if not np.all(denominator > 0):
        raise RuntimeError('tiled compositor left an uncovered pixel')
    reconstructed = (numerator / denominator[..., None]).clip(0, 1)
    # Exactly retain input bytes outside all editable masks, regardless
    # of interpolation, tile overlap or ONNX model side effects.
    editable = source_masks.sum(axis=0) > 0
    rgb = np.rint(reconstructed * 255.).clip(0, 255).astype(np.uint8)
    return np.where(editable[..., None], rgb, source)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', type=Path, required=True)
    parser.add_argument('--manifest', type=Path, required=True)
    parser.add_argument('--source', type=Path, required=True)
    parser.add_argument('--reference', type=Path, required=True)
    parser.add_argument('--source-masks', type=Path, required=True)
    parser.add_argument('--reference-masks', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--research-only', action='store_true')
    parser.add_argument('--max-pixels', type=int, default=10_000_000)
    args = parser.parse_args()
    if not args.research_only:
        raise ValueError('This is unapproved research inference; pass --research-only')
    manifest = json.loads(args.manifest.read_text(encoding='utf-8'))
    if manifest.get('schema') != 'hbeauty.neural.appearance.v0.1':
        raise ValueError('unsupported model schema')
    if manifest.get('status') != 'experimental_not_sota_approved':
        raise ValueError('unsupported approval status')
    digest = hashlib.sha256(args.model.read_bytes()).hexdigest()
    if digest != manifest.get('sha256'):
        raise ValueError('model SHA256 does not match the locked manifest')
    if not (isinstance(manifest.get('input_resolution'), list) and
            len(manifest['input_resolution']) == 2 and
            manifest['input_resolution'][0] == manifest['input_resolution'][1]):
        raise ValueError('invalid ONNX resolution metadata')
    tile = int(manifest['input_resolution'][0])
    # Research pipeline only; onnxruntime is not bundled into mobile.
    import onnxruntime as ort

    session = ort.InferenceSession(
        str(args.model), providers=['CPUExecutionProvider'],
    )
    source = np.asarray(ImageOps.exif_transpose(Image.open(args.source)).convert('RGB'))
    reference = np.asarray(ImageOps.exif_transpose(Image.open(args.reference)).convert('RGB'))
    source_masks = np.load(args.source_masks, allow_pickle=False)
    reference_masks = np.load(args.reference_masks, allow_pickle=False)
    result = run_tiled(
        session, source, reference, source_masks, reference_masks,
        tile=tile, overlap=max(16, tile // 5),
        max_pixels=args.max_pixels,
    )
    args.output.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(result, 'RGB').save(args.output, format='PNG')
    print(json.dumps({
        'saved': str(args.output),
        'resolution': list(result.shape[:2][::-1]),
        'sha256': hashlib.sha256(args.output.read_bytes()).hexdigest(),
        'offline_local': True,
        'trained_model_quality_verified': False,
    }))


if __name__ == '__main__':
    main()
