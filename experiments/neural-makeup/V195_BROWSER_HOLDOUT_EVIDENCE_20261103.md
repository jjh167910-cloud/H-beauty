# v19.5 high-contrast local makeup matte — bounded evidence, 3 November 2026

**Research only; not a trained commercial state-of-the-art model.** The new standalone v19.5 offline app ZIP was built and verified. It is not merged into main or published to Cloudflare or AppDeploy.

## A/B study on existing generated portraits

Actual browser Canvas transfer, 810 × 1080 native resolution, same single model and same landmark mesh throughout. 13 exploratory look variations were checked first, then **28 previously unused makeup looks**. MAE is mean absolute RGB channel difference inside eye or lip masks relative to the reference image. Lower is better reference matching, **not** an identity similarity or human photorealism score.

| Source | Region | v19.4 MAE | v19.5 MAE | Reduction | Looks improved |
|---|---|---:|---:|---:|---:|
| Exploratory 13 styles | Eyes | 6.732 | 5.435 | 19.27% | 13/13 |
| Exploratory 13 styles | Lips | 2.351 | 1.399 | 40.51% | 12/13 |
| Unused 28 styles | Eyes | 5.632 | 4.567 | 18.91% | 27/28 |
| Unused 28 styles | Lips | 4.054 | 2.114 | 47.85% | 26/28 |

Bootstrap absolute-improvement CI on the unused 28 styles, 20,000 style-level resamples, seed 2026: eyes [0.796, 1.362], lips [1.009, 3.028]. These confidence bounds **do not extrapolate to new people**.

Known regressions: sun-kissed had 0.068 worse eye MAE and 1.015 worse lip MAE; boho-bride had 0.295 worse lip MAE. The three-version selector permits A/B and manual fallback for those looks.

## Pixel preservation and package QA

The source and reference renderings of electric-blue, classic-smokey, bold-glam, henna-night, no-makeup, sun-kissed, plus a same-image control were actually run through Chromium Canvas at 810×1080. Zero off-mask pixel changes, zero alpha byte changes, zero changes at all-zero strengths, zero changes for self-reference.

Standalone ZIP SHA256: `6c9147b0429a108b399c043c49315a0394294797241ecd540e21eaecdbdce69c`. Its 262 entries pass ZIP CRC, 246 service-worker assets and 29 core cached assets are all present. JS syntax passed; the 390×844 static mobile preview has no horizontal overflow. v19.3 and v19.4 rendering paths are retained as selectable fallback methods.

Full face-landmark MediaPipe execution was **attempted** in an in-memory Chromium page using bundled JS, WASM and model. The base64-encoded 4.8MB model decoded into a valid ZIP bundle and the graph initialized, but this container Chrome exposes no WebGL1/2 context; inference could not complete. Physical Android inference remains unverified.

The research ZIP is a ChatGPT attachment, not checked into this repo. The pure v19.5 contrast kernel is committed as `experiments/neural-makeup/v195_contrast_kernel.mjs` with Node regression tests. No neural checkpoint or user face photos are committed.

## Blocked for SOTA certification

No independently held-out multiple identities, varied skin tones and poses, blind human portrait comparisons, real Android latency/memory/thermal tests, or commercially cleared trained SOTA weights. The downloaded package is an *experimental* candidate and must not be called the market leader. AppDeploy hosting was rate-limited by its daily free-tier cap until 2026-11-04 00:00 UTC; the live v19.2 preview and salon production remain unchanged.

Design context: [Chau et al., WACV 2026](https://openaccess.thecvf.com/content/WACV2026/html/Chau_Towards_High-Fidelity_Identity-Preserving_Real-Time_Makeup_Transfer_Decoupling_Style_Generation_WACV_2026_paper.html), [Gao et al., CVPR 2026](https://openaccess.thecvf.com/content/CVPR2026/html/Gao_Diffusion-Based_Makeup_Transfer_with_Facial_Region-Aware_Makeup_Features_CVPR_2026_paper.html). No external third-party model/code is imported.
