"""Synthetic-only QA: v20.3 natural-finish atlas, no user photographs."""
from pathlib import Path
import importlib.util
import numpy as np
import pytest

MODULE=Path(__file__).resolve().parents[1]/"v203_natural_atlas.py"
SPEC=importlib.util.spec_from_file_location("v203_natural_atlas",MODULE)
M=importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(M)

def fixture():
    a=np.full((80,80,3),128,dtype=np.uint8)
    region=np.zeros_like(a)
    region[15:60,12:72,0]=255
    # broad blue shadow and a too-black 1px feature
    a[20:55,14:70]=[105,115,176]
    a[30,14:70]=[35,35,35]
    return a,region

def test_no_edits_outside_eye_region_and_optical_identity():
    a,region=fixture()
    b=M.naturalize(a,region)
    np.testing.assert_array_equal(b[region[...,0]==0],a[region[...,0]==0])
    assert b.shape==a.shape and b.dtype==a.dtype

def test_dark_high_frequency_ink_is_attenuated_without_removing_blue_shadow():
    a,region=fixture()
    b=M.naturalize(a,region)
    # one-pixel black ink is less extreme in a softened variant.
    assert np.mean(b[30,30:50])>np.mean(a[30,30:50])
    # nearby broad cobalt shadow remains close to original.
    assert np.max(abs(b[40,30].astype(np.int16)-a[40,30].astype(np.int16)))<5

def test_deterministic_atlas_encoding():
    a,region=fixture()
    np.testing.assert_array_equal(M.naturalize(a,region),M.naturalize(a,region))

def test_fail_closed_on_bad_dimensions():
    a,region=fixture()
    with pytest.raises(ValueError):
        M.naturalize(a,region[:40])
