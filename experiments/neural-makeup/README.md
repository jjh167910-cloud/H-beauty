# H-Beauty experimental neural makeup transfer (v20 research branch)

**Status: a verified training pipeline, not a trained production model, and not yet state of the art.**
This folder is isolated from the Cloudflare salon and deployed v19.2 preview. Nothing here automatically runs in production.

## Architecture

1. Inputs: source portrait, reference makeup portrait, and four aligned soft masks per image: eyes, lips, cheeks, complexion.
2. A small learnable convolutional encoder extracts source features while reference features are **pooled separately within makeup regions**. Reference face geometry is not directly copied to the source.
3. A neural fusion and decoder predict a cosmetic RGB delta plus alpha. Pixels strictly outside the editable masks are copied **exactly** from the source.
4. Train using identity-consistent source/reference/target triples. Later, export a SHA256-locked ONNX model and validate on physical Android devices.

This original implementation is informed by the research direction—not borrowed weights—of [WACV 2026 decoupled cosmetic extraction/rendering](https://openaccess.thecvf.com/content/WACV2026/html/Chau_Towards_High-Fidelity_Identity-Preserving_Real-Time_Makeup_Transfer_Decoupling_Style_Generation_WACV_2026_paper.html), [FPMT](https://github.com/Snowfallingplum/FPMT), [MagicMakeup](https://github.com/vivoCameraResearch/Magic-Makeup), and [ART](https://github.com/csbowei/ART). Never redistribute research-only model weights in the commercial salon.

## Data contract

Use consented, commercially usable .npz pairs with keys:

- source, reference, target: matching H×W×3 uint8 RGB; target is the **same person as source** with the target makeup.
- source_regions, reference_regions: 4×H×W finite soft masks, ordered eyes, lips, cheeks, complexion.

Manifest (JSONL, one per sample):

    {"file":"train/sample001.npz","subject_id":"person001","split":"train","rights":"written model-training and distribution permission"}

The loader enforces subject-disjoint train/validation splits and rejects missing rights labels and paths outside the data directory. Do not commit real face photos.

## Commands

    pip install -r requirements.txt
    pytest tests -q
    python train.py --data-root /private/data --manifest /private/data/pairs.jsonl --output /private/model --epochs 40 --size 256
    pip install 'onnx>=1.16,<2'
    python export_onnx.py --checkpoint /private/model/best.pt --output /private/model/appearance.onnx --size 256

A small synthetic CPU smoke test demonstrated working forward/backward training, **not** image quality. The exported manifest intentionally flags the model unapproved.

## Mandatory release gates

- Real paired, rights-cleared training data, subject-disjoint tests, and consent.
- Blinded comparisons against v19.2 and permitted published methods on identical source/reference pairs, with confidence intervals for identity, makeup fidelity, skin texture and artifact avoidance.
- Exact preservation outside cosmetic regions; evaluate leakage at mask edges, occlusions, expressions, skin-tone groups and lighting.
- True native-resolution reconstructions and real Android thermal, memory, latency and fully offline validation.
- Only promote validated weights with a verified SHA256, model card, reproducible results and a rollback-safe installer.

**Not implemented yet:** trained quality model, automatic semantic face masks, ONNX browser integration, Android field validation, or state-of-the-art certification.
