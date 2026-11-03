"""Reproducible quality diagnostic; not a photorealism or identity certificate.

Compares the learned result and unedited source against the SAME target
makeup photo in each held-out pair. No subject photos are exported.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
import torch
from torch.utils.data import DataLoader

from model import AppearanceNet
from train import PairedAppearanceDataset, parse_manifest


def bootstrap_interval(values: np.ndarray, rounds=2000, seed=2026):
    if values.size < 2:
        return [None, None]
    generator = np.random.default_rng(seed)
    samples = generator.choice(values, size=(rounds, values.size), replace=True)
    return [float(v) for v in np.percentile(samples.mean(axis=1), [2.5, 97.5])]


def benchmark(model, loader, device='cpu'):
    model.eval()
    rows = []
    with torch.inference_mode():
        for src, ref, target, smask, rmask in loader:
            for tensor in (src, ref, target, smask, rmask):
                if not torch.isfinite(tensor).all():
                    raise ValueError('nonfinite input in benchmark')
            src, ref, target, smask, rmask = (
                tensor.to(device) for tensor in (src, ref, target, smask, rmask)
            )
            result = model(src, ref, smask, rmask)
            gate = smask.sum(dim=1, keepdim=True).clamp(0, 1)
            for idx in range(src.shape[0]):
                editable = gate[idx].sum().item()
                if editable < 1:
                    raise ValueError('sample has no editable region')
                baseline = ((src[idx] - target[idx]).abs() * gate[idx]).sum().item()
                predicted = ((result[idx] - target[idx]).abs() * gate[idx]).sum().item()
                protected = (gate[idx] == 0).expand_as(src[idx])
                leakage = float((result[idx][protected] - src[idx][protected]).abs().max())
                rows.append({
                    'source_masked_mae': baseline / (3 * editable),
                    'predicted_masked_mae': predicted / (3 * editable),
                    'outside_mask_max_abs': leakage,
                })
    if not rows:
        raise ValueError('empty benchmark')
    raw = np.array([r['source_masked_mae'] for r in rows], dtype='float64')
    predicted = np.array([r['predicted_masked_mae'] for r in rows], dtype='float64')
    improvements = raw - predicted
    report = {
        'schema': 'hbeauty.neural.benchmark.v1',
        'sample_count': len(rows),
        'baseline_mean_mae': float(raw.mean()),
        'model_mean_mae': float(predicted.mean()),
        'absolute_improvement': float(improvements.mean()),
        'improvement_95pct_bootstrap_interval': bootstrap_interval(improvements),
        'outside_mask_max_abs': float(max(r['outside_mask_max_abs'] for r in rows)),
        'superior_to_baseline_on_this_dataset': bool(float(improvements.mean()) > 0),
        'photorealism_certified': False,
        'state_of_the_art_certified': False,
        'not_assessed': [
            'human identity similarity', 'makeup reference fidelity',
            'skin pore realism', 'demographic performance', 'temporal stability',
            'comparison with ART and MagicMakeup', 'Android device execution',
        ],
        'method': 'matched target MAE with person-disjoint holdout; do not use alone to approve deployment',
    }
    return report


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--checkpoint', type=Path, required=True)
    parser.add_argument('--manifest', type=Path, required=True)
    parser.add_argument('--data-root', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--size', type=int, default=256)
    parser.add_argument('--batch', type=int, default=4)
    args = parser.parse_args()
    rows = parse_manifest(args.manifest, args.data_root)
    checkpoint = torch.load(args.checkpoint, map_location='cpu', weights_only=True)
    if checkpoint.get('manifest_sha256') != hashlib.sha256(args.manifest.read_bytes()).hexdigest():
        raise ValueError('checkpoint was trained on a different manifest')
    if checkpoint.get('architecture') != 'HBeautyAppearanceNet-v0.1':
        raise ValueError('unsupported checkpoint')
    model = AppearanceNet(width=int(checkpoint['width']))
    model.load_state_dict(checkpoint['weights'], strict=True)
    dataset = PairedAppearanceDataset(rows, 'val', args.size)
    loader = DataLoader(dataset, batch_size=args.batch, shuffle=False, num_workers=0)
    report = benchmark(model, loader)
    report['val_subject_count'] = len({r['subject_id'] for r in rows if r['split']=='val'})
    report['manifest_sha256'] = checkpoint['manifest_sha256']
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(json.dumps(report))
    # Never declare SOTA based on synthetic or single-benchmark MAE.
    if report['outside_mask_max_abs'] != 0.0:
        raise SystemExit('FAIL: protected region changed')


if __name__ == '__main__':
    main()
