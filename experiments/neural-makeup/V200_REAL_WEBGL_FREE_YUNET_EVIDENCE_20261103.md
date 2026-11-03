# v20.0 CPU-only offline face-count acceptance · 3 November 2026

**Research-only, not merged or deployed. No state-of-the-art quality certification.**

## Confirmed: real YuNet 2026may inference, no WebGL

The official MIT-licensed OpenCV Zoo YuNet ONNX (SHA-256 `ebafce4e3c118d6554634be5c27ab333b4c047a9a8c3faf1d7cf93101c22f0f0`) was downloaded by a GitHub Actions job and executed with the **real ONNX Runtime CPU backend**. An official 2026may 229 KB model and a second official ONNX Runtime Web 1.31.1 WebAssembly distribution were captured as Actions artifacts.

GitHub Actions real CPU model run: https://github.com/jjh167910-cloud/H-beauty/actions/runs/41714864876 (PASS).
GitHub Actions ONNX Web WASM asset collection: https://github.com/jjh167910-cloud/H-beauty/actions/runs/41715920575 (PASS).

A second independent **actual Chromium 144** run performed local ONNX Runtime **WebAssembly** inference (ort.wasm.min.mjs + local 15MB WASM + official YuNet weights) with **WebGL unavailable**:
- Single catalog portrait, one detection, **95.37%** confidence.
- Composite of *two copies of the same catalog portrait*, two detections, **94.22%** and **93.36%** confidence.
- Same image in native-aspect preflight, **single consistent face** accepted (95.28%).
- Two-face composite in native-aspect preflight, rejected (**multiple-faces**).
- Both checks including session creation completed in approximately 534 ms on the headless test machine, **not a phone latency measurement**.

No remote image processing was used. The in-memory `about:blank` browser origin lacks WebCrypto; its standalone native-aspect *adapter integration test* used a test digest shim containing the independently Python-verified model SHA. Production HTTPS uses WebCrypto to check the hard-pinned SHA-256. The separate real-runtime/decoder test did not use that shim.

The two-face composite uses identical duplicated identities and is therefore **not** independent cross-subject or demographic QA. At 320x320, YuNet can miss tiny or occluded second faces. It can assess count/approximate placement, not biometric identity.

## v20.0 isolated browser app candidate

A standalone local package built on v19.9 contains:
- New selected `atlas-safe-cpu-v200` mode; older v19.9/v19.8 modes remain selectable.
- CPU YuNet ONNX file (hash-pinned), local `onnxruntime-web@1.31.1` WASM/mjs files, license notices, CPU preflight adapter, and decision core.
- Local face-count result caching isolated per source image and independent of previous MediaPipe preflight mode.
- Rendering output is cleared when a new style, intensity, render mode, photo or render attempt begins, including on failed preflight; prevents stale success imagery.
- New `hbeauty-tryon-20.0` service-worker cache key with ONNX/WASM added to first-install precache.

**Package:** `HBeauty_AI_TryOn_v20_0_Offline_CPU_Face_Safety_Research.zip`, **44,021,956 bytes**, **334 ZIP entries**.
SHA-256: `280397e16ce9fb01375585299a34abd12af1ae1e468d9302df09abc66f58ea1f`.
Local QA: **34/34 Node regressions**, **28 JS syntax checks**, **306/306 declared offline asset paths**, **93/93 first-install paths**, ZIP CRC integrity pass. The binary package remains a ChatGPT attachment, not committed to GitHub.

The CPU preflight is new, but it does **not** solve MediaPipe 478-point full-face landmark generation, which remains required for makeup geometry and could not be run in this headless no-WebGL browser. Therefore do not present this isolated build as universally WebGL-independent, Android-verified, state-of-the-art photorealism, or ready for public deployment. Independent real people, diverse skin tone and pose, occlusions, human perceptual quality assessments, full offline Android installation, CPU memory/thermal budgets, original model-face rights, and real 2K makeup texture remain open gates.

**Existing salon Cloudflare production and the independent AppDeploy preview remain unchanged.** Research PR #111 remains draft.
