"""Export a trained, rights-cleared model to a hash-locked ONNX artifact.

Does not export random/untrained weights as a working salon model.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import torch
from model import AppearanceNet


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--checkpoint', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--size', type=int, default=256)
    args = parser.parse_args()
    if args.size < 32 or args.size % 16:
        raise ValueError('export size must be >=32 and divisible by 16')
    checkpoint = torch.load(
        args.checkpoint, map_location='cpu', weights_only=True,
    )
    if checkpoint.get('architecture') != 'HBeautyAppearanceNet-v0.1':
        raise ValueError('unexpected architecture')
    if 'validation' not in checkpoint or 'manifest_sha256' not in checkpoint:
        raise ValueError('training validation and source manifest are required')

    network = AppearanceNet(width=int(checkpoint['width'])).eval()
    network.load_state_dict(checkpoint['weights'], strict=True)
    rgb = torch.zeros(1, 3, args.size, args.size)
    masks = torch.zeros(1, 4, args.size, args.size)
    args.output.parent.mkdir(parents=True, exist_ok=True)

    torch.onnx.export(
        network, (rgb, rgb, masks, masks),
        str(args.output), opset_version=17,
        input_names=[
            'source', 'reference', 'source_regions', 'reference_regions',
        ],
        output_names=['transferred'],
        dynamo=False,
    )
    data = args.output.read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    manifest = {
        'schema': 'hbeauty.neural.appearance.v0.1',
        'status': 'experimental_not_sota_approved',
        'offline_deployment_approved': False,
        'sha256': digest,
        'bytes': len(data),
        'input_resolution': [args.size, args.size],
        'dtype': 'float32',
        'mask_regions': ['eyes', 'lips', 'cheeks', 'complexion'],
        'inputs': [
            'source', 'reference', 'source_regions', 'reference_regions',
        ],
        'output': 'transferred',
        'training_manifest_sha256': checkpoint['manifest_sha256'],
        'validation': checkpoint['validation'],
    }
    (args.output.parent / 'manifest.json').write_text(
        json.dumps(manifest, indent=2), encoding='utf-8',
    )
    print(json.dumps({
        'file': str(args.output), 'sha256': digest, 'bytes': len(data),
    }))


if __name__ == '__main__':
    main()
