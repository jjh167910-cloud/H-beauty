# H-Beauty v20.5: landmark-only anatomical protection (4 Nov 2026)

**Release status: research-only / DO NOT MERGE OR DEPLOY TO THE SALON.**

## Commercial rights finding

The prior v20.4 BiSeNet face parser was trained on the **CelebAMask-HQ** dataset. Its official source explicitly restricts the dataset and derived data to **non-commercial research**; an MIT license on a model implementation is insufficient to establish downstream commercial distribution rights. Sources: https://github.com/switchablenorms/CelebAMask-HQ and https://mmlab.ie.cuhk.edu.hk/projects/CelebA.html .

For this reason the v20.5 standalone ZIP **does not contain any BiSeNet / CelebAMask-HQ-trained weights or parser source**. Research remains available for internal comparisons only; a commercially cleared parser would require independently verified data/weight rights.

## New algorithm

Source module: `experiments/neural-makeup/v205_landmark_guard.mjs`

- Uses existing **MIT YuNet** detector and **Apache-2.0-derived 478-point ONNX face mesh** only (plus the same generated makeup atlases as previous offline research builds).
- Rasterizes a facial oval, excludes hair/background outside that oval, eyebrow polygons, left/right eye openings, inner mouth/teeth, and a conservative nose/bridge/nostril region derived from landmarks.
- Uses a small bounded chamfer distance to blend just inside the permitted skin/lip region; ALL protected pixels and ALL original image alpha bytes are preserved exactly.
- Includes a strictly optional `Legacy` switch to preserve the old appearance for A/B evaluation. Natural and Original pigment atlases remain independently selectable.
- Not a substitute for a learned semantic segmentation model. Might suppress valid eyeshadow/blush, especially on unusual poses.

## Real JS A/B measurements

The actual JavaScript compositor was executed on 4 previously rendered 810 × 1080 samples of a **second face**. An older **research-only BiSeNet class map** was used solely as a fixed metric oracle; it is not part of the v20.5 app. Disallowed classes are all except skin=1, upper lip=12 and lower lip=13.

| Look | v20.3 pixels changed in disallowed classes | v20.5 | Reduction |
| --- | ---: | ---: | ---: |
| Electric Blue | 2,142 | 478 | 77.7% |
| Classic Smokey | 2,077 | 436 | 79.0% |
| Arabic Glam | 2,048 | 458 | 77.6% |
| Strawberry | 1,873 | 438 | 76.6% |

ALL four outputs preserve the original alpha bytes (zero changes). Some disallowed-class changes remain (v20.4's research parser masked them entirely) and cosmetic edits on allowed skin are reduced too. These numbers measure **anatomical leakage on one face**, NOT clinical safety, photorealism, demographic robustness or superiority to commercial products.

## v20.5 isolated standalone PWA

- File: `HBeauty_AI_TryOn_v20_5_Landmark_Safety_Research.zip`
- **49,937,195 bytes / 405 ZIP entries**
- SHA256: `6810001964f2b03507c7775664c3a5a1e03ffacaf395817fa7fa8e391ecfc21b`
- 365/365 declared offline asset paths verified
- 152/152 first-install cache resources verified; cache namespace version 20.5
- 37/37 root JavaScript syntax checks, 6/6 new unit tests, 42/42 Natural atlas SHA checks, ZIP CRC
- Both commercial-candidate model checksums verified: YuNet `ebafce4e3c118d6554634be5c27ab333b4c047a9a8c3faf1d7cf93101c22f0f0` and 478-point `7d6e82dee82a1dca5fbddb282b3cc74571833a530de317fc22ae325c3358beeb`.
- Corrected dormant v20.3 finish-selector wiring is present: new standalone studio loads `detail-atlas-v203.js`, not the older v20.2 loader.
- Persian RTL static Chromium layouts at widths 320/390/768/1280 passed without horizontal overflow. Default Anatomical Protection and optional Legacy method controls confirmed.

### Outstanding release blockers

An attempted **full upload-to-export** Chrome browser test via intercepted HTTPS navigation failed **before page load** due `ERR_BLOCKED_BY_ADMINISTRATOR`. Static UI, individual real ONNX models, and real image-compositing tests have been performed separately, but this is NOT equivalent to end-to-end new-page verification. No physical Android offline install/cold restart/thermal/memory test, no independently consented diverse-person evaluation, no blinded makeup-artist realism scores, and no verified true-native 2K cosmetic synthesis. Atlas image licensing and source-photo release rights still need their own audit.

**Decision: research evaluation candidate, not commercial-ready, not certified state of the art.** Public H-Beauty salon deployment remains unchanged.