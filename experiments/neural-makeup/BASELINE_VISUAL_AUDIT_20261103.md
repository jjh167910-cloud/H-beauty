# H-Beauty: actual visual baseline audit — 3 November 2026

The existing v19.1 and v19.2 archives were compared using their **actual previously rendered 810×1080 portraits** of one sample face, not newly synthesized output.

| Look | v19.1 RGB MAE vs source | v19.2 RGB MAE vs source | v19.1 pixels with >20/channel (%) | v19.2 pixels with >20/channel (%) |
|---|---:|---:|---:|---:|
| Arabic Glam | 2.339 | 0.145 | 3.148 | 0.194 |
| Classic Smokey | 1.813 | 0.138 | 2.823 | 0.474 |
| Electric Blue | 1.861 | 0.281 | 3.141 | 0.861 |
| Strawberry | 1.132 | 0.158 | 1.410 | 0.005 |

**Interpretation:** v19.2 reference-conditioned chroma transfer produces far less visible change than v19.1's more detailed preset engine on this one test face. These are *activity metrics*, not evidence of quality, superiority, identity fidelity or demographic generalization.

## Experimental local v19.3 hybrid artifact

A 36.1-MB standalone ZIP research package was built from the exact user-owned v19.2 experimental archive. It adds `reference-hybrid.js`, a 42-look preset selection, and optional offline hybrid path (existing `paintLook` followed by `transferReference`). The original standalone reference-only path is preserved as a failover.

- Archive SHA256: `5cdca8b14a13043c8478e31dc7eba3eef6cf88eace5cab2cfa05eed55e3dfc64`.
- 258 ZIP files; 244 service-worker precache resources all accounted for.
- `node --check` passed on the hybrid module, the updated reference UI, and the service worker.
- Static HTML mobile smoke: form controls and no horizontal overflow at 390×844.
- **Live neural model inference and hybrid image output have NOT been validated.** Chromium network navigation was blocked by the execution environment; a successful code-only test would not establish aesthetic performance.
- No new trained weights, no new vendor models, and no private-person dataset have been included. Do not merge or deploy based on this report alone.

## Remaining go/no-go requirements

Rights-cleared multi-person training/evaluation pairs, trained model checkpoints, accurate face part segmentation, human blind before/after assessments, reference appearance matching, device latency/memory and offline Android validation. Existing Cloudflare salon production and the independent v19.2 preview remain unchanged.
