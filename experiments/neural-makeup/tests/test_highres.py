"""Native-size tiling contracts, blending and fail-closed behavior."""
import sys
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from highres_inference import run_tiled, tile_starts


class FakeModel:
    """Predicts a uniform red change across every pixel of each tile."""
    def __init__(self, invalid=False):
        self.invalid = invalid
        self.calls = 0

    def run(self, names, inputs):
        self.calls += 1
        n, c, h, w = inputs['source'].shape
        assert (n, c) == (1, 3)
        assert inputs['source_regions'].shape == (1, 4, h, w)
        assert inputs['reference_regions'].shape == (1, 4, h, w)
        result = inputs['source'].copy()
        result[:, 0] = np.clip(result[:, 0] + .2, 0, 1)
        if self.invalid:
            result[0, 0, 0, 0] = np.nan
        return [result]


def fixtures(height=340, width=365):
    src = np.zeros((height, width, 3), dtype=np.uint8)
    src[:] = [100, 120, 130]
    ref = src.copy()
    source_masks = np.zeros((4, height, width), dtype=np.float32)
    source_masks[1, height // 3:2 * height // 3, width // 3:2 * width // 3] = 1
    ref_mask = source_masks.copy()
    return src, ref, source_masks, ref_mask


def test_positions_cover_right_boundary_without_duplicate():
    assert tile_starts(129, 64, 16) == [0, 48, 65]
    assert tile_starts(64, 64, 16) == [0]
    assert tile_starts(22, 64, 16) == [0]


def test_tiling_preserves_native_resolution_and_mask_bit_exactness():
    src, ref, m1, m2 = fixtures()
    fake = FakeModel()
    rendered = run_tiled(fake, src, ref, m1, m2, tile=64, overlap=16)
    assert rendered.shape == src.shape
    assert rendered.dtype == np.uint8
    assert fake.calls > 1
    protected = m1.sum(0) == 0
    assert np.array_equal(rendered[protected], src[protected])
    edited = m1[1] == 1
    assert np.all(rendered[edited, 0] == 151)
    assert np.all(rendered[edited, 1] == 120)
    assert np.all(rendered[edited, 2] == 130)


def test_small_image_padding_still_protects_outside_mask():
    src, ref, m1, m2 = fixtures(40, 50)
    output = run_tiled(FakeModel(), src, ref, m1, m2, tile=64, overlap=16)
    assert output.shape == src.shape
    assert np.array_equal(output[m1.sum(0) == 0], src[m1.sum(0) == 0])


def test_bad_mask_shape_and_nan_output_rejected():
    src, ref, m1, m2 = fixtures(60, 75)
    with pytest.raises(ValueError, match='masks'):
        run_tiled(FakeModel(), src, ref, m1[:3], m2, tile=64, overlap=16)
    with pytest.raises(RuntimeError, match='nonfinite'):
        run_tiled(FakeModel(invalid=True), src, ref, m1, m2, tile=64, overlap=16)


def test_invalid_tiling_parameters_rejected():
    src, ref, m1, m2 = fixtures(48, 48)
    with pytest.raises(ValueError, match='tile'):
        run_tiled(FakeModel(), src, ref, m1, m2, tile=64, overlap=32)
    with pytest.raises(ValueError, match='budget'):
        run_tiled(FakeModel(), src, ref, m1, m2, tile=64, overlap=16,
                  max_pixels=100)
