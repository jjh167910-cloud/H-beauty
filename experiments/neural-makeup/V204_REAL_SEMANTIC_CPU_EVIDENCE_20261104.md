# H-Beauty v20.4 — Real 19-class semantic face parsing

Date: 4 November 2026. RESEARCH ONLY. Do not merge or deploy commercially.

## Real CPU ONNX execution

BiSeNet ResNet18 from yakhyo/face-parsing, MIT repo, CelebAMask-HQ training corpus. Weights: 53,205,364 bytes, SHA256 0d9bd318e46987c3bdbfacae9e2c0f461cae1c6ac6ea6d43bbe541a91727e33f.

- Real GitHub Actions CPU ONNX inference on a catalog face PASSED: https://github.com/jjh167910-cloud/H-beauty/actions/runs/41743061971 . Output [1,19,512,512]; 171ms model-only inference.
- Independently executed the same actual weights in local onnxruntime-web WebAssembly without WebGL on a second face at 810x1080. Session initialization 1206ms, inference 2061ms on the test machine; these are NOT Android timings.
- Parsed categories distinguish skin, left/right eyes, brows, upper/lower lips, mouth, hair, nose and background.

## Four actual makeup-image comparisons

Anatomical safety compositor retains ORIGINAL source RGBA for every prohibited class. Allowed classes: skin=1, upper-lip=12, lower-lip=13. Existing CPU478 triangular geometry still determines placement and strength; a soft 2px inward edge reduces harsh class transitions.

| Makeup style | v20.3 changed prohibited pixels | v20.4 |
| --- | ---: | ---: |
| Electric Blue | 2,142 | 0 |
| Arabic Glam | 2,048 | 0 |
| Classic Smokey | 2,077 | 0 |
| Strawberry | 1,873 | 0 |

Figures use exact source-output pixel mapping from JS (center-based nearest 512x512 class index). These are placement correctness measurements, NOT identity, photorealism, or market-SOTA scores. Only a limited second face was tested.

## Previously unnoticed source bug fixed in standalone app

The v20.3 CPU studio still imported version 20.2's atlas loader/renderer, making its Natural selector ineffective. v20.4 standalone studio imports the correct v20.3 loader and compositor so Natural/Original actually select different atlases. This full standalone code and assets are in the downloadable research ZIP, not merged into the main app.

## Standalone research artifact

Name: HBeauty_AI_TryOn_v20_4_Semantic_CPU_Research.zip
SHA256: 28772b72e98cf3209040eea3ae622772e2ba050afb57ba594c329880bed32bf9
Bytes: 99,398,521. Entries: 406. ZIP CRC passed.
All 368 service-worker assets and 154 initial-cache assets present; 42 original and 42 natural cosmetic style atlases; 38 root JS syntax checks and 5 local Node semantic tests passed. Real YuNet, CPU478 and BiSeNet model SHA checks passed. Static RTL widths 320/390/768/1280 have zero horizontal overflow.

The 53MB additional model is opt-in via an explicit cache button so base installation does not require a very large immediate download. It can run offline once all required assets have been cached from an HTTPS PWA installation; actual Android offline cold-start has NOT been tested.

## NO-GO release blockers

License: source repo provides an MIT notice, but the CelebAMask-HQ training dataset's commercial use rights have NOT been independently cleared. The owner must additionally verify rights for all catalog face images.

No independent varied-skin-tone or occlusion benchmark, no professional blind before/after assessment, no physical Android memory/thermal/restart test, no true native 2K cosmetic texture or new learned lash synthesis. Full new-page upload-to-export hosted E2E is not verified due local browser navigation restrictions.

State of the art is NOT achieved or certified. Research PR remains draft and production must stay unchanged. Relevant context: WACV 2026 Chau et al., transparent cosmetics via graphics rendering; CVPR 2026 Gao et al., facial region-aware makeup features. No third-party research-only weights were included.
