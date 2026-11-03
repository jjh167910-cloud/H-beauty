# H-Beauty v19.9 — single-face safety + offline cache repair

**3 November 2026. Research-only; no deployment or merge.**

## Two concrete defects fixed

1. The isolated v19.8 package's `sw.js` still used cache ID `hbeauty-tryon-19.7`. In v19.9, the service worker uses `hbeauty-tryon-19.9`, purges obsolete versions on activation, and includes the new face-safety adapter and pure classifier in the offline first-install core.
2. The bundled makeup engine's MediaPipe face detector uses `numFaces:1` and selects `faceLandmarks[0]`. This cannot reject a selfie containing multiple faces. The v19.9 safe-atlas mode adds an **independent local detector** requesting `numFaces:2`, and checks its result against the exact face chosen by the rendering pipeline, using normalized center and eye width. No-face, multiple-face and mismatched-face results are fail-closed.

The existing source-face detector and production app are unchanged. The new research adapter is in `face-safety.js`, its offline/identity classifier in `face-safety-core.mjs`, and six Node tests in `tests/test_v199_face_safety.mjs`. The standalone PWA ZIP contains these modules, an updated Persian UI, and the new service worker.

## Test evidence

The independent standalone release candidate was built as **HBeauty_AI_TryOn_v19_9_Single_Face_Offline_Research.zip**, SHA256 `192d5d626939f79ed0d1f50dd383b52e82e59c92eec4db5050f2fcf1355a19f4`, 40,013,086 bytes and 325 files. Its 42 cosmetic atlas SHA256 locks and tone-support asset hashes passed. All 298 offline declared paths and 85 first-install paths were present. 24 root JS syntax checks passed, and 28/28 Node regression tests passed.

Chromium Canvas/DOM integration used mocked face-landmark return values, **not real inference**: a 1620×2160 upload rendered 1620×2160; two-face and face-selection mismatch cases were blocked with Persian errors and zero previous output. A simulated SW lifecycle proved the v19.7 cache is retired, unrelated caches remain, full successful download reports ready, and missing resource yields an explicit incomplete status.

### Critical caveat

Real `FaceLandmarker` WASM initialization was attempted **using the actual bundled 4.8MB local model and 13MB local vision WASM**, not just mocks. The headless environment cannot create a WebGL context; the real inference test failed inside Emscripten at `_emscripten_glActiveTexture` (`activeTexture` undefined). A local HTTP browser test was also blocked by `ERR_BLOCKED_BY_ADMINISTRATOR`. Thus **the actual two-face model has NOT been demonstrated on a real Android phone or in this CI**. Any statement that it detects all multiple-face photos would be unsupported.

`numFaces:2` caps the count of reported faces and can still miss a second person. Matching 3 anatomical landmarks reduces wrong-face selection but does not establish identity or biometric consistency. Do not use this as a claim of face-recognition capability.

No new commercially licensed neural weights, diverse-person evaluation corpus, or human photorealism benchmarking was produced. The 42 appearance atlases still originate from the same generated portrait identity. Do not claim world-class makeup quality or merge to production until real-model Android offline validation and independent multi-person photo QA pass.
