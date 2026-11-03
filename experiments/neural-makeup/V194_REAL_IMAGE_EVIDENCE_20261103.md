# H-Beauty v19.4 controlled reference-matte verification · 3 November 2026

Status: experimental graphics-based cosmetic matte, not a trained SOTA renderer. Production Cloudflare salon and the separate AppDeploy v19.2 preview remain unchanged.

## Corrected defects

The previous transfer computed a reference position from barycentric mesh coordinates for pixel centers (x+0.5, y+0.5), but bilinear sampling expects image array pixel indices (x, y). Correcting both sampling offsets by -0.5 eliminated 19,291 unnecessary changes when using a portrait as its own reference on a test image: 0 changes afterwards.

The original UI used a shared revision token for simultaneous original/reference uploads. Independent per-image tokens now allow two rapidly loaded photos to complete. A controlled Chromium UI test with mocked face detection passed.

## Exploratory real Chromium Canvas image test

All images of ONE PERSON in the same camera pose: source refined_soft-glam.png and four alternate-look outputs from the prior v19.1 evidence, with shared bundled 478 landmarks and SciPy Delaunay mesh. The graphics color-transfer algorithm was actually executed in Chromium Canvas through page.set_content(), without remote services.

| Reference | v19.3 eye MAE | v19.4 eye MAE | v19.3 lip MAE | v19.4 lip MAE |
| --- | ---: | ---: | ---: | ---: |
| Electric Blue | 12.475 | 10.556 | 1.892 | 1.026 |
| Classic Smokey | 13.531 | 9.479 | 4.728 | 2.730 |
| Strawberry | 9.984 | 3.193 | 6.157 | 4.236 |
| Arabic Glam | 16.671 | 12.275 | 3.817 | 2.547 |

MAE = per-channel absolute difference to same-person target within landmark-derived makeup masks, in 0–255 RGB units. Lower is closer pixel color, not proof of makeup realism. These four references influenced development, so this is NOT an independent held-out benchmark. There is no cross-subject evidence here.

Protected-region checks in the actual Chromium renderer: 0 changed fully-unmasked pixels out of 789,748 tested; 0 alpha changes; 0 changes with all sliders at zero; 0 changes when source = reference. The nonzero electric-blue test changed 34,656 pixels inside editable makeup regions.

## v19.4 research archive

The standalone research ZIP (available as a generated ChatGPT attachment rather than committed or deployed) has SHA256 e90559d5fe80e477c0710020de3691625ab524c204e8797a6e1acc480cd584e9. It contains 260 files; ZIP CRC passes. The offline service worker includes 245 resources; none are missing. All module imports and 18 JavaScript source syntax checks passed. It includes the old method and an optional v19.4 matte switch.

## Limits and next release gate

No full face landmark and neural inference loop was executed on a physical Android phone, nor was a new trained appearance model produced. No independent multi-person evaluation, native 2048 neural generation, cross-pose robustness benchmark, skin-tone fairness study or independent comparison with 2026 research methods has passed. No rights-restricted third-party weights were imported. Do NOT merge or deploy v19.4 as a proven commercial SOTA renderer.
