"""Dataset integrity tests: no train/test identity leakage or path traversal."""
import sys
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from train import PairedAppearanceDataset, parse_manifest


def write_pair(root):
    image = np.zeros((48, 48, 3), dtype=np.uint8)
    masks = np.zeros((4, 48, 48), dtype=np.float32)
    masks[0, 8:22, 8:32] = 1
    np.savez(root / 'p.npz',
             source=image, reference=image, target=image,
             source_regions=masks, reference_regions=masks)


def test_identity_disjoint_required(tmp_path):
    write_pair(tmp_path)
    manifest = tmp_path / 'pairs.jsonl'
    manifest.write_text('\n'.join([
        '{"file":"p.npz","subject_id":"same","split":"train","rights":"owner"}',
        '{"file":"p.npz","subject_id":"same","split":"val","rights":"owner"}',
    ]))
    with pytest.raises(ValueError, match='identity leakage'):
        parse_manifest(manifest, tmp_path)


def test_valid_shapes_and_licenses(tmp_path):
    write_pair(tmp_path)
    manifest = tmp_path / 'pairs.jsonl'
    manifest.write_text('\n'.join([
        '{"file":"p.npz","subject_id":"a","split":"train","rights":"owner"}',
        '{"file":"p.npz","subject_id":"b","split":"val","rights":"owner"}',
    ]))
    rows = parse_manifest(manifest, tmp_path)
    tensors = PairedAppearanceDataset(rows, 'train', 32)[0]
    assert all(t.shape == (3, 32, 32) for t in tensors[:3])
    assert all(t.shape == (4, 32, 32) for t in tensors[3:])


def test_escape_from_data_root_rejected(tmp_path):
    manifest = tmp_path / 'pairs.jsonl'
    manifest.write_text(
        '{"file":"../secret.npz","subject_id":"a","split":"train","rights":"owner"}'
    )
    with pytest.raises(ValueError, match='outside data root'):
        parse_manifest(manifest, tmp_path)


def test_missing_rights_rejected(tmp_path):
    write_pair(tmp_path)
    manifest = tmp_path / 'pairs.jsonl'
    manifest.write_text(
        '{"file":"p.npz","subject_id":"a","split":"train"}'
    )
    with pytest.raises(ValueError, match='missing rights'):
        parse_manifest(manifest, tmp_path)
