# H-Beauty v20.6 — real in-memory Chromium offline CPU E2E

**Date:** 2026-11-04. **Status:** experimental; no main merge or production deployment.

## Critical packaging defect corrected

v20.5 ZIP shipped an *old* `v198_geometry.js` face-frame cutoff even though the GitHub research branch had already introduced a 1.5px raster-rounding allowance. During actual Chromium browser inference on the included 810×1080 sample portrait, the new 478-point model output a cheek landmark **1.16px beyond** the original +/-5% cutoff (851.66px vs. 850.5px). Detection and landmarking succeeded, but makeup rendering aborted with `Face geometry confidence gate: out-of-frame`.

The v20.6 ZIP contains the corrected +1.5px limit, still rejects significant geometric errors, and increments the service-worker cache namespace to **20.6**. Also fixes a download UX defect: when the user previews their original selfie, PNG export is disabled (rather than enabled but inert).

New `v206_release_gate.py` compares critical package contents with research-source acceptance rules and checks all offline assets, style atlases, ONNX SHA hashes, optional-parser absence and UI state. A synthetic unit test verifies it catches the stale-geometry ZIP regression.

## Actual in-memory browser test

This test loaded `cpu-tryon.html`, the app's **real ES module source**, ONNX Runtime Web/WASM, **real pinned YuNet and 478-point landmark ONNX bytes**, sample image and atlas assets into Chromium as Blob resources, **with WebGL disabled**. Application model inference was not mocked. Test suite source is included in the downloadable standalone ZIP under `qa/in_memory_e2e_test.py` and output evidence JSON under `V206_ACTUAL_END_TO_END_EVIDENCE.json`.

Result:
- 42 selectable styles loaded.
- Single packaged selfie: real face detection and all **478** landmarks succeeded.
- Actual **Electric Blue Natural Finish** rendered to **810×1080**, editing **60,864 RGB pixels**.
- **524,781** outside-mask pixels remained source-byte identical; **0** alpha-channel changes.
- User-facing PNG download completed and matched the encoded canvas exactly (**776,148 bytes**).
- Original-view toggle disabled export and restored it on returning to the edited view.
- Natural / Original finishes rendered distinct PNG bytes; changing finish invalidated stale output.
- Real two-portrait composite was correctly rejected with a Persian message; previous output remained cleared.
- A subsequently uploaded single-face JPEG via the real file chooser rendered successfully.
- **0** browser JavaScript errors, **0** unexpected network fetches.

### Important qualification

Local/HTTPS navigation from the test browser was blocked by an administrative policy. To execute actual app code without navigation, the test page ran at `about:blank` with in-memory modules. This opaque origin lacks WebCrypto: the two model files were independently SHA256 checked in Python and a **test-only digest shim** used only to bootstrap in-memory runtime; production source uses secure-origin WebCrypto. Therefore this is a valid **in-memory functional E2E for ONNX, atlas, controls and export**, but not a full HTTPS PWA integrity/offline cold-install test. The test-only shim is **not** packaged into runtime code.

## Release package

- Filename: `HBeauty_AI_TryOn_v20_6_E2E_Geometry_Fix_Research.zip`
- Bytes: **50,800,444**
- SHA256: `75bbe6999f688715d8b97283d76460e2a34cbf8468c56e3797431fb357fb886c`
- 410 archive members; CRC passed.
- All **365** service-worker declared assets exist; **152** first-cache paths exist.
- 42 original + 42 natural atlas styles, verified YuNet and 478-point model hashes.
- Includes before/after QA comparison and actual browser output of packaged demo face.
- Excludes the CelebAMask-HQ/BiSeNet research-only parser.

## No-go conditions

Not yet independently verified: actual HTTPS hosted-page E2E, physical Android phone offline install/reboot, RAM/thermals, diverse real users/occlusions/lighting, commercial image/model training-rights, blinded cosmetic appearance ratings, native 2K generative lash/eyeliner synthesis. Existing style still looks overly graphic around some liner and lashes. **No state-of-the-art certification or live salon deployment.**
