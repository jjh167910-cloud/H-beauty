import importlib.util
from pathlib import Path
import numpy as np,cv2,pytest

SRC=Path(__file__).resolve().parents[1]/"v207_eyeshadow_atlas.py"
spec=importlib.util.spec_from_file_location("eyematerial",SRC)
M=importlib.util.module_from_spec(spec)
spec.loader.exec_module(M)
cv2.setNumThreads(1)

def fixture():
    original=np.full((128,128,3),128,dtype=np.uint8)
    mask=np.zeros_like(original)
    mask[18:106,16:112,0]=255
    original[25:97,25:105]=[83,94,152]
    for x in range(25,105,4):
        original[58:92,x:x+1]=[65,67,70]
    return original,mask

def test_lip_cheek_and_outside_eye_exact_original_atlas_bytes():
    image,mask=fixture()
    candidate=M.shadow_only(image,mask)
    np.testing.assert_array_equal(candidate[mask[...,0]==0],image[mask[...,0]==0])
    assert candidate.dtype==image.dtype and candidate.shape==image.shape

def test_model_specific_thin_strokes_reduced_without_erasing_broad_eyeshadow():
    image,mask=fixture()
    result=M.shadow_only(image,mask)
    def hf(arr):
        delta=(arr.astype(np.float32)-128)*2
        return np.mean(np.abs((delta-cv2.GaussianBlur(delta,(0,0),2.5))[mask[...,0]>10]))
    assert hf(result)<hf(image)*.78
    original=np.mean((image[35:50,30:90].astype(np.float32)-128)*2,axis=(0,1))
    changed=np.mean((result[35:50,30:90].astype(np.float32)-128)*2,axis=(0,1))
    assert np.max(np.abs(original-changed))<13

def test_deterministic_and_bad_shapes_fail_closed():
    image,mask=fixture()
    np.testing.assert_array_equal(M.shadow_only(image,mask),M.shadow_only(image,mask))
    with pytest.raises(ValueError):M.shadow_only(image,mask[:50])
    with pytest.raises(ValueError):M.shadow_only(image,mask,sigma=np.nan)
