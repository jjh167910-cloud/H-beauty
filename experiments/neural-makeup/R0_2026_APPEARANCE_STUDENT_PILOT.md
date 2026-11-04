# H-Beauty R0 — original research pilot (2026-11-04)

**Separate research branch. Does not deploy. No human data, licensed face-model weights or commercial makeup-transfer checkpoint in this study.**

## Research question
Can a tiny, reference-conditioned per-region RGB-delta predictor outperform simple color-transfer baselines on a procedural cosmetic generator, while preserving source pixels outside allowed cosmetics masks?

## Experiment
- Four procedural fixed facial regions: eyes, lips, cheeks, complexion.
- Source and makeup reference are different synthetic RGB skin appearances.
- Synthetic pigment and opacity produce a reference makeup image and a paired target.
- Features: 19 numeric inputs per facial region (source/ref color, estimated bare colors, reference contrast, one-hot region).
- Model: 2×64 SiLU MLP, **5,635 parameters**, 3 predicted color deltas per region.
- Renderer: applies synthetic cosmetic matte to original source, copying off-region pixels exactly.
- Seeds: `20261104`, `20261105`, `20261106`. Per-seed 320 synthetic train, 96 withheld test samples, 45 epochs, CPU PyTorch; no real face images.
- Checkpoint is TorchScript with procedural training only. **Not a pretrained high-quality makeup model, not an H-Beauty ONNX adapter checkpoint.**

## Synthetic RGB mean absolute error (0–255; lower is better)
| Method | Seed 1104 | 1105 | 1106 | Three-seed mean |
|---|---:|---:|---:|---:|
| No makeup | 8.070 | 8.132 | 7.916 | 8.039 |
| Direct reference | 13.214 | 13.255 | 13.592 | 13.354 |
| Reference contrast | 6.329 | 6.599 | 6.439 | 6.456 |
| **Learned region student** | **4.419** | **4.241** | **4.324** | **4.328** |

First-seed paired bootstrap difference vs contrast: 1.909 RGB levels (95% CI 1.526–2.289, n=96, 5000 resamples). Model improved in 81/96 cases. In a fresh retraining ablation, removing reference inputs raises error to **5.546**; removing region-onehot features yields **4.534**. All off-region changes are exactly zero by construction.

**No scientific claim about photographic realism, performance across actual skin tones, superior quality vs consumer apps, or commercial model readiness follows from these numbers.**

## Source / reproducibility availability
The complete Python experiment (generator, training, ablations, bootstrap, 6 unit tests), synthetic preview, checkpoints, machine-readable output and 7-page research report were generated together in `HBeauty_Applied_Research_2026.zip` attached to the ChatGPT conversation. The GitHub connector's text-only writes cannot transfer the local ZIP directly. This GitHub branch preserves the protocol and results independently of the commercial app.

## Identifiability
An observed reference RGB=.50 may be produced by (bare skin=.30, pigment=.70, alpha=.50) or (bare skin=.40, pigment=.80, alpha=.25). Applying these two physically different cosmetics to source skin=.20 yields .45 vs .35: a single reference image does not determine pigment+opacity without priors.

## Literature and license gates
- WACV 2026 Chau et al. extraction + graphics rendering is the most relevant architectural direction: https://openaccess.thecvf.com/content/WACV2026/html/Chau_Towards_High-Fidelity_Identity-Preserving_Real-Time_Makeup_Transfer_Decoupling_Style_Generation_WACV_2026_paper.html
- CVPR 2026 FRAM: CC BY-NC-SA 4.0 code, GPU diffusion: https://github.com/zaczgao/Facial_Region-Aware_Makeup
- ECCV 2026 MagicMakeup: explicitly noncommercial research, dependent on FLUX Kontext dev: https://github.com/vivoCameraResearch/Magic-Makeup
- ECCV 2026 ART: LoRA diffusion dependent on noncommercial FLUX Kontext dev: https://github.com/csbowei/ART
- FFHQ dataset license: CC BY-NC-SA 4.0; not clear for commercial training: https://github.com/NVlabs/ffhq-dataset/blob/master/LICENSE.txt

## Next falsifiable study (R1)
1. Explicit-consent, commercially usable same-person before/after target photos plus independent makeup references, with true subject/session-disjoint splits and rights audit.
2. Train an uncertainty-aware region-conditioned pigment+alpha map predictor, not whole-face identity replacement. Preserve source alpha and all original pixels outside the authorized matte.
3. Compare to deterministic v27.11 renderer, source-contrast and legally tested published baselines on **identical subjects and looks**, using blind makeup artist scores, region fidelity, calibrated errors and failure slices.
4. Physical offline Android cold/warm/airplane-mode tests and private, source-hash-verifiable staging before release.

**Research status: pilot validated on simulator only; no paper submitted, no state-of-the-art or production certification, production Cloudflare app untouched.**
