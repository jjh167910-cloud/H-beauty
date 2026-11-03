# H-Beauty v19.6 Detail Atlas — 2026-11-03

Status: RESEARCH ONLY. No trained SOTA model, no production deployment, no commercial quality certification.

## Implementation

A signed RGB cosmetic-delta atlas was extracted from 42 existing generated same-person makeup portraits relative to the matching no-makeup portrait. The standalone 19.6 PWA uses the uploaded selfie landmarks and face-mesh triangles to warp those deltas into the selfie geometry. An optical protection mask prevents copying colors into eyes or mouth; source pixels outside the editable mask and original alpha bytes are retained. No cloud face-photo upload, pretrained third-party weights or reference-model identity pixels are involved in the local renderer.

The research branch contains the transferable pure-JS v196_detail_atlas.js algorithm and its Node regression tests. The actual 42 PNG atlases and Persian mobile UI are in the separate downloadable experimental ZIP, intentionally not committed to this PR.

## Actual Chromium results

Four looks (Electric Blue, Classic Smokey, Arabic Glam, Strawberry) each rendered onto a generated neutral portrait and the original sample photo at 810x1080. Rendering time was approximately 167-213ms per frame on this test machine, excluding face detection.

Paired reconstruction MAE inside the makeup mask against the same-style reference:

| Style | Neutral before | Neutral after | Original before | Original after |
|---|---:|---:|---:|---:|
| Electric Blue | 8.139 | 1.640 | 9.564 | 3.326 |
| Classic Smokey | 7.583 | 1.611 | 9.204 | 3.314 |
| Arabic Glam | 9.981 | 2.263 | 11.645 | 3.995 |
| Strawberry | 3.744 | 1.234 | 5.141 | 2.910 |

IMPORTANT: This is circular paired-reconstruction evidence. Each same-person reference helped build the atlas; these numbers do not establish performance on other identities or superiority to commercial apps.

On a synthetically rotated 10-degree, 0.9-scaled, translated (+27,-11 px) version of the same face, mesh registration reduced MAE relative to fixed positioning: Electric Blue 7.610 to 1.296; Arabic Glam 9.080 to 1.743. This is geometric consistency, NOT independent pose or identity generalization. In those tests, no pixels changed beyond a 2-pixel-dilated transformed cosmetic mask.

## Separate release candidate

HBeauty_AI_TryOn_v19_6_Detail_Atlas_Research.zip: 39,220,851 bytes, SHA256 de0bf08fffb76399958c3badf13f98fbf7b8b31fea9b6f8fe3686cacf48e76de. ZIP CRC passed. All 42 style PNG hashes are inventoried, all 292 service-worker asset paths exist, and all 42 atlases appear among 75 initial cached resources. 20 root JavaScript syntax tests and four new Node regressions passed. A 390x844 mobile-browser integration test passed with stubbed face detection and resource fetches, including a working source-only workflow.

Unverified: real Android MediaPipe/WASM inference and offline reinstall, varied skin tones, new identities, arbitrary pose, independent human photorealism comparisons, 2048-native cosmetic texture, commercial image rights. Current atlas textures originate at 810x1080 and may double-apply makeup over an already heavily made-up selfie.

Do not merge this branch for commercial production; the live salon and existing v19.2 hosted preview are unchanged.

Scientific context: Chau, Yu & Jiang, WACV 2026, identity-preserving transparent makeup extraction and graphics rendering. No authors' model weights imported.
