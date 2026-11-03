"""Supervised trainer for an original, rights-cleared H-Beauty makeup network.

Do not treat a successful training job as state-of-the-art or as permission to
publish real-face training images. All model weights are new, never bundled.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import random
from pathlib import Path

import numpy as np
import torch
from torch.nn import functional as F
from torch.utils.data import DataLoader, Dataset

from model import AppearanceNet, training_loss


def parse_manifest(path: Path, root: Path):
    root = root.resolve()
    rows = []
    for lineno, line in enumerate(path.read_text(encoding='utf-8').splitlines(), 1):
        if not line.strip():
            continue
        row = json.loads(line)
        if not all(row.get(key) for key in ('file', 'subject_id', 'split', 'rights')):
            raise ValueError(f'manifest line {lineno}: missing rights or required fields')
        if row['split'] not in ('train', 'val'):
            raise ValueError(f'manifest line {lineno}: invalid split')
        filepath = (root / row['file']).resolve()
        if not filepath.is_relative_to(root) or filepath.suffix != '.npz' or not filepath.is_file():
            raise ValueError(f'manifest line {lineno}: file outside data root or missing')
        rows.append({**row, 'resolved_file': str(filepath)})
    if not rows:
        raise ValueError('empty training manifest')
    ids = {
        split: {r['subject_id'] for r in rows if r['split'] == split}
        for split in ('train', 'val')
    }
    if not ids['train'] or not ids['val']:
        raise ValueError('nonempty train and val identity splits are required')
    if ids['train'] & ids['val']:
        raise ValueError('identity leakage: subject_id appears in both splits')
    return rows


class PairedAppearanceDataset(Dataset):
    def __init__(self, rows, split: str, size: int):
        self.rows = [r for r in rows if r['split'] == split]
        self.size = size

    def __len__(self):
        return len(self.rows)

    def __getitem__(self, index: int):
        with np.load(self.rows[index]['resolved_file'], allow_pickle=False) as sample:
            expected = {
                'source', 'reference', 'target',
                'source_regions', 'reference_regions',
            }
            if not expected.issubset(sample.files):
                raise ValueError('NPZ is missing a required RGB image or facial mask')
            images = []
            for name in ('source', 'reference', 'target'):
                array = sample[name]
                if array.ndim != 3 or array.shape[2] != 3 or array.dtype != np.uint8:
                    raise ValueError(f'{name} must be uint8 HWC RGB')
                tensor = torch.from_numpy(array.copy()).permute(2, 0, 1).float().unsqueeze(0) / 255
                images.append(F.interpolate(
                    tensor, size=(self.size, self.size),
                    mode='bilinear', align_corners=False,
                )[0])
            masks = []
            for name in ('source_regions', 'reference_regions'):
                array = sample[name]
                if array.ndim != 3 or array.shape[0] != 4 or not np.isfinite(array).all():
                    raise ValueError(f'{name} must be finite four-region masks')
                tensor = torch.from_numpy(array.copy()).float().unsqueeze(0)
                masks.append(F.interpolate(
                    tensor, size=(self.size, self.size), mode='area',
                )[0].clamp(0, 1))
            return (*images, *masks)


def evaluate(model, loader, device):
    model.eval()
    scores = {'loss': 0., 'protected_mae': 0., 'editable_mae': 0.}
    count = 0
    with torch.no_grad():
        for src, ref, target, src_mask, ref_mask in loader:
            src, ref, target, src_mask, ref_mask = (
                x.to(device) for x in (src, ref, target, src_mask, ref_mask)
            )
            prediction = model(src, ref, src_mask, ref_mask)
            edit = src_mask.sum(dim=1, keepdim=True).clamp(0, 1)
            scores['loss'] += float(training_loss(prediction, target, src, src_mask))
            scores['protected_mae'] += float(((prediction - src).abs() * (edit == 0)).mean())
            scores['editable_mae'] += float(
                ((prediction - target).abs() * edit).sum() / (edit.sum() * 3 + 1e-6)
            )
            count += 1
    return {key: value / max(count, 1) for key, value in scores.items()}


def train(args):
    if not 32 <= args.size <= 512 or args.size % 16:
        raise ValueError('size must be a multiple of 16 in the interval 32..512')
    if args.batch <= 0 or args.epochs <= 0:
        raise ValueError('batch and epochs must be positive')
    torch.manual_seed(args.seed)
    random.seed(args.seed)
    np.random.seed(args.seed)
    rows = parse_manifest(args.manifest, args.data_root)
    training = DataLoader(
        PairedAppearanceDataset(rows, 'train', args.size),
        batch_size=args.batch, shuffle=True, num_workers=0,
    )
    validation = DataLoader(
        PairedAppearanceDataset(rows, 'val', args.size),
        batch_size=args.batch, shuffle=False, num_workers=0,
    )
    device = torch.device('cuda' if torch.cuda.is_available() and not args.cpu else 'cpu')
    network = AppearanceNet(width=args.width).to(device)
    optimizer = torch.optim.AdamW(network.parameters(), lr=args.lr)
    args.output.mkdir(parents=True, exist_ok=True)
    manifest_sha = hashlib.sha256(args.manifest.read_bytes()).hexdigest()
    best = float('inf')
    history = []

    for epoch in range(1, args.epochs + 1):
        network.train()
        losses = []
        for src, ref, target, src_mask, ref_mask in training:
            src, ref, target, src_mask, ref_mask = (
                x.to(device) for x in (src, ref, target, src_mask, ref_mask)
            )
            optimizer.zero_grad(set_to_none=True)
            prediction = network(src, ref, src_mask, ref_mask)
            loss = training_loss(prediction, target, src, src_mask)
            if not torch.isfinite(loss):
                raise RuntimeError('nonfinite training loss')
            loss.backward()
            torch.nn.utils.clip_grad_norm_(network.parameters(), 1.0)
            optimizer.step()
            losses.append(float(loss.detach()))
        metrics = evaluate(network, validation, device)
        row = {
            'epoch': epoch,
            'train_loss': sum(losses) / max(1, len(losses)),
            **metrics,
        }
        history.append(row)
        print(json.dumps(row))
        if metrics['loss'] < best:
            best = metrics['loss']
            torch.save({
                'architecture': 'HBeautyAppearanceNet-v0.1',
                'width': args.width,
                'regions': ['eyes', 'lips', 'cheeks', 'complexion'],
                'weights': network.cpu().state_dict(),
                'manifest_sha256': manifest_sha,
                'epoch': epoch,
                'validation': metrics,
            }, args.output / 'best.pt')
            network.to(device)

    report = {
        'status': 'trained_not_sota_validated',
        'manifest_sha256': manifest_sha,
        'train_subjects': len({r['subject_id'] for r in rows if r['split'] == 'train'}),
        'val_subjects': len({r['subject_id'] for r in rows if r['split'] == 'val'}),
        'history': history,
        'limitations': 'No blinded comparisons or physical Android validation.',
    }
    (args.output / 'report.json').write_text(
        json.dumps(report, indent=2), encoding='utf-8',
    )
    return report


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--manifest', required=True, type=Path)
    parser.add_argument('--data-root', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    parser.add_argument('--epochs', type=int, default=40)
    parser.add_argument('--batch', type=int, default=4)
    parser.add_argument('--size', type=int, default=256)
    parser.add_argument('--width', type=int, default=32)
    parser.add_argument('--lr', type=float, default=3e-4)
    parser.add_argument('--seed', type=int, default=2026)
    parser.add_argument('--cpu', action='store_true')
    train(parser.parse_args())


if __name__ == '__main__':
    main()
