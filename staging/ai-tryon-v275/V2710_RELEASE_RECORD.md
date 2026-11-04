# H-Beauty v27.10 — real mask impact, not just model coverage

**2026-11-04 engineering release candidate. Public staging NOT deployed. Production `h-beauty` Worker not modified.**

## Exact release sources
- Complete archive: `HBeauty_AI_TryOn_v27_10_Real_Makeup_Mask_Impact_RC.zip` — 55,716,838 bytes; SHA-256 `d9a52d6f58c99ecc0b8149893ac744311f35732429908791b0fd7acb3154a4f3`; 547 files.
- Isolated staging: `HBeauty_v27_10_Isolated_Staging_Kit.zip` — 52,777,893 bytes; SHA-256 `27dd016b069171dcdd3e350373cc22f25b91fe73f987d81301072fe69b09c46a`; 347 archive entries.
- Independently extracted and verified: **339/339 static full-app SHA-256 resources**, **93/93 CPU-only resources**, service-worker cache version `27.10`. Target worker `hbeauty-tryon-v2710-staging` is deliberately distinct from `h-beauty`.
- The ZIP is still an artifact of the ChatGPT conversation. The connected GitHub tool interface supports text writes but not transferring a >50 MB local ZIP to GitHub Releases.

## Defect identified and fixed
Prior UI counted protected pixels in the model's large hair/background mask and implied that this preserved makeup pixels. On a real 810×1080 catalog portrait, 60,598 pixels were altered by the unmasked makeup renderer, but neither the 156,537-pixel single-pass nor the 160,715-pixel two-pass nonzero masks changed any of those cosmetic-edited pixels. The app now reports the actual contribution to the **selected makeup look** rather than raw mask coverage.

The renderer computes per-pixel protected-vs-unprotected cosmetic RGB differences **during a single compositing pass**, adding `maskImpactPixels`, `maskPreventedPixels` and `maskSoftenedPixels` without a second full image render. Fully suppressed eligible fragments mark themselves visited so overlapping warped triangles cannot repaint them. Persian UI explains a true zero-effect outcome. Six-class and 19-class report provenance is kept separate; disabling protection clears stale model report state.

## Authentic integrated acceptance
- 160/160 Node tests PASS; 17/17 Python evaluation/release/model metadata tests PASS.
- Real YuNet/478 landmark ONNX/WASM sample PASS (one face, 478 points; 60,598 atlas-rendered RGB edits; original alpha exactly preserved).
- Exact bundled six-class LiteRT.js CPU/WASM, no WebGL, WITH those actual 478 face points: fast and optional mirrored two-pass masks PASS. `interiorFaceAvailable=true`, `possibleSkinFull=0` on this sample.
- Independent full baseline-vs-protected compositor: **model masks cause 0 visible makeup pixel changes** on the sample, and single-pass QA reports precisely 0.
- Controlled mask placed on 5,000 genuinely makeup-edited pixels: 5,000/5,000 preserve the original RGBA exactly; other pixels unchanged.
- Mixed full/partial mask on those same selected pixels: 4,901 RGB outcome differences (2,500 fully prevented, 2,401 softened; 99 softer changes lost to 8-bit rounding). App-reported impact 4,901 exactly matches independently compared output; no off-mask change.
- No real user portrait in test artifacts; no input photo uploaded in the app.
- About:blank browser harness is origin-restricted: independent model SHA verification was used with a controlled mock digest. Real HTTPS WebCrypto still needs staging validation.

## Deployment gate
`.github/workflows/hbeauty-tryon-v275-staging.yml` is pinned to tag `hbeauty-tryon-v27.10-staging-source`, exact staging ZIP filename and SHA-256 above. It must fail closed when that archive is absent; no Cloudflare API call should occur. It never targets production `main`.

## Outstanding gates
Public HTTPS staging and SHA parity; physical Android install/cold-start/airplane mode/thermal; independently annotated segmentation precision/recall; legally distributable model weights and training datasets; trained neural appearance model; blind identity and realism review.

**This is a QA correctness/occlusion compositing improvement, not a claim of better photorealism or state-of-the-art makeup transfer. Production decision: NO-GO.**