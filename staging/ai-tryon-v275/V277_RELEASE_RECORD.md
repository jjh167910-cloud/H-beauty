# H-Beauty v27.7 — real six-class mask-edge refinement

**Engineering RC only. Production NO-GO. Public staging NOT deployed.**

## Artifacts and provenance
- Complete source archive `HBeauty_AI_TryOn_v27_7_Soft_Edge_SixClass_RC.zip`: 55,690,487 bytes, SHA-256 `94abd6960e4d6888d1d7b303c6a130724ffab505ce3573e4fec2d1a5f8d24df4`.
- Isolated staging archive `HBeauty_v27_7_Isolated_Staging_Kit.zip`: 52,772,352 bytes, SHA-256 `3baa0804b30c5cfa41c7c839c618a43b7aa3b143d1f9dfa5d1ace82fe8c90e9a`.
- Bundled authentic 6-class model 8,290,292 bytes, SHA-256 `d2cd8f253fb44f135900753d0124c5228285165cf2a8f8100fbe958ad7bc55df`, unchanged from v27.6.
- Full static asset hashes 339/339; CPU subset 93/93; ZIP extraction and independent manifest verification PASS.
- Source v27.7 is **currently in the generated conversation ZIP, not this public repository**. The connected GitHub tools do not expose a secure binary transfer from the conversation runtime. The staging deployment workflow is pinned to this exact ZIP and will fail before any Cloudflare call unless the verified Release asset exists.

## Implemented difference from v27.6
Coarse nearest-neighbor output-grid enlargement was replaced by bilinear interpolation of **protective alpha on the 256×256 model grid**. The same conservative hair/accessories confidence thresholds and 478-landmark-restricted body-skin overlap logic are preserved.

Real Chromium LiteRT.js WASM CPU (WebGL disabled) A/B on a single 810×1080 sample, same original model:
- Abrupt horizontal adjacent alpha jumps ≥128: 1,706 (old) → 0 (new).
- Abrupt vertical jumps ≥128: 1,103 → 0.
- Soft-protected pixels: 45,730 → 61,441.
- Fully protected pixels: 92,047 → 85,183.
- Nonzero protected pixels: 137,777 → 146,624.

This is **edge-continuity engineering evidence, NOT precision/recall, photorealism or independent facial-feature validation**.

## Regression evidence
- 147/147 JavaScript Node tests; 12/12 Python evaluation and 4/4 release/privacy tests.
- Real ONNX/WASM 478-landmark smoke on 810×1080 test portrait: 1 face, 478 landmarks, 60,598 original makeup edited pixels, alpha unchanged.
- Real LiteRT.js CPU sample without WebGL: PASS; masks produced by the exact bundled weights.

## Remaining mandatory gates
- Physical Android HTTPS/WebCrypto and offline relaunch.
- Ground-truth segmentation mask IoU over varied subjects.
- Commercial rights review of model checkpoint and third-party assets.
- Genuine trained neural appearance-transfer model (the experimental ONNX bridge is not proof of this).
- Blind human review of photorealism and identity preservation.
- Public staging deployment with Cloudflare permission/verified binary transfer.

**No production or public staging publication has been performed.**