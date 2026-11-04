# v19.7 — Adaptive offline cosmetic atlas: bounded evidence

**Date:** 3 November 2026. Research only; unmerged, not deployed, not a trained state-of-the-art model.

## Improvements over the v19.6 graphics baseline

1. **Skin-relative cosmetic transfer.** v19.6 adds signed RGB cosmetic differences extracted from same-person generated styled and neutral portraits. This uses 15-knot monotone per-channel tone calibration, sampled from the user's original selfie at landmark-corresponding, makeup-free regions. The source selfie is always the base image, never the template person's skin. Conservative slope clamps (0.40–1.75) and minimum 120 valid skin samples.
2. **Explicit safe fallback.** Unstable calibration returns a reason and reverts to v19.6, rather than applying invalid/NaN cosmetic values.
3. **Original-resolution photos.** Separate detection at preview resolution from rendering at the original uploaded resolution, up to 3072 pixels per side. A controlled doubled-size input at 1620×2160, with detection at 810×1080, produced a 1620×2160 output using existing 810×1080 atlas textures. This preserves source pixels and dimensions, not newly generated true-native 2K cosmetic texture.
4. **Offline completeness.** Initial cache includes all 42 makeup atlases plus the baseline neutral, statistical skin mask, bundled face-landmarker model, vision WASM and required shell.

The standalone ZIP contains real generated-portrait-derived atlas PNGs, which were kept out of this PR pending rights clearance. GitHub includes the research renderer, unit tests, and this evidence record.

## Actual Chromium Canvas comparison (4 looks × 4 synthetic photometric transforms)

Arabic Glam, Electric Blue, Classic Smokey, Strawberry; all poses and identities are identical and generated imagery. Controls are digitally simulated dim exposure, gamma darkening, light exposure and warm color balance.

- v19.6 masked RGB MAE: **2.3390** units
- v19.7 masked RGB MAE: **1.3414** units
- relative reduction: **42.65%**
- all **16/16** cases improved
- source alpha changes: **0**
- changed RGB pixels outside any nonzero cosmetic region mask: **0**
- all 16 skin-tone calibrations reported valid (761 stable probe pixels each)

This is not a test of physically diverse skin tones or independent identities.

## Wider Python stress test, independent of Chromium loop

Using the same 41 non-neutral makeup atlases and **six** deterministic color transformations, **246** cases yielded aggregate masked MAE **1.823→1.196**, improvement on 246/246. Python uses the same quantile mapping concept but is separately implemented; do **not** report this as 246 real-browser image tests.

## Integration & integrity

- Standalone experimental PWA: **42** makeup atlases, **294** listed offline assets, **81** first-install core cache entries, **20** JavaScript syntax checks, **8** unit tests passing, ZIP CRC validated.
- SHA256 of standalone ZIP: `18d7543b1652f508c8d4c3fb0166ac946a2cfdf4a2a163d13e8d1e8f09c4891b`
- Raw browser results and screenshots are separate ChatGPT conversation artifacts. No photos or binary weights are committed to this PR.
- Face-landmark model inference and offline PWA cold start on a **physical Android device** have not been verified. The UI flow used mocked landmarks in headless Chromium.

## Mandatory release gates

No independent multi-person results, no demographic/pose generalization test, no rights-cleared paired training corpus, no professionally blinded real-face evaluations, no Android thermal/memory/latency measurements, no verified 2048-native makeup texture. Strong existing makeup, occlusion, glasses, extreme yaw and multiple faces may produce poor results. Do not merge or market this as a state-of-the-art product until those gates pass.

Research context: Lydia Chau et al., WACV 2026, *Towards High-Fidelity, Identity-Preserving Real-Time Makeup Transfer: Decoupling Style Generation*; their methodology motivates skin-independent rendering, but neither their code nor weights are bundled.
