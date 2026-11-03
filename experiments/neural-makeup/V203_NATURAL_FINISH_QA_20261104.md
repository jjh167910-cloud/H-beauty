# H-Beauty v20.3 Natural Finish — verified bounded evidence

**Date:** 4 November 2026. **Research only, NOT deployed and NOT independently certified as state of the art.**

## Change

The standalone `HBeauty_AI_TryOn_v20_3_Natural_Finish_CPU_Research.zip` is based on the previously verified v20.2 offline CPU face-detection/478-landmark and geometry-safe makeup prototype. It adds:
- **42 optical-natural PNG cosmetic delta atlases** generated from the existing aligned signed-difference atlases, plus all 42 originals retained unmodified.
- Eye-only normalized Gaussian decomposition (2.6px), with preferential attenuation of thin high-contrast dark strokes while preserving coarse eyeshadow color. This is a deterministic graphics algorithm, not a new trained cosmetic model.
- Optical protection core remains **exact original photo pixels** in sclera/iris/inner mouth. A bounded distance-based feather blends the makeup directly *outside* those regions, reducing hard polygon-mask edges; radius 0 is the exact old behavior.
- Persian `cpu-tryon.html` selector for **Natural** (default) and **Original** (legacy dramatic) appearance. An old or failed render is invalidated when the user changes finish.
- Reproducible source code `v203_natural_atlas.py`, `v203_soft_protection.mjs`, `v203_detail_atlas.js` and two new test suites in the GitHub research branch. Full offline package includes generated images and the updated page, not merged into main.

## Measured source-data quality proxies

Across **42** preexisting catalog atlases:
- Mean 2.6px high-frequency eye delta signal: **1.7852 → 1.3439** RGB units, **24.72% lower**; 41 atlases modified, 1 effectively unchanged.
- Mean 8px-blurred coarse eyeshadow difference: only **0.0995 RGB units**, preserving broad chromatic fields. These are **signal-fidelity metrics**, NOT independent photorealism, identity preservation, skin-tone diversity or human preference measurements.
- Four makeup styles were rasterized using the **actual JS renderer** onto the same non-reference sample portrait. The separate A/B attachment shows Electric Blue, Arabic Glam, Classic Smokey and Strawberry.
- **7,382 strict-core optical pixels** in the Electric Blue test remained byte-exact original photo pixels, with 0 alpha changes. Pixel-identity protection in the eye/mouth core does not prove that every border and lash is realistic.
- `Original` mode at feather=0 was **pixel-identical** to v20.2's output in the same test.
- Original image dimensions survived a **1620×2160** test with scaled 478 landmarks (native canvas, not native 2K makeup synthesis). Approximate **377ms at 810×1080** and **749ms at 1620×2160** for the local graphics stage; not mobile Android latency and excludes model startup.

## Artifact integrity

Standalone ZIP: **49,924,403 bytes**, **397 files**, SHA256:
`557742f124ceb1adf27aa495fab59b61923f0390949532fc359f1239615ec5a1`.

Verified: ZIP CRC, **363/363** offline asset paths, **150/150** install-core assets (including root route), **42/42** hashed natural atlas PNGs, **34** root JavaScript syntax checks, official YuNet MIT and face-mesh Apache-2.0 ONNX SHA pins, Natural/Original selector and no horizontal overflow at **320/390/768/1280px**. Both original and natural atlases cached. Existing salon Cloudflare production and live independent v19.2 preview unchanged.

## Outstanding release gates

The source atlas uses synthetic same-face makeup references. No independent diverse real-person comparison, professional blind perceptual test, real Android install/thermal/latency validation, verified commercial image-rights audit, true-native 2K cosmetic synthesis, or model validated against current leading 2026 diffusion approaches has been completed. The *new page* full upload-to-export still has not passed a complete hosted-URL browser acceptance test due local navigation restrictions. Attenuated detail can make dramatic looks less distinct; Original remains an option.

**Decision: GO for isolated expert review. NO-GO for commercial production or SOTA marketing.**

Relevant external research: [Chau et al., WACV 2026](https://openaccess.thecvf.com/content/WACV2026/html/Chau_Towards_High-Fidelity_Identity-Preserving_Real-Time_Makeup_Transfer_Decoupling_Style_Generation_WACV_2026_paper.html), [Gao et al., CVPR 2026](https://openaccess.thecvf.com/content/CVPR2026/html/Gao_Diffusion-Based_Makeup_Transfer_with_Facial_Region-Aware_Makeup_Features_CVPR_2026_paper.html). No paper's trained model weights were imported.
