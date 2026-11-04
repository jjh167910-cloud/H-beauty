# H-Beauty v20.2 — independent CPU offline studio research evidence

Date: 3 November 2026. **Draft research only; not released to salon production.**

## New capability built

An independent Persian-first page `cpu-tryon.html` was packaged outside the repository using the existing complete v20.0 PWA static assets plus verified CPU478 ONNX model artifacts. It performs single-photo ingestion and 478-point landmark inference through local ONNX Runtime Web WASM **without calling the older WebGL MediaPipe photo preparation path**. It then locally loads a selected one of 42 makeup detail atlases and performs calibrated appearance transfer, before/after comparison, and PNG export. A dedicated `cpu478.webmanifest` makes it independent of the existing main PWA launch route.

The source-controlled portion of this change is deliberately focused on independently testable mathematical safety layers:
- `v202_mesh_quality.mjs` measures local triangle Jacobian singular-value ratio and area scale relative to the global face similarity transform. Rejects folded, >4:1 anisotropically stretched or wildly scaled geometry.
- `v202_detail_atlas.js` retains original source RGBA outside editable cosmetic regions and skips rejected triangles without inventing face pixels.
- `tests/test_v202_mesh_quality.mjs` tests normal rotation, global mirror, strong shear, anomalous scale, malformed input, source alpha identity, safe rejection.
- `.github/workflows/neural-makeup-research.yml` now runs these tests.

## Verified evidence

The previous real-model CPU and browser acceptance checks succeeded: [YuNet one/two-face CPU](https://github.com/jjh167910-cloud/H-beauty/actions/runs/41714864876), [YuNet + 478-point real model CPU](https://github.com/jjh167910-cloud/H-beauty/actions/runs/41721145326), and previous Chromium in-memory combined model and makeup module tests on a second portrait. These results do **not** prove the new separate UI has passed.

The new standalone package:
- `HBeauty_AI_TryOn_v20_2_CPU478_Mesh_Safety_Research.zip`, **47,026,398 bytes**, **349 files**, SHA256 **c178fd09f4d9427f929c4cb41f00cd1f8f721b07ce4f8df1e716275214f5f3c5**
- all **317** declared offline asset paths present, **104** initial-cache entries accounted for including the root route
- all **42** atlas files included; both verified ONNX weights, local WASM and licensing notices bundled
- **31/31** root JS syntax checks, Node math/raster safety checks, ZIP CRC pass
- mobile and desktop static RTL interface renders without horizontal overflow at widths **320, 390, 1280**; original service worker cache version incremented to `20.2`
- independent research page uses local model bytes and local static assets only; no user photos intentionally uploaded
- the package includes `V202_QA_EVIDENCE.md` and `V202_START_HERE.md`

## Remaining essential gates

Chromium blocked navigation to the local HTTP test site with `ERR_BLOCKED_BY_ADMINISTRATOR`, so a **full new-page upload→478 landmarks→makeup→save interaction was NOT validated**. Prior separate in-memory browser modules did complete the real models and makeup rendering, but that cannot be substituted for full page acceptance.

The current 810×1080 one-model appearance atlas still produces somewhat **graphic eyelashes and liner**, particularly Electric Blue. Triangle distortion rejection avoids egregious shapes but does not generate new natural lash fibers or constitute SOTA photorealism. Diverse real identities, permission-cleared images, skin tones, poses, glasses/occlusion, actual Android offline install/cold boot, CPU memory/thermals, blind visual reviews and true 2K cosmetic detail are unverified.

**Decision: research-review candidate; NO-GO for live salon production or state-of-the-art claims.** Existing production Cloudflare worker remains unchanged. The new standalone ZIP is a ChatGPT artifact and **is not embedded in this PR's source tree**.
