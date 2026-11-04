# H-Beauty v27.8 — correct embedded model input normalization

**Local engineering RC. No Cloudflare staging/production deployment.**

## Core discovery
The exact bundled TFLite SHA-256 `d2cd8f253fb44f135900753d0124c5228285165cf2a8f8100fbe958ad7bc55df` includes a valid FlatBuffer `M001` model metadata table. Its sole RGB input specifies `NormalizationOptions(mean=[127.5],std=[127.5])`, so LiteRT raw floats must use **(RGB−127.5)/127.5**, not RGB/255 as in the old WebGL-free fallback. MediaPipe Tasks handles preprocessing separately.

## Deliverables and exact SHA-256
- Full ZIP `HBeauty_AI_TryOn_v27_8_Authentic_Model_Normalization_RC.zip`, 55,697,698 bytes, sha256 `f02006972d427b83bd3049c5afa6562281e61a6f7946ec266e00e8cfddc16d17`.
- Isolated staging ZIP `HBeauty_v27_8_Isolated_Staging_Kit.zip`, 52,774,896 bytes, sha256 `d247458e7b7ae7889231e720e0a2e4aa3a46ff0eeb0f03d80bc7dade8a2f1df9`.
- Service-worker version 27.8; full asset integrity 339/339 and CPU assets 93/93.

The source ZIPs are currently attached to the ChatGPT conversation. They are NOT present in GitHub Releases. Existing GitHub connector tools provide text Git writes but do not transfer a ~53 MB archive from the private ChatGPT runtime; the source-archive gate must refuse deployment.

## Actual model A/B on identical sample
- 810×1080 portrait, 874,800 pixels, exact same weights and conservative bilinear protection policy.
- 27.7 RGB/255: 146,624 nonzero alpha pixels (85,183 full; 61,441 partial).
- 27.8 metadata normalization: 156,537 nonzero (107,276 full; 49,261 partial).
- Exactly 72,882 mask values changed, of which 12,817 changed by >=128 alpha levels. Mean absolute alpha difference 5.267.
- WebGL disabled and CPU-only LiteRT.js real inference succeeded with normal body output; no image was uploaded.
- **No ground-truth labels** were evaluated. This is preprocessing-contract correction and behavioral evidence, not accuracy or photorealism certification.

## Regression evidence
- 150/150 Node tests; 17/17 Python tests (including actual model FlatBuffer metadata).
- Real YuNet/478 ONNX WASM and atlas composite: 1 face / 478 landmarks / 60,598 edited pixels / alpha preserved.
- Extracted isolated staging kit independently verified 339/339 full SHA-256 resources and 93/93 CPU subset.

## CI isolation
Workflow `.github/workflows/hbeauty-tryon-v275-staging.yml` now targets separate Cloudflare Worker `hbeauty-tryon-v278-staging`, pins the ZIP hash above, and fixes its own GitHub push-path trigger. Missing ZIP, wrong worker name, missing assets or failed remote hash validation must halt deployment. No modification of production `h-beauty`.

## Remaining gates
Upload the exact pinned v27.8 staging ZIP as GitHub Release asset under tag `hbeauty-tryon-v27.8-staging-source`; verify online HTTPS, then physical Android cold/warm/offline tests; independent semantic-mask IoU; trained licensed neural makeup-transfer model; blind realism and identity evaluation.

**Decision: engineering improvement VERIFIED; state-of-the-art claim and production release NO-GO.**
