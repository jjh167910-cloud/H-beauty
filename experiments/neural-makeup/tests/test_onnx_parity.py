"""Check PyTorch / ONNX Runtime numerical parity of the actual network."""
import sys
from pathlib import Path

import numpy as np
import pytest
import torch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from model import AppearanceNet

onnx = pytest.importorskip('onnx')
ort = pytest.importorskip('onnxruntime')


def test_real_network_onnx_export_and_cpu_parity(tmp_path):
    torch.manual_seed(2026)
    model = AppearanceNet(width=16).eval()
    src = torch.rand(1, 3, 32, 32)
    ref = torch.rand(1, 3, 32, 32)
    masks = torch.zeros(1, 4, 32, 32)
    masks[:, 0, 6:18, 8:24] = 1
    ref_masks = masks.clone()

    expected = model(src, ref, masks, ref_masks).detach().numpy()
    path = tmp_path / 'appearance.onnx'
    torch.onnx.export(
        model, (src, ref, masks, ref_masks), str(path),
        input_names=['source', 'reference', 'source_regions', 'reference_regions'],
        output_names=['transferred'],
        opset_version=17,
        dynamo=False,
    )
    onnx.checker.check_model(onnx.load(str(path)))
    session = ort.InferenceSession(str(path), providers=['CPUExecutionProvider'])
    actual = session.run(['transferred'], {
        'source': src.numpy(),
        'reference': ref.numpy(),
        'source_regions': masks.numpy(),
        'reference_regions': ref_masks.numpy(),
    })[0]

    assert actual.shape == expected.shape
    np.testing.assert_allclose(actual, expected, atol=1e-4, rtol=1e-4)
    no_makeup = masks.numpy().sum(axis=1, keepdims=True) == 0
    assert np.array_equal(actual[no_makeup.repeat(3, axis=1)],
                          src.numpy()[no_makeup.repeat(3, axis=1)])
