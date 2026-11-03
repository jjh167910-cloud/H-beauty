# H-Beauty v19.8 — geometry confidence and mirror-safe skin calibration

**3 November 2026 · Research-only.** No production deployment, no trained state-of-the-art model.

## Actual changes

- Added key-landmark quality gate: refuses incompatible/off-frame/implausibly small face geometry, excessive (>33-degree) roll, extreme eye-to-nose alignment and inconsistent landmark topology.
- Samples skin-tone calibration at **similarity-transformed local offsets**, correcting misregistered probes under rotation and scale. Uses orientation from forehead→chin to detect mirrored selfies; mirrored photos require a reflected (not 180-degree rotated) local Jacobian.
- Rejects **local foldover triangles** when their winding differs from the global face handedness. Mirrored faces remain permitted.
- Added an opt-in v19.8 mode to the isolated standalone PWA, preserving v19.7/v19.6 and older transfer modes for A/B testing. Invalid geometry displays a Persian rejection message.
- Changes to selected style, renderer and intensity invalidate in-flight work to prevent a stale result being shown under new settings.
- Retains the prior 1620×2160 original-image output from 810×1080 landmark detection. This preserves image dimensions, **not** newly synthesized 2K makeup texture.

## Controlled actual-renderer evidence

Four *same-person* 810×1080 transformed inputs, comparing the identical atlas and same target:

| Synthetic transform | v19.7 masked RGB MAE | v19.8 MAE | Difference |
| --- | ---: | ---: | --- |
| Mirrored selfie | 5.6554 | 5.6145 | 0.72% lower |
| +12-degree rotation and 0.92x scale | 4.1995 | 4.1378 | 1.47% lower |
| -11-degree rotation and 1.10x scale | 5.6210 | 5.6932 | **1.29% higher (regression)** |
| +18-degree rotation and 0.88x scale | 4.9751 | 4.9155 | 1.20% lower |

This is **not** new-identity generalization. The source face and reference are generated versions of the *same person*; the target helped form the atlas. MAE is a color difference, not perceptual realism or identity fidelity. Three cases improved, one regressed; no winner-takes-all claim is warranted.

In four image tests source alpha bytes were completely unchanged. In separate pure Node tests, all source bytes outside the region mask remained exact. Geometry quality tests reject extreme roll, off-frame landmarks and face triangle foldovers. Mirrored selfies are accepted with correct global handedness.

## Package checks

Standalone archive: HBeauty_AI_TryOn_v19_8_Geometry_Safe_Research.zip, SHA256 **fa49122be5aeb2cd6fa31608421ad6975a8fbe99cf43f962e866ea7605e4d69a**, 40,005,540 bytes, 319 files. All 42 atlas hashes, 296 service-worker resources, 83 initial-cache resources, 22 JavaScript syntax checks, and 17 Node regression tests passed. Two mobile Chromium app flows passed at 810×1080 and 1620×2160 with mocked facial landmark detection, actual JS Canvas cosmetics, and explicit Persian invalid-face status.

**Release blockers remain**: diverse real faces, demographic/lighting robustness, glasses/occlusions, live MediaPipe inference on real Android, physical cold-start offline relaunch, thermal and memory testing, commercial rights for reference photos, professionally blinded human photorealism comparisons, and trained high-resolution makeup model. Do not merge this PR into production on this evidence alone.
