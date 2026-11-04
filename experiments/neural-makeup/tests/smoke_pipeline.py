"""End-to-end CPU smoke test; synthetic shapes are not photorealism evidence."""
from __future__ import annotations

import json
import sys
import tempfile
from pathlib import Path
from argparse import Namespace
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from train import train


def synthetic_face(seed: int, makeup: bool):
    rng = np.random.default_rng(seed)
    h = w = 48
    yy, xx = np.mgrid[:h, :w]
    shape = ((xx - 24) / 19) ** 2 + ((yy - 24) / 22) ** 2 <= 1
    skin = np.array([194 + seed * 5, 142 + seed * 3, 116 + seed], dtype=np.uint8)
    image = np.zeros((h, w, 3), dtype=np.uint8)
    image[:] = (230, 225, 221)
    image[shape] = skin
    image = np.clip(image.astype('int16') + rng.integers(-2, 3, size=image.shape), 0, 255).astype('uint8')
    masks = np.zeros((4, h, w), dtype='float32')
    masks[0, 13:19, 12:35] = 1
    masks[1, 30:35, 19:30] = 1
    masks[2, 23:30, 10:19] = .6
    masks[2, 23:30, 29:39] = .6
    masks[3] = shape.astype('float32') * .25
    if makeup:
        image[13:19, 12:35] = (110, 66, 100)
        image[30:35, 19:30] = (162, 57, 82)
    return image, masks


def main():
    with tempfile.TemporaryDirectory(prefix='hbeauty-neural-smoke-') as folder:
        root = Path(folder)
        rows = []
        for ident, split in [(1, 'train'), (2, 'val')]:
            source, masks = synthetic_face(ident, False)
            reference, ref_masks = synthetic_face(ident + 10, True)
            target, _ = synthetic_face(ident, True)
            name = 'sample-' + str(ident) + '.npz'
            np.savez_compressed(
                root / name, source=source, reference=reference,
                target=target, source_regions=masks, reference_regions=ref_masks,
            )
            rows.append(json.dumps({
                'file': name, 'subject_id': 'synthetic-' + str(ident),
                'split': split,
                'rights': 'generated procedural test data, no person',
            }))
        manifest = root / 'manifest.jsonl'
        manifest.write_text('\n'.join(rows), encoding='utf-8')
        out = root / 'model'
        result = train(Namespace(
            manifest=manifest, data_root=root, output=out, epochs=1,
            batch=1, size=32, width=16, lr=3e-4,
            seed=2026, cpu=True,
        ))
        assert (out / 'best.pt').is_file()
        assert result['val_subjects'] == 1 and result['train_subjects'] == 1
        assert result['history'][0]['protected_mae'] == 0.0
        assert np.isfinite(result['history'][0]['loss'])
        print('PASS: synthetic training, validation and hard off-mask identity preservation')


if __name__ == '__main__':
    main()
