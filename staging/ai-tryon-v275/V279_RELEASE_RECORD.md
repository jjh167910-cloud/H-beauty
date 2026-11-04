# H-Beauty v27.9 — optional real-model two-pass occlusion protection

**Engineering candidate only. Neither public staging nor production has been deployed.**

## Binary provenance
- Complete v27.9 ZIP: `HBeauty_AI_TryOn_v27_9_Two_Pass_Conservative_Protection_RC.zip` — **55,705,605 bytes**, SHA-256 `1a7a11ccbd60ff20b5e909f9f78a79cc026a255470a91063e99f60e66c2d2f78`, 541 packaged files.
- Isolated staging ZIP: `HBeauty_v27_9_Isolated_Staging_Kit.zip` — **52,776,467 bytes**, SHA-256 `94a22cd63f31691f7d726dc5410dc4c974eec8524baea6ddebfb4bef6c821827`, 347 archive entries.
- Exact six-class TFLite SHA-256 remains `d2cd8f253fb44f135900753d0124c5228285165cf2a8f8100fbe958ad7bc55df`; 8,290,292 decoded bytes, unchanged model weights.
- SHA-256-verified offline assets: **339 full-app files / 93 CPU-only files**, verified by independent staging extraction.
- Complete source ZIP currently exists in the ChatGPT-generated artifact, NOT in GitHub Releases. No GitHub binary upload/Cloudflare connection was authorized or available in the tool interface.

## Functional implementation
- A user-visible Persian checkbox provides **optional conservative two-pass protection**. It is disabled by default for speed and heat control.
- LiteRT.js CPU/WASM performs real inference on the original photo and a horizontally reflected 256x256 normalized input. It inverse-reflects second-pass logits, applies the existing six-class confidence thresholds, and takes the **per-pixel maximum of alpha** after geometric masking. Both predictions are from the same SHA-pinned model.
- Additional alpha can preserve some pixels incorrectly, so this **does not certify semantic segmentation precision** or trained makeup appearance quality.
- All photos remain local; only aggregate counters are reported. No new CDN, WebGL, paid service or server inference.

## Actual Chromium no-WebGL QA
- 810×1080 same bundled demo photo, 874,800 mask pixels.
- Single pass: 107,276 fully protected + 49,261 partially protected = 156,537 with nonzero protection.
- Two passes: 113,549 fully protected + 47,166 partial = 160,715 nonzero.
- **30,657 pixels increased alpha strength; zero decreased**. Only **4,178 newly nonzero**. The distinction matters.
- CPU inference/processing 1,349.8ms single and 2,270.5ms two-pass on restricted browser host; not Android performance. Model load excluded. WebGL remained false. The test did not supply real face points, so the body-skin interior overlap component was not evaluated in this browser run.
- The about:blank test's WebCrypto is unavailable by browser restriction; SHA was independently checked in Python and a controlled deterministic digest substitute used in browser. Real HTTPS WebCrypto and Android remain gating.

## Regression
- 156/156 Node tests incl. 6 new mirroring/involution/union/privacy cases.
- 17/17 Python evaluation/release/real-model-metadata tests.
- Real CPU478 ONNX/WASM atlas regression: one face, 478 landmark points, 60,598 edited pixels, original alpha preserved.
- Chromium UI layout @ 320,390,768,1280px: zero overflow; new checkbox present and unchecked by default.

## Staging gate
Existing branch workflow `.github/workflows/hbeauty-tryon-v275-staging.yml` was updated to pin the exact **v27.9 staging SHA-256**, target separate Cloudflare Worker `hbeauty-tryon-v279-staging`, and fail before any deployment if binary archive is absent. Never targets `h-beauty` or modifies production `main`.
GitHub Release tag would be `hbeauty-tryon-v27.9-staging-source`. It does not exist at the time of this release record.

## Remaining NO-GO gates
Verified public staging URL, physical Android cold/warm/offline QA, independent IoU and false-positive rates across faces and obstructions, rights verification, genuine trained neural makeup-transfer model and blind identity/realism assessment.

**Version numbers do not replace evidence. State-of-the-art and production certification remain NO-GO.**
