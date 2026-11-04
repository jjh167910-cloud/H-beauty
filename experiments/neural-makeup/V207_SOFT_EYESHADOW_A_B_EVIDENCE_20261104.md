# H-Beauty v20.7 — optional Soft Eyeshadow, real offline CPU browser A/B (4 Nov 2026)

**Research only. NOT market state of the art, production-ready, or physically Android-verified.**

## Method

The previous Natural delta atlases still transplant fine dark lash/liner texture from the one catalog model; across identities this looks doubled and illustrated. Instead of only blurring completed selfies, v20.7 creates an **optional, offline eye-only material**: normalized Gaussian low-frequency RGB delta from the existing atlas (`sigma=11px`, preservation coefficient `0.04`). The existing 478-point CPU geometry maps the pigment into the selected user face, while eye openings, eyebrows, mouth, hair and nonface pixels are still guarded by the v20.5 deterministic landmark geometry. **No user skin, eyelash, iris or mouth identity pixels are copied from the reference**.

Natural and Original atlases are unchanged and remain selectable. The Soft Eyeshadow mode **intentionally reduces detailed liner/eyelash style fidelity** rather than synthesizing new photorealistic lashes.

Source: `v207_eyeshadow_atlas.py` and `v207_detail_atlas.js`. Automated synthetic tests: `tests/test_v207_eyeshadow.py`.

## Deterministic 42-style material QC

Across all 42 existing styles, under a consistent half-resolution 2.5px high-pass metric:
- Eye high-frequency RGB delta mean: **1.02901 → 0.45015**, a **56.25% decrease**.
- Average 8px low-frequency eye-color difference from Natural: **1.34176 RGB units**.
- **0** atlas pixels changed outside the eye channel in **all 42** generated PNGs.
- All new atlas PNGs have individual SHA-256 checksums in a separate `detail-atlas/shadow-manifest.json` included in the ZIP.

These numbers characterize a **processing frequency trade-off**, **NOT** perceived photorealism quality or market superiority. The output can look less dramatic; users choose the prior methods as alternatives.

## Real v20.7 browser acceptance with actual ONNX, not simulated landmarks

An actual Chromium in-memory app run (navigational `about:blank` + local Blob ESM because site navigations are blocked here) loaded the **real bundled YuNet and 478-point ONNX models in WebAssembly with WebGL disabled**, and the full Persian studio:
- **42 styles** in the selector.
- Soft Eyeshadow applied to one **810 × 1080** input, **61,220 edited RGB pixels**.
- **524,781 source-exact protected pixels**, **zero alpha changes**, and zero browser JS errors/unexpected network fetches.
- User-facing browser PNG download saved **772,324 bytes**.
- Three finish settings (Soft Eyeshadow, Natural, Original) resulted in **three different actual rendered PNG SHA-256 values**, with output invalidated on each switch.
- Real two-face composite rejected; subsequently a fresh single-face upload passed and rendered.
- Source and output dimensions identical.

The in-memory `about:blank` origin lacks WebCrypto. Both ONNX files were **independently SHA-256 checked** by the Python QA harness and a **test-only digest shim** was used for local session bootstrap. **No digest shim exists in app runtime.** A normal HTTPS PWA page, service-worker installation and physical Android cold boot remain **unverified**. The Chromium screenshots and real comparison artifacts remain attached to the chat, not committed to GitHub.

## Separate standalone package

`HBeauty_AI_TryOn_v20_7_Soft_Eyeshadow_CPU_Research.zip`:
- Final ZIP **55,999,829 bytes**, **470 files**, SHA256 **d98d2c49288218133c6446390161645f23c63e11fe26c3ed40bfca6ca5bfda72**
- ZIP CRC passed; **410/410 declared offline assets** and **197/197 first-cache resources** present.
- 42 Original + 42 Natural + 42 new Soft Eyeshadow atlases, all hash verified.
- 39 root JavaScript syntax checks and 4 local eye-material generator/asset unit tests passed.
- Pinned YuNet and 478 mesh model hashes verified; the research-only CelebAMask-HQ/BiSeNet model **is not bundled**.
- `qa/actual_in_memory_e2e.py` and `qa/release_gate.py` included with CLI/HTTPS caveats.
- Existing public salon and draft PR remain unchanged by ZIP delivery.

## Required gates before a commercial-quality state-of-the-art claim

Independent consented multi-person and diverse skin tones/lighting benchmark; blind makeup-artist preference scoring; licensed photo/model training-data provenance; photorealistic native eyelash, eyeliner and lip material generation; full HTTPS/PWA installation and actual Android offline restart, memory and thermals; repeatable benchmarks against leading consumer apps.

**Release decision: GO for isolated image-quality A/B research only. NO-GO for production merge or state-of-the-art certification.**
