"""Device-independent smoke/regression tests; not photorealism claims."""
import sys
from pathlib import Path

import pytest
import torch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from model import AppearanceNet, REGIONS, training_loss


def sample(size=48):
    source = torch.rand(1, 3, size, size)
    reference = torch.rand_like(source)
    smask = torch.zeros(1, 4, size, size)
    rmask = torch.zeros_like(smask)
    smask[:, 0, 7:19, 8:32] = 1
    smask[:, 1, 26:36, 17:35] = 1
    rmask[:, 0, 7:19, 8:32] = 1
    rmask[:, 1, 26:36, 17:35] = 1
    return source, reference, smask, rmask


def test_valid_forward():
    items = sample()
    result = AppearanceNet(width=16)(*items)
    assert result.shape == items[0].shape
    assert torch.isfinite(result).all()


def test_zero_mask_preserves_source_exactly():
    source, reference, smask, rmask = sample()
    smask.zero_()
    output = AppearanceNet(width=16)(source, reference, smask, rmask)
    assert torch.equal(output, source)


def test_outside_mask_is_bit_exact():
    source, reference, smask, rmask = sample()
    output = AppearanceNet(width=16)(source, reference, smask, rmask)
    protected = (smask.sum(dim=1, keepdim=True) == 0).expand_as(source)
    assert torch.equal(output[protected], source[protected])


def test_trainable_gradient_and_finite_loss():
    source, reference, smask, rmask = sample()
    net = AppearanceNet(width=16)
    prediction = net(source, reference, smask, rmask)
    target = (source + .2 * smask[:, :1]).clamp(0, 1)
    loss = training_loss(prediction, target, source, smask)
    loss.backward()
    assert torch.isfinite(loss)
    assert net.head.weight.grad is not None
    assert net.head.weight.grad.abs().sum() > 0


def test_invalid_region_count_fails():
    source, reference, smask, rmask = sample()
    with pytest.raises(ValueError):
        AppearanceNet(width=16)(source, reference, smask[:, :3], rmask)


def test_region_order_is_stable():
    assert REGIONS == ('eyes', 'lips', 'cheeks', 'complexion')
