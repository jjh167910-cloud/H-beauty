# H-Beauty v39 — External portrait recovery ledger

**Publication state: BLOCKED.** The core source image is the original woman's user-supplied portrait; preserve face proportions and natural hairline and do not put her source photo in public git.

## Independently confirmed external generation records

| Look | Name (FA) | Provider | Identifier | Provider dimensions | Stage |
| --- | --- | --- | --- | --- | --- |
| 23 | نقره‌ای کروم | ElevenLabs / GPT Image 2 | `eH1MBM7xiolO490QM71n` | 1536×2048 | completed, original bytes not imported |
| 24 | تراکوتای مات | Canva | `MAHY2T8DJK4` | 1088×1456 | completed, original bytes not imported |
| 25 | لب آلبالویی براق | Canva | `MAHY2TsmYRY` | 1088×1456 | completed, original bytes not imported |
| 26 | غروب مرجانی | Canva | `MAHY2UrdqZo` | 1088×1456 | completed, original bytes not imported |

The Canva 25 and 26 generation jobs were confirmed SUCCESS during this continuation, and get_assets independently verified each as a 1088×1456 image. #24 had already completed and the asset lookup confirmed 1088×1456. The ElevenLabs 23 job was confirmed COMPLETED at 1536×2048. No direct original bytes have been retrieved via the available tools; the connector exposes small preview thumbnails. **Media metadata, a thumbnail or a completion flag do not certify face likeness, hairline, makeup distinction, copyright permission, or actual local file presence.**

Look 27's previous job token was not accepted by the generation-status service; its status remains **unknown**; do not infer completion.

## Exact acceptance sequence

1. In Canva/ElevenLabs, export the original images, individually, at their full reported resolution (not the 149×200 Canva thumbnails). Keep the metadata and generation IDs.
2. Verify orientation is 3:4, WebP decode is complete, and the individual full-resolution output is not a contact sheet.
3. Compare directly to the original model photograph for cheeks/jaw roundness, thick original eyebrow architecture, nose, natural lip contour, dimples and head hairline (no visible scalp).
4. Compare eye and lip pigment/technique to all 22 existing looks. For #25, confirm actual black-cherry *gloss*, not repeated rose satin. For #26, verify an orange/coral/yellow sunset eye gradient, not duplicate warm brown.
5. If acceptable, convert to named, optimized WebP (full image in `public/makeup/ai-portraits/hb-makeup-NN-<slug>.webp`), derive SHA256 and add local candidate state. Do **not** mark `publishApproved` true unless separately authorized with consent and editorial review.
6. Rebuild and test the offline portrait viewer and the React app before deployment. Maintain fallback for missing looks.

## Current hard accounting

- 40 desired Persian-named makeup styles.
- 22 full-resolution individually named WebP candidates in v38 private downloadable kit.
- 4 new *external-only completed* image jobs, unverified artwork and not present in ZIP or git.
- 18 planned styles without locally verified portrait assets.
- 0 approved for production or published.
- No new production deployment, and no CI verification claimed in v39.

Draft branch PR #11 remains the authoritative review branch. No generated images have been falsely imported or counted.
