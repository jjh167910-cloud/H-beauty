# H-Beauty v27.6 — authentic WebGL-free offline six-class CPU fallback

**Engineering candidate; no production/staging deploy certified.** Separate staging Worker: `hbeauty-tryon-v276-staging`. Production `h-beauty` Worker unchanged.

## Release checks independently reproduced locally
- Complete v27.6 ZIP: `HBeauty_AI_TryOn_v27_6_LiteRT_CPU_Fallback_RC.zip`, SHA-256 `31ef0128741a4d4f98b84f271d5c103ae50b731c93d29d74066e8b9fcc6b0bb8`, 55,686,581 bytes.
- Isolated staging ZIP: `HBeauty_v27_6_Isolated_Staging_Kit.zip`, SHA-256 `34c71ff1d3889dd70e094187d3c823b3e9cb1ae4e3d66815d70c684133613872`, 52,772,480 bytes. **This binary is not yet present in the GitHub Releases API**.
- Offline static hashes: 339/339 full assets, 93/93 CPU assets, tested against exact local bytes; v27.6 service-worker cache version.
- Automated Node tests: 141/141 PASS. Python evaluation/privacy: 16/16 PASS. Real YuNet/478-landmark/atlas smoke: PASS (810×1080, 60,598 changed pixels, alpha unchanged).
- **Actual WebGL-free browser execution**: Playwright Chromium `--disable-webgl --disable-gpu`, `litertjs-wasm-cpu`, exact 8,290,292 byte bundled SelfieMulticlass TFLite. Real mask 810×1080, 874,800 pixels with 137,777 nonzero protection pixels, 92,047 fully protected. WebGL false; no uploads. On this restricted runner, model load plus first inference 4.75 s; not Android benchmark.
- SHA256 of included model `d2cd8f253fb44f135900753d0124c5228285165cf2a8f8100fbe958ad7bc55df` (the newer public Google float32/latest model has a different SHA).
- Browser test passed the bundled model hash using independent Python SHA256 plus an injected digest substitute because the harness's opaque `about:blank` origin lacks WebCrypto; actual HTTPS WebCrypto must be confirmed in staging.

## GitHub-only components
- GitHub Actions `hbeauty-litert-cp313-wheel.yml` successfully provisioned official LiteRT CPU wheel; [run 41908063366](https://github.com/jjh167910-cloud/H-beauty/actions/runs/41908063366).
- `hbeauty-litertjs-runtime.yml` provisioned `@litertjs/core@2.5.3` and wasm-utils; [run 41909041783](https://github.com/jjh167910-cloud/H-beauty/actions/runs/41909041783).
- `hbeauty-selfie6-real-cpu.yml` tested a DIFFERENT public float32 model and intentionally flagged SHA mismatch; its failure is evidence of model-version separation, not a pass of bundled identity.
- Isolated staging workflow updated to **v27.6**, refuses wrong Worker name, wrong ZIP SHA, absent release file, or failed HTTPS parity. It does not deploy `main` or the salon.

## Outstanding independent acceptance gates
1. Transfer exact v27.6 staging ZIP to GH Release tag `hbeauty-tryon-v27.6-staging-source` and verify GitHub Actions+Cloudflare publish.
2. Validate real HTTPS origin/WebCrypto, install, airplane mode and cold/warm inference on physical Android.
3. Independently annotate hair/forehead/overlap masks for precision/recall. Do not call six-class body skin a hand detector.
4. Secure trained reference-guided neural makeup-transfer model; verify licensing, photorealism, identity preservation and blind reviewer outcomes.

**Do not merge staging into production main or declare the product state of the art without these results.**
