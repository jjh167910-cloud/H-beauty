# H-Beauty v27.11 — neural compositor identity-safety engineering candidate

**Status: local engineering release candidate; NOT state-of-the-art-certified; NOT publicly deployed.** The production salon Worker `h-beauty` remains unchanged.

## Pinned deliverables
- Full application `HBeauty_AI_TryOn_v27_11_Neural_Identity_Safety_RC.zip`: 55,730,019 bytes; 554 archive entries; SHA-256 `c436cd272f87cc77608af5c816cf0f3d052c67299babb051aa58e110e81a6014`.
- Isolated Cloudflare staging kit `HBeauty_v27_11_Isolated_Staging_Kit.zip`: 52,782,928 bytes; 349 entries; SHA-256 `0ba49456541e2bb99c67130beb3a1bb2f5d71f41c0c9b64ec04bb7fce58a6b64`.
- Full offline assets: SHA-256 340/340; offline CPU subset 93/93; v27.11 service-worker cache.
- This conversation's generated binary ZIP is **NOT yet in GitHub Releases**; no binary-upload connector and no Cloudflare publishing authorization are available. Staging CI must fail closed on absent ZIP.

## Engineering changes
1. Neural compositor's protection alpha is now a continuous attenuation, not a binary veto for every nonzero value. Fully protected pixels remain source-identical. No source alpha modification.
2. The optional ONNX reference studio is connected to the genuine bundled six-class LiteRT.js CPU/WASM segmentation mask with landmark-based face geometry. User-selectable Persian checkbox; extra processing and possible overprotection documented.
3. An independent local appearance firewall refuses candidate composites changing any RGBA outside the allowed makeup matte or changing the source alpha.
4. Real 478-point meshes may extend 12% outside the sensor edge before final crop clamping. Previous 5% tolerance incorrectly rejected a genuine face sample.
5. New regression coverage and release documentation distinguish identity preservation checks from photorealism claims.

## Reproducible results
- **168/168 Node tests PASS**, **19/19 Python tests PASS**, explicit real atlas compositor regression PASS.
- Real 810×1080 source, genuine CPU478 face model, genuine 8,290,292-byte bundled six-class segmentation model, WebGL disabled and CPU LiteRT.js.
- Test neural appearance proposal intentionally synthetic, NOT a trained makeup-transfer result.
- **50,139** fully protected source RGBA pixels preserved exactly; **28,628** partially protected pixels; **23,875** partial pixels had a different rendered RGB than unprotected; zero source-alpha changes.
- No independent realism comparison, segmentation accuracy labels, physical Android numbers or trained licensed reference appearance weights were provided.

## Staging
The GitHub Actions workflow `.github/workflows/hbeauty-tryon-v275-staging.yml` on the isolated branch is pinned to v27.11 archive hash and target Worker `hbeauty-tryon-v2711-staging`, never production `h-beauty`. Expected source GitHub Release tag `hbeauty-tryon-v27.11-staging-source`. Do not claim staging success without a verified HTTPS response and SHA-parity checks.

## Research and licensing
2026 relevant references include WACV Chau et al. identity-preserving real-time makeup transfer, CVPR FRAM region-aware diffusion, and ECCV MagicMakeup region-controlled diffusion. FRAM/MagicMakeup repositories and foundation models impose noncommercial or unresolved downstream rights. Code licenses alone do not establish dataset/model checkpoint commercial permission.

## Final blockers
Trained and commercially licensed neural transfer model, realistic independent blind review, multi-subject identity safety, physical Android CPU/RAM/thermal and true offline QA, independent segmentation labeling, verified HTTPS staging and rollback.

**Production/SOTA certification: NO-GO.**
