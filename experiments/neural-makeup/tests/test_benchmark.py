"""Benchmark semantics: no metric is a photorealism/identity certificate."""
import sys
from pathlib import Path
import numpy as np
import torch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from benchmark import benchmark, bootstrap_interval


def test_bootstrap_ci_ignores_single_sample():
    assert bootstrap_interval(np.array([.3])) == [None, None]
    lo, hi = bootstrap_interval(np.array([.2, .2, .2]))
    assert abs(lo - .2) < 1e-8
    assert abs(hi - .2) < 1e-8


def test_masked_baseline_comparison_and_no_sota_claim():
    source = torch.zeros(2, 3, 32, 32)
    reference = source.clone()
    reference[:, :, 10:20, 10:20] = .5
    target = reference.clone()
    mask = torch.zeros(2, 4, 32, 32)
    mask[:, 1, 10:20, 10:20] = 1
    class PerfectFake(torch.nn.Module):
        def forward(self, s, r, sm, rm):
            gate = sm.sum(1, keepdim=True).clamp(0, 1)
            return torch.where(gate > 0, r, s)
    result = benchmark(PerfectFake(), [(source, reference, target, mask, mask)])
    assert result['sample_count'] == 2
    assert abs(result['baseline_mean_mae'] - .5) < 1e-6
    assert result['model_mean_mae'] == 0.0
    assert result['outside_mask_max_abs'] == 0.0
    assert result['superior_to_baseline_on_this_dataset']
    assert not result['state_of_the_art_certified']
    assert not result['photorealism_certified']
